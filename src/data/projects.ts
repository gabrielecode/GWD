import { ProjectItem } from '../types/showcase';

export const PROJECTS: ProjectItem[] = [
  // ========================
  // 6 SAAS PRODUCTS (/prodotti/*)
  // ========================
  {
    slug: 'swiss-lead-finder',
    name: 'Swiss Lead Finder',
    engine: 'saas',
    status: 'live-saas',
    featured: true,
    category: {
      it: 'Prodotto SaaS',
      de: 'SaaS-Produkt',
      fr: 'Produit SaaS',
      en: 'SaaS Product',
    },
    sector: {
      it: 'B2B Lead Intelligence · Svizzera',
      de: 'B2B Lead Intelligence · Schweiz',
      fr: 'Prospection B2B · Suisse',
      en: 'B2B Lead Intelligence · Switzerland',
    },
    tagline: {
      it: 'Trova aziende svizzere qualificate con audit digitale automatico in pochi secondi.',
      de: 'Finden Sie qualifizierte Schweizer KMU inklusive automatischem Digital-Audit.',
      fr: 'Identifiez des PME suisses qualifiées avec audit digital automatique.',
      en: 'Discover qualified Swiss SMEs with automated digital health scoring in seconds.',
    },
    shortDescription: {
      it: 'Motore di ricerca B2B per cantone e codice NOGA con verifica immediata di sito web, velocità e schede Google.',
      de: 'B2B-Suchmaschine nach Kanton und NOGA-Code mit sofortigem Website- und Google-Check.',
      fr: 'Moteur B2B par canton et secteur avec vérification instantanée de site web et fiche Google.',
      en: 'B2B search engine by Swiss canton and industry with instant website, speed, and Google listing audit.',
    },
    heroMetric: {
      value: '48.000+',
      label: {
        it: 'Aziende svizzere indicizzate',
        de: 'Indexierte Schweizer Firmen',
        fr: 'Entreprises suisses indexées',
        en: 'Indexed Swiss companies',
      },
    },
    secondaryMetrics: [
      {
        value: '26',
        label: {
          it: 'Cantoni coperti',
          de: 'Abgedeckte Kantone',
          fr: 'Cantons couverts',
          en: 'Cantons covered',
        },
      },
      {
        value: '3.2x',
        label: {
          it: 'Velocità qualificazione lead',
          de: 'Schnellere Lead-Qualifizierung',
          fr: 'Qualification plus rapide',
          en: 'Faster lead qualification',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Agenzie, consulenti e team commerciali svizzeri perdono ore a cercare manualmente aziende locali con siti obsoleti o schede Google incomplete.',
      de: 'Agenturen und Vertriebsteams in der Schweiz verlieren Stunden mit der manuellen Suche nach Firmen mit veralteten Websites.',
      fr: 'Les agences et équipes commerciales suisses perdent un temps précieux à repérer manuellement les entreprises sans site performant.',
      en: 'Swiss agencies and sales teams waste hours manually researching local businesses with outdated websites or incomplete Google profiles.',
    },
    solution: {
      it: 'Swiss Lead Finder aggrega dati pubblici svizzeri, esegue audit automatici su prestazioni e SEO locale, ed esporta liste pronte per il contatto.',
      de: 'Swiss Lead Finder bündelt Schweizer Firmendaten, prüft automatisch Performance und lokale SEO und exportiert kontaktbereite Listen.',
      fr: 'Swiss Lead Finder croise les données publiques suisses, audite automatiquement le site et le SEO local, et exporte des listes prêtes à contacter.',
      en: 'Swiss Lead Finder aggregates Swiss business records, runs automated performance and local SEO checks, and exports outreach-ready lists.',
    },
    results: {
      it: 'Riduzione del 70% del tempo di ricerca commerciale per agenzie B2B e consulenti in Ticino e Svizzera interna.',
      de: '70 % weniger Recherchezeit für B2B-Agenturen und Berater im Tessin und der Deutschschweiz.',
      fr: '70 % de temps de prospection économisé pour les agences B2B et consultants en Suisse.',
      en: '70% reduction in prospecting research time for B2B agencies and consultants across Switzerland.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Filtri per Cantone, città e settore',
          de: 'Filter nach Kanton, Stadt und Branche',
          fr: 'Filtres par canton, ville et secteur',
          en: 'Canton, city & industry filters',
        },
        description: {
          it: 'Segmenta immediatamente PMI in Ticino, Zurigo, Romandia per categoria merceologica e dimensione.',
          de: 'Segmentieren Sie KMU im Tessin, Zürich oder der Romandie nach Branche und Größe.',
          fr: 'Segmentez instantanément les PME au Tessin, à Zurich ou en Suisse romande.',
          en: 'Segment SMEs across Ticino, Zurich, or Romandy by trade category and company footprint.',
        },
      },
      {
        title: {
          it: 'Audit automatico sito e Core Web Vitals',
          de: 'Automatischer Website- & Core-Web-Vitals-Check',
          fr: 'Audit automatique site & Core Web Vitals',
          en: 'Automated site & Core Web Vitals check',
        },
        description: {
          it: 'Rileva assenza di HTTPS, lentezza mobile, meta mancanti e opportunità di restyling.',
          de: 'Erkennt fehlendes HTTPS, langsame Mobilseiten und fehlende Meta-Daten sofort.',
          fr: 'Détecte instantanément absence de HTTPS, lenteur mobile et opportunités de refonte.',
          en: 'Detects missing HTTPS, slow mobile load times, missing metadata, and redesign opportunities.',
        },
      },
      {
        title: {
          it: 'Esportazione CSV e pipeline diretta',
          de: 'CSV-Export & direkte Pipeline',
          fr: 'Export CSV & pipeline direct',
          en: 'Clean CSV export & CRM sync',
        },
        description: {
          it: 'Esporta contatti verificati conformi ai flussi commerciali B2B in un solo clic.',
          de: 'Exportieren Sie geprüfte B2B-Kontakte mit einem Klick in Ihr CRM.',
          fr: 'Exportez des contacts vérifiés en un clic vers votre CRM.',
          en: 'Export verified B2B records into your sales pipeline in a single click.',
        },
      },
    ],
    targetAudience: {
      it: 'Web agency, consulenti SEO, team commerciali B2B e fornitori di servizi per PMI svizzere.',
      de: 'Webagenturen, SEO-Berater, B2B-Vertriebsteams und Dienstleister für Schweizer KMU.',
      fr: 'Agences web, consultants SEO, équipes commerciales B2B et prestataires pour PME suisses.',
      en: 'Web agencies, SEO consultants, B2B sales teams, and service providers targeting Swiss SMEs.',
    },
    servicesUsed: {
      it: ['Motore scraping svizzero', 'Scoring Core Web Vitals', 'Dashboard SaaS multi-tenant'],
      de: ['Schweizer Daten-Pipeline', 'Core-Web-Vitals-Scoring', 'Multi-Tenant SaaS'],
      fr: ['Pipeline données suisses', 'Scoring Core Web Vitals', 'SaaS multi-tenant'],
      en: ['Swiss data pipeline', 'Core Web Vitals scoring', 'Multi-tenant SaaS'],
    },
    externalUrl: 'https://swissleadfinder.ch',
    relatedSlugs: ['rankuplist', 'sititicino-geoboost', 'ata-school-scraper'],
    previewTheme: {
      primaryHex: '#2DD4BF',
      domainUrl: 'app.swissleadfinder.ch',
      desktopHeadline: {
        it: 'Ricerca Lead · Distretto Lugano',
        de: 'Lead-Suche · Bezirk Lugano',
        fr: 'Recherche Leads · District Lugano',
        en: 'Lead Search · Lugano District',
      },
      desktopSubline: {
        it: '142 aziende trovate con opportunità di ottimizzazione web',
        de: '142 Firmen mit Website-Optimierungspotenzial gefunden',
        fr: '142 entreprises identifiées avec potentiel d’optimisation',
        en: '142 companies matched with web optimization opportunities',
      },
      highlights: [
        { label: 'Lugano · Ristorazione', value: 'Score web 42/100' },
        { label: 'Bellinzona · Edilizia', value: 'No HTTPS' },
        { label: 'Locarno · Estetica', value: 'LCP 4.8s' },
      ],
      uiModules: {
        it: ['Filtro NOGA / Cantone', 'Audit mobile istantaneo', 'Esporta 142 lead CSV'],
        de: ['NOGA- & Kantonsfilter', 'Sofort-Mobil-Audit', '142 Leads als CSV'],
        fr: ['Filtre NOGA / Canton', 'Audit mobile instantané', 'Exporter 142 leads CSV'],
        en: ['NOGA & Canton filter', 'Instant mobile audit', 'Export 142 CSV leads'],
      },
    },
  },
  {
    slug: 'rankuplist',
    name: 'RankUpList',
    engine: 'saas',
    status: 'live-saas',
    featured: true,
    category: {
      it: 'Prodotto SaaS',
      de: 'SaaS-Produkt',
      fr: 'Produit SaaS',
      en: 'SaaS Product',
    },
    sector: {
      it: 'Local SEO & Directory Engine',
      de: 'Lokale SEO & Branchenverzeichnisse',
      fr: 'SEO Local & Annuaires',
      en: 'Local SEO & Directory Engine',
    },
    tagline: {
      it: 'Allinea NAP, citazioni locali e posizionamento Google Maps da un unico pannello.',
      de: 'Synchronisieren Sie NAP-Daten, lokale Einträge und Google-Maps-Rankings zentral.',
      fr: 'Harmonisez vos données NAP, citations locales et positions Google Maps.',
      en: 'Synchronize NAP consistency, local citations, and Google Maps rankings from one console.',
    },
    shortDescription: {
      it: 'Piattaforma SaaS per gestire coerenza dati aziendali su directory svizzere e monitorare parole chiave locali.',
      de: 'SaaS-Plattform für konsistente Firmendaten in Schweizer Verzeichnissen und Keyword-Tracking.',
      fr: 'Plateforme SaaS pour la cohérence des fiches locales suisses et le suivi des mots-clés.',
      en: 'SaaS platform for managing Swiss directory consistency and tracking local map pack rankings.',
    },
    heroMetric: {
      value: '+64%',
      label: {
        it: 'Visibilità Google Map Pack',
        de: 'Sichtbarkeit im Google Map Pack',
        fr: 'Visibilité Google Map Pack',
        en: 'Google Map Pack visibility',
      },
    },
    secondaryMetrics: [
      {
        value: '35+',
        label: {
          it: 'Directory e portali connessi',
          de: 'Verbundene Verzeichnisse',
          fr: 'Annuaires connectés',
          en: 'Connected directories',
        },
      },
      {
        value: '100%',
        label: {
          it: 'Coerenza dati NAP',
          de: 'NAP-Datenkonsistenz',
          fr: 'Cohérence NAP',
          en: 'NAP consistency',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Indirizzi discordanti, numeri vecchi e schede duplicate su directory locali penalizzano il posizionamento organico delle PMI su Google.',
      de: 'Widersprüchliche Adressen und doppelte Einträge in Verzeichnissen schaden dem lokalen Google-Ranking von KMU.',
      fr: 'Des adresses incohérentes et fiches en double pénalisent fortement le classement Google local des PME.',
      en: 'Mismatched addresses, outdated phone numbers, and duplicate directory listings suppress local SME rankings on Google.',
    },
    solution: {
      it: 'RankUpList centralizza nome, indirizzo, telefono e categorie, verifica automaticamente le discrepanze e traccia le posizioni per città.',
      de: 'RankUpList zentralisiert Name, Adresse und Telefon, erkennt Abweichungen automatisch und trackt Rankings pro Stadt.',
      fr: 'RankUpList centralise nom, adresse et téléphone, corrige les écarts et suit les positions ville par ville.',
      en: 'RankUpList centralizes business Name, Address, and Phone records, flags discrepancies automatically, and tracks city-level keywords.',
    },
    results: {
      it: 'I clienti locali raggiungono la Top 3 su Google Maps per parole chiave commerciali ad alta intenzione in 8–12 settimane.',
      de: 'Lokale Kunden erreichen innerhalb von 8–12 Wochen die Top 3 bei Google Maps für kaufstarke Keywords.',
      fr: 'Les entreprises locales atteignent le Top 3 Google Maps sur leurs requêtes clés en 8 à 12 semaines.',
      en: 'Local clients reach Google Maps Top 3 positions for high-intent commercial searches within 8–12 weeks.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Audit citazioni NAP in tempo reale',
          de: 'Echtzeit-NAP-Zitat-Audit',
          fr: 'Audit NAP en temps réel',
          en: 'Real-time NAP citation audit',
        },
        description: {
          it: 'Controlla istantaneamente la corrispondenza tra sito web, Google Business Profile e portali svizzeri.',
          de: 'Prüft sofort die Übereinstimmung zwischen Website, Google Business Profile und Schweizer Portalen.',
          fr: 'Vérifie la concordance exacte entre site web, Google Business et annuaires suisses.',
          en: 'Instantly checks alignment across company website, Google Business Profile, and Swiss portals.',
        },
      },
      {
        title: {
          it: 'Monitoraggio ranking per quartiere',
          de: 'Ranking-Tracking nach Stadtteil',
          fr: 'Suivi de position géolocalisé',
          en: 'District-level rank tracker',
        },
        description: {
          it: 'Verifica le posizioni reali da Lugano, Bellinzona, Locarno e Mendrisio.',
          de: 'Misst reale Positionen aus Lugano, Bellinzona, Locarno und Mendrisio.',
          fr: 'Mesure les positions réelles depuis Lugano, Bellinzona, Locarno et Mendrisio.',
          en: 'Measures real local rankings across Lugano, Bellinzona, Locarno, and Mendrisio.',
        },
      },
      {
        title: {
          it: 'Report mensile automatico per clienti',
          de: 'Automatischer Monatsbericht',
          fr: 'Rapport mensuel automatisé',
          en: 'Automated client reporting',
        },
        description: {
          it: 'Esporta progressi su chiamate, richieste percorso e clic al sito web.',
          de: 'Exportiert Fortschritte bei Anrufen, Routenanfragen und Website-Klicks.',
          fr: 'Exporte les progrès sur les appels, itinéraires et clics site web.',
          en: 'Exports clear monthly progress on calls, direction requests, and website clicks.',
        },
      },
    ],
    targetAudience: {
      it: 'Attività locali multi-sede, ristoranti, studi medici, parrucchieri e consulenti SEO.',
      de: 'Lokale Unternehmen mit mehreren Standorten, Gastronomie, Praxen, Salons und SEO-Berater.',
      fr: 'Commerces locaux, restaurants, cabinets, salons et consultants SEO.',
      en: 'Multi-location local businesses, restaurants, clinics, hair salons, and SEO specialists.',
    },
    servicesUsed: {
      it: ['Motore analisi SERP locale', 'Sincronizzazione directory CH', 'Alerting variazioni'],
      de: ['Lokale SERP-Analyse', 'CH-Verzeichnis-Sync', 'Ranking-Alerts'],
      fr: ['Analyse SERP locale', 'Sync annuaires CH', 'Alertes de position'],
      en: ['Local SERP engine', 'Swiss directory sync', 'Ranking alerts'],
    },
    externalUrl: 'https://rankuplist.com',
    relatedSlugs: ['sititicino-geoboost', 'swiss-lead-finder', 'il-vicolo-lugano'],
    previewTheme: {
      primaryHex: '#2DD4BF',
      domainUrl: 'app.rankuplist.com',
      desktopHeadline: {
        it: 'Coerenza Directory & Map Pack',
        de: 'Verzeichnis-Konsistenz & Map Pack',
        fr: 'Cohérence Annuaires & Map Pack',
        en: 'Directory Consistency & Map Pack',
      },
      desktopSubline: {
        it: '35 portali monitorati · 0 errori critici NAP',
        de: '35 überwachte Portale · 0 kritische NAP-Fehler',
        fr: '35 portails suivis · 0 erreur critique NAP',
        en: '35 monitored portals · 0 critical NAP mismatches',
      },
      highlights: [
        { label: 'Google Business', value: '#1 Lugano Centro' },
        { label: 'SitiTicino.ch', value: 'Verificato' },
        { label: 'Search.ch / Local', value: 'Allineato' },
      ],
      uiModules: {
        it: ['Mappa posizioni Lugano', 'Verifica NAP automatica', 'Storico chiamate +64%'],
        de: ['Positionskarte Lugano', 'Automatischer NAP-Check', 'Anrufhistorie +64%'],
        fr: ['Carte positions Lugano', 'Contrôle NAP auto', 'Historique appels +64%'],
        en: ['Lugano position grid', 'Automated NAP check', 'Call growth +64%'],
      },
    },
  },
  {
    slug: 'sititicino-geoboost',
    name: 'SitiTicino GeoBoost',
    engine: 'saas',
    status: 'live-saas',
    featured: true,
    category: {
      it: 'Prodotto SaaS',
      de: 'SaaS-Produkt',
      fr: 'Produit SaaS',
      en: 'SaaS Product',
    },
    sector: {
      it: 'Hyper-Local Growth · Canton Ticino',
      de: 'Hyperlokales Wachstum · Tessin',
      fr: 'Croissance Hyper-Locale · Tessin',
      en: 'Hyper-Local Growth · Ticino',
    },
    tagline: {
      it: 'Genera pagine geografiche e segnali locali autentici per dominare le ricerche in Ticino.',
      de: 'Erzeugen Sie authentische Standortseiten für Spitzenplätze in der Tessiner Suche.',
      fr: 'Déployez des pages géolocalisées performantes pour dominer la recherche au Tessin.',
      en: 'Deploy authentic geo-localized service pages and local trust signals across Canton Ticino.',
    },
    shortDescription: {
      it: 'Modulo SaaS integrato con SitiTicino.ch per potenziare l’indicizzazione su Lugano, Bellinzona, Locarno e Mendrisio.',
      de: 'In SitiTicino.ch integriertes SaaS-Modul für lokale Sichtbarkeit in allen Tessiner Bezirken.',
      fr: 'Module SaaS connecté à SitiTicino.ch pour renforcer le SEO sur Lugano, Bellinzona, Locarno et Mendrisio.',
      en: 'SaaS growth engine integrated with SitiTicino.ch to boost local search across all Ticino districts.',
    },
    heroMetric: {
      value: 'Top 5',
      label: {
        it: 'Media su keyword ticinesi',
        de: 'Durchschnitt bei Tessiner Keywords',
        fr: 'Moyenne sur requêtes tessinoises',
        en: 'Average on Ticino keywords',
      },
    },
    secondaryMetrics: [
      {
        value: '4',
        label: {
          it: 'Poli cantonali ottimizzati',
          de: 'Optimierte Bezirkszentren',
          fr: 'Pôles cantonaux optimisés',
          en: 'Optimized cantonal hubs',
        },
      },
      {
        value: '96/100',
        label: {
          it: 'Lighthouse SEO score',
          de: 'Lighthouse SEO-Wert',
          fr: 'Score SEO Lighthouse',
          en: 'Lighthouse SEO score',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Molte PMI ticinesi duplicano la stessa pagina cambiando solo il nome della città, venendo ignorate o penalizzate da Google.',
      de: 'Viele Tessiner KMU kopieren identische Seiten nur mit anderem Stadtnamen und werden von Google ignoriert.',
      fr: 'Beaucoup de PME dupliquent la même page en changeant uniquement la ville, ce qui bloque leur indexation Google.',
      en: 'Many Ticino SMEs duplicate identical service pages only swapping city names, causing Google to filter them out.',
    },
    solution: {
      it: 'SitiTicino GeoBoost struttura contenuti geografici realmente differenziati, Schema LocalBusiness e link interni contestuali verso SitiTicino.ch.',
      de: 'SitiTicino GeoBoost strukturiert eigenständige lokale Inhalte, LocalBusiness-Schema und kontextuelle Backlinks.',
      fr: 'SitiTicino GeoBoost structure des contenus locaux uniques, des données Schema LocalBusiness et un maillage interne ciblé.',
      en: 'SitiTicino GeoBoost builds genuinely differentiated local landing structures, LocalBusiness schema, and contextual backlinks.',
    },
    results: {
      it: 'Aumento costante del traffico organico qualificato dai 4 distretti principali del Cantone entro 90 giorni.',
      de: 'Nachhaltiges Wachstum an qualifiziertem organischem Traffic aus allen vier Tessiner Hauptbezirken binnen 90 Tagen.',
      fr: 'Hausse continue du trafic organique qualifié depuis les 4 pôles du canton en moins de 90 jours.',
      en: 'Consistent qualified organic traffic growth across Ticino’s four core districts within 90 days.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Matrice contenuti per 4 distretti',
          de: 'Inhaltsmatrix für 4 Bezirke',
          fr: 'Matrice éditoriale 4 districts',
          en: '4-district content matrix',
        },
        description: {
          it: 'Dati locali, riferimenti territoriali e casi reali distinti tra Lugano, Bellinzona, Locarno e Mendrisio.',
          de: 'Individuelle lokale Daten und Referenzen für Lugano, Bellinzona, Locarno und Mendrisio.',
          fr: 'Données territoriales et références distinctes pour Lugano, Bellinzona, Locarno et Mendrisio.',
          en: 'Distinct local proofs and neighborhood context for Lugano, Bellinzona, Locarno, and Mendrisio.',
        },
      },
      {
        title: {
          it: 'Dati strutturati JSON-LD automatici',
          de: 'Automatisches JSON-LD Schema',
          fr: 'Données structurées JSON-LD auto',
          en: 'Automated JSON-LD LocalBusiness',
        },
        description: {
          it: 'Genera markup LocalBusiness, Breadcrumb e FAQ validato per rich snippet.',
          de: 'Erzeugt validiertes LocalBusiness-, Breadcrumb- und FAQ-Markup.',
          fr: 'Génère un balisage LocalBusiness, Breadcrumb et FAQ validé.',
          en: 'Generates validated LocalBusiness, Breadcrumb, and FAQ schema markup.',
        },
      },
      {
        title: {
          it: 'Collegamento contestuale SitiTicino.ch',
          de: 'Kontextuelle Verlinkung SitiTicino.ch',
          fr: 'Maillage contextuel SitiTicino.ch',
          en: 'Contextual SitiTicino.ch network',
        },
        description: {
          it: 'Rafforza l’autorità locale con rimandi editoriali verificati tra schede e vetrina.',
          de: 'Stärkt lokale Autorität durch redaktionell geprüfte Querverweise.',
          fr: 'Renforce l’autorité locale via des liens contextuels vérifiés.',
          en: 'Strengthens regional authority through verified contextual links across the group network.',
        },
      },
    ],
    targetAudience: {
      it: 'PMI, artigiani, studi professionali e reti commerciali attive nel Canton Ticino.',
      de: 'KMU, Handwerksbetriebe, Kanzleien und Dienstleister im Kanton Tessin.',
      fr: 'PME, artisans, cabinets et commerces actifs au Tessin.',
      en: 'SMEs, trades, professional practices, and service brands operating across Canton Ticino.',
    },
    servicesUsed: {
      it: ['Motore SEO territoriale', 'Validazione Schema.org', 'Rete SitiTicino.ch'],
      de: ['Regionale SEO-Engine', 'Schema.org-Validierung', 'SitiTicino-Netzwerk'],
      fr: ['Moteur SEO territorial', 'Validation Schema.org', 'Réseau SitiTicino.ch'],
      en: ['Territorial SEO engine', 'Schema.org validation', 'SitiTicino.ch network'],
    },
    externalUrl: 'https://sititicino.ch',
    relatedSlugs: ['rankuplist', 'swiss-lead-finder', 'casa-bidia'],
    previewTheme: {
      primaryHex: '#2DD4BF',
      domainUrl: 'geoboost.sititicino.ch',
      desktopHeadline: {
        it: 'Copertura Organica Canton Ticino',
        de: 'Organische Abdeckung Kanton Tessin',
        fr: 'Couverture Organique Canton Tessin',
        en: 'Organic Coverage · Canton Ticino',
      },
      desktopSubline: {
        it: '4 distretti attivi · Zero duplicazione contenuti',
        de: '4 aktive Bezirke · Keine doppelten Inhalte',
        fr: '4 districts actifs · Zéro contenu dupliqué',
        en: '4 active districts · Zero duplicate content',
      },
      highlights: [
        { label: 'Lugano', value: 'Pos. 2 · web agency' },
        { label: 'Bellinzona', value: 'Pos. 3 · siti web' },
        { label: 'Locarno / Mendrisio', value: 'Pos. 4 · SEO locale' },
      ],
      uiModules: {
        it: ['Mappa distretti Ticino', 'Schema LocalBusiness OK', 'Rete link contestuali'],
        de: ['Tessin-Bezirkskarte', 'LocalBusiness-Schema OK', 'Kontextuelle Links'],
        fr: ['Carte districts Tessin', 'Schema LocalBusiness OK', 'Liens contextuels'],
        en: ['Ticino district grid', 'LocalBusiness schema OK', 'Contextual link map'],
      },
    },
  },
  {
    slug: 'auto-social-publisher',
    name: 'Auto Social Publisher',
    engine: 'saas',
    status: 'ai-division',
    featured: false,
    category: {
      it: 'Prodotto SaaS · AI',
      de: 'SaaS-Produkt · KI',
      fr: 'Produit SaaS · IA',
      en: 'SaaS Product · AI',
    },
    sector: {
      it: 'AI Content Automation',
      de: 'KI-Content-Automatisierung',
      fr: 'Automatisation Éditoriale IA',
      en: 'AI Content Automation',
    },
    tagline: {
      it: 'Trasforma articoli e schede prodotto in piani editoriali multilingua pronti alla pubblicazione.',
      de: 'Verwandelt Artikel und Produktseiten in mehrsprachige Redaktionspläne.',
      fr: 'Transforme articles et fiches produits en calendriers éditoriaux multilingues.',
      en: 'Turn product updates and articles into scheduled multilingual social campaigns automatically.',
    },
    shortDescription: {
      it: 'Pipeline AI per adattare tono di voce, formati visivi e programmazione su LinkedIn, Instagram e Google Business.',
      de: 'KI-Pipeline zur Anpassung von Tonalität und Planung auf LinkedIn, Instagram & Google.',
      fr: 'Pipeline IA adaptant le ton et la planification sur LinkedIn, Instagram et Google Business.',
      en: 'AI pipeline adapting brand tone, formats, and scheduling across LinkedIn, Instagram, and Google Posts.',
    },
    heroMetric: {
      value: '12h/sett',
      label: {
        it: 'Tempo operativo risparmiato',
        de: 'Zeitersparnis pro Woche',
        fr: 'Temps gagné par semaine',
        en: 'Operational time saved weekly',
      },
    },
    secondaryMetrics: [
      {
        value: '4',
        label: {
          it: 'Lingue native (IT/DE/FR/EN)',
          de: 'Native Sprachen (IT/DE/FR/EN)',
          fr: 'Langues natives (IT/DE/FR/EN)',
          en: 'Native languages (IT/DE/FR/EN)',
        },
      },
      {
        value: '100%',
        label: {
          it: 'Approvazione umana prima dell’invio',
          de: 'Menschliche Freigabe vor Versand',
          fr: 'Validation humaine avant envoi',
          en: 'Human approval before publish',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Le PMI svizzere faticano a mantenere una presenza costante in più lingue su social e aggiornamenti Google senza un reparto dedicato.',
      de: 'Schweizer KMU schaffen es selten, Social Media und Google-Beiträge konsistent mehrsprachig zu pflegen.',
      fr: 'Les PME suisses peinent à publier régulièrement en plusieurs langues sur les réseaux et Google Business.',
      en: 'Swiss SMEs struggle to maintain consistent multilingual publishing across social channels and Google updates without dedicated staff.',
    },
    solution: {
      it: 'Auto Social Publisher genera varianti editoriali coerenti con la voce del brand, pianifica il calendario e mantiene un controllo di revisione in 1 clic.',
      de: 'Auto Social Publisher generiert markenkonforme Varianten, plant den Kalender und bietet eine 1-Klick-Freigabe.',
      fr: 'Auto Social Publisher génère des déclinaisons fidèles à la marque, planifie le calendrier et propose une validation en 1 clic.',
      en: 'Auto Social Publisher drafts brand-aligned multilingual posts, schedules queues, and preserves one-click human sign-off.',
    },
    results: {
      it: 'Continuità editoriale costante per studi, agenzie e aziende B2B con zero contenuti generici o ripetitivi.',
      de: 'Durchgängige Redaktionspräsenz für Studios, Agenturen und B2B-Firmen ohne generische Standardtexte.',
      fr: 'Régularité éditoriale continue pour studios, agences et entreprises B2B sans textes génériques.',
      en: 'Consistent editorial cadence for studios, agencies, and B2B companies without generic filler copy.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Adattamento automatico per canale',
          de: 'Kanalspezifische Aufbereitung',
          fr: 'Adaptation native par canal',
          en: 'Channel-native adaptation',
        },
        description: {
          it: 'Formatta ogni post per LinkedIn B2B, Instagram carosello o aggiornamento Google Business.',
          de: 'Formatiert Beiträge gezielt für LinkedIn, Instagram oder Google-Beiträge.',
          fr: 'Formate chaque publication pour LinkedIn, Instagram ou Google Business.',
          en: 'Tailors copy length and structure specifically for LinkedIn, Instagram, or Google Business updates.',
        },
      },
      {
        title: {
          it: 'Coerenza quadrilingue svizzera',
          de: 'Schweizer Mehrsprachigkeit',
          fr: 'Cohérence quadrilingue suisse',
          en: 'Swiss 4-language parity',
        },
        description: {
          it: 'Genera varianti naturali in italiano, tedesco, francese e inglese partendo da un unico brief.',
          de: 'Erstellt natürliche Varianten in IT, DE, FR und EN aus einem einzigen Briefing.',
          fr: 'Produit des versions naturelles en IT, DE, FR et EN depuis un seul brief.',
          en: 'Produces natural Italian, German, French, and English variations from one source brief.',
        },
      },
      {
        title: {
          it: 'Coda di approvazione veloce',
          de: 'Schnelle Freigabe-Warteschlange',
          fr: 'File de validation rapide',
          en: 'Fast approval queue',
        },
        description: {
          it: 'Modifica o approva un intero mese editoriale in meno di dieci minuti.',
          de: 'Prüfen und genehmigen Sie einen ganzen Monatsplan in unter zehn Minuten.',
          fr: 'Relisez et validez un mois complet de publications en moins de dix minutes.',
          en: 'Review, edit, and approve an entire month of scheduled posts in under ten minutes.',
        },
      },
    ],
    targetAudience: {
      it: 'Team marketing snelli, agenzie partner e imprese svizzere multilingua.',
      de: 'Schlanke Marketing-Teams, Partneragenturen und mehrsprachige Schweizer Firmen.',
      fr: 'Équipes marketing agiles, agences partenaires et entreprises suisses multilingues.',
      en: 'Lean marketing teams, partner agencies, and multilingual Swiss businesses.',
    },
    servicesUsed: {
      it: ['Workflow AI editoriale', 'Scheduler multi-canale', 'Glossario brand'],
      de: ['KI-Redaktions-Workflow', 'Multi-Kanal-Planer', 'Marken-Glossar'],
      fr: ['Workflow éditorial IA', 'Planificateur multi-canal', 'Glossaire de marque'],
      en: ['AI editorial workflow', 'Multi-channel scheduler', 'Brand glossary engine'],
    },
    externalUrl: 'https://gwdgroup.ch/auto-social-publisher',
    relatedSlugs: ['aurora-ai', 'aurora-adv', 'swiss-lead-finder'],
    previewTheme: {
      primaryHex: '#60A5FA',
      domainUrl: 'studio.autosocial.ch',
      desktopHeadline: {
        it: 'Calendario Editoriale AI · IT / DE / FR',
        de: 'KI-Redaktionsplan · IT / DE / FR',
        fr: 'Calendrier Éditorial IA · IT / DE / FR',
        en: 'AI Editorial Queue · IT / DE / FR',
      },
      desktopSubline: {
        it: '18 post programmati · Revisione brand attiva',
        de: '18 geplante Beiträge · Markenprüfung aktiv',
        fr: '18 publications planifiées · Contrôle de ton actif',
        en: '18 posts queued · Brand tone guardrails active',
      },
      highlights: [
        { label: 'LinkedIn', value: 'Martedì 09:00' },
        { label: 'Google Business', value: 'Giovedì 12:30' },
        { label: 'Instagram', value: 'Sabato 10:15' },
      ],
      uiModules: {
        it: ['Bozze IT/DE/FR sincronizzate', 'Approvazione 1-clic', 'Statistiche clic UTM'],
        de: ['Synchronisierte Entwürfe', '1-Klick-Freigabe', 'UTM-Klick-Tracking'],
        fr: ['Brouillons IT/DE/FR sync', 'Validation 1-clic', 'Suivi clics UTM'],
        en: ['Synced IT/DE/FR drafts', '1-click approval', 'UTM click tracking'],
      },
    },
  },
  {
    slug: 'salviapet',
    name: 'SalviaPet',
    engine: 'saas',
    status: 'live-saas',
    featured: false,
    category: {
      it: 'Prodotto SaaS',
      de: 'SaaS-Produkt',
      fr: 'Produit SaaS',
      en: 'SaaS Product',
    },
    sector: {
      it: 'Pet Tech & Veterinary Cloud',
      de: 'Pet-Tech & Veterinär-Cloud',
      fr: 'Pet Tech & Cloud Vétérinaire',
      en: 'Pet Tech & Veterinary Cloud',
    },
    tagline: {
      it: 'Libretto sanitario digitale, tracciamento microchip e promemoria vaccini per animali domestici.',
      de: 'Digitaler Impfpass, Mikrochip-Verwaltung und Termin-Erinnerungen für Haustiere.',
      fr: 'Carnet de santé numérique, suivi puce électronique et rappels vaccins.',
      en: 'Digital pet health passport, microchip registry bridge, and automated clinic reminders.',
    },
    shortDescription: {
      it: 'Piattaforma consumer e B2B per proprietari e cliniche veterinarie con scheda emergenza accessibile via QR.',
      de: 'Plattform für Tierhalter und Tierarztpraxen mit sofort abrufbarem QR-Notfallprofil.',
      fr: 'Plateforme pour propriétaires et cliniques vétérinaires avec fiche d’urgence accessible par QR.',
      en: 'Consumer and veterinary clinic platform featuring instant QR emergency medical cards and vaccine tracking.',
    },
    heroMetric: {
      value: '4.9/5',
      label: {
        it: 'Valutazione utenti proprietari',
        de: 'Bewertung durch Tierhalter',
        fr: 'Note des propriétaires',
        en: 'Pet owner satisfaction',
      },
    },
    secondaryMetrics: [
      {
        value: '< 1.2s',
        label: {
          it: 'Apertura scheda emergenza QR',
          de: 'Ladezeit QR-Notfallkarte',
          fr: 'Ouverture fiche urgence QR',
          en: 'QR emergency card load',
        },
      },
      {
        value: '100%',
        label: {
          it: 'Archiviazione conforme nLPD',
          de: 'nDSG-konforme Speicherung',
          fr: 'Stockage conforme nLPD',
          en: 'Swiss FADP compliant storage',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Documenti cartacei sparsi, date dei richiami dimenticate e difficoltà nel condividere allergie o terapie in caso di urgenza veterinaria.',
      de: 'Verstreute Papierdokumente, vergessene Impftermine und fehlende Allergie-Daten im veterinärmedizinischen Notfall.',
      fr: 'Carnets papier égarés, rappels de vaccins oubliés et manque d’informations critiques en urgence vétérinaire.',
      en: 'Scattered paper records, missed booster shots, and missing allergy histories during urgent veterinary visits.',
    },
    solution: {
      it: 'SalviaPet centralizza vaccini, referti, terapie e contatti del veterinario in una web app mobile-first collegata a medaglietta QR.',
      de: 'SalviaPet bündelt Impfungen, Befunde und Tierarztkontakte in einer Mobile-First-App mit QR-Halsbandmarke.',
      fr: 'SalviaPet centralise vaccins, ordonnances et contacts vétérinaires dans une web app reliée à une médaille QR.',
      en: 'SalviaPet unifies vaccination logs, clinical reports, and vet contacts in a mobile-first web app linked to a scannable QR tag.',
    },
    results: {
      it: 'Migliore puntualità nei richiami clinici e adozione immediata da parte di proprietari e studi veterinari in Svizzera e Italia.',
      de: 'Höhere Termintreue bei Impfauffrischungen und schnelle Akzeptanz bei Haltern und Praxen.',
      fr: 'Meilleure régularité des rappels cliniques et adoption rapide auprès des propriétaires et cliniques.',
      en: 'Higher clinic booster adherence and rapid adoption across pet owners and partner veterinary practices.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Passaporto sanitario digitale e QR',
          de: 'Digitaler Gesundheitspass & QR',
          fr: 'Passeport santé numérique & QR',
          en: 'Digital health passport & QR',
        },
        description: {
          it: 'Accesso immediato a microchip, peso, allergie e contatti di emergenza da smartphone.',
          de: 'Sofortiger Smartphone-Zugriff auf Chipnummer, Gewicht, Allergien und Notfallkontakt.',
          fr: 'Accès instantané au numéro de puce, poids, allergies et contacts d’urgence.',
          en: 'Instant mobile access to microchip ID, weight history, allergies, and emergency contacts.',
        },
      },
      {
        title: {
          it: 'Promemoria automatici vaccini e visite',
          de: 'Automatische Impf- & Termin-Erinnerung',
          fr: 'Rappels automatiques vaccins & visites',
          en: 'Automated vaccine & checkup alerts',
        },
        description: {
          it: 'Notifiche programmate prima della scadenza di profilassi e richiami annuali.',
          de: 'Geplante Benachrichtigungen vor Ablauf von Prophylaxe und Jahresimpfungen.',
          fr: 'Alertes planifiées avant chaque échéance de prophylaxie ou rappel annuel.',
          en: 'Scheduled reminders ahead of annual vaccinations and preventative treatments.',
        },
      },
      {
        title: {
          it: 'Condivisione sicura con il veterinario',
          de: 'Sicherer Austausch mit Tierärzten',
          fr: 'Partage sécurisé avec le vétérinaire',
          en: 'Secure veterinary sharing',
        },
        description: {
          it: 'Link temporaneo protetto per consultare lo storico clinico completo.',
          de: 'Geschützter temporärer Link für die gesamte Krankengeschichte.',
          fr: 'Lien temporaire protégé pour consulter l’historique médical complet.',
          en: 'Protected temporary access link allowing vets to review complete clinical history.',
        },
      },
    ],
    targetAudience: {
      it: 'Proprietari di cani e gatti, allevamenti, pensioni per animali e cliniche veterinarie.',
      de: 'Hunde- und Katzenhalter, Züchter, Tierpensionen und Tierarztpraxen.',
      fr: 'Propriétaires de chiens et chats, éleveurs, pensions et cliniques vétérinaires.',
      en: 'Dog and cat owners, breeders, pet boarding facilities, and veterinary clinics.',
    },
    servicesUsed: {
      it: ['Web App Mobile-First', 'QR Code Dinamici', 'Archivio documentale criptato'],
      de: ['Mobile-First Web-App', 'Dynamische QR-Codes', 'Verschlüsseltes Archiv'],
      fr: ['Web App Mobile-First', 'QR Codes dynamiques', 'Archivage chiffré'],
      en: ['Mobile-first Web App', 'Dynamic QR tags', 'Encrypted document vault'],
    },
    externalUrl: 'https://salviapet.com',
    relatedSlugs: ['auto-social-publisher', 'swiss-lead-finder', 'casa-bidia'],
    previewTheme: {
      primaryHex: '#2DD4BF',
      domainUrl: 'app.salviapet.com',
      desktopHeadline: {
        it: 'Scheda Sanitaria · Leo (Golden Retriever)',
        de: 'Gesundheitskarte · Leo (Golden Retriever)',
        fr: 'Carnet Santé · Leo (Golden Retriever)',
        en: 'Health Passport · Leo (Golden Retriever)',
      },
      desktopSubline: {
        it: 'Microchip verificato · Prossimo vaccino tra 28 giorni',
        de: 'Mikrochip verifiziert · Nächste Impfung in 28 Tagen',
        fr: 'Puce vérifiée · Prochain vaccin dans 28 jours',
        en: 'Microchip verified · Next booster due in 28 days',
      },
      highlights: [
        { label: 'Stato vaccini', value: 'Aggiornato' },
        { label: 'Tag QR collare', value: 'Attivo' },
        { label: 'Clinica Lugano', value: 'Collegata' },
      ],
      uiModules: {
        it: ['Storico vaccini & referti', 'Scansione QR emergenza', 'Promemoria automatici'],
        de: ['Impf- & Befundhistorie', 'QR-Notfallscan', 'Automatische Erinnerungen'],
        fr: ['Historique vaccins', 'Scan QR urgence', 'Rappels automatiques'],
        en: ['Vaccine & lab history', 'Emergency QR card', 'Automated reminders'],
      },
    },
  },
  {
    slug: 'ata-school-scraper',
    name: 'ATA School Scraper',
    engine: 'saas',
    status: 'ai-division',
    featured: false,
    category: {
      it: 'Prodotto SaaS · AI',
      de: 'SaaS-Produkt · KI',
      fr: 'Produit SaaS · IA',
      en: 'SaaS Product · AI',
    },
    sector: {
      it: 'EdTech Data Extraction & Alerts',
      de: 'EdTech Datenextraktion & Alerts',
      fr: 'Extraction Données Éducatives',
      en: 'EdTech Data Extraction & Alerts',
    },
    tagline: {
      it: 'Monitora bandi scolastici, graduatorie ATA e aggiornamenti degli istituti in automatico.',
      de: 'Überwacht Schulausschreibungen, ATA-Ranglisten und Instituts-Updates automatisch.',
      fr: 'Surveille automatiquement les appels à candidatures scolaires et mises à jour ATA.',
      en: 'Monitors school notices, ATA recruitment rankings, and institutional updates automatically.',
    },
    shortDescription: {
      it: 'Piattaforma di estrazione strutturata che trasforma comunicati PDF e albi scolastici sparsi in notifiche filtrate.',
      de: 'Strukturierte Extraktionsplattform für verstreute Schul-PDFs und amtliche Mitteilungen.',
      fr: 'Plateforme d’extraction transformant des PDF scolaires dispersés en alertes filtrées.',
      en: 'Structured extraction engine turning scattered school PDFs and notice boards into filtered real-time alerts.',
    },
    heroMetric: {
      value: '1.800+',
      label: {
        it: 'Istituti monitorati ogni giorno',
        de: 'Täglich überwachte Institute',
        fr: 'Établissements suivis chaque jour',
        en: 'Institutions monitored daily',
      },
    },
    secondaryMetrics: [
      {
        value: '< 5 min',
        label: {
          it: 'Latenza notifica nuovo bando',
          de: 'Benachrichtigung bei neuem Aufruf',
          fr: 'Latence alerte nouvel avis',
          en: 'Alert latency on new notice',
        },
      },
      {
        value: '99.4%',
        label: {
          it: 'Precisione parsing PDF tabellari',
          de: 'Genauigkeit bei Tabellen-PDFs',
          fr: 'Précision extraction PDF',
          en: 'Tabular PDF parsing accuracy',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Candidati e sindacati devono controllare manualmente decine di siti scolastici e PDF non indicizzati per non perdere scadenze di interpelli e graduatorie.',
      de: 'Bewerber und Verbände müssen dutzende unstrukturierte Schulwebsites und PDFs manuell auf Fristen prüfen.',
      fr: 'Les candidats doivent vérifier manuellement des dizaines de portails scolaires et PDF non structurés.',
      en: 'Applicants and advisors must manually inspect dozens of fragmented school websites and unindexed PDFs to avoid missing deadlines.',
    },
    solution: {
      it: 'ATA School Scraper scansiona gli albi online, estrae tabelle e scadenze dai PDF tramite AI e invia alert istantanei per provincia e profilo.',
      de: 'ATA School Scraper scannt Online-Aushänge, extrahiert PDF-Tabellen per KI und sendet sofortige Alerts.',
      fr: 'ATA School Scraper analyse les tableaux d’affichage, extrait les données PDF par IA et envoie des alertes ciblées.',
      en: 'ATA School Scraper crawls school boards, parses PDF tables with AI, and dispatches instant alerts by region and profile.',
    },
    results: {
      it: 'Zero scadenze mancate e risparmio di ore di controllo manuale settimanale per candidati e consulenti scolastici.',
      de: 'Keine verpassten Fristen und erhebliche Zeitersparnis für Bewerber und Bildungsberater.',
      fr: 'Zéro échéance manquée et des heures économisées chaque semaine pour les candidats et conseillers.',
      en: 'Zero missed deadlines and hours saved every week for applicants and education advisors.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Parsing intelligente di PDF e bandi',
          de: 'Intelligentes PDF- & Ausschreibungs-Parsing',
          fr: 'Analyse intelligente de PDF',
          en: 'Intelligent PDF & notice parsing',
        },
        description: {
          it: 'Estrae profilo richiesto, ore, sede dell’istituto e data limite di invio.',
          de: 'Extrahiert Profil, Stundenumfang, Schulstandort und Bewerbungsfrist.',
          fr: 'Extrait profil requis, volume horaire, établissement et date limite.',
          en: 'Extracts required role, weekly hours, school location, and application deadline.',
        },
      },
      {
        title: {
          it: 'Filtri per provincia e qualifica',
          de: 'Filter nach Provinz und Qualifikation',
          fr: 'Filtres par province et qualification',
          en: 'Region & role profile filters',
        },
        description: {
          it: 'Ricevi esclusivamente gli avvisi pertinenti al tuo profilo professionale.',
          de: 'Erhalten Sie ausschließlich Meldungen passend zu Ihrem Berufsprofil.',
          fr: 'Recevez uniquement les avis correspondant à votre profil exact.',
          en: 'Receive strictly the notices matching your exact qualification and target district.',
        },
      },
      {
        title: {
          it: 'Archivio storico ricercabile',
          de: 'Durchsuchbares Archiv',
          fr: 'Archive historique consultable',
          en: 'Searchable historical archive',
        },
        description: {
          it: 'Confronta bandi precedenti e statistiche territoriali in un’unica tabella.',
          de: 'Vergleichen Sie frühere Ausschreibungen und regionale Statistiken.',
          fr: 'Comparez les appels précédents et statistiques régionales en un tableau.',
          en: 'Compare past openings and regional trends inside one searchable data table.',
        },
      },
    ],
    targetAudience: {
      it: 'Personale scolastico ATA, docenti, sindacati territoriali e centri di consulenza carriera.',
      de: 'Schulpersonal, Lehrkräfte, Bildungsverbände und Karriereberatungen.',
      fr: 'Personnel scolaire, enseignants, syndicats et centres d’orientation.',
      en: 'School administrative staff, teachers, education unions, and career advisory centers.',
    },
    servicesUsed: {
      it: ['Crawler distribuito', 'Estrazione AI documenti PDF', 'Motore notifiche real-time'],
      de: ['Verteilter Crawler', 'KI-PDF-Extraktion', 'Echtzeit-Benachrichtigungen'],
      fr: ['Crawler distribué', 'Extraction IA de PDF', 'Alertes temps réel'],
      en: ['Distributed crawler', 'AI PDF extraction', 'Real-time alert engine'],
    },
    externalUrl: 'https://gwdgroup.ch/ata-school-scraper',
    relatedSlugs: ['swiss-lead-finder', 'aurora-ai', 'auto-social-publisher'],
    previewTheme: {
      primaryHex: '#60A5FA',
      domainUrl: 'monitor.atascraper.app',
      desktopHeadline: {
        it: 'Monitoraggio Bandi & Interpelli',
        de: 'Ausschreibungs-Monitor',
        fr: 'Suivi Appels & Avis Scolaires',
        en: 'Live School Notice Monitor',
      },
      desktopSubline: {
        it: '1.800+ istituti scansionati · Estrazione PDF AI attiva',
        de: '1.800+ Institute gescannt · KI-PDF-Extraktion aktiv',
        fr: '1 800+ établissements analysés · Extraction PDF IA active',
        en: '1,800+ institutions scanned · AI PDF extraction active',
      },
      highlights: [
        { label: 'Nuovi interpelli oggi', value: '34 estratti' },
        { label: 'Precisione parsing', value: '99.4%' },
        { label: 'Scadenza < 48h', value: '7 urgenti' },
      ],
      uiModules: {
        it: ['Scanner albi scolastici', 'Estrattore scadenze PDF', 'Alert filtrati per profilo'],
        de: ['Schul-Aushang-Scanner', 'PDF-Fristen-Extraktor', 'Profil-Alerts'],
        fr: ['Scanner tableaux scolaires', 'Extracteur dates PDF', 'Alertes par profil'],
        en: ['Board crawler', 'PDF deadline parser', 'Profile-matched alerts'],
      },
    },
  },

  // ========================
  // 6 AGENCY & CLIENT WORKS (/lavori/*)
  // ========================
  {
    slug: 'reverse-editing',
    name: 'Reverse Editing',
    engine: 'agency',
    status: 'client-work',
    featured: true,
    category: {
      it: 'Caso Studio Agenzia',
      de: 'Agentur-Fallstudie',
      fr: 'Étude de Cas Agence',
      en: 'Agency Case Study',
    },
    sector: {
      it: 'Post-Produzione Video & Media Studio',
      de: 'Video-Postproduktion & Medienstudio',
      fr: 'Post-Production Vidéo & Studio Média',
      en: 'Video Post-Production & Media Studio',
    },
    tagline: {
      it: 'Piattaforma vetrina e acquisizione clienti internazionali per studio di editing video ad alto ritmo.',
      de: 'Showcase- und Akquise-Plattform für ein internationales Video-Editing-Studio.',
      fr: 'Plateforme vitrine et acquisition clients pour studio de montage vidéo haute cadence.',
      en: 'High-conversion showcase and international client intake platform for a commercial video editing studio.',
    },
    shortDescription: {
      it: 'Servizio professionale di editing e post-produzione video. Interfaccia chiara e flusso di lavoro snello per creator e aziende che vogliono contenuti di alta qualità.',
      de: 'Professioneller Service für Video-Editing und Postproduktion. Klare Oberfläche und schlanker Workflow für Creator und Unternehmen.',
      fr: 'Service professionnel de montage et post-production vidéo. Interface claire et workflow fluide pour créateurs et entreprises.',
      en: 'Professional video editing and post-production service with a clean interface and streamlined workflow for creators and businesses.',
    },
    heroMetric: {
      value: '+145%',
      label: {
        it: 'Richieste preventivo qualificate',
        de: 'Qualifizierte Offertanfragen',
        fr: 'Demandes de devis qualifiées',
        en: 'Qualified quote requests',
      },
    },
    secondaryMetrics: [
      {
        value: '1.4s',
        label: {
          it: 'LCP su rete mobile 4G',
          de: 'LCP im 4G-Mobilnetz',
          fr: 'LCP sur réseau mobile 4G',
          en: 'LCP on 4G mobile',
        },
      },
      {
        value: '97/100',
        label: {
          it: 'Lighthouse Performance',
          de: 'Lighthouse Performance',
          fr: 'Performance Lighthouse',
          en: 'Lighthouse Performance',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Il sito precedente impiegava oltre 6 secondi a caricare i video in homepage, causando un abbandono superiore al 65% da mobile e pochi contatti dai creator e brand.',
      de: 'Die frühere Website benötigte über 6 Sekunden für Startseiten-Videos und verlor über 65 % der mobilen Besucher.',
      fr: 'L’ancien site mettait plus de 6 secondes à charger les vidéos d’accueil, générant 65 % de rebond mobile.',
      en: 'The legacy site took over 6 seconds to load homepage videos, causing a 65%+ mobile bounce rate and low creator/brand inquiries.',
    },
    solution: {
      it: 'Abbiamo progettato un layout scuro ad alto contrasto con caricamento progressivo delle anteprime video, struttura casi prima/dopo e modulo preventivo breve integrato.',
      de: 'Kontrastreiches Dark-Design mit progressivem Video-Preloading, Vorher/Nachher-Showcase und schlankem Anfrage-Funnel.',
      fr: 'Design sombre contrasté avec préchargement progressif des vidéos, comparatif avant/après et formulaire de devis court.',
      en: 'Engineered a high-contrast dark showcase with progressive video previews, before/after cut comparisons, and an embedded short quote brief.',
    },
    results: {
      it: '+145% di richieste di collaborazione nei primi 90 giorni dal lancio, tempo medio di permanenza salito a 2 min 40 s e punteggio Lighthouse 97.',
      de: '+145 % mehr Kooperationsanfragen in den ersten 90 Tagen und eine Verweildauer von 2 Min. 40 Sek.',
      fr: '+145 % de demandes de collaboration en 90 jours et temps moyen sur page porté à 2 min 40 s.',
      en: '+145% qualified collaboration inquiries within 90 days of launch, 2m 40s average session duration, and 97 Lighthouse performance.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Player Showreel zero-blocco',
          de: 'Blockierfreier Showreel-Player',
          fr: 'Lecteur Showreel sans blocage',
          en: 'Zero-jank Showreel player',
        },
        description: {
          it: 'Poster WebP precaricati e streaming adattivo solo su interazione utente.',
          de: 'Vorgeladene WebP-Poster und adaptives Streaming erst bei Nutzerinteraktion.',
          fr: 'Vignettes WebP préchargées et streaming adaptatif à l’interaction.',
          en: 'Preloaded lightweight posters with adaptive streaming triggered on user intent.',
        },
      },
      {
        title: {
          it: 'Confronto Raw vs Final Edit',
          de: 'Raw- vs. Final-Edit-Vergleich',
          fr: 'Comparatif Raw vs Montage Final',
          en: 'Raw vs Final Cut showcase',
        },
        description: {
          it: 'Dimostrazione immediata di color grading, sound design e ritmo di montaggio.',
          de: 'Sofortige Demonstration von Color Grading, Sounddesign und Schnitt-Rhythmus.',
          fr: 'Démonstration directe du color grading, sound design et rythme de montage.',
          en: 'Immediate visual demonstration of color grading, sound design, and pacing.',
        },
      },
      {
        title: {
          it: 'Funnel preventivo per pacchetti mensili',
          de: 'Anfrage-Funnel für Monatspakete',
          fr: 'Tunnel de devis forfaits mensuels',
          en: 'Retainer package intake funnel',
        },
        description: {
          it: 'Selezione rapida del volume video desiderato e collegamento diretto a call conoscitiva.',
          de: 'Schnelle Auswahl des gewünschten Videovolumens und direkte Terminbuchung.',
          fr: 'Sélection rapide du volume mensuel et prise de rendez-vous directe.',
          en: 'Quick volume selector guiding prospects directly into a discovery call.',
        },
      },
    ],
    targetAudience: {
      it: 'Brand e-commerce, podcaster, agenzie creative e creator internazionali.',
      de: 'E-Commerce-Marken, Podcaster, Kreativagenturen und internationale Creator.',
      fr: 'Marques e-commerce, podcasteurs, agences créatives et créateurs.',
      en: 'E-commerce brands, podcasters, creative agencies, and international creators.',
    },
    servicesUsed: {
      it: ['Sito Web ad Alte Prestazioni', 'UI/UX Design', 'Ottimizzazione Media & CWV'],
      de: ['High-Speed Website', 'UI/UX Design', 'Medien- & CWV-Optimierung'],
      fr: ['Site Web Haute Performance', 'Design UI/UX', 'Optimisation Médias & CWV'],
      en: ['High-Performance Web', 'UI/UX Design', 'Media & CWV Optimization'],
    },
    externalUrl: 'https://reverseediting.com',
    relatedSlugs: ['aurora-adv', 'dj-magix', 'aurora-ai'],
    previewTheme: {
      primaryHex: '#FBBF24',
      domainUrl: 'reverseediting.com',
      desktopHeadline: {
        it: 'Montaggio ad Alta Ritenzione per Brand',
        de: 'High-Retention Video-Editing für Marken',
        fr: 'Montage Haute Rétention pour Marques',
        en: 'High-Retention Editing for Brands',
      },
      desktopSubline: {
        it: '48h turnaround · Color grading & Sound design inclusi',
        de: '48h Lieferung · Color Grading & Sounddesign inklusive',
        fr: 'Livraison 48h · Étalonnage & Sound design inclus',
        en: '48h turnaround · Color grading & Sound design included',
      },
      highlights: [
        { label: 'Conversione brief', value: '+145%' },
        { label: 'Mobile LCP', value: '1.4 s' },
        { label: 'Clienti attivi', value: '38 brand' },
      ],
      uiModules: {
        it: ['Showreel interattivo', 'Comparativa Raw / Final', 'Brief rapido 3 step'],
        de: ['Interaktives Showreel', 'Raw / Final Vergleich', '3-Schritt-Briefing'],
        fr: ['Showreel interactif', 'Comparatif Raw / Final', 'Brief rapide 3 étapes'],
        en: ['Interactive showreel', 'Raw / Final comparison', '3-step quick brief'],
      },
    },
  },
  {
    slug: 'aurora-adv',
    name: 'Aurora ADV',
    engine: 'agency',
    status: 'client-work',
    featured: false,
    category: {
      it: 'Caso Studio Agenzia',
      de: 'Agentur-Fallstudie',
      fr: 'Étude de Cas Agence',
      en: 'Agency Case Study',
    },
    sector: {
      it: 'Performance Marketing & Advertising',
      de: 'Performance Marketing & Werbung',
      fr: 'Marketing de Performance & Publicité',
      en: 'Performance Marketing & Advertising',
    },
    tagline: {
      it: 'Portale agenzia orientato alla generazione lead con casi studio tracciati e landing dedicate.',
      de: 'Lead-orientiertes Agenturportal mit messbaren Fallstudien und dedizierten Landingpages.',
      fr: 'Portail d’agence orienté génération de leads avec études de cas tracées.',
      en: 'Conversion-focused agency portal built around tracked performance case studies and lead funnels.',
    },
    shortDescription: {
      it: 'Piattaforma di servizi pubblicitari con strumenti di analisi dati. Aiuta i brand a raggiungere il pubblico giusto con campagne mirate.',
      de: 'Werbeplattform mit präzisen Datenanalyse-Tools. Hilft Marken, mit gezielten Kampagnen genau die richtige Zielgruppe zu erreichen.',
      fr: 'Plateforme de services publicitaires dotée d’outils d’analyse de données pour toucher la bonne audience avec des campagnes ciblées.',
      en: 'Advertising services platform equipped with data analytics tools helping brands reach the right audience through targeted campaigns.',
    },
    heroMetric: {
      value: '-38%',
      label: {
        it: 'Costo per contatto qualificato',
        de: 'Kosten pro qualifiziertem Lead',
        fr: 'Coût par lead qualifié',
        en: 'Cost per qualified lead',
      },
    },
    secondaryMetrics: [
      {
        value: '4.1%',
        label: {
          it: 'Tasso di conversione landing',
          de: 'Landingpage-Conversion-Rate',
          fr: 'Taux de conversion landing',
          en: 'Landing conversion rate',
        },
      },
      {
        value: '95/100',
        label: {
          it: 'Lighthouse Accessibility & SEO',
          de: 'Lighthouse Barrierefreiheit & SEO',
          fr: 'Accessibilité & SEO Lighthouse',
          en: 'Lighthouse Accessibility & SEO',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Aurora ADV inviava traffico a pagamento verso pagine generiche prive di prova sociale concreta, con costi per lead elevati.',
      de: 'Aurora ADV leitete bezahlten Traffic auf allgemeine Seiten ohne konkrete Nachweise, was zu hohen Lead-Kosten führte.',
      fr: 'Aurora ADV envoyait son trafic payant vers des pages génériques sans preuves chiffrées, augmentant le coût par lead.',
      en: 'Aurora ADV directed paid ad traffic to generic pages lacking concrete proof metrics, inflating cost per acquisition.',
    },
    solution: {
      it: 'Costruzione di schede caso studio indicizzabili con metriche ROAS reali, pagine servizio verticali e tracciamento eventi privacy-first.',
      de: 'Aufbau indexierbarer Fallstudien mit echten ROAS-Werten, vertikalen Serviceseiten und datenschutzkonformem Tracking.',
      fr: 'Création d’études de cas indexables avec métriques ROAS réelles, pages services et suivi d’événements respectueux.',
      en: 'Built indexable case study templates backed by real ROAS data, vertical service landing pages, and privacy-first event tracking.',
    },
    results: {
      it: 'Riduzione del 38% del costo per lead B2B e raddoppio delle call strategiche prenotate direttamente dal sito.',
      de: '38 % niedrigere Kosten pro B2B-Lead und doppelt so viele direkt gebuchte Strategiegespräche.',
      fr: 'Baisse de 38 % du coût par lead B2B et doublement des appels stratégiques réservés en ligne.',
      en: '38% lower cost per B2B lead and 2x more strategy calls booked directly through the website.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Schede ROAS verificabili',
          de: 'Verifizierbare ROAS-Fallstudien',
          fr: 'Fiches ROAS vérifiables',
          en: 'Verifiable ROAS case sheets',
        },
        description: {
          it: 'Ogni progetto espone budget gestito, spesa media e ritorno misurato.',
          de: 'Jedes Projekt zeigt verwaltetes Budget und gemessene Rendite transparent.',
          fr: 'Chaque projet détaille le budget géré et le retour mesuré.',
          en: 'Every case presents managed ad spend, funnel fixes, and verified return metrics.',
        },
      },
      {
        title: {
          it: 'Pagine atterraggio ad alta velocità',
          de: 'Ultraschnelle Kampagnen-Landings',
          fr: 'Pages d’atterrissage ultra-rapides',
          en: 'Sub-second paid ad landing pages',
        },
        description: {
          it: 'Ottimizzate per Quality Score elevato su Google Ads.',
          de: 'Optimiert für höchste Qualitätsfaktoren in Google Ads.',
          fr: 'Optimisées pour maximiser le Quality Score Google Ads.',
          en: 'Engineered to boost Google Ads Quality Score and lower CPC.',
        },
      },
      {
        title: {
          it: 'Prenotazione audit campagna',
          de: 'Buchung von Kampagnen-Audits',
          fr: 'Réservation d’audit campagne',
          en: 'Campaign audit booking',
        },
        description: {
          it: 'Modulo a 4 campi collegato direttamente all’agenda del team media.',
          de: '4-Felder-Formular direkt mit dem Kalender des Media-Teams verbunden.',
          fr: 'Formulaire à 4 champs connecté à l’agenda de l’équipe média.',
          en: '4-field intake form wired directly to the media strategy calendar.',
        },
      },
    ],
    targetAudience: {
      it: 'Aziende B2C ed e-commerce che investono in crescita tramite paid media.',
      de: 'B2C-Unternehmen und E-Commerce-Marken mit Fokus auf bezahlte Kundengewinnung.',
      fr: 'Entreprises B2C et e-commerces investissant en acquisition payante.',
      en: 'B2C companies and e-commerce brands scaling customer acquisition via paid media.',
    },
    servicesUsed: {
      it: ['Architettura Conversione', 'Sviluppo Web', 'Tracciamento Eventi Privacy-First'],
      de: ['Conversion-Architektur', 'Webentwicklung', 'Datenschutzkonformes Tracking'],
      fr: ['Architecture Conversion', 'Développement Web', 'Tracking Privacy-First'],
      en: ['Conversion Architecture', 'Web Engineering', 'Privacy-First Analytics'],
    },
    externalUrl: 'https://www.aurora-adv.com',
    relatedSlugs: ['aurora-ai', 'reverse-editing', 'rankuplist'],
    previewTheme: {
      primaryHex: '#FBBF24',
      domainUrl: 'www.aurora-adv.com',
      desktopHeadline: {
        it: 'Campagne Performance Tracciate',
        de: 'Messbare Performance-Kampagnen',
        fr: 'Campagnes Performance Tracées',
        en: 'Tracked Performance Campaigns',
      },
      desktopSubline: {
        it: 'Meta Ads · Google Search · Landing Page ad alta resa',
        de: 'Meta Ads · Google Search · High-Yield Landingpages',
        fr: 'Meta Ads · Google Search · Landing pages à fort rendement',
        en: 'Meta Ads · Google Search · High-yield landing funnels',
      },
      highlights: [
        { label: 'CPL medio', value: '-38%' },
        { label: 'Conversion rate', value: '4.1%' },
        { label: 'Call prenotate', value: '2.1x' },
      ],
      uiModules: {
        it: ['Griglia casi ROAS', 'Landing Google Ads', 'Prenota audit 4 campi'],
        de: ['ROAS-Fallstudien', 'Google-Ads-Landings', '4-Felder-Audit'],
        fr: ['Grille cas ROAS', 'Landings Google Ads', 'Audit 4 champs'],
        en: ['ROAS case grid', 'Google Ads landings', '4-field audit intake'],
      },
    },
  },
  {
    slug: 'casa-bidia',
    name: 'Casa Bidia',
    engine: 'agency',
    status: 'client-work',
    featured: true,
    category: {
      it: 'Caso Studio Agenzia',
      de: 'Agentur-Fallstudie',
      fr: 'Étude de Cas Agence',
      en: 'Agency Case Study',
    },
    sector: {
      it: 'Ospitalità & Prenotazioni Dirette · Ticino',
      de: 'Hospitality & Direktbuchungen · Tessin',
      fr: 'Hôtellerie & Réservations Directes · Tessin',
      en: 'Hospitality & Direct Bookings · Ticino',
    },
    tagline: {
      it: 'Sito multilingua e motore di prenotazione diretta per ridurre la dipendenza dalle OTA.',
      de: 'Mehrsprachige Website und Direktbuchungs-Flow zur Senkung von OTA-Provisionen.',
      fr: 'Site multilingue et tunnel de réservation directe pour réduire les commissions OTA.',
      en: 'Multilingual hospitality flagship and direct booking flow reducing third-party OTA commissions.',
    },
    shortDescription: {
      it: 'Sito vetrina per una struttura residenziale in Svizzera. Design orientato all’esperienza utente per raccontare al meglio l’immobile e il suo contesto.',
      de: 'Showcase-Website für ein Wohnobjekt in der Schweiz mit nutzerzentriertem Design zur optimalen Präsentation von Immobilie und Umfeld.',
      fr: 'Site vitrine pour une résidence en Suisse. Design centré sur l’expérience utilisateur pour valoriser le bien immobilier et son cadre.',
      en: 'Showcase website for a residential property in Switzerland featuring UX-focused design to present the residence and its surroundings.',
    },
    heroMetric: {
      value: '+52%',
      label: {
        it: 'Prenotazioni dirette senza commissioni',
        de: 'Provisionsfreie Direktbuchungen',
        fr: 'Réservations directes sans commission',
        en: 'Commission-free direct bookings',
      },
    },
    secondaryMetrics: [
      {
        value: '4',
        label: {
          it: 'Lingue ospiti (IT/DE/FR/EN)',
          de: 'Gästesprachen (IT/DE/FR/EN)',
          fr: 'Langues clients (IT/DE/FR/EN)',
          en: 'Guest languages (IT/DE/FR/EN)',
        },
      },
      {
        value: '0.9s',
        label: {
          it: 'Tempo di risposta mobile',
          de: 'Mobile Antwortzeit',
          fr: 'Temps de réponse mobile',
          en: 'Mobile response time',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Oltre il 78% dei soggiorni arrivava tramite portali terzi con commissioni elevate, mentre gli ospiti svizzero-tedeschi faticavano a prenotare dal cellulare.',
      de: 'Über 78 % der Buchungen kamen über teure Drittportale, da Deutschschweizer Gäste mobil kaum direkt buchen konnten.',
      fr: 'Plus de 78 % des séjours passaient par des plateformes à forte commission faute de parcours mobile fluide.',
      en: 'Over 78% of stays came through high-commission OTAs because mobile guests from German-speaking Switzerland struggled to book directly.',
    },
    solution: {
      it: 'Realizzazione di un sito multilingua IT/DE/FR/EN con selettore date immediato, gallerie WebP ottimizzate e SEO locale per soggiorni in Ticino.',
      de: 'Viersprachige Website IT/DE/FR/EN mit direkter Datumsauswahl, optimierten WebP-Galerien und lokaler Tessin-SEO.',
      fr: 'Site multilingue IT/DE/FR/EN avec sélecteur de dates instantané, galeries WebP légères et SEO local Tessin.',
      en: 'Built a crisp IT/DE/FR/EN site with frictionless date selection, fast WebP galleries, and local Ticino search positioning.',
    },
    results: {
      it: '+52% di prenotazioni dirette nella prima stagione, con crescita netta delle ricerche organiche dalla Svizzera tedesca.',
      de: '+52 % mehr Direktbuchungen in der ersten Saison bei starkem Wachstum organischer Anfragen aus der Deutschschweiz.',
      fr: '+52 % de réservations directes dès la première saison et forte hausse du trafic suisse alémanique.',
      en: '+52% increase in direct commission-free bookings in the first season and strong organic growth from German-speaking Switzerland.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Motore prenotazione diretta in 2 clic',
          de: 'Direktbuchung in 2 Klicks',
          fr: 'Réservation directe en 2 clics',
          en: '2-click direct booking engine',
        },
        description: {
          it: 'Prezzo trasparente con vantaggio esclusivo rispetto ai portali esterni.',
          de: 'Transparente Preise mit direktem Preisvorteil gegenüber Buchungsportalen.',
          fr: 'Tarifs transparents avec avantage exclusif par rapport aux portails.',
          en: 'Transparent rates highlighting direct-booking perks over external marketplaces.',
        },
      },
      {
        title: {
          it: 'Schede multilingua con hreflang',
          de: 'Mehrsprachige Seiten mit hreflang',
          fr: 'Pages multilingues avec hreflang',
          en: 'Hreflang multilingual architecture',
        },
        description: {
          it: 'Indicizzazione pulita per turisti da Zurigo, Basilea, Ginevra e Nord Italia.',
          de: 'Saubere Indexierung für Gäste aus Zürich, Basel, Genf und Norditalien.',
          fr: 'Indexation propre pour voyageurs de Zurich, Bâle, Genève et Italie du Nord.',
          en: 'Clean organic visibility for travelers from Zurich, Basel, Geneva, and Northern Italy.',
        },
      },
      {
        title: {
          it: 'Guida locale esperienziale',
          de: 'Lokaler Erlebnis-Guide',
          fr: 'Guide d’expériences locales',
          en: 'Curated Ticino experience guide',
        },
        description: {
          it: 'Itinerari selezionati, trasporti Ticino Ticket e ristoranti consigliati.',
          de: 'Ausgewählte Touren, Ticino-Ticket-Infos und Restaurantempfehlungen.',
          fr: 'Itinéraires choisis, infos Ticino Ticket et bonnes tables.',
          en: 'Curated local itineraries, Ticino Ticket info, and dining recommendations.',
        },
      },
    ],
    targetAudience: {
      it: 'Boutique hotel, case vacanza, B&B e strutture ricettive del Canton Ticino.',
      de: 'Boutique-Hotels, Ferienhäuser, B&Bs und Gastgeber im Kanton Tessin.',
      fr: 'Boutique-hôtels, maisons de vacances et hébergements du Tessin.',
      en: 'Boutique hotels, vacation residences, and hospitality properties across Ticino.',
    },
    servicesUsed: {
      it: ['Sito Web Multilingua', 'Booking Diretto', 'SEO Locale Ticino'],
      de: ['Mehrsprachige Website', 'Direktbuchung', 'Lokale SEO Tessin'],
      fr: ['Site Web Multilingue', 'Réservation Directe', 'SEO Local Tessin'],
      en: ['Multilingual Web', 'Direct Booking UX', 'Ticino Local SEO'],
    },
    externalUrl: 'https://casabidia.ch',
    relatedSlugs: ['il-vicolo-lugano', 'sititicino-geoboost', 'rankuplist'],
    previewTheme: {
      primaryHex: '#FBBF24',
      domainUrl: 'casabidia.ch',
      desktopHeadline: {
        it: 'Soggiorni Autentici in Ticino · Prenota Diretto',
        de: 'Authentische Aufenthalte im Tessin · Direkt buchen',
        fr: 'Séjours Authentiques au Tessin · Réservation Directe',
        en: 'Authentic Stays in Ticino · Book Direct',
      },
      desktopSubline: {
        it: 'Miglior tariffa garantita · Colazione locale & Ticino Ticket inclusi',
        de: 'Bestpreisgarantie · Lokales Frühstück & Ticino Ticket inklusive',
        fr: 'Meilleur tarif garanti · Petit-déjeuner local & Ticino Ticket inclus',
        en: 'Best rate guaranteed · Local breakfast & Ticino Ticket included',
      },
      highlights: [
        { label: 'Prenotazioni dirette', value: '+52%' },
        { label: 'Ospiti DACH', value: '61% traffico' },
        { label: 'Velocità mobile', value: '0.9 s' },
      ],
      uiModules: {
        it: ['Selettore date rapido', 'Lingue IT / DE / FR / EN', 'Mappa attrazioni Ticino'],
        de: ['Schnelle Datumsauswahl', 'Sprachen IT / DE / FR / EN', 'Tessin-Erlebniskarte'],
        fr: ['Sélecteur dates rapide', 'Langues IT / DE / FR / EN', 'Carte expériences Tessin'],
        en: ['Instant date picker', 'IT / DE / FR / EN switch', 'Ticino experience guide'],
      },
    },
  },
  {
    slug: 'il-vicolo-lugano',
    name: 'Il Vicolo Lugano',
    engine: 'agency',
    status: 'client-work',
    featured: false,
    category: {
      it: 'Caso Studio Agenzia',
      de: 'Agentur-Fallstudie',
      fr: 'Étude de Cas Agence',
      en: 'Agency Case Study',
    },
    sector: {
      it: 'Ristorazione & Prenotazione Tavoli · Lugano',
      de: 'Gastronomie & Tischreservierung · Lugano',
      fr: 'Restauration & Réservation · Lugano',
      en: 'Dining & Table Reservation · Lugano',
    },
    tagline: {
      it: 'Menu mobile istantaneo, SEO Google Maps e gestione prenotazioni per ristorante nel centro di Lugano.',
      de: 'Mobiles Sofort-Menü, Google-Maps-SEO und Tischreservierung für ein Restaurant in Lugano.',
      fr: 'Menu mobile instantané, SEO Google Maps et réservations pour restaurant au cœur de Lugano.',
      en: 'Instant mobile menu, Google Maps SEO, and seamless table booking for a downtown Lugano restaurant.',
    },
    shortDescription: {
      it: 'Sito per un locale nel cuore di Lugano. Attenzione all’atmosfera, menù e contatti subito visibili, pensato per il pubblico locale.',
      de: 'Website für ein Lokal im Herzen von Lugano. Fokus auf Atmosphäre sowie sofort sichtbare Speisekarte und Kontakte für lokale Gäste.',
      fr: 'Site web pour un restaurant au cœur de Lugano. Mise en avant de l’atmosphère, du menu et des contacts pour le public local.',
      en: 'Website for a venue in the heart of Lugano highlighting atmosphere, menu, and instant contact access tailored for local guests.',
    },
    heroMetric: {
      value: '+88%',
      label: {
        it: 'Prenotazioni tavolo da Google',
        de: 'Tischreservierungen über Google',
        fr: 'Réservations de table via Google',
        en: 'Table bookings from Google',
      },
    },
    secondaryMetrics: [
      {
        value: '#2',
        label: {
          it: 'Ranking "ristorante centro Lugano"',
          de: 'Ranking „Restaurant Zentrum Lugano“',
          fr: 'Position « restaurant centre Lugano »',
          en: 'Rank "restaurant Lugano center"',
        },
      },
      {
        value: '0',
        label: {
          it: 'PDF pesanti da scaricare',
          de: 'Schwere PDF-Menüs',
          fr: 'PDF lourds à télécharger',
          en: 'Heavy PDF menus',
        },
      },
    ],
    problemOrChallenge: {
      it: 'I turisti e i professionisti a Lugano dovevano scaricare un PDF da 14 MB per leggere il menu e non trovavano un pulsante immediato per riservare.',
      de: 'Gäste in Lugano mussten ein 14-MB-PDF laden, um die Speisekarte zu sehen, ohne direkte Reservierungsoption.',
      fr: 'Les clients à Lugano devaient télécharger un PDF de 14 Mo pour lire la carte, sans bouton de réservation direct.',
      en: 'Diners in downtown Lugano had to download a 14 MB PDF just to browse the menu and lacked one-tap table booking.',
    },
    solution: {
      it: 'Menu HTML strutturato e indicizzabile (allergeni, vini, menu del giorno), collegamento Google Business Profile e flusso prenotazione con agente vocale opzionale.',
      de: 'Strukturiertes HTML-Menü (Allergene, Weine, Tageskarte), Google-Business-Verknüpfung und optionaler KI-Telefonassistent.',
      fr: 'Menu HTML structuré et indexable, connexion Google Business Profile et réservation fluide avec option accueil vocal IA.',
      en: 'Replaced the PDF with a structured HTML menu (allergens, wines, daily specials), optimized Google Business, and wired one-tap table booking.',
    },
    results: {
      it: '+88% di coperti prenotati tramite Google Search & Maps in quattro mesi e zero chiamate perse negli orari di servizio.',
      de: '+88 % mehr reservierte Tische über Google Search & Maps in vier Monaten ohne verpasste Anrufe.',
      fr: '+88 % de couverts réservés via Google Search & Maps en quatre mois sans appels manqués en service.',
      en: '+88% more table covers booked via Google Search & Maps within four months and zero missed service-hour calls.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Menu HTML veloce e multilingua',
          de: 'Schnelle mehrsprachige HTML-Karte',
          fr: 'Carte HTML rapide et multilingue',
          en: 'Fast multilingual HTML menu',
        },
        description: {
          it: 'Leggibile su qualsiasi schermo in meno di un secondo e indicizzato piatto per piatto su Google.',
          de: 'Auf jedem Smartphone in unter einer Sekunde lesbar und von Google indexiert.',
          fr: 'Lisible sur mobile en moins d’une seconde et indexé plat par plat sur Google.',
          en: 'Readable on any smartphone under one second and indexed dish-by-dish on Google.',
        },
      },
      {
        title: {
          it: 'Integrazione WhatsApp e Agente AI',
          de: 'WhatsApp- & KI-Agent-Integration',
          fr: 'Intégration WhatsApp & Agent IA',
          en: 'WhatsApp & AI Voice ready',
        },
        description: {
          it: 'Gestione automatica delle richieste tavoli quando la cucina è nel picco serale.',
          de: 'Automatische Annahme von Tischwünschen während der Stoßzeiten in der Küche.',
          fr: 'Gestion automatique des demandes de tables pendant le coup de feu du soir.',
          en: 'Captures table reservations automatically during peak dinner service.',
        },
      },
      {
        title: {
          it: 'Schema Restaurant & LocalBusiness',
          de: 'Schema Restaurant & LocalBusiness',
          fr: 'Schema Restaurant & LocalBusiness',
          en: 'Restaurant & LocalBusiness schema',
        },
        description: {
          it: 'Orari aggiornati, fascia prezzo e link diretto alla prenotazione nei risultati Google.',
          de: 'Aktuelle Öffnungszeiten und direkter Reservierungslink in den Google-Ergebnissen.',
          fr: 'Horaires à jour et lien direct de réservation dans les résultats Google.',
          en: 'Live opening hours, price tier, and direct booking actions surfaced directly in Google results.',
        },
      },
    ],
    targetAudience: {
      it: 'Ristoranti, osterie, pizzerie e locali del centro di Lugano e del Ticino.',
      de: 'Restaurants, Osterien und Gastronomiebetriebe im Zentrum von Lugano und dem Tessin.',
      fr: 'Restaurants, brasseries et établissements de Lugano et du Tessin.',
      en: 'Restaurants, bistros, and hospitality venues in Lugano and across Ticino.',
    },
    servicesUsed: {
      it: ['Sito Web Mobile-First', 'SEO Locale Lugano', 'Agenti AI Ristoranti'],
      de: ['Mobile-First Website', 'Lokale SEO Lugano', 'KI-Agenten Restaurants'],
      fr: ['Site Web Mobile-First', 'SEO Local Lugano', 'Agents IA Restaurants'],
      en: ['Mobile-First Web', 'Lugano Local SEO', 'AI Restaurant Agents'],
    },
    externalUrl: 'https://ilvicololugano.ch',
    relatedSlugs: ['casa-bidia', 'rankuplist', 'aurora-ai'],
    previewTheme: {
      primaryHex: '#FBBF24',
      domainUrl: 'ilvicololugano.ch',
      desktopHeadline: {
        it: 'Cucina Ticinese & Vini nel Cuore di Lugano',
        de: 'Tessiner Küche & Weine im Herzen von Lugano',
        fr: 'Cuisine Tessinoise & Vins au Cœur de Lugano',
        en: 'Ticino Dining & Wine in Downtown Lugano',
      },
      desktopSubline: {
        it: 'Aperto Mar–Dom · Prenota tavolo in 15 secondi',
        de: 'Geöffnet Di–So · Tisch in 15 Sekunden reservieren',
        fr: 'Ouvert Mar–Dim · Réservez votre table en 15 secondes',
        en: 'Open Tue–Sun · Reserve your table in 15 seconds',
      },
      highlights: [
        { label: 'Coperti da Google', value: '+88%' },
        { label: 'Menu HTML', value: '0 PDF pesanti' },
        { label: 'Lugano Centro', value: 'Top 2 Maps' },
      ],
      uiModules: {
        it: ['Carta HTML interattiva', 'Prenotazione tavolo 1-tap', 'Orari & mappa Lugano'],
        de: ['Interaktive HTML-Karte', '1-Tap Tischreservierung', 'Standortkarte Lugano'],
        fr: ['Carte HTML interactive', 'Réservation 1-tap', 'Plan & horaires Lugano'],
        en: ['Interactive HTML menu', '1-tap table booking', 'Lugano hours & map'],
      },
    },
  },
  {
    slug: 'dj-magix',
    name: 'DJ Magix',
    engine: 'agency',
    status: 'client-work',
    featured: false,
    category: {
      it: 'Caso Studio Agenzia',
      de: 'Agentur-Fallstudie',
      fr: 'Étude de Cas Agence',
      en: 'Agency Case Study',
    },
    sector: {
      it: 'Entertainment, Eventi & Audio Booking',
      de: 'Entertainment, Events & Booking',
      fr: 'Événementiel, Spectacles & Booking',
      en: 'Live Events & Artist Booking',
    },
    tagline: {
      it: 'Press kit digitale, anteprime audio e sistema rapido di richiesta disponibilità per eventi aziendali e matrimoni.',
      de: 'Digitales Press-Kit, Audio-Previews und schnelle Terminanfrage für Firmen- und Privatevents.',
      fr: 'Dossier de presse numérique, extraits audio et demande de disponibilité instantanée.',
      en: 'Digital press kit, instant audio sets, and rapid date-availability booking for corporate events and weddings.',
    },
    shortDescription: {
      it: 'Servizio DJ e organizzazione eventi in Ticino. Presenta stili musicali, attrezzatura e referenze in modo diretto ed efficace.',
      de: 'DJ-Service und Eventorganisation im Tessin. Präsentiert Musikstile, Technik und Referenzen direkt und wirkungsvoll.',
      fr: 'Service DJ et organisation d’événements au Tessin. Présente styles musicaux, équipement et références de manière directe.',
      en: 'DJ service and event production in Ticino showcasing musical genres, sound equipment, and references clearly and effectively.',
    },
    heroMetric: {
      value: '2.4x',
      label: {
        it: 'Richieste date da eventi corporate',
        de: 'Terminanfragen für Firmenevents',
        fr: 'Demandes de dates corporate',
        en: 'Corporate event inquiries',
      },
    },
    secondaryMetrics: [
      {
        value: '< 1.1s',
        label: {
          it: 'Caricamento press kit mobile',
          de: 'Ladezeit mobiles Press-Kit',
          fr: 'Chargement press kit mobile',
          en: 'Mobile press kit load',
        },
      },
      {
        value: '32',
        label: {
          it: 'Date prenotate in stagione',
          de: 'Gebuchte Termine pro Saison',
          fr: 'Dates réservées sur la saison',
          en: 'Season dates booked',
        },
      },
    ],
    problemOrChallenge: {
      it: 'I contatti arrivavano solo via passaparola senza materiale strutturato da inviare ad agenzie eventi, hotel di lusso e wedding planner in Svizzera.',
      de: 'Anfragen kamen nur über Mundpropaganda, ohne professionelle Unterlagen für Eventagenturen und Luxushotels.',
      fr: 'Les demandes reposaient uniquement sur le bouche-à-oreille, sans support professionnel pour agences et hôtels.',
      en: 'Bookings relied solely on word-of-mouth with no structured showcase for Swiss event planners and luxury venues.',
    },
    solution: {
      it: 'Creazione di una web app vetrina con player set audio leggero, schede tecniche per location e verifica data evento in 3 campi.',
      de: 'Entwicklung eines schlanken Artist-Showcases mit Audio-Player, Technik-Specs und 3-Felder-Terminprüfung.',
      fr: 'Création d’une vitrine web avec lecteur audio léger, fiches techniques et vérification de date en 3 champs.',
      en: 'Designed a sharp dark showcase with lightweight audio set previews, venue tech specs, and a 3-field date availability checker.',
    },
    results: {
      it: 'Richieste da eventi corporate e location sul Lago di Lugano e Como aumentate di 2.4 volte in una stagione.',
      de: '2,4-mal mehr Anfragen für Firmenevents und Locations am Luganer- und Comersee in einer Saison.',
      fr: 'Demandes pour événements corporate et lieux d’exception multipliées par 2,4 en une saison.',
      en: '2.4x growth in corporate and luxury venue bookings across Lake Lugano and Northern Italy in one season.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Verifica disponibilità data immediata',
          de: 'Sofortige Terminprüfung',
          fr: 'Vérification de date instantanée',
          en: 'Instant date availability check',
        },
        description: {
          it: 'Seleziona data, città e tipologia evento per ricevere risposta in poche ore.',
          de: 'Datum, Ort und Eventtyp wählen für eine schnelle Rückmeldung.',
          fr: 'Choisissez date, lieu et format pour recevoir une réponse rapide.',
          en: 'Select event date, venue city, and format for same-day confirmation.',
        },
      },
      {
        title: {
          it: 'Schede tecniche Audio & Lighting',
          de: 'Technik-Pakete Audio & Licht',
          fr: 'Fiches techniques Son & Lumière',
          en: 'Sound & Lighting rider specs',
        },
        description: {
          it: 'Specifiche chiare per location private, terrazze hotel e sale congressi.',
          de: 'Klare Spezifikationen für Privatlocations, Hotelterrassen und Kongresssäle.',
          fr: 'Spécifications claires pour domaines privés, hôtels et salles de congrès.',
          en: 'Clear setup specs tailored for private villas, hotel terraces, and corporate halls.',
        },
      },
      {
        title: {
          it: 'Anteprime Mix & Moodboard eventi',
          de: 'Mix-Previews & Event-Moodboard',
          fr: 'Extraits Mix & Moodboard',
          en: 'Curated Mixes & Event Gallery',
        },
        description: {
          it: 'Ascolto immediato dei generi Deep House, Lounge e Party Set.',
          de: 'Direktes Probehören von Deep House, Lounge und Party-Sets.',
          fr: 'Écoute directe des ambiances Deep House, Lounge et Party.',
          en: 'Instant preview of Lounge, Deep House, and Corporate Gala sets.',
        },
      },
    ],
    targetAudience: {
      it: 'Organizzatori di eventi aziendali, hotel 5 stelle e wedding planner in Svizzera.',
      de: 'Organisatoren von Firmenevents, 5-Sterne-Hotels und Hochzeitsplaner in der Schweiz.',
      fr: 'Organisateurs d’événements d’entreprise, hôtels et wedding planners en Suisse.',
      en: 'Corporate event organizers, luxury hotels, and wedding planners across Switzerland.',
    },
    servicesUsed: {
      it: ['Brand Showcase Design', 'Web Performance', 'Booking Funnel'],
      de: ['Brand Showcase Design', 'Web-Performance', 'Booking-Funnel'],
      fr: ['Design Vitrine Marque', 'Performance Web', 'Tunnel de Booking'],
      en: ['Brand Showcase Design', 'Web Performance', 'Booking Funnel'],
    },
    externalUrl: 'https://djmagix.net',
    relatedSlugs: ['reverse-editing', 'il-vicolo-lugano', 'aurora-adv'],
    previewTheme: {
      primaryHex: '#FBBF24',
      domainUrl: 'djmagix.net',
      desktopHeadline: {
        it: 'Live Sets per Eventi Corporate & Ville',
        de: 'Live-Sets für Firmenevents & Villen',
        fr: 'Live Sets pour Événements & Villas',
        en: 'Live Sets for Corporate & Private Events',
      },
      desktopSubline: {
        it: 'Lugano · Zurigo · Lago di Como · Verifica data live',
        de: 'Lugano · Zürich · Comersee · Live-Terminprüfung',
        fr: 'Lugano · Zurich · Lac de Côme · Vérification de date',
        en: 'Lugano · Zurich · Lake Como · Live date check',
      },
      highlights: [
        { label: 'Eventi corporate', value: '2.4x' },
        { label: 'Press kit load', value: '< 1.1 s' },
        { label: 'Setup audio', value: '3 tier' },
      ],
      uiModules: {
        it: ['Player audio leggero', 'Check disponibilità data', 'Pacchetti tecnici location'],
        de: ['Leichter Audio-Player', 'Terminprüfung', 'Technik-Pakete'],
        fr: ['Lecteur audio léger', 'Vérif disponibilité', 'Packs techniques'],
        en: ['Lightweight audio player', 'Date availability check', 'Venue tech riders'],
      },
    },
  },
  {
    slug: 'aurora-ai',
    name: 'Aurora AI',
    engine: 'agency',
    status: 'ai-division',
    featured: false,
    category: {
      it: 'Caso Studio · Divisione AI',
      de: 'Fallstudie · KI-Division',
      fr: 'Étude de Cas · Division IA',
      en: 'Case Study · AI Division',
    },
    sector: {
      it: 'Agenti AI Vocali & Automazione Aziendale',
      de: 'KI-Sprachagenten & Prozessautomatisierung',
      fr: 'Agents Vocaux IA & Automatisation',
      en: 'AI Voice Agents & Workflow Automation',
    },
    tagline: {
      it: 'Segreteria telefonica AI multilingua integrata con agenda appuntamenti e CRM aziendale.',
      de: 'Mehrsprachiger KI-Telefonassistent integriert mit Terminkalender und Firmen-CRM.',
      fr: 'Secrétariat téléphonique IA multilingue connecté à l’agenda et au CRM d’entreprise.',
      en: 'Multilingual AI voice receptionist integrated directly with business calendars and CRM pipelines.',
    },
    shortDescription: {
      it: 'Studio dedicato a soluzioni di intelligenza artificiale. Il sito comunica competenze tecniche e applicazioni concrete in modo essenziale.',
      de: 'Studio für Lösungen im Bereich künstliche Intelligenz. Vermittelt technische Kompetenz und konkrete Anwendungen auf den Punkt.',
      fr: 'Studio dédié aux solutions d’intelligence artificielle. Le site présente expertise technique et cas concrets avec clarté.',
      en: 'Studio dedicated to artificial intelligence solutions, communicating technical expertise and practical applications concisely.',
    },
    heroMetric: {
      value: '100%',
      label: {
        it: 'Chiamate risposte senza attesa',
        de: 'Beantwortete Anrufe ohne Wartezeit',
        fr: 'Appels répondus sans attente',
        en: 'Inbound calls answered instantly',
      },
    },
    secondaryMetrics: [
      {
        value: '24/7',
        label: {
          it: 'Copertura multilingua continua',
          de: 'Mehrsprachige 24/7-Abdeckung',
          fr: 'Couverture multilingue 24/7',
          en: 'Multilingual 24/7 coverage',
        },
      },
      {
        value: '+34%',
        label: {
          it: 'Appuntamenti confermati fuori orario',
          de: 'Termine außerhalb der Öffnungszeiten',
          fr: 'Rendez-vous pris hors horaires',
          en: 'After-hours bookings captured',
        },
      },
    ],
    problemOrChallenge: {
      it: 'Ristoranti, saloni e studi professionali perdevano oltre il 30% delle chiamate in ingresso durante i picchi operativi o fuori orario.',
      de: 'Restaurants, Salons und Praxen verloren über 30 % der Anrufe während Stoßzeiten oder nach Feierabend.',
      fr: 'Restaurants, salons et cabinets manquaient plus de 30 % des appels entrants pendant les heures de pointe.',
      en: 'Restaurants, salons, and service clinics missed over 30% of inbound phone calls during peak service hours and evenings.',
    },
    solution: {
      it: 'Implementazione di agenti vocali AI addestrati su listini, orari e regole di prenotazione reali, con trascrizione e conferma automatica via SMS/WhatsApp.',
      de: 'Einsatz von KI-Sprachagenten, trainiert auf echte Preislisten und Kalenderregeln, mit SMS/WhatsApp-Bestätigung.',
      fr: 'Déploiement d’agents vocaux IA entraînés sur les tarifs, horaires et règles réelles avec confirmation SMS/WhatsApp.',
      en: 'Deployed domain-trained AI voice agents synced to live calendars, menu/service rules, and instant SMS/WhatsApp confirmations.',
    },
    results: {
      it: 'Zero chiamate perse, aumento del 34% degli appuntamenti fuori orario e riduzione drastica delle interruzioni al banco.',
      de: 'Keine verpassten Anrufe mehr, +34 % Buchungen außerhalb der Geschäftszeiten und ruhigerer Ablauf vor Ort.',
      fr: 'Zéro appel manqué, +34 % de rendez-vous hors horaires et réduction nette des interruptions au comptoir.',
      en: 'Zero missed inbound calls, +34% after-hours appointments captured, and dramatic reduction in front-desk interruptions.',
    },
    keyFeatures: [
      {
        title: {
          it: 'Voce naturale in 4 lingue',
          de: 'Natürliche Stimme in 4 Sprachen',
          fr: 'Voix naturelle en 4 langues',
          en: 'Natural 4-language voice fluency',
        },
        description: {
          it: 'Riconosce automaticamente se il chiamante parla italiano, tedesco, francese o inglese.',
          de: 'Erkennt automatisch, ob Anrufer Italienisch, Deutsch, Französisch oder Englisch sprechen.',
          fr: 'Détecte automatiquement si l’appelant parle italien, allemand, français ou anglais.',
          en: 'Automatically detects and responds fluently in Italian, German, French, or English.',
        },
      },
      {
        title: {
          it: 'Scrittura diretta in agenda',
          de: 'Direkter Kalendereintrag',
          fr: 'Inscription directe à l’agenda',
          en: 'Real-time calendar booking',
        },
        description: {
          it: 'Verifica gli slot liberi in tempo reale e previene sovrapposizioni.',
          de: 'Prüft freie Zeitfenster in Echtzeit und verhindert Doppelbuchungen.',
          fr: 'Vérifie les créneaux disponibles en temps réel sans double réservation.',
          en: 'Checks live slot availability and books appointments without double-booking conflicts.',
        },
      },
      {
        title: {
          it: 'Passaggio immediato a operatore umano',
          de: 'Sofortige Übergabe an Mitarbeitende',
          fr: 'Transfert immédiat vers un humain',
          en: 'Instant human escalation',
        },
        description: {
          it: 'Trasferisce chiamate complesse o urgenti al referente designato con riepilogo immediato.',
          de: 'Leitet komplexe Anliegen inklusive Kurzprotokoll direkt an die zuständige Person weiter.',
          fr: 'Transfère les demandes complexes au responsable avec un résumé instantané.',
          en: 'Routes urgent or complex calls directly to staff along with an instant call summary.',
        },
      },
    ],
    targetAudience: {
      it: 'Ristoranti, parrucchieri, centri estetici, studi medici e aziende di servizi in Svizzera.',
      de: 'Restaurants, Friseursalons, Kosmetikstudios, Praxen und Dienstleister in der Schweiz.',
      fr: 'Restaurants, salons de coiffure, instituts, cabinets médicaux et PME de services.',
      en: 'Restaurants, hair salons, beauty clinics, medical practices, and Swiss service SMEs.',
    },
    servicesUsed: {
      it: ['Agenti AI Vocali', 'Integrazione Calendario & CRM', 'Notifiche WhatsApp'],
      de: ['KI-Sprachagenten', 'Kalender- & CRM-Integration', 'WhatsApp-Bestätigungen'],
      fr: ['Agents Vocaux IA', 'Intégration Agenda & CRM', 'Notifications WhatsApp'],
      en: ['AI Voice Agents', 'Calendar & CRM Sync', 'WhatsApp Confirmations'],
    },
    externalUrl: 'https://aurora-ai.studio',
    relatedSlugs: ['auto-social-publisher', 'il-vicolo-lugano', 'aurora-adv'],
    previewTheme: {
      primaryHex: '#60A5FA',
      domainUrl: 'aurora-ai.studio',
      desktopHeadline: {
        it: 'Console Agente Vocale AI · Multilingua',
        de: 'KI-Sprachagent-Konsole · Mehrsprachig',
        fr: 'Console Agent Vocal IA · Multilingue',
        en: 'AI Voice Agent Console · Multilingual',
      },
      desktopSubline: {
        it: 'Risposta < 0.8s · Sincronizzazione calendario attiva',
        de: 'Antwortzeit < 0,8s · Kalender-Synchronisation aktiv',
        fr: 'Réponse < 0,8s · Synchronisation agenda active',
        en: 'Response < 0.8s · Live calendar booking active',
      },
      highlights: [
        { label: 'Chiamate risposte', value: '100%' },
        { label: 'Booking fuori orario', value: '+34%' },
        { label: 'Lingue attive', value: 'IT/DE/FR/EN' },
      ],
      uiModules: {
        it: ['Trascrizione chiamata live', 'Slot prenotato in agenda', 'Conferma SMS / WhatsApp'],
        de: ['Live-Anruftranskript', 'Direkter Kalendereintrag', 'SMS / WhatsApp Bestätigung'],
        fr: ['Transcription en direct', 'Créneau réservé agenda', 'Confirmation SMS / WhatsApp'],
        en: ['Live call transcript', 'Calendar slot locked', 'SMS / WhatsApp confirmation'],
      },
    },
  },
];

export const getProjectBySlug = (slug: string): ProjectItem | undefined =>
  PROJECTS.find((p) => p.slug === slug);

export const getSaasProjects = (): ProjectItem[] =>
  PROJECTS.filter((p) => p.engine === 'saas');

export const getAgencyProjects = (): ProjectItem[] =>
  PROJECTS.filter((p) => p.engine === 'agency');
