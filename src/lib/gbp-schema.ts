/**
 * Shared Google Business Profile / Schema.org constants for ArtiZone.
 *
 * Import these into any page that needs a LocalBusiness / BeautySalon block
 * so every page emits identical, consistent structured data.
 *
 * Google uses the `@id` anchor to merge signals across pages — keep it
 * pointing at the canonical homepage URL.
 */

export const SITE_URL = 'https://artizonespa.com';

/** Canonical @id for the business entity — used on every page */
export const GBP_ID = SITE_URL;

/** Google Business Profile URL (update once the profile is verified) */
export const GBP_URL = 'https://g.page/artizone-amman';

/** Google Maps short link (already used in the UI) */
export const MAPS_URL = 'https://maps.app.goo.gl/Scp8Do5U9sgNGpSz7';

export const GBP_NAME = 'ArtiZone Beauty & Aesthetic Clinic';

export const GBP_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Arjan St., 2nd Floor, Mazen Al-Kurdi St.',
  addressLocality: 'Amman',
  addressRegion: 'Amman Governorate',
  postalCode: '11183',
  addressCountry: 'JO',
} as const;

export const GBP_GEO = {
  '@type': 'GeoCoordinates',
  latitude: 31.9539,
  longitude: 35.8833,
} as const;

export const GBP_OPENING_HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    opens: '10:00',
    closes: '21:00',
  },
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Friday'],
    opens: '14:00',
    closes: '21:00',
  },
] as const;

export const GBP_AGGREGATE_RATING = {
  '@type': 'AggregateRating',
  ratingValue: '4.9',
  reviewCount: '2500',
  bestRating: '5',
  worstRating: '1',
} as const;

export const GBP_SAME_AS = [
  'https://instagram.com/artizone_clinic',
  'https://facebook.com/artizone.jo',
  'https://tiktok.com/@artizone.jo',
  GBP_URL,
] as const;

/** Neighbourhoods / districts served — used in serviceArea */
export const GBP_SERVICE_AREA = {
  '@type': 'GeoCircle',
  geoMidpoint: { '@type': 'GeoCoordinates', latitude: 31.9539, longitude: 35.8833 },
  geoRadius: '15000', // 15 km radius covers greater Amman
} as const;

/** Key treatments — helps Google surface the business for treatment-specific queries */
export const GBP_KNOWS_ABOUT = [
  'Laser Hair Removal',
  'HydraFacial',
  'Chemical Peel',
  'Body Slimming',
  'Gel Nails',
  'Acne Scar Treatment',
  'Skin Tightening',
  'Bridal Beauty Packages',
  "Men's Grooming",
  'Eyebrow Shaping',
] as const;

/** Amenities — boosts local relevance signals */
export const GBP_AMENITY_FEATURES = [
  { '@type': 'LocationFeatureSpecification', name: 'Private Treatment Rooms', value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Free Consultation',        value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Online Booking',           value: true },
  { '@type': 'LocationFeatureSpecification', name: 'Tabby Installments',       value: true },
  { '@type': 'LocationFeatureSpecification', name: "Women's Services",         value: true },
  { '@type': 'LocationFeatureSpecification', name: "Men's Services",           value: true },
] as const;

/**
 * Lightweight provider reference — use this as `provider` or `seller` in
 * landing-page JSON-LD blocks instead of the full `buildBeautySalonSchema()`.
 * The `@id` anchor lets Google merge it with the full entity on the homepage.
 */
export const GBP_PROVIDER_REF = {
  '@type': 'BeautySalon',
  '@id': SITE_URL,
  name: GBP_NAME,
  url: SITE_URL,
  telephone: '+962790412758',
  address: GBP_ADDRESS,
  geo: GBP_GEO,
  aggregateRating: GBP_AGGREGATE_RATING,
  sameAs: GBP_SAME_AS,
} as const;

/** Site name used in og:site_name across all pages */
export const SITE_NAME = 'ArtiZone Beauty & Aesthetic Clinic';

/**
 * Standard image dimensions for Open Graph / Twitter Card previews.
 * Facebook, Instagram link previews, and Twitter all render best at 1200×630.
 */
export const OG_IMG_WIDTH  = '1200';
export const OG_IMG_HEIGHT = '630';

/**
 * Build the full set of social-sharing meta tag props for a page.
 *
 * Returns an object you can spread into JSX or use individually.
 * Covers: og:site_name, og:image:width/height/alt, twitter:title,
 * twitter:description, twitter:site — the tags most commonly missing.
 *
 * Usage:
 *   const og = buildOgTags({ title, description, image, url });
 *   // then in <Helmet>:
 *   <meta property="og:title"            content={og['og:title']} />
 *   <meta property="og:site_name"        content={og['og:site_name']} />
 *   <meta property="og:image:width"      content={og['og:image:width']} />
 *   <meta property="og:image:height"     content={og['og:image:height']} />
 *   <meta property="og:image:alt"        content={og['og:image:alt']} />
 *   <meta name="twitter:title"           content={og['twitter:title']} />
 *   <meta name="twitter:description"     content={og['twitter:description']} />
 *   <meta name="twitter:site"            content={og['twitter:site']} />
 */
export function buildOgTags({
  title,
  description,
  image,
  imageAlt,
  url,
  type = 'website',
  locale = 'en_US',
}: {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  url: string;
  type?: string;
  locale?: string;
}) {
  return {
    /* Open Graph core */
    'og:title':        title,
    'og:description':  description,
    'og:image':        image,
    'og:image:width':  OG_IMG_WIDTH,
    'og:image:height': OG_IMG_HEIGHT,
    'og:image:alt':    imageAlt ?? title,
    'og:url':          url,
    'og:type':         type,
    'og:site_name':    SITE_NAME,
    'og:locale':       locale,
    /* Twitter / X Card */
    'twitter:card':        'summary_large_image',
    'twitter:title':       title,
    'twitter:description': description,
    'twitter:image':       image,
    'twitter:image:alt':   imageAlt ?? title,
    'twitter:site':        '@artizone_clinic',
  } as const;
}

/**
 * Full BeautySalon entity — drop this into any page's JSON-LD as the
 * top-level object or as a `mainEntity` / `provider` value.
 *
 * @param overrides  Any per-page fields to merge in (e.g. a page-specific image)
 */
export function buildBeautySalonSchema(overrides: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    '@id': GBP_ID,
    name: GBP_NAME,
    url: SITE_URL,
    telephone: '+962790412758',
    alternateName: 'ArtiZone Spa',
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Second Phone',
      value: '+962792828024',
    },
    email: 'info@artizonespa.com',
    image: [
      `${SITE_URL}/airo-assets/images/pages/home/hero`,
      `${SITE_URL}/airo-assets/images/about/clinic-interior`,
      `${SITE_URL}/airo-assets/images/about/clinic-treatment`,
    ],
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/loogoooo.png`,
      width: 400,
      height: 120,
    },
    address: GBP_ADDRESS,
    geo: GBP_GEO,
    hasMap: MAPS_URL,
    openingHoursSpecification: GBP_OPENING_HOURS,
    priceRange: '$',
    currenciesAccepted: 'JOD',
    paymentAccepted: 'Cash, Credit Card, Tabby',
    aggregateRating: GBP_AGGREGATE_RATING,
    sameAs: GBP_SAME_AS,
    serviceArea: GBP_SERVICE_AREA,
    knowsAbout: GBP_KNOWS_ABOUT,
    amenityFeature: GBP_AMENITY_FEATURES,
    areaServed: { '@type': 'City', name: 'Amman', '@id': 'https://www.wikidata.org/wiki/Q3805' },
    ...overrides,
  };
}
