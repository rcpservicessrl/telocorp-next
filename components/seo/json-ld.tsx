interface ProductJsonLdProps {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'LimitedAvailability'
  rating?: number
  reviewCount?: number
  brand?: string
  url: string
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = 'DOP',
  availability = 'InStock',
  rating,
  reviewCount,
  brand,
  url,
}: ProductJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: "Telo' Corp Group",
      },
    },
    aggregateRating: rating ? {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: (reviewCount || 1).toString(),
    } : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface OrganizationJsonLdProps {
  name?: string
  url?: string
  logo?: string
}

export function OrganizationJsonLd({
  name = "Telo' Corp Group",
  url = 'https://telocg.com',
  logo = 'https://telocg.com/assets/telocorpgroup-logo.jpg',
}: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-809-686-0050',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface LocalBusinessJsonLdProps {
  name?: string
}

export function LocalBusinessJsonLd({ name = "Telo' Corp Group" }: LocalBusinessJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    image: 'https://telocg.com/assets/telocorpgroup-logo.jpg',
    url: 'https://telocg.com',
    telephone: '+1-809-686-0050',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Santo Domingo',
      addressCountry: 'DO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.4861,
      longitude: -69.9312,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:00',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
