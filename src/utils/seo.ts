import { BUSINESS_INFO } from '../data/business';
import { getAgencyProjects, getProjectBySlug, getSaasProjects } from '../data/projects';
import { SERVICES, TICINO_CITIES } from '../data/services';
import { TRANSLATIONS } from '../data/translations';
import { Language, ProjectItem, ServiceItem, TicinoCitySlug } from '../types/showcase';

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  ogType: 'website' | 'article';
  ogLocale: string;
  ogLocaleAlternates: string[];
  ogImage: string;
  ogImageAlt: string;
  robots: string;
  hreflangs: HreflangLink[];
  jsonLd: Record<string, unknown>;
}

const OG_LOCALE_MAP: Record<Language, string> = {
  it: 'it_CH',
  de: 'de_CH',
  fr: 'fr_CH',
  en: 'en_US',
};

const ALL_LANGS: Language[] = ['it', 'de', 'fr', 'en'];

export function clampText(input: string, maxLen: number): string {
  const clean = input.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${(lastSpace > maxLen * 0.6 ? sliced.slice(0, lastSpace) : sliced).trim()}…`;
}

export function resolveSiteOrigin(): string {
  const envUrl =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    typeof import.meta.env.VITE_SITE_URL === 'string' &&
    import.meta.env.VITE_SITE_URL.trim().length > 0
      ? import.meta.env.VITE_SITE_URL.trim()
      : '';

  if (envUrl) return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return BUSINESS_INFO.defaultSiteUrl;
}

export function normalizeCanonicalPath(rawPath: string): string {
  const clean = rawPath.trim() || '/';
  if (clean === '/') return '/';
  return clean.endsWith('/') ? clean.slice(0, -1) : clean;
}

export function buildCanonicalRouteUrl(
  origin: string,
  path: string,
  lang: Language,
  city?: TicinoCitySlug,
  includeCityParam = false
): string {
  const normalizedPath = normalizeCanonicalPath(path);
  const params = new URLSearchParams();
  if (lang !== 'it') {
    params.set('lang', lang);
  }
  if (includeCityParam && city && city !== 'lugano') {
    params.set('city', city);
  }
  const qs = params.toString();
  return `${origin}${normalizedPath}${qs ? `?${qs}` : ''}`; }  function buildOrganizationSchema(origin: string): Record<string, unknown> { return { '@type': 'Organization', '@id': `${origin}/#organization`,
    name: BUSINESS_INFO.combinedBrand,
    legalName: BUSINESS_INFO.brandName,
    url: origin,
    logo: 'https://i.postimg.cc/zbbY84tF/logo.jpg',
    sameAs: BUSINESS_INFO.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_INFO.address.locality,
      addressRegion: BUSINESS_INFO.address.region,
      addressCountry: BUSINESS_INFO.address.countryCode,
    },
  };
}

function buildLocalBusinessSchema(
  origin: string,
  cityFocus?: TicinoCitySlug
): Record<string, unknown> {
  const activeCity =
    TICINO_CITIES.find((c) => c.slug === cityFocus) || TICINO_CITIES[0];

  return {
    '@type': 'ProfessionalService',
    '@id': `${origin}/#localbusiness`, name: BUSINESS_INFO.combinedBrand, url: origin, image: `${origin}${BUSINESS_INFO.ogImagePath}`, priceRange: 'CHF', parentOrganization: { '@id': `${origin}/#organization` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: BUSINESS_INFO.address.locality,
      addressRegion: BUSINESS_INFO.address.region,
      addressCountry: BUSINESS_INFO.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: BUSINESS_INFO.openingHours.days,
        opens: BUSINESS_INFO.openingHours.opens,
        closes: BUSINESS_INFO.openingHours.closes,
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Lugano' },
      { '@type': 'City', name: 'Bellinzona' },
      { '@type': 'City', name: 'Locarno' },
      { '@type': 'City', name: 'Mendrisio' },
      { '@type': 'AdministrativeArea', name: 'Canton Ticino' },
    ],
    knowsLanguage: ['it', 'de', 'fr', 'en'],
    description: activeCity.description.it,
    sameAs: BUSINESS_INFO.sameAs,
  };
}

function buildBreadcrumbSchema(
  origin: string,
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${origin}${item.url}`,
    })),
  };
}

function buildSoftwareAppSchema(
  origin: string,
  project: ProjectItem,
  lang: Language,
  canonicalUrl: string
): Record<string, unknown> {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${canonicalUrl}#software`, name: project.name, applicationCategory: 'BusinessApplication', operatingSystem: 'Web, Cloud', description: project.tagline[lang], url: project.externalUrl, sameAs: canonicalUrl, inLanguage: lang, creator: { '@id': `${