-- ============================================================
-- MIGRACIÓN v5.0 — Sistema Multi-Tenant (Organizaciones + Roles)
-- Telo' Corp Group — Plataforma Super App
-- ============================================================
-- IMPORTANTE: Ejecutar en Supabase SQL Editor (producción)
-- Prerequisito: Migraciones v4.x ya aplicadas
-- ============================================================

-- 1. Tabla de organizaciones (empresas vinculadas)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  modules TEXT[] NOT NULL DEFAULT ARRAY['sales']::TEXT[], -- módulos habilitados
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  settings JSONB NOT NULL DEFAULT '{}'::JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Miembros de organizaciones con roles granulares
CREATE TABLE IF NOT EXISTS org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'manager', 'operator', 'viewer')),
  modules TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[], -- módulos a los que tiene acceso
  permissions JSONB NOT NULL DEFAULT '{}'::JSONB,
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- 3. Perfil público de usuario (complementa auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'DO',
  preferences JSONB NOT NULL DEFAULT '{}'::JSONB,
  loyalty_points INT NOT NULL DEFAULT 0,
  loyalty_tier TEXT NOT NULL DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger para auto-crear perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 5. Función para verificar acceso a módulo en una organización
CREATE OR REPLACE FUNCTION user_has_module_access(p_user_id UUID, p_module TEXT)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM org_members
    WHERE user_id = p_user_id
    AND (p_module = ANY(modules) OR modules = ARRAY[]::TEXT[])
    AND org_id IN (SELECT id FROM organizations WHERE active = true)
  )
  OR EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = p_user_id
    AND (email LIKE '%@telocg.com' OR raw_user_meta_data->>'role' = 'admin')
  );
$$;

-- 6. Función para obtener el rol más alto de un usuario
CREATE OR REPLACE FUNCTION user_org_role(p_user_id UUID, p_org_id UUID)
RETURNS TEXT LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM org_members
  WHERE user_id = p_user_id AND org_id = p_org_id
  LIMIT 1;
$$;

-- 7. RLS para organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners and members can view their orgs"
  ON organizations FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Owners can update their orgs"
  ON organizations FOR UPDATE
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "Authenticated users can create orgs"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- 8. RLS para org_members
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their org's members"
  ON org_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "Admins can manage members"
  ON org_members FOR ALL
  USING (
    org_id IN (
      SELECT org_id FROM org_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
    OR is_admin()
  );

-- 9. RLS para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Auto-insert on signup"
  ON user_profiles FOR INSERT
  WITH CHECK (true); -- trigger handles this

-- 10. Crear organización semilla para Telo' Corp Group
INSERT INTO organizations (name, slug, modules, plan, owner_id, settings)
SELECT
  'Telo'' Corp Group',
  'telocorp',
  ARRAY['sales', 'educa', 'lleva', 'repara', 'instala'],
  'enterprise',
  id,
  '{"whatsapp": "18096860050", "currency": "DOP", "country": "DO"}'::JSONB
FROM auth.users
WHERE email = 'admin@telocg.com'
ON CONFLICT (slug) DO NOTHING;

-- 11. Indexes para performance
CREATE INDEX IF NOT EXISTS idx_org_members_user ON org_members(user_id);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);

-- ============================================================
-- ROLES Y PERMISOS — Documentación
-- ============================================================
-- owner:    Control total de la organización (CRUD todo, facturación, borrar org)
-- admin:    Gestiona todos los módulos y usuarios de la org
-- manager:  Gestiona módulos específicos asignados (ve métricas, edita contenido)
-- operator: Opera día a día (procesa órdenes, gestiona bookings, sin config)
-- viewer:   Solo lectura (reportes, dashboard, sin modificar nada)
--
-- El campo `modules` en org_members define a qué verticales tiene acceso:
-- ['sales'] → solo ve Telo' Sales
-- ['sales', 'lleva'] → ve Telo' Sales + Telo' Lleva
-- [] (vacío) → hereda los módulos de la organización
-- ============================================================
