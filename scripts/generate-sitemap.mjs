import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://kreativalab.ch').replace(/\/$/, '');
const LANGS = ['it', 'de', 'fr', 'en'];
const TODAY = new Date().toISOString().slice(0, 10);

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildLangUrl(routePath, lang) {
  const normalized = routePath === '/' ? '/' : routePath.replace(/\/$/, '');
  if (lang === 'it') return `${SITE_URL}${normalized}`;
  return `${SITE_URL}${normalized}?lang=${lang}`;
}

function extractProjects() {
  const source = fs.readFileSync(path.join(ROOT_DIR, 'src/data/projects.ts'), 'utf8');
  const matches = [...source.matchAll(/slug:\s*'([^']+)'[\s\S]{1,120}?engine:\s*'(saas|agency)'/g)];
  return matches.map((m) => ({ slug: m[1], engine: m[2] }));
}

function extractServicesAndCities() {
  const source = fs.readFileSync(path.join(ROOT_DIR, 'src/data/services.ts'), 'utf8');
  const servicesSection = source.split('export const TICINO_CITIES')[0] || '';
  const citiesSection = source.split('export const TICINO_CITIES')[1] || '';

  const serviceSlugs = [...servicesSection.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);
  const citySlugs = [...citiesSection.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);

  return { serviceSlugs, citySlugs };
}

function generateSitemap() {
  const projects = extractProjects();
  const { serviceSlugs, citySlugs } = extractServicesAndCities();

  const routes = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/prodotti', changefreq: 'weekly', priority: '0.9' },
    ...projects
      .filter((p) => p.engine === 'saas')
      .map((p) => ({ path: `/prodotti/${p.slug}`, changefreq: 'monthly', priority: '0.8' })),
    { path: '/lavori', changefreq: 'weekly', priority: '0.9' },
    ...projects
      .filter((p) => p.engine === 'agency')
      .map((p) => ({ path: `/lavori/${p.slug}`, changefreq: 'monthly', priority: '0.8' })),
    { path: '/servizi', changefreq: 'weekly', priority: '0.9' },
    ...serviceSlugs.map((slug) => ({
      path: `/servizi/${slug}`,
      changefreq: 'monthly',
      priority: '0.85',
    })),
    ...citySlugs.map((slug) => ({
      path: `/servizi/${slug}`,
      changefreq: 'monthly',
      priority: '0.85',
    })),
    { path: '/chi-siamo', changefreq: 'monthly', priority: '0.7' },
    { path: '/contatti', changefreq: 'monthly', priority: '0.8' },
  ];

  const urlBlocks = routes.flatMap((route) => {
    return LANGS.map((currentLang) => {
      const loc = escapeXml(buildLangUrl(route.path, currentLang));
      const alternates = [
        `    <xhtml:link rel="alternate" hreflang="${currentLang}" href="${loc}" />`,
        ...LANGS.filter((lang) => lang !== currentLang).map(
          (lang) =>
            `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(
              buildLangUrl(route.path, lang)
            )}" />`
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
          buildLangUrl(route.path, 'it')
        )}" />`,
      ].join('\n');

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${TODAY}</lastmod>`,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${currentLang === 'it' ? route.priority : (Math.max(0.2, parseFloat(route.priority) - 0.1)).toFixed(1)}</priority>`,
        alternates,
        '  </url>',
      ].join('\n');
    });
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urlBlocks,
    '</urlset>',
    '',
  ].join('\n');

  const outPath = path.join(ROOT_DIR, 'public/sitemap.xml');
  fs.writeFileSync(outPath, xml, 'utf8');
  console.log(`Generated ${outPath} with ${urlBlocks.length} URLs across ${routes.length} routes (${LANGS.join(', ')}, x-default).`);
}

generateSitemap();
