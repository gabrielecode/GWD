import { useCallback, useEffect, useState } from 'react';
import {
  CookiePreferences,
  Language,
  ProjectFilter,
  TicinoCitySlug,
} from './types/showcase';
import { getProjectBySlug } from './data/projects';
import { TICINO_CITIES } from './data/services';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { SeoHead } from './components/SeoHead';
import { HomeView } from './views/HomeView';
import { ProductsHubView } from './views/ProductsHubView';
import { ProductDetailView } from './views/ProductDetailView';
import { WorksHubView } from './views/WorksHubView';
import { WorkDetailView } from './views/WorkDetailView';
import { ServicesView } from './views/ServicesView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { AdminAffiliatesView } from './views/AdminAffiliatesView';
import { AdminPayoutsView } from './views/AdminPayoutsView';
import { AffiliatePortalView } from './views/AffiliatePortalView';

const COOKIE_STORAGE_KEY = 'kreativalab_group_cookie_prefs_v1';

function parseUrlState(): {
  path: string;
  lang: Language;
  filter: ProjectFilter;
  city: TicinoCitySlug;
} {
  let rawPath = window.location.pathname || '/';
  let pathLang: Language | null = null;

  const prefixMatch = rawPath.match(/^\/(it|de|fr|en)(\/|$)/);
  if (prefixMatch) {
    pathLang = prefixMatch[1] as Language;
    rawPath = rawPath.slice(prefixMatch[1].length + 1) || '/';
  }

  const normalizedPath =
    rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

  const params = new URLSearchParams(window.location.search);
  const qLang = params.get('lang');
  const lang: Language =
    qLang === 'de' || qLang === 'fr' || qLang === 'en' || qLang === 'it'
      ? qLang
      : pathLang || 'it';

  const qFilter = params.get('filter');
  const filter: ProjectFilter =
    qFilter === 'saas' || qFilter === 'agency' || qFilter === 'all'
      ? qFilter
      : 'all';

  const cityFromPath = TICINO_CITIES.find(
    (c) => normalizedPath === `/servizi/${c.slug}`
  );
  const qCity = params.get('city');
  const city: TicinoCitySlug = cityFromPath
    ? cityFromPath.slug
    : qCity === 'lugano' ||
      qCity === 'bellinzona' ||
      qCity === 'locarno' ||
      qCity === 'mendrisio'
    ? qCity
    : 'lugano';

  return { path: normalizedPath, lang, filter, city };
}

function buildUrl(
  path: string,
  lang: Language,
  filter: ProjectFilter,
  city?: TicinoCitySlug
): string {
  const params = new URLSearchParams();
  if (lang !== 'it') params.set('lang', lang);
  if (path === '/' && filter !== 'all') params.set('filter', filter);
  const isCitySlugPath = TICINO_CITIES.some((c) => path === `/servizi/${c.slug}`);
  if (path.startsWith('/servizi') && !isCitySlugPath && city && city !== 'lugano') {
    params.set('city', city);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

export default function App() {
  const initial = parseUrlState();
  const [currentPath, setCurrentPath] = useState<string>(initial.path);
  const [lang, setLang] = useState<Language>(initial.lang);
  const [filter, setFilter] = useState<ProjectFilter>(initial.filter);
  const [city, setCity] = useState<TicinoCitySlug>(initial.city);
  const [showCookieModal, setShowCookieModal] = useState(false);

  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(() => {
    try {
      const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (saved) return JSON.parse(saved) as CookiePreferences;
    } catch {
      // ignore storage access issues
    }
    return { necessary: true, analytics: false, decided: false };
  });

  const handleUpdateCookies = useCallback((prefs: CookiePreferences) => {
    setCookiePrefs(prefs);
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage access issues
    }
  }, []);

  // Sync browser back/forward navigation
  useEffect(() => {
    const onPopState = () => {
      const next = parseUrlState();
      setCurrentPath(next.path);
      setLang(next.lang);
      setFilter(next.filter);
      setCity(next.city);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback(
    (nextPath: string, nextCity?: TicinoCitySlug) => {
      const cityFromPath = TICINO_CITIES.find(
        (c) => nextPath === `/servizi/${c.slug}`
      );
      const resolvedCity = cityFromPath ? cityFromPath.slug : nextCity || city;
      setCurrentPath(nextPath);
      if (cityFromPath) setCity(cityFromPath.slug);
      else if (nextCity) setCity(nextCity);

      const url = buildUrl(nextPath, lang, filter, resolvedCity);
      window.history.pushState({}, '', url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [lang, filter, city]
  );

  const handleFilterChange = useCallback(
    (nextFilter: ProjectFilter) => {
      setFilter(nextFilter);
      const url = buildUrl(currentPath, lang, nextFilter, city);
      window.history.replaceState({}, '', url);
    },
    [currentPath, lang, city]
  );

  const handleChangeLang = useCallback(
    (nextLang: Language) => {
      setLang(nextLang);
      const url = buildUrl(currentPath, nextLang, filter, city);
      window.history.replaceState({}, '', url);
    },
    [currentPath, filter, city]
  );

  const handleSelectCity = useCallback(
    (nextCity: TicinoCitySlug) => {
      setCity(nextCity);
      const isCitySlugPath = TICINO_CITIES.some(
        (c) => currentPath === `/servizi/${c.slug}`
      );
      const targetPath = isCitySlugPath ? `/servizi/${nextCity}` : currentPath;
      if (isCitySlugPath) setCurrentPath(targetPath);
      const url = buildUrl(targetPath, lang, filter, nextCity);
      window.history.replaceState({}, '', url);
    },
    [currentPath, lang, filter]
  );

  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <HomeView
          lang={lang}
          activeFilter={filter}
          onFilterChange={handleFilterChange}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/prodotti') {
      return <ProductsHubView lang={lang} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/prodotti/')) {
      const slug = currentPath.replace('/prodotti/', '');
      const project = getProjectBySlug(slug);
      if (project && project.engine === 'saas') {
        return (
          <ProductDetailView
            project={project}
            lang={lang}
            onNavigate={navigate}
          />
        );
      }
      return <ProductsHubView lang={lang} onNavigate={navigate} />;
    }

    if (currentPath === '/lavori') {
      return <WorksHubView lang={lang} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/lavori/')) {
      const slug = currentPath.replace('/lavori/', '');
      const project = getProjectBySlug(slug);
      if (project && project.engine === 'agency') {
        return (
          <WorkDetailView
            project={project}
            lang={lang}
            onNavigate={navigate}
          />
        );
      }
      return <WorksHubView lang={lang} onNavigate={navigate} />;
    }

    if (currentPath === '/servizi') {
      return (
        <ServicesView
          lang={lang}
          activeCity={city}
          onSelectCity={handleSelectCity}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/servizi/')) {
      const rawSlug = currentPath.replace('/servizi/', '');
      const isCitySlug = TICINO_CITIES.some((c) => c.slug === rawSlug);
      const serviceSlug = isCitySlug ? 'seo-locale' : rawSlug;
      return (
        <ServicesView
          lang={lang}
          activeServiceSlug={serviceSlug}
          activeCity={isCitySlug ? (rawSlug as TicinoCitySlug) : city}
          onSelectCity={handleSelectCity}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/chi-siamo') {
      return <AboutView lang={lang} onNavigate={navigate} />;
    }

    if (currentPath === '/contatti') {
      return <ContactView lang={lang} onNavigate={navigate} />;
    }

    if (currentPath === '/privacy') {
      return (
        <LegalView
          mode="privacy"
          lang={lang}
          cookiePrefs={cookiePrefs}
          onUpdateCookies={handleUpdateCookies}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/cookie') {
      return (
        <LegalView
          mode="cookie"
          lang={lang}
          cookiePrefs={cookiePrefs}
          onUpdateCookies={handleUpdateCookies}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/impressum') {
      return (
        <LegalView
          mode="impressum"
          lang={lang}
          cookiePrefs={cookiePrefs}
          onUpdateCookies={handleUpdateCookies}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/admin/affiliates') {
      return <AdminAffiliatesView onNavigate={navigate} />;
    }

    if (currentPath === '/admin/payouts') {
      return <AdminPayoutsView onNavigate={navigate} />;
    }

    if (currentPath === '/affiliate') {
      return <AffiliatePortalView onNavigate={navigate} />;
    }

    // Fallback to Home
    return (
      <HomeView
        lang={lang}
        activeFilter={filter}
        onFilterChange={handleFilterChange}
        onNavigate={navigate}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0A09] text-[#FAFAF9] overflow-x-clip">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#2DD4BF] focus:text-[#0C0A09] focus:font-semibold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FAFAF9]"
      >
        Vai al contenuto
      </a>
      <SeoHead currentPath={currentPath} lang={lang} city={city} />
      <Header
        currentPath={currentPath}
        lang={lang}
        onNavigate={navigate}
        onChangeLang={handleChangeLang}
      />

      <main id="main" className="flex-1 pt-14 lg:pt-16">
        {renderRoute()}
      </main>

      <Footer
        lang={lang}
        onNavigate={navigate}
        onChangeLang={handleChangeLang}
        onOpenCookieSettings={() => setShowCookieModal(true)}
      />

      <FloatingActions
        lang={lang}
        cookiePrefs={cookiePrefs}
        showCookieModal={showCookieModal}
        onUpdateCookies={handleUpdateCookies}
        onCloseCookieModal={() => setShowCookieModal(false)}
        onNavigate={navigate}
      />
    </div>
  );
}
