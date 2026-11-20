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
  return `${origin}${normalizedPath}${qs ? `?${qs}` : ''}`;
}

function buildOrganizationSchema(origin: string): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
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
    '@id': `${origin}/#localbusiness`,
    name: BUSINESS_INFO.combinedBrand,
    url: origin,
    image: `${origin}${BUSINESS_INFO.ogImagePath}`,
    priceRange: 'CHF',
    parentOrganization: { '@id': `${origin}/#organization` },
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
    '@id': `${canonicalUrl}#software`,
    name: project.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, Cloud',
    description: project.tagline[lang],
    url: project.externalUrl,
    sameAs: canonicalUrl,
    inLanguage: lang,
    creator: { '@id': `${origin}/#organization` },
    publisher: { '@id': `${origin}/#organization` },
    featureList: project.keyFeatures.map((f) => f.title[lang]),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CHF',
      availability: 'https://schema.org/OnlineOnly',
    },
  };
}

function buildCreativeWorkSchema(
  origin: string,
  project: ProjectItem,
  lang: Language,
  canonicalUrl: string
): Record<string, unknown> {
  return {
    '@type': 'CreativeWork',
    '@id': `${canonicalUrl}#work`,
    name: project.name,
    headline: project.tagline[lang],
    description: project.shortDescription[lang],
    genre: project.sector[lang],
    url: canonicalUrl,
    sameAs: project.externalUrl,
    inLanguage: lang,
    creator: { '@id': `${origin}/#organization` },
    about: project.servicesUsed[lang],
    spatialCoverage: {
      '@type': 'Place',
      name: 'Canton Ticino, Switzerland',
    },
  };
}

function buildServiceSchema(
  origin: string,
  service: ServiceItem,
  lang: Language,
  canonicalUrl: string,
  cityProfile: (typeof TICINO_CITIES)[number]
): Record<string, unknown> {
  return {
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: `${service.title[lang]} — ${cityProfile.name}`,
    serviceType: service.shortTitle[lang],
    description: `${service.subtitle[lang]} ${cityProfile.localFocus[lang]}`,
    provider: { '@id': `${origin}/#localbusiness` },
    areaServed: [
      { '@type': 'City', name: cityProfile.name },
      { '@type': 'AdministrativeArea', name: 'Canton Ticino' },
    ],
    url: canonicalUrl,
  };
}

function buildFaqSchema(
  service: ServiceItem,
  lang: Language
): Record<string, unknown> | null {
  if (!service.faqs || service.faqs.length === 0) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question[lang],
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[lang],
      },
    })),
  };
}

export function resolveSeoMetadata(params: {
  path: string;
  lang: Language;
  city: TicinoCitySlug;
}): SeoMetadata {
  const { lang, city } = params;
  const origin = resolveSiteOrigin();
  const t = TRANSLATIONS[lang];
  const path = normalizeCanonicalPath(params.path);

  const cityFromPath = TICINO_CITIES.find(
    (c) => path === `/servizi/${c.slug}`
  );
  const resolvedCitySlug: TicinoCitySlug = cityFromPath ? cityFromPath.slug : city;
  const cityProfile =
    TICINO_CITIES.find((c) => c.slug === resolvedCitySlug) || TICINO_CITIES[0];

  const isServiceRoute = path === '/servizi' || path.startsWith('/servizi/');
  const includeCityInCanonical =
    isServiceRoute && !cityFromPath && resolvedCitySlug !== 'lugano';

  const canonicalUrl = buildCanonicalRouteUrl(
    origin,
    path,
    lang,
    resolvedCitySlug,
    includeCityInCanonical
  );

  const hreflangs: HreflangLink[] = [
    {
      hreflang: lang,
      href: canonicalUrl,
    },
    ...ALL_LANGS.filter((code) => code !== lang).map((code) => ({
      hreflang: code,
      href: buildCanonicalRouteUrl(
        origin,
        path,
        code,
        resolvedCitySlug,
        includeCityInCanonical
      ),
    })),
    {
      hreflang: 'x-default',
      href: buildCanonicalRouteUrl(
        origin,
        path,
        'it',
        resolvedCitySlug,
        includeCityInCanonical
      ),
    },
  ];

  const ogLocale = OG_LOCALE_MAP[lang];
  const ogLocaleAlternates = ALL_LANGS.filter((l) => l !== lang).map(
    (l) => OG_LOCALE_MAP[l]
  );
  const ogImage = `${origin}${BUSINESS_INFO.ogImagePath}`;
  const ogImageAlt = t.seoUi.heroImageAlt;

  const orgNode = buildOrganizationSchema(origin);
  const localBizNode = buildLocalBusinessSchema(origin, resolvedCitySlug);

  // 1. Product Detail (/prodotti/:slug)
  if (path.startsWith('/prodotti/')) {
    const slug = path.replace('/prodotti/', '');
    const product = getProjectBySlug(slug);
    if (product && product.engine === 'saas') {
      const titleByLang: Record<Language, string> = {
        it: `${product.name} · SaaS B2B Svizzera | kreativalab`,
        de: `${product.name} · Schweizer SaaS | kreativalab`,
        fr: `${product.name} · SaaS Suisse | kreativalab`,
        en: `${product.name} · Swiss SaaS | kreativalab`,
      };
      const descByLang: Record<Language, string> = {
        it: `${product.name}: ${product.tagline.it}`,
        de: `${product.name}: ${product.tagline.de}`,
        fr: `${product.name} : ${product.tagline.fr}`,
        en: `${product.name}: ${product.tagline.en}`,
      };
      return {
        title: clampText(titleByLang[lang], 60),
        description: clampText(descByLang[lang], 155),
        canonicalUrl,
        ogType: 'website',
        ogLocale,
        ogLocaleAlternates,
        ogImage,
        ogImageAlt,
        robots: 'index, follow',
        hreflangs,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            orgNode,
            buildSoftwareAppSchema(origin, product, lang, canonicalUrl),
            buildBreadcrumbSchema(origin, [
              { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
              { name: t.nav.products, url: buildCanonicalRouteUrl(origin, '/prodotti', lang) },
              { name: product.name, url: canonicalUrl },
            ]),
          ],
        },
      };
    }
  }

  // 2. Products Hub (/prodotti)
  if (path === '/prodotti' || path.startsWith('/prodotti/')) {
    const titleByLang: Record<Language, string> = {
      it: 'Prodotti SaaS B2B Svizzera · kreativalab',
      de: 'Schweizer B2B SaaS-Produkte · kreativalab',
      fr: 'Produits SaaS B2B Suisse · kreativalab',
      en: 'Swiss B2B SaaS Products · kreativalab',
    };
    const descByLang: Record<Language, string> = {
      it: '6 piattaforme SaaS proprietarie per aziende svizzere: lead intelligence B2B, SEO locale, social AI, gestione veterinaria e bandi scolastici.',
      de: '6 eigene SaaS-Plattformen für Schweizer KMU: B2B-Lead-Suche, lokale SEO, KI-Social-Publishing, Tiergesundheit und Schul-Monitoring.',
      fr: '6 plateformes SaaS propriétaires pour PME suisses : prospection B2B, SEO local, publication sociale IA, santé animale et suivi scolaire.',
      en: '6 proprietary SaaS platforms built in Lugano: Swiss B2B lead intelligence, local SEO automation, AI social publishing, and vertical tools.',
    };
    const saasList = getSaasProjects().map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.name,
      url: buildCanonicalRouteUrl(origin, `/prodotti/${p.slug}`, lang),
    }));
    return {
      title: clampText(titleByLang[lang], 60),
      description: clampText(descByLang[lang], 155),
      canonicalUrl,
      ogType: 'website',
      ogLocale,
      ogLocaleAlternates,
      ogImage,
      ogImageAlt,
      robots: 'index, follow',
      hreflangs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          orgNode,
          {
            '@type': 'CollectionPage',
            name: titleByLang[lang],
            description: descByLang[lang],
            url: canonicalUrl,
            mainEntity: { '@type': 'ItemList', itemListElement: saasList },
          },
          buildBreadcrumbSchema(origin, [
            { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
            { name: t.nav.products, url: canonicalUrl },
          ]),
        ],
      },
    };
  }

  // 3. Work / Case Study Detail (/lavori/:slug)
  if (path.startsWith('/lavori/')) {
    const slug = path.replace('/lavori/', '');
    const work = getProjectBySlug(slug);
    if (work && work.engine === 'agency') {
      const titleByLang: Record<Language, string> = {
        it: `${work.name} · Caso Studio Ticino | kreativalab`,
        de: `${work.name} · Fallstudie Tessin | kreativalab`,
        fr: `${work.name} · Étude de Cas Tessin | kreativalab`,
        en: `${work.name} · Ticino Case Study | kreativalab`,
      };
      const descByLang: Record<Language, string> = {
        it: `${work.name}: ${work.results.it}`,
        de: `${work.name}: ${work.results.de}`,
        fr: `${work.name} : ${work.results.fr}`,
        en: `${work.name}: ${work.results.en}`,
      };
      return {
        title: clampText(titleByLang[lang], 60),
        description: clampText(descByLang[lang], 155),
        canonicalUrl,
        ogType: 'article',
        ogLocale,
        ogLocaleAlternates,
        ogImage,
        ogImageAlt,
        robots: 'index, follow',
        hreflangs,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            orgNode,
            buildCreativeWorkSchema(origin, work, lang, canonicalUrl),
            buildBreadcrumbSchema(origin, [
              { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
              { name: t.nav.works, url: buildCanonicalRouteUrl(origin, '/lavori', lang) },
              { name: work.name, url: canonicalUrl },
            ]),
          ],
        },
      };
    }
  }

  // 4. Works Hub (/lavori)
  if (path === '/lavori' || path.startsWith('/lavori/')) {
    const titleByLang: Record<Language, string> = {
      it: 'Casi Studio & Lavori Web Ticino · kreativalab',
      de: 'Fallstudien & Webprojekte Tessin · kreativalab',
      fr: 'Études de Cas & Projets Tessin · kreativalab',
      en: 'Case Studies & Client Works Ticino · kreativalab',
    };
    const descByLang: Record<Language, string> = {
      it: 'Siti web veloci, booking turistico, SEO locale a Lugano e agenti AI per ristoranti e PMI in Ticino. Scopri sfida, soluzione e risultati.',
      de: 'Schnelle Websites, Direktbuchung, lokale SEO in Lugano und KI-Agenten für Unternehmen im Tessin. Fallstudien mit messbaren Resultaten.',
      fr: 'Sites web rapides, réservation directe, SEO local à Lugano et agents IA pour entreprises au Tessin. Études de cas et résultats chiffrés.',
      en: 'Fast websites, direct hospitality booking, Lugano local SEO, and AI agents for Ticino businesses. Explore real client outcomes.',
    };
    const worksList = getAgencyProjects().map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.name,
      url: buildCanonicalRouteUrl(origin, `/lavori/${p.slug}`, lang),
    }));
    return {
      title: clampText(titleByLang[lang], 60),
      description: clampText(descByLang[lang], 155),
      canonicalUrl,
      ogType: 'website',
      ogLocale,
      ogLocaleAlternates,
      ogImage,
      ogImageAlt,
      robots: 'index, follow',
      hreflangs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          orgNode,
          localBizNode,
          {
            '@type': 'CollectionPage',
            name: titleByLang[lang],
            description: descByLang[lang],
            url: canonicalUrl,
            mainEntity: { '@type': 'ItemList', itemListElement: worksList },
          },
          buildBreadcrumbSchema(origin, [
            { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
            { name: t.nav.works, url: canonicalUrl },
          ]),
        ],
      },
    };
  }

  // 5. Services (/servizi and /servizi/:slug or /servizi/:citySlug)
  if (isServiceRoute) {
    const slug = path === '/servizi' ? '' : path.replace('/servizi/', '');
    const selectedService = cityFromPath
      ? SERVICES.find((s) => s.slug === 'seo-locale') || SERVICES[0]
      : SERVICES.find((s) => s.slug === slug) || SERVICES[0];

    const hasExplicitCity = Boolean(cityFromPath) || resolvedCitySlug !== 'lugano';

    let pageTitle: string;
    let pageDescription: string;

    if (path === '/servizi' && !hasExplicitCity) {
      const titles: Record<Language, string> = {
        it: 'Siti Web, SEO Locale & Agenti AI Ticino · kreativalab',
        de: 'Websites, Lokale SEO & KI-Agenten Tessin · kreativalab',
        fr: 'Sites Web, SEO Local & Agents IA Tessin · kreativalab',
        en: 'Web Design, Local SEO & AI Agents Ticino · kreativalab',
      };
      const descs: Record<Language, string> = {
        it: 'Web agency a Lugano: siti web ad alte prestazioni, e-commerce TWINT, SEO locale in Ticino e segreterie telefoniche AI per ristoranti e saloni.',
        de: 'Webagentur in Lugano: schnelle Websites, TWINT E-Commerce, lokale SEO im Tessin sowie KI-Telefonassistenten für Gastronomie und Salons.',
        fr: 'Agence web à Lugano : sites haute performance, e-commerce TWINT, SEO local au Tessin et secrétariats vocaux IA pour restaurants et salons.',
        en: 'Lugano web agency delivering fast websites, TWINT e-commerce, Ticino local SEO, and 24/7 AI voice agents for restaurants and salons.',
      };
      pageTitle = titles[lang];
      pageDescription = descs[lang];
    } else if (cityFromPath || hasExplicitCity) {
      const titles: Record<Language, string> = {
        it: `${selectedService.shortTitle.it} ${cityProfile.name} · kreativalab`,
        de: `${selectedService.shortTitle.de} ${cityProfile.name} · kreativalab`,
        fr: `${selectedService.shortTitle.fr} ${cityProfile.name} · kreativalab`,
        en: `${selectedService.shortTitle.en} ${cityProfile.name} · kreativalab`,
      };
      pageTitle = titles[lang];
      pageDescription = `${cityProfile.name} (${cityProfile.regionLabel[lang]}): ${cityProfile.description[lang]}`;
    } else {
      const titles: Record<Language, string> = {
        it: `${selectedService.shortTitle.it} Ticino & Lugano · kreativalab`,
        de: `${selectedService.shortTitle.de} Tessin & Lugano · kreativalab`,
        fr: `${selectedService.shortTitle.fr} Tessin & Lugano · kreativalab`,
        en: `${selectedService.shortTitle.en} Ticino & Lugano · kreativalab`,
      };
      pageTitle = titles[lang];
      pageDescription = `${selectedService.title[lang]}: ${selectedService.subtitle[lang]}`;
    }

    const faqSchema = buildFaqSchema(selectedService, lang);
    const graphNodes: Record<string, unknown>[] = [
      orgNode,
      localBizNode,
      buildServiceSchema(origin, selectedService, lang, canonicalUrl, cityProfile),
      buildBreadcrumbSchema(origin, [
        { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
        { name: t.nav.services, url: buildCanonicalRouteUrl(origin, '/servizi', lang) },
        ...(path !== '/servizi'
          ? [
              {
                name: cityFromPath
                  ? `${selectedService.shortTitle[lang]} · ${cityProfile.name}`
                  : selectedService.shortTitle[lang],
                url: canonicalUrl,
              },
            ]
          : []),
      ]),
    ];
    if (faqSchema) graphNodes.push(faqSchema);

    return {
      title: clampText(pageTitle, 60),
      description: clampText(pageDescription, 155),
      canonicalUrl,
      ogType: 'website',
      ogLocale,
      ogLocaleAlternates,
      ogImage,
      ogImageAlt,
      robots: 'index, follow',
      hreflangs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': graphNodes,
      },
    };
  }

  // 6. About (/chi-siamo)
  if (path === '/chi-siamo') {
    const titleByLang: Record<Language, string> = {
      it: 'Chi Siamo · kreativalab & SitiTicino Lugano',
      de: 'Über Uns · kreativalab & SitiTicino Lugano',
      fr: 'À Propos · kreativalab & SitiTicino Lugano',
      en: 'About Us · kreativalab & SitiTicino Lugano',
    };
    const descByLang: Record<Language, string> = {
      it: 'kreativalab a Lugano: uniamo Venture Studio SaaS e agenzia digitale SitiTicino per le imprese della Svizzera italiana.',
      de: 'kreativalab in Lugano: SaaS Venture Studio und Digitalagentur SitiTicino für KMU in der italienischen Schweiz.',
      fr: 'kreativalab à Lugano : Venture Studio SaaS et agence digitale SitiTicino pour les entreprises de Suisse italienne.',
      en: 'kreativalab in Lugano: combining a B2B SaaS Venture Studio and the SitiTicino agency across Italian-speaking Switzerland.',
    };
    return {
      title: clampText(titleByLang[lang], 60),
      description: clampText(descByLang[lang], 155),
      canonicalUrl,
      ogType: 'website',
      ogLocale,
      ogLocaleAlternates,
      ogImage,
      ogImageAlt,
      robots: 'index, follow',
      hreflangs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          orgNode,
          localBizNode,
          buildBreadcrumbSchema(origin, [
            { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
            { name: t.nav.about, url: canonicalUrl },
          ]),
        ],
      },
    };
  }

  // 7. Contact (/contatti)
  if (path === '/contatti') {
    const titleByLang: Record<Language, string> = {
      it: 'Contatti & Preventivo · kreativalab Lugano',
      de: 'Kontakt & Offerte · kreativalab Lugano',
      fr: 'Contact & Devis · kreativalab Lugano',
      en: 'Contact & Quote · kreativalab Lugano',
    };
    const descByLang: Record<Language, string> = {
      it: 'Richiedi un preventivo web, SEO locale Ticino o demo SaaS/AI. Lugano · Risposta entro 4 ore lavorative.',
      de: 'Offerte für Website, lokale SEO Tessin oder KI/SaaS-Demo anfordern. Lugano · Antwort in 4 Stunden.',
      fr: 'Demandez un devis site web, SEO local Tessin ou démo SaaS/IA. Lugano · Réponse sous 4h.',
      en: 'Request a web, Ticino local SEO, or SaaS/AI quote. Lugano · Reply within 4 business hours.',
    };
    return {
      title: clampText(titleByLang[lang], 60),
      description: clampText(descByLang[lang], 155),
      canonicalUrl,
      ogType: 'website',
      ogLocale,
      ogLocaleAlternates,
      ogImage,
      ogImageAlt,
      robots: 'index, follow',
      hreflangs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          orgNode,
          localBizNode,
          {
            '@type': 'ContactPage',
            name: titleByLang[lang],
            url: canonicalUrl,
            mainEntity: { '@id': `${origin}/#localbusiness` },
          },
          buildBreadcrumbSchema(origin, [
            { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
            { name: t.nav.contact, url: canonicalUrl },
          ]),
        ],
      },
    };
  }

  // 8. Legal (/privacy, /cookie, /impressum)
  if (path === '/privacy' || path === '/cookie' || path === '/impressum') {
    const isPrivacy = path === '/privacy';
    const isImpressum = path === '/impressum';
    const titleByLang: Record<Language, string> = isPrivacy
      ? {
          it: 'Informativa Privacy nLPD / GDPR · kreativalab',
          de: 'Datenschutz nDSG / DSGVO · kreativalab',
          fr: 'Confidentialité nLPD / RGPD · kreativalab',
          en: 'Privacy Policy Swiss FADP / GDPR · kreativalab',
        }
      : isImpressum
      ? {
          it: 'Impressum Dati Aziendali LCSI · kreativalab',
          de: 'Impressum & Angaben UWG · kreativalab',
          fr: 'Impressum & Mentions LCD · kreativalab',
          en: 'Impressum Corporate Notice · kreativalab',
        }
      : {
          it: 'Preferenze Cookie nLPD / GDPR · kreativalab',
          de: 'Cookie-Einstellungen nDSG · kreativalab',
          fr: 'Préférences Cookies nLPD · kreativalab',
          en: 'Cookie Preferences FADP / GDPR · kreativalab',
        };
    const descByLang: Record<Language, string> = isImpressum
      ? {
          it: 'Impressum e dati societari di kreativalab (Lugano) ai sensi della Legge federale contro la concorrenza sleale (LCSI art. 3).',
          de: 'Impressum und Unternehmensangaben von kreativalab (Lugano) gemäss Schweizer UWG Art. 3.',
          fr: 'Impressum et mentions légales de kreativalab (Lugano) conformément à la loi suisse contre la concurrence déloyale (LCD art. 3).',
          en: 'Corporate disclosure and Impressum for kreativalab (Lugano) pursuant to Art. 3 of the Swiss Act Against Unfair Competition (UWG).',
        }
      : {
          it: 'Trattamento dati personali e gestione cookie di kreativalab (Lugano) conforme alla legge svizzera nLPD e al GDPR europeo.',
          de: 'Datenschutz und Cookie-Verwaltung von kreativalab (Lugano) gemäß Schweizer nDSG und europäischer DSGVO.',
          fr: 'Traitement des données et gestion des cookies de kreativalab (Lugano) conforme à la nLPD suisse et au RGPD.',
          en: 'Data protection and cookie preferences for kreativalab (Lugano), compliant with Swiss FADP (nLPD) and EU GDPR.',
        };
    const pageBreadcrumbName = isPrivacy
      ? t.footer.privacyLink
      : isImpressum
      ? t.footer.impressumLink
      : t.footer.cookieLink;
    return {
      title: clampText(titleByLang[lang], 60),
      description: clampText(descByLang[lang], 155),
      canonicalUrl,
      ogType: 'website',
      ogLocale,
      ogLocaleAlternates,
      ogImage,
      ogImageAlt,
      robots: 'noindex, follow',
      hreflangs,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          orgNode,
          buildBreadcrumbSchema(origin, [
            { name: t.seoUi.homeLabel, url: buildCanonicalRouteUrl(origin, '/', lang) },
            {
              name: pageBreadcrumbName,
              url: canonicalUrl,
            },
          ]),
        ],
      },
    };
  }

  // 9. Home (/)
  const homeTitles: Record<Language, string> = {
    it: 'kreativalab — Digital Venture Studio & Agency | Lugano',
    de: 'kreativalab — Digital Venture Studio & Agentur | Lugano',
    fr: 'kreativalab — Venture Studio & Agence Digitale | Lugano',
    en: 'kreativalab — Digital Venture Studio & Agency | Lugano',
  };
  const homeDescs: Record<Language, string> = {
    it: 'Venture Studio SaaS e Web Agency a Lugano: piattaforme B2B, siti veloci, SEO locale in Ticino e agenti AI vocali 24/7 per far crescere la tua impresa.',
    de: 'SaaS Venture Studio & Webagentur in Lugano: B2B-Software, schnelle Websites, lokale SEO im Tessin und KI-Sprachagenten für Ihr Unternehmen.',
    fr: 'Venture Studio SaaS & Agence Web à Lugano : logiciels B2B, sites rapides, SEO local au Tessin et agents vocaux IA 24/7 pour votre entreprise.',
    en: 'SaaS Venture Studio & Web Agency in Lugano: B2B platforms, fast websites, Ticino local SEO, and 24/7 AI voice agents to grow your business.',
  };

  return {
    title: clampText(homeTitles[lang], 60),
    description: clampText(homeDescs[lang], 155),
    canonicalUrl: buildCanonicalRouteUrl(origin, '/', lang),
    ogType: 'website',
    ogLocale,
    ogLocaleAlternates,
    ogImage,
    ogImageAlt,
    robots: 'index, follow',
    hreflangs: [
      {
        hreflang: lang,
        href: buildCanonicalRouteUrl(origin, '/', lang),
      },
      ...ALL_LANGS.filter((code) => code !== lang).map((code) => ({
        hreflang: code,
        href: buildCanonicalRouteUrl(origin, '/', code),
      })),
      {
        hreflang: 'x-default',
        href: buildCanonicalRouteUrl(origin, '/', 'it'),
      },
    ],
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        orgNode,
        localBizNode,
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: BUSINESS_INFO.combinedBrand,
          inLanguage: ['it-CH', 'de-CH', 'fr-CH', 'en'],
          publisher: { '@id': `${origin}/#organization` },
        },
      ],
    },
  };
}