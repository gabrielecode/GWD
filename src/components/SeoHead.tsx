import { useEffect } from 'react';
import { Language, TicinoCitySlug } from '../types/showcase';
import { resolveSeoMetadata } from '../utils/seo';

interface SeoHeadProps {
  currentPath: string;
  lang: Language;
  city: TicinoCitySlug;
}

function upsertMetaTag(
  selectorAttr: 'name' | 'property',
  attrValue: string,
  content: string
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${selectorAttr}="${attrValue}"]`
  );
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(selectorAttr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function syncHreflangLinks(hreflangs: { hreflang: string; href: string }[]) {
  document.head
    .querySelectorAll('link[rel="alternate"][data-seo-managed="true"]')
    .forEach((node) => node.remove());

  hreflangs.forEach(({ hreflang, href }) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', href);
    link.setAttribute('data-seo-managed', 'true');
    document.head.appendChild(link);
  });
}

function syncOgLocaleAlternates(locales: string[]) {
  document.head
    .querySelectorAll('meta[property="og:locale:alternate"][data-seo-managed="true"]')
    .forEach((node) => node.remove());

  locales.forEach((loc) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:locale:alternate');
    meta.setAttribute('content', loc);
    meta.setAttribute('data-seo-managed', 'true');
    document.head.appendChild(meta);
  });
}

function syncJsonLd(jsonLd: Record<string, unknown>) {
  let script = document.head.querySelector<HTMLScriptElement>(
    'script#kreativalab-jsonld[type="application/ld+json"]'
  );
  if (!script) {
    script = document.createElement('script');
    script.id = 'kreativalab-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLd);
}

export function SeoHead({ currentPath, lang, city }: SeoHeadProps) {
  useEffect(() => {
    const seo = resolveSeoMetadata({ path: currentPath, lang, city });

    document.documentElement.lang = lang;
    document.title = seo.title;

    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('name', 'robots', seo.robots);
    upsertCanonical(seo.canonicalUrl);
    syncHreflangLinks(seo.hreflangs);

    // Open Graph
    upsertMetaTag('property', 'og:site_name', 'Kreativalab');
    upsertMetaTag('property', 'og:title', seo.title);
    upsertMetaTag('property', 'og:description', seo.description);
    upsertMetaTag('property', 'og:type', seo.ogType);
    upsertMetaTag('property', 'og:url', seo.canonicalUrl);
    upsertMetaTag('property', 'og:locale', seo.ogLocale);
    syncOgLocaleAlternates(seo.ogLocaleAlternates);
    upsertMetaTag('property', 'og:image', seo.ogImage);
    upsertMetaTag('property', 'og:image:width', '1376');
    upsertMetaTag('property', 'og:image:height', '768');
    upsertMetaTag('property', 'og:image:alt', seo.ogImageAlt);

    // Twitter Cards
    upsertMetaTag('name', 'twitter:card', 'summary_large_image');
    upsertMetaTag('name', 'twitter:title', seo.title);
    upsertMetaTag('name', 'twitter:description', seo.description);
    upsertMetaTag('name', 'twitter:image', seo.ogImage);
    upsertMetaTag('name', 'twitter:image:alt', seo.ogImageAlt);

    // Schema.org JSON-LD
    syncJsonLd(seo.jsonLd);
  }, [currentPath, lang, city]);

  return null;
}
