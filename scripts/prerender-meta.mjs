import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { register } from 'tsx/esm/api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const SITEMAP_PATH = path.join(ROOT_DIR, 'public/sitemap.xml');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractItalianRoutes(sitemapXml) {
  const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    m[1].trim()
  );
  const routes = new Set();

  for (const loc of locs) {
    try {
      const url = new URL(loc);
      const langParam = url.searchParams.get('lang');
      if (langParam && langParam !== 'it') continue;
      const pathname =
        url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
      routes.add(pathname);
    } catch {
      // Skip malformed URLs
    }
  }

  return [...routes];
}

function applySeoToHtml(templateHtml, seo) {
  const safeTitle = escapeHtml(seo.title);
  const safeDesc = escapeHtml(seo.description);
  const safeCanonical = escapeHtml(seo.canonicalUrl);

  let html = templateHtml;

  html = html.replace(
    /<title>[\s\S]*?<\/title>/i,
    () => `<title>${safeTitle}</title>`
  );

  html = html.replace(
    /<meta\s+name=["']description["'][\s\S]*?\/?>/i,
    () => `<meta name="description" content="${safeDesc}" />`
  );

  html = html.replace(
    /<link\s+rel=["']canonical["'][\s\S]*?\/?>/i,
    () => `<link rel="canonical" href="${safeCanonical}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:title["'][\s\S]*?\/?>/i,
    () => `<meta property="og:title" content="${safeTitle}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:description["'][\s\S]*?\/?>/i,
    () => `<meta property="og:description" content="${safeDesc}" />`
  );

  html = html.replace(
    /<meta\s+property=["']og:url["'][\s\S]*?\/?>/i,
    () => `<meta property="og:url" content="${safeCanonical}" />`
  );

  return html;
}

async function run() {
  const unregister = register();
  try {
    const indexHtmlPath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(indexHtmlPath)) {
      throw new Error(`Missing build output: ${indexHtmlPath}`);
    }
    if (!fs.existsSync(SITEMAP_PATH)) {
      throw new Error(`Missing sitemap: ${SITEMAP_PATH}`);
    }

    const templateHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const routes = extractItalianRoutes(sitemapXml);

    const { resolveSeoMetadata } = await import('../src/utils/seo.ts');

    let count = 0;
    for (const routePath of routes) {
      const seo = resolveSeoMetadata({
        path: routePath,
        lang: 'it',
        city: 'lugano',
      });
      const renderedHtml = applySeoToHtml(templateHtml, seo);

      const targetPath =
        routePath === '/'
          ? indexHtmlPath
          : path.join(DIST_DIR, routePath.replace(/^\/+/, ''), 'index.html');

      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, renderedHtml, 'utf8');
      count += 1;
    }

    console.log(`Prerendered SEO meta tags for ${count} IT routes in dist/.`);
  } finally {
    unregister();
  }
}

run().catch((err) => {
  console.error('prerender-meta failed:', err);
  process.exit(1);
});
