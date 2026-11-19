import { useCallback, useEffect, useState } from 'react';
import {
  CookiePreferences,
  Language,
  ProjectFilter,
  TicinoCitySlug,
} from './types/showcase';
import { getProjectBySlug } from './data/projects';
import { TRANSLATIONS } from './data/translations';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { HomeView } from './views/HomeView';
import { ProductsHubView } from './views/ProductsHubView';
import { ProductDetailView } from './views/ProductDetailView';
import { WorksHubView } from './views/WorksHubView';
import { WorkDetailView } from './views/WorkDetailView';
import { ServicesView } from './views/ServicesView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';

const COOKIE_STORAGE_KEY = 'gwd_group_cookie_prefs_v1';

function parseUrlState(): {
  path: string;
  lang: Language;
  filter: ProjectFilter;
  city: TicinoCitySlug;
} {
  const rawPath = window.location.pathname || '/';
  const normalizedPath = rawPath.length > 1 && rawPath.endsWith('/')
    ? rawPath.slice(0, -1)
    : rawPath;

  const params = new URLSearchParams(window.location.search);
  const qLang = params.get('lang');
  const lang: Language =
    qLang === 'de' || qLang === 'fr' || qLang === 'en' || qLang === 'it'
      ? qLang
      : 'it';

  const qFilter = params.get('filter');
  const filter: ProjectFilter =
    qFilter === 'saas' || qFilter === 'agency' || qFilter === 'all'
      ? qFilter
      : 'all';

  const qCity = params.get('city');
  const city: TicinoCitySlug =
    qCity === 'lugano' ||
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
  if (path.startsWith('/servizi') && city && city !== 'lugano') {
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

  // Update <html lang> & dynamic SEO <title>
  useEffect(() => {
    document.documentElement.lang = lang;
    const t = TRANSLATIONS[lang];
    let pageTitle = `GWD Group — ${t.hero.title}`;

    if (currentPath.startsWith('/prodotti/')) {
      const slug = currentPath.replace('/prodotti/', '');
      const prod = getProjectBySlug(slug);
      if (prod) pageTitle = `${prod.name} · GWD Group SaaS`;
    } else if (currentPath.startsWith('/lavori/')) {
      const slug = currentPath.replace('/lavori/', '');
      const work = getProjectBySlug(slug);
      if (work) pageTitle = `${work.name} · Case Study · GWD Group`;
    } else if (currentPath === '/prodotti') {
      pageTitle = `${t.nav.products} · GWD Group`;
    } else if (currentPath === '/lavori') {
      pageTitle = `${t.nav.works} · GWD Group`;
    } else if (currentPath.startsWith('/servizi')) {
      pageTitle = `${t.nav.services} · GWD Group Lugano`;
    } else if (currentPath === '/chi-siamo') {
      pageTitle = `${t.nav.about} · GWD Group`;
    } else if (currentPath === '/contatti') {
      pageTitle = `${t.nav.contact} · GWD Group Lugano`;
    } else if (currentPath === '/privacy') {
      pageTitle = `${t.footer.privacyLink} · GWD Group`;
    } else if (currentPath === '/cookie') {
      pageTitle = `${t.footer.cookieLink} · GWD Group`;
    }

    document.title = pageTitle;
  }, [currentPath, lang]);

  const navigate = useCallback(
    (nextPath: string, nextCity?: TicinoCitySlug) => {
      const resolvedCity = nextCity || city;
      setCurrentPath(nextPath);
      if (nextCity) setCity(nextCity);

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
      const url = buildUrl(currentPath, lang, filter, nextCity);
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
      const serviceSlug = currentPath.replace('/servizi/', '');
      return (
        <ServicesView
          lang={lang}
          activeServiceSlug={serviceSlug}
          activeCity={city}
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
        />
      );
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
      <Header
        currentPath={currentPath}
        lang={lang}
        onNavigate={navigate}
        onChangeLang={handleChangeLang}
      />

      <main className="flex-1 pt-14 lg:pt-16">
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
      />
    </div>
  );
}
