-- ============================================================
-- MIGRACIÓN v5.1 — Notificaciones de usuario + Reviews + Stock
-- Telo' Corp Group — Super App v5
-- ============================================================

-- 1. Notificaciones in-app para usuarios
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system', -- order, course, delivery, repair, install, system
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_user_notifs_user ON user_notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifs_unread ON user_notifications(user_id) WHERE read = false;

-- RLS
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON user_notifications FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own notifications (mark read)"
  ON user_notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON user_notifications FOR INSERT
  WITH CHECK (true); -- Edge Functions y Server Actions insertan

-- 2. Reviews genérico (productos, cursos, técnicos, conductores)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewable_type TEXT NOT NULL, -- 'product', 'course', 'technician', 'driver', 'service'
  reviewable_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL DEFAULT '',
  verified BOOLEAN NOT NULL DEFAULT false, -- true si el usuario completó compra/servicio
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reviewable_type, reviewable_id, user_id) -- un review por usuario por entidad
);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(reviewable_type, reviewable_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admin can delete reviews"
  ON reviews FOR DELETE
  USING (is_admin());

-- 3. Función para decrementar stock al crear orden
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(stock - qty, 0),
      sold = COALESCE(sold, 0) + qty
  WHERE id = product_id;
END;
$$;

-- 4. Tabla payments (registro de pagos para todos los servicios)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_type TEXT NOT NULL, -- 'sales', 'educa', 'lleva', 'repara', 'instala'
  order_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  method TEXT NOT NULL, -- 'cardnet', 'transfer', 'paypal', 'cash'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'DOP',
  receipt_url TEXT, -- comprobante de transferencia
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_type, order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "System can insert payments"
  ON payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can update payments"
  ON payments FOR UPDATE
  USING (is_admin());

-- ============================================================
-- FIN MIGRACIÓN v5.1
-- ============================================================
