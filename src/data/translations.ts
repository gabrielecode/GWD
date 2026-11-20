import { Language, StatusBadgeType } from '../types/showcase';

export interface UiStrings {
  nav: {
    products: string;
    works: string;
    services: string;
    about: string;
    contact: string;
    ctaHeader: string;
    menuOpen: string;
    menuClose: string;
  };
  badges: Record<StatusBadgeType, string>;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    metrics: [
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
    ];
    studioPreviewTitle: string;
    studioPreviewSubtitle: string;
    engineSaasLabel: string;
    engineAgencyLabel: string;
    statsBar: {
      activeUsersLabel: string;
      activeUsersSub: string;
      projectsDeliveredLabel: string;
      projectsDeliveredSub: string;
      yearsExperienceLabel: string;
      yearsExperienceSub: string;
    };
  };
  dualEngine: {
    sectionTitle: string;
    sectionSubtitle: string;
    saasTitle: string;
    saasTag: string;
    saasDescription: string;
    saasPoints: string[];
    saasCta: string;
    agencyTitle: string;
    agencyTag: string;
    agencyDescription: string;
    agencyPoints: string[];
    agencyCta: string;
  };
  filterSection: {
    sectionTitle: string;
    sectionSubtitle: string;
    all: string;
    saas: string;
    agency: string;
    countLabel: string;
    viewCard: string;
    openPlatform: string;
    visitSite: string;
    showTechStack: string;
    hideTechStack: string;
    techStackHeading: string;
    technicalTagsHeading: string;
  };
  featuredSaas: {
    sectionTitle: string;
    sectionSubtitle: string;
    viewAll: string;
    openPlatform: string;
    technicalSheet: string;
  };
  caseStudies: {
    sectionTitle: string;
    sectionSubtitle: string;
    challengeLabel: string;
    solutionLabel: string;
    resultLabel: string;
    desktopView: string;
    mobileView: string;
    viewCaseStudy: string;
    viewAllWorks: string;
  };
  servicesSection: {
    sectionTitle: string;
    sectionSubtitle: string;
    exploreService: string;
    aiRestaurantsCta: string;
    aiSalonsCta: string;
  };
  socialProof: {
    sectionTitle: string;
    sectionSubtitle: string;
    clientsLabel: string;
    reviewsLabel: string;
    zonesLabel: string;
    zonesSubtitle: string;
    exploreZone: string;
  };
  quickContact: {
    sectionTitle: string;
    sectionSubtitle: string;
    whatsappDirect: string;
    whatsappSub: string;
    bookCallTitle: string;
    bookCallSub: string;
    selectDay: string;
    selectSlot: string;
    confirmCall: string;
    callConfirmed: string;
    responseTime: string;
  };
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    needLabel: string;
    needOptions: string[];
    consentLabel: string;
    submit: string;
    submitting: string;
    errorName: string;
    errorEmail: string;
    errorConsent: string;
    successTitle: string;
    successBody: string;
    reset: string;
  };
  productDetail: {
    backToHub: string;
    problemSolved: string;
    keyFeatures: string;
    targetAudience: string;
    interactivePreview: string;
    openPlatform: string;
    relatedProducts: string;
    nextActionTitle: string;
    nextActionCta: string;
  };
  caseDetail: {
    backToHub: string;
    clientSector: string;
    challenge: string;
    solution: string;
    results: string;
    previewTitle: string;
    servicesUsed: string;
    visitLiveSite: string;
    similarProjectTitle: string;
    similarProjectSub: string;
    similarProjectCta: string;
    relatedWorks: string;
  };
  serviceDetail: {
    allServices: string;
    mainBenefit: string;
    howItWorks: string;
    whatIncluded: string;
    examplesTitle: string;
    faqTitle: string;
    localTitle: string;
    localSubtitle: string;
    ctaQuote: string;
    aiVerticalsTitle: string;
    appsSectionTag: string;
    appsSectionTitle: string;
    appsSectionSubtitle: string;
  };
  about: {
    title: string;
    subtitle: string;
    groupStoryTitle: string;
    groupStoryBody: string;
    brandsTitle: string;
    gwdTitle: string;
    gwdDesc: string;
    sitiTicinoTitle: string;
    sitiTicinoDesc: string;
    standardsTitle: string;
    standards: { metric: string; target: string; desc: string }[];
    ctaTitle: string;
    ctaButton: string;
  };
  contactPage: {
    title: string;
    subtitle: string;
    directChannels: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    hoursLabel: string;
    hoursValue: string;
    responseTitle: string;
    responseValue: string;
    mapTitle: string;
    mapSubtitle: string;
  };
  footer: {
    tagline: string;
    address: string;
    vat: string;
    navigationTitle: string;
    legalTitle: string;
    privacyLink: string;
    cookieLink: string;
    languageTitle: string;
    copyright: string;
  };
  whatsapp: {
    label: string;
    ariaLabel: string;
  };
  cookieBanner: {
    title: string;
    description: string;
    acceptAll: string;
    onlyNecessary: string;
    customize: string;
    savePreferences: string;
    necessaryLabel: string;
    analyticsLabel: string;
  };
  seoUi: {
    homeLabel: string;
    heroImageAlt: string;
    districtsLabel: string;
    industriesLabel: string;
    serviceAngleLabel: string;
    keywordsLabel: string;
    relatedServiceLabel: string;
    sitiTicinoNetworkLabel: string;
  };
}

export const TRANSLATIONS: Record<Language, UiStrings> = {
  it: {
    nav: {
      products: 'Prodotti',
      works: 'Lavori',
      services: 'Servizi',
      about: 'Chi siamo',
      contact: 'Contatti',
      ctaHeader: 'Parla del tuo progetto',
      menuOpen: 'Apri menu',
      menuClose: 'Chiudi menu',
    },
    badges: {
      'live-saas': 'Live SaaS',
      'client-work': 'Client Work',
      'ai-division': 'Divisione AI',
    },
    hero: {
      eyebrow: 'GWD Group · Lugano, Svizzera',
      title: 'Digital Venture Studio & Agency',
      subtitle:
        'Un solo gruppo con due motori operativi: progettiamo piattaforme SaaS proprietarie per il mercato B2B e realizziamo siti web, SEO locale e agenti AI vocali per le imprese del Ticino.',
      ctaPrimary: 'Scopri i prodotti',
      ctaSecondary: 'Richiedi preventivo',
      metrics: [
        { value: '10', label: 'Aree di progetto' },
        { value: '13', label: 'Schede progetto indicizzabili' },
        { value: '4', label: 'Lingue: IT · DE · FR · EN' },
        { value: '90+', label: 'Obiettivo Lighthouse' },
      ],
      studioPreviewTitle: 'Architettura a doppio motore',
      studioPreviewSubtitle: 'Venture interne e soluzioni su misura',
      engineSaasLabel: 'Motore SaaS · 6 Piattaforme',
      engineAgencyLabel: 'Motore Agenzia · Ticino & AI',
      statsBar: {
        activeUsersLabel: 'Utenti SaaS attivi',
        activeUsersSub: 'Su {count} piattaforme SaaS live',
        projectsDeliveredLabel: 'Progetti consegnati',
        projectsDeliveredSub: 'Siti, WebApp & soluzioni AI in CH',
        yearsExperienceLabel: 'Anni di esperienza',
        yearsExperienceSub: 'Dal 2018 · Studio a Lugano',
      },
    },
    dualEngine: {
      sectionTitle: 'Due motori, una sola ingegneria',
      sectionSubtitle:
        'Le competenze sviluppate nei nostri prodotti SaaS alimentano ogni progetto cliente con standard misurabili su velocità, conversione e indicizzazione.',
      saasTitle: 'Motore Venture SaaS',
      saasTag: 'Prodotti proprietari',
      saasDescription:
        'Software verticali per acquisizione lead B2B in Svizzera, SEO locale automatizzata, pubblicazione social AI e gestione dati scolastici e veterinari.',
      saasPoints: [
        'Accesso diretto in cloud con metriche operative reali',
        'Architetture sviluppate internamente da GWD',
        'Integrazione nativa con dati e directory svizzere',
      ],
      saasCta: 'Esplora gli asset SaaS',
      agencyTitle: 'Motore Agenzia & AI',
      agencyTag: 'SitiTicino & Client Works',
      agencyDescription:
        'Siti web veloci, piattaforme e-commerce, posizionamento Google in Ticino e segreterie vocali AI progettate per trasformare le visite in clienti.',
      agencyPoints: [
        'Progetti ottimizzati per Core Web Vitals tutti in verde',
        'Presidio territoriale su Lugano, Bellinzona, Locarno e Mendrisio',
        'Agenti AI vocali verticali per ristoranti e parrucchieri',
      ],
      agencyCta: 'Esplora i lavori agenzia',
    },
    filterSection: {
      sectionTitle: 'Ecosistema progetti e piattaforme',
      sectionSubtitle:
        'Filtra istantaneamente tra asset SaaS proprietari e progetti realizzati per clienti e brand del gruppo.',
      all: 'Tutti',
      saas: 'Prodotti SaaS',
      agency: 'Lavori agenzia',
      countLabel: 'schede visibili',
      viewCard: 'Apri scheda',
      openPlatform: 'Apri piattaforma ↗',
      visitSite: 'Visita il sito',
      showTechStack: 'Stack & Tag tecnici',
      hideTechStack: 'Nascondi stack',
      techStackHeading: 'Stack Tecnologico',
      technicalTagsHeading: 'Tag Tecnici',
    },
    featuredSaas: {
      sectionTitle: 'Prodotti SaaS in evidenza',
      sectionSubtitle:
        'Tre piattaforme attive sul mercato svizzero con accesso diretto e metriche verificate.',
      viewAll: 'Vedi tutti i 6 SaaS',
      openPlatform: 'Apri piattaforma ↗',
      technicalSheet: 'Scheda prodotto',
    },
    caseStudies: {
      sectionTitle: 'Casi studio: Sfida, Soluzione, Risultato',
      sectionSubtitle:
        'Ispeziona le anteprime interattive su desktop e mobile per verificare struttura, velocità e impatto commerciale.',
      challengeLabel: 'La sfida',
      solutionLabel: 'La soluzione',
      resultLabel: 'Il risultato',
      desktopView: 'Desktop',
      mobileView: 'Mobile',
      viewCaseStudy: 'Leggi caso studio',
      viewAllWorks: 'Tutti i lavori agenzia',
    },
    servicesSection: {
      sectionTitle: 'Servizi ad alto impatto per il Ticino',
      sectionSubtitle:
        'Dalla presenza web al posizionamento locale su Google fino agli agenti vocali AI che rispondono 24 ore su 24.',
      exploreService: 'Approfondisci servizio',
      aiRestaurantsCta: 'Agenti AI Ristoranti',
      aiSalonsCta: 'Agenti AI Parrucchieri',
    },
    socialProof: {
      sectionTitle: 'Aziende, recensioni e presenza in Ticino',
      sectionSubtitle:
        'Collaboriamo con realtà locali e gruppi digitali in tutto il Cantone con risultati verificabili su Google e prenotazioni dirette.',
      clientsLabel: 'Brand e clienti seguiti',
      reviewsLabel: 'Riscontri verificati in Ticino',
      zonesLabel: 'Zone servite con pagine dedicate',
      zonesSubtitle: 'Seleziona un distretto per vedere il focus SEO locale e i casi di riferimento.',
      exploreZone: 'Vedi focus locale',
    },
    quickContact: {
      sectionTitle: 'Parla del tuo progetto',
      sectionSubtitle:
        'Compila il modulo breve in meno di 60 secondi oppure scegli una fascia oraria per una call operativa con il team di Lugano.',
      whatsappDirect: 'Scrivici su WhatsApp ↗',
      whatsappSub: 'Risposta rapida in italiano, tedesco, francese o inglese',
      bookCallTitle: 'Prenota una call di 20 minuti',
      bookCallSub: 'Scegli giorno e fascia oraria per analizzare il tuo progetto.',
      selectDay: 'Giorno preferito',
      selectSlot: 'Fascia oraria',
      confirmCall: 'Conferma prenotazione call',
      callConfirmed: 'Call opzionata',
      responseTime: 'Tempo medio di risposta: entro 4 ore lavorative (Lun–Ven, Lugano)',
    },
    form: {
      nameLabel: 'Nome e Azienda',
      namePlaceholder: 'es. Marco Bernasconi · Studio Lugano',
      emailLabel: 'Email aziendale',
      emailPlaceholder: 'marco@azienda.ch',
      needLabel: 'Esigenza principale',
      needOptions: [
        'Nuovo sito web o restyling ad alte prestazioni',
        'Posizionamento SEO locale in Ticino',
        'Agente AI vocale (Ristorante / Salone / Azienda)',
        'Accesso demo o partnership piattaforme SaaS',
      ],
      consentLabel: 'Accetto l’informativa privacy conforme a nLPD svizzera e GDPR.',
      submit: 'Richiedi preventivo',
      submitting: 'Invio in corso...',
      errorName: 'Inserisci almeno 2 caratteri per nome o azienda.',
      errorEmail: 'Inserisci un indirizzo email valido.',
      errorConsent: 'Conferma il consenso nLPD / GDPR per procedere.',
      successTitle: 'Richiesta registrata correttamente',
      successBody:
        'Abbiamo preso in carico il tuo messaggio. Il team di Lugano ti risponderà entro 4 ore lavorative.',
      reset: 'Invia un’altra richiesta',
    },
    productDetail: {
      backToHub: 'Torna a Prodotti SaaS',
      problemSolved: 'Problema risolto',
      keyFeatures: '3 funzioni chiave',
      targetAudience: 'Per chi è progettato',
      interactivePreview: 'Anteprima interfaccia piattaforma',
      openPlatform: 'Apri piattaforma ↗',
      relatedProducts: 'Prodotti SaaS correlati',
      nextActionTitle: 'Vuoi integrare questo strumento nella tua azienda?',
      nextActionCta: 'Richiedi una demo guidata',
    },
    caseDetail: {
      backToHub: 'Torna a Lavori agenzia',
      clientSector: 'Cliente e settore',
      challenge: 'La sfida',
      solution: 'La soluzione',
      results: 'I risultati ottenuti',
      previewTitle: 'Anteprima multi-dispositivo',
      servicesUsed: 'Servizi impiegati',
      visitLiveSite: 'Visita sito live ↗',
      similarProjectTitle: 'Vuoi un progetto simile per la tua attività?',
      similarProjectSub:
        'Progettiamo l’architettura tecnica, il design e la strategia SEO partendo dai tuoi obiettivi di conversione.',
      similarProjectCta: 'Vuoi un progetto simile?',
      relatedWorks: 'Altri casi studio correlati',
    },
    serviceDetail: {
      allServices: 'Tutti i servizi',
      mainBenefit: 'Beneficio principale',
      howItWorks: 'Come funziona in 3 passi',
      whatIncluded: 'Cosa include il servizio',
      examplesTitle: 'Esempi e casi studio collegati',
      faqTitle: 'Domande frequenti',
      localTitle: 'Posizionamento locale in Ticino',
      localSubtitle: 'Contenuti, parole chiave e strategie dedicate per ciascun polo cantonale.',
      ctaQuote: 'Richiedi preventivo dedicato',
      aiVerticalsTitle: 'Soluzioni verticali Agenti AI vocali',
      appsSectionTag: 'SitiTicino.ch · Ecosistema digitale',
      appsSectionTitle: 'Progetti / App',
      appsSectionSubtitle:
        'Piattaforme SaaS, strumenti AI e WebApp PWA progettati per artigiani, PMI svizzere, e-commerce e attività locali.',
    },
    about: {
      title: 'Il gruppo dietro GWD e SitiTicino',
      subtitle:
        'Uniamo la disciplina ingegneristica di un Venture Studio SaaS alla concretezza operativa di un’agenzia digitale radicata a Lugano.',
      groupStoryTitle: 'Un modello integrato, zero intermediari',
      groupStoryBody:
        'GWD Group nasce per superare il divario tra agenzie creative lente e software house distanti dal business locale. Da una parte sviluppiamo e gestiamo asset SaaS proprietari in produzione; dall’altra trasferiamo quella stessa solidità tecnica ai siti web, alle campagne e agli agenti AI delle PMI ticinesi.',
      brandsTitle: 'Architettura dei brand del gruppo',
      gwdTitle: 'GWD · Digital Venture Studio',
      gwdDesc:
        'La divisione di prodotto e AI engineering: progetta, lancia e scala piattaforme SaaS B2B, motori di estrazione dati svizzeri e sistemi di automazione vocale.',
      sitiTicinoTitle: 'SitiTicino · Agency & Local Growth',
      sitiTicinoDesc:
        'Il brand territoriale dedicato alle imprese di Lugano, Bellinzona, Locarno e Mendrisio: siti veloci, e-commerce, Google Business Profile e SEO cantonale.',
      standardsTitle: 'Standard tecnici e trasparenza E-E-A-T',
      standards: [
        { metric: '< 2.5 s', target: 'LCP Caricamento', desc: 'Risorse leggere e rendering ottimizzato senza blocchi.' },
        { metric: '< 200 ms', target: 'INP Reattività', desc: 'Interfacce snelle e interazioni immediate su mobile.' },
        { metric: '< 0.1', target: 'CLS Stabilità', desc: 'Dimensioni dichiarate per zero salti visivi.' },
        { metric: '90+', target: 'Lighthouse Score', desc: 'Verifica su prestazioni, accessibilità WCAG 2.2 AA e SEO.' },
      ],
      ctaTitle: 'Pronto a lavorare con il team di Lugano?',
      ctaButton: 'Parla del tuo progetto',
    },
    contactPage: {
      title: 'Contatti · GWD Group Lugano',
      subtitle:
        'Raccontaci cosa vuoi costruire o ottimizzare. Rispondiamo in giornata con una valutazione tecnica chiara.',
      directChannels: 'Canali diretti svizzeri',
      phoneLabel: 'Telefono svizzero',
      emailLabel: 'Email diretta',
      addressLabel: 'Sede operativa',
      hoursLabel: 'Orari ufficio',
      hoursValue: 'Lun–Ven · 08:30 – 18:30 CET',
      responseTitle: 'Tempi di risposta garantiti',
      responseValue: 'Entro 4 ore lavorative per preventivi e demo SaaS; immediato su WhatsApp in fascia diurna.',
      mapTitle: 'Lugano · Centro & Distretto Digitale',
      mapSubtitle: 'Riceviamo su appuntamento o in videochiamata per tutto il Canton Ticino e la Svizzera.',
    },
    footer: {
      tagline: 'Digital Venture Studio & Agency Group — Piattaforme SaaS proprietarie, siti web ad alte prestazioni e agenti AI vocali.',
      address: 'Lugano',
      vat: 'GWD Group',
      navigationTitle: 'Mappa del sito',
      legalTitle: 'Conformità & Legale',
      privacyLink: 'Informativa Privacy (nLPD / GDPR)',
      cookieLink: 'Preferenze Cookie',
      languageTitle: 'Lingua',
      copyright: '© 2026 GWD Group (GWD + SitiTicino). Tutti i diritti riservati.',
    },
    whatsapp: {
      label: 'WhatsApp',
      ariaLabel: 'Contatta GWD Group su WhatsApp',
    },
    cookieBanner: {
      title: 'Rispetto della tua privacy (nLPD / GDPR)',
      description:
        'Utilizziamo cookie tecnici essenziali per il funzionamento del sito e, solo previo tuo consenso esplicito, misurazioni aggregate rispettose della privacy svizzera.',
      acceptAll: 'Accetta tutti',
      onlyNecessary: 'Solo necessari',
      customize: 'Personalizza',
      savePreferences: 'Salva scelte',
      necessaryLabel: 'Cookie tecnici necessari (sempre attivi)',
      analyticsLabel: 'Statistiche aggregate privacy-first',
    },
    seoUi: {
      homeLabel: 'Home',
      heroImageAlt: 'Ecosistema digitale GWD Group a Lugano: piattaforme SaaS, sviluppo web, SEO locale Ticino e agenti AI',
      districtsLabel: 'Comuni e quartieri serviti',
      industriesLabel: 'Settori chiave locali',
      serviceAngleLabel: 'Approccio su misura per il territorio',
      keywordsLabel: 'Ricerche locali presidiate',
      relatedServiceLabel: 'Servizio agenzia collegato',
      sitiTicinoNetworkLabel: 'Rete territoriale SitiTicino.ch',
    },
  },
  de: {
    nav: {
      products: 'Produkte',
      works: 'Projekte',
      services: 'Leistungen',
      about: 'Über uns',
      contact: 'Kontakt',
      ctaHeader: 'Projekt besprechen',
      menuOpen: 'Menü öffnen',
      menuClose: 'Menü schließen',
    },
    badges: {
      'live-saas': 'Live SaaS',
      'client-work': 'Client Work',
      'ai-division': 'KI-Division',
    },
    hero: {
      eyebrow: 'GWD Group · Lugano, Schweiz',
      title: 'Digital Venture Studio & Agency',
      subtitle:
        'Eine Gruppe mit zwei operativen Motoren: Wir entwickeln eigene B2B-SaaS-Plattformen und realisieren schnelle Websites, lokale SEO und KI-Sprachagenten für Unternehmen im Tessin.',
      ctaPrimary: 'Produkte entdecken',
      ctaSecondary: 'Offerte anfordern',
      metrics: [
        { value: '10', label: 'Projektbereiche' },
        { value: '13', label: 'Indexierbare Projektseiten' },
        { value: '4', label: 'Sprachen: IT · DE · FR · EN' },
        { value: '90+', label: 'Lighthouse-Zielwert' },
      ],
      studioPreviewTitle: 'Dual-Engine-Architektur',
      studioPreviewSubtitle: 'Eigene Ventures & Kundenlösungen',
      engineSaasLabel: 'SaaS-Motor · 6 Plattformen',
      engineAgencyLabel: 'Agentur-Motor · Tessin & KI',
      statsBar: {
        activeUsersLabel: 'Aktive SaaS-Nutzer',
        activeUsersSub: 'Auf {count} aktiven Cloud-Plattformen',
        projectsDeliveredLabel: 'Gelieferte Projekte',
        projectsDeliveredSub: 'Websites, WebApps & KI in der CH',
        yearsExperienceLabel: 'Jahre Erfahrung',
        yearsExperienceSub: 'Seit 2018 · Studio in Lugano',
      },
    },
    dualEngine: {
      sectionTitle: 'Zwei Motoren, ein Engineering-Standard',
      sectionSubtitle:
        'Die in unseren SaaS-Produkten bewährte Technik fließt direkt in jedes Kundenprojekt – mit messbaren Zielen für Ladezeit, Conversion und Google-Rankings.',
      saasTitle: 'SaaS Venture Motor',
      saasTag: 'Eigene Produkte',
      saasDescription:
        'Spezialisierte Cloud-Software für Schweizer B2B-Lead-Generierung, automatisierte lokale SEO, KI-Social-Publishing und Branchen-Datenplattformen.',
      saasPoints: [
        'Direkter Cloud-Zugang mit produktiven Live-Metriken',
        'Vollständig intern durch GWD entwickelt',
        'Native Integration von Schweizer Branchen- und Geodaten',
      ],
      saasCta: 'SaaS-Portfolio ansehen',
      agencyTitle: 'Agentur & KI Motor',
      agencyTag: 'SitiTicino & Kundenprojekte',
      agencyDescription:
        'Hochleistungs-Websites, E-Commerce, lokale Sichtbarkeit im Tessin und KI-Telefonassistenten, die Anfragen rund um die Uhr in Buchungen verwandeln.',
      agencyPoints: [
        'Core Web Vitals konsequent im grünen Bereich',
        'Lokale Präsenz in Lugano, Bellinzona, Locarno und Mendrisio',
        'Branchenspezifische KI-Sprachagenten für Gastronomie & Salons',
      ],
      agencyCta: 'Kundenprojekte ansehen',
    },
    filterSection: {
      sectionTitle: 'Projekt- und Plattform-Ökosystem',
      sectionSubtitle:
        'Filtern Sie direkt zwischen unseren eigenen SaaS-Plattformen und ausgewählten Agentur-Referenzen.',
      all: 'Alle',
      saas: 'SaaS-Produkte',
      agency: 'Agentur-Projekte',
      countLabel: 'sichtbare Einträge',
      viewCard: 'Details öffnen',
      openPlatform: 'Plattform öffnen ↗',
      visitSite: 'Website besuchen',
      showTechStack: 'Tech-Stack & Tags',
      hideTechStack: 'Stack ausblenden',
      techStackHeading: 'Technologie-Stack',
      technicalTagsHeading: 'Technische Tags',
    },
    featuredSaas: {
      sectionTitle: 'Ausgewählte SaaS-Plattformen',
      sectionSubtitle:
        'Drei aktiv am Schweizer Markt betriebene Produkte mit direktem Zugang und verifizierten Kennzahlen.',
      viewAll: 'Alle 6 SaaS ansehen',
      openPlatform: 'Plattform öffnen ↗',
      technicalSheet: 'Produktdatenblatt',
    },
    caseStudies: {
      sectionTitle: 'Fallstudien: Herausforderung, Lösung, Ergebnis',
      sectionSubtitle:
        'Wechseln Sie zwischen Desktop- und Mobile-Vorschau, um Architektur, Tempo und wirtschaftlichen Effekt zu prüfen.',
      challengeLabel: 'Herausforderung',
      solutionLabel: 'Lösung',
      resultLabel: 'Ergebnis',
      desktopView: 'Desktop',
      mobileView: 'Mobil',
      viewCaseStudy: 'Fallstudie lesen',
      viewAllWorks: 'Alle Agentur-Projekte',
    },
    servicesSection: {
      sectionTitle: 'Wirkungsvolle Leistungen für das Tessin',
      sectionSubtitle:
        'Von schnellen Unternehmenswebsites über lokale Google-Optimierung bis zu KI-Sprachagenten mit 24/7-Erreichbarkeit.',
      exploreService: 'Leistung im Detail',
      aiRestaurantsCta: 'KI-Agenten Restaurants',
      aiSalonsCta: 'KI-Agenten Friseursalons',
    },
    socialProof: {
      sectionTitle: 'Kunden, Bewertungen & Tessiner Präsenz',
      sectionSubtitle:
        'Messbare Resultate bei lokalen KMU und digitalen Marken im gesamten Kanton Tessin.',
      clientsLabel: 'Betreute Marken & Partner',
      reviewsLabel: 'Verifizierte Kundenstimmen',
      zonesLabel: 'Abgedeckte Regionen im Tessin',
      zonesSubtitle: 'Wählen Sie eine Stadt für lokale SEO-Schwerpunkte und Referenzen.',
      exploreZone: 'Lokalen Fokus öffnen',
    },
    quickContact: {
      sectionTitle: 'Sprechen wir über Ihr Projekt',
      sectionSubtitle:
        'Füllen Sie das Kurzformular in unter 60 Sekunden aus oder reservieren Sie direkt einen Gesprächstermin mit unserem Team in Lugano.',
      whatsappDirect: 'Per WhatsApp schreiben ↗',
      whatsappSub: 'Schnelle Antwort auf Deutsch, Italienisch, Französisch oder Englisch',
      bookCallTitle: '20-Minuten-Call buchen',
      bookCallSub: 'Wählen Sie Tag und Zeitfenster für Ihre Projektanalyse.',
      selectDay: 'Bevorzugter Tag',
      selectSlot: 'Zeitfenster',
      confirmCall: 'Termin anfragen',
      callConfirmed: 'Termin vorgemerkt',
      responseTime: 'Durchschnittliche Antwortzeit: innerhalb von 4 Arbeitsstunden (Mo–Fr, Lugano)',
    },
    form: {
      nameLabel: 'Name & Unternehmen',
      namePlaceholder: 'z. B. Lukas Meier · Treuhand Lugano',
      emailLabel: 'Geschäftliche E-Mail',
      emailPlaceholder: 'lukas@firma.ch',
      needLabel: 'Wichtigstes Anliegen',
      needOptions: [
        'Neue High-Speed-Website oder Relaunch',
        'Lokale SEO im Tessin / Google-Ranking',
        'KI-Sprachagent (Restaurant / Salon / KMU)',
        'SaaS-Demo oder Partnerschaft',
      ],
      consentLabel: 'Ich akzeptiere die Datenschutzerklärung gemäß Schweizer nDSG und DSGVO.',
      submit: 'Offerte anfordern',
      submitting: 'Wird gesendet...',
      errorName: 'Bitte mindestens 2 Zeichen für Name oder Unternehmen eingeben.',
      errorEmail: 'Bitte eine gültige E-Mail-Adresse eingeben.',
      errorConsent: 'Bitte bestätigen Sie die nDSG / DSGVO-Einwilligung.',
      successTitle: 'Anfrage erfolgreich übermittelt',
      successBody:
        'Vielen Dank. Unser Team in Lugano meldet sich innerhalb von 4 Arbeitsstunden bei Ihnen.',
      reset: 'Weitere Anfrage senden',
    },
    productDetail: {
      backToHub: 'Zurück zu SaaS-Produkten',
      problemSolved: 'Gelöstes Problem',
      keyFeatures: '3 Kernfunktionen',
      targetAudience: 'Zielgruppe',
      interactivePreview: 'Interaktive Plattform-Vorschau',
      openPlatform: 'Plattform öffnen ↗',
      relatedProducts: 'Verwandte SaaS-Produkte',
      nextActionTitle: 'Möchten Sie dieses Tool in Ihrem Unternehmen einsetzen?',
      nextActionCta: 'Geführte Demo anfragen',
    },
    caseDetail: {
      backToHub: 'Zurück zu Kundenprojekten',
      clientSector: 'Kunde & Branche',
      challenge: 'Herausforderung',
      solution: 'Umgesetzte Lösung',
      results: 'Messbare Ergebnisse',
      previewTitle: 'Multi-Device-Vorschau',
      servicesUsed: 'Eingesetzte Leistungen',
      visitLiveSite: 'Live-Website besuchen ↗',
      similarProjectTitle: 'Möchten Sie ein ähnliches Projekt umsetzen?',
      similarProjectSub:
        'Wir planen Architektur, Design und lokale SEO exakt auf Ihre Geschäftsziele zugeschnitten.',
      similarProjectCta: 'Ähnliches Projekt anfragen',
      relatedWorks: 'Weitere passende Fallstudien',
    },
    serviceDetail: {
      allServices: 'Alle Leistungen',
      mainBenefit: 'Hauptnutzen',
      howItWorks: 'So funktioniert es in 3 Schritten',
      whatIncluded: 'Leistungsumfang',
      examplesTitle: 'Verknüpfte Fallstudien',
      faqTitle: 'Häufig gestellte Fragen',
      localTitle: 'Lokale Präsenz im Tessin',
      localSubtitle: 'Dedizierte Strategien und Keywords für jeden Tessiner Bezirk.',
      ctaQuote: 'Individuelle Offerte anfordern',
      aiVerticalsTitle: 'Branchenlösungen KI-Sprachagenten',
      appsSectionTag: 'SitiTicino.ch · Digitales Ökosystem',
      appsSectionTitle: 'Projekte / Apps',
      appsSectionSubtitle:
        'SaaS-Plattformen, KI-Tools und PWA-Web-Apps für Handwerker, Schweizer KMU, E-Commerce und lokale Betriebe.',
    },
    about: {
      title: 'Die Gruppe hinter GWD und SitiTicino',
      subtitle:
        'Wir verbinden die Produkt-DNA eines SaaS Venture Studios mit der lokalen Schlagkraft einer Tessiner Digitalagentur in Lugano.',
      groupStoryTitle: 'Ein integriertes Modell ohne Reibungsverluste',
      groupStoryBody:
        'GWD Group schließt die Lücke zwischen langsamen Kreativagenturen und rein abstrakten Softwarehäusern. Unsere eigenen produktiven SaaS-Systeme setzen den technischen Maßstab für jedes Kundenprojekt in der Schweiz.',
      brandsTitle: 'Markenarchitektur der Gruppe',
      gwdTitle: 'GWD · Digital Venture Studio',
      gwdDesc:
        'Produkt- und KI-Engineering: entwickelt und skaliert B2B-SaaS-Plattformen, Schweizer Daten-Pipelines und automatisierte Sprachagenten.',
      sitiTicinoTitle: 'SitiTicino · Agency & Local Growth',
      sitiTicinoDesc:
        'Unsere regionale Marke für Unternehmen in Lugano, Bellinzona, Locarno und Mendrisio: schnelle Websites, E-Commerce und lokale Google-Sichtbarkeit.',
      standardsTitle: 'Technische Standards & E-E-A-T Transparenz',
      standards: [
        { metric: '< 2.5 s', target: 'LCP Ladezeit', desc: 'Vorgeladene Assets und schlanke Auslieferung.' },
        { metric: '< 200 ms', target: 'INP Reaktionszeit', desc: 'Sofortiges Feedback auf mobilen Endgeräten.' },
        { metric: '< 0.1', target: 'CLS Stabilität', desc: 'Feste Containermaße ohne Layout-Verschiebungen.' },
        { metric: '90+', target: 'Lighthouse-Score', desc: 'Geprüft auf Performance, WCAG 2.2 AA und SEO.' },
      ],
      ctaTitle: 'Bereit für die Zusammenarbeit mit unserem Team in Lugano?',
      ctaButton: 'Projekt besprechen',
    },
    contactPage: {
      title: 'Kontakt · GWD Group Lugano',
      subtitle:
        'Schildern Sie uns Ihr Vorhaben. Sie erhalten noch am selben Arbeitstag eine fundierte technische Einschätzung.',
      directChannels: 'Direkte Schweizer Kontaktkanäle',
      phoneLabel: 'Schweizer Telefon',
      emailLabel: 'Direkte E-Mail',
      addressLabel: 'Standort',
      hoursLabel: 'Bürozeiten',
      hoursValue: 'Mo–Fr · 08:30 – 18:30 MEZ',
      responseTitle: 'Garantierte Antwortzeit',
      responseValue: 'Innerhalb von 4 Arbeitsstunden für Offerten und SaaS-Demos; sofort via WhatsApp tagsüber.',
      mapTitle: 'Lugano · Zentrum & Digital Hub',
      mapSubtitle: 'Persönliche Termine in Lugano oder per Video-Call für die ganze Schweiz.',
    },
    footer: {
      tagline: 'Digital Venture Studio & Agency Group — Eigene SaaS-Plattformen, High-Speed-Websites und KI-Sprachagenten.',
      address: 'Lugano',
      vat: 'GWD Group',
      navigationTitle: 'Sitemap',
      legalTitle: 'Rechtliches & nDSG',
      privacyLink: 'Datenschutz (nDSG / DSGVO)',
      cookieLink: 'Cookie-Einstellungen',
      languageTitle: 'Sprache',
      copyright: '© 2026 GWD Group (GWD + SitiTicino). Alle Rechte vorbehalten.',
    },
    whatsapp: {
      label: 'WhatsApp',
      ariaLabel: 'GWD Group auf WhatsApp kontaktieren',
    },
    cookieBanner: {
      title: 'Schutz Ihrer Privatsphäre (nDSG / DSGVO)',
      description:
        'Wir verwenden technisch notwendige Cookies für den Betrieb sowie – nur mit Ihrer ausdrücklichen Zustimmung – datenschutzfreundliche aggregierte Statistiken.',
      acceptAll: 'Alle akzeptieren',
      onlyNecessary: 'Nur notwendige',
      customize: 'Anpassen',
      savePreferences: 'Auswahl speichern',
      necessaryLabel: 'Technisch notwendige Cookies (immer aktiv)',
      analyticsLabel: 'Datenschutzfreundliche Statistiken',
    },
    seoUi: {
      homeLabel: 'Startseite',
      heroImageAlt: 'Digitales Ökosystem der GWD Group in Lugano: SaaS-Plattformen, Webentwicklung, lokale SEO Tessin und KI-Agenten',
      districtsLabel: 'Abgedeckte Gemeinden & Quartiere',
      industriesLabel: 'Lokale Schlüsselbranchen',
      serviceAngleLabel: 'Spezifischer Ansatz vor Ort',
      keywordsLabel: 'Fokussierte lokale Suchbegriffe',
      relatedServiceLabel: 'Verknüpfte Agenturleistung',
      sitiTicinoNetworkLabel: 'Regionales Netzwerk SitiTicino.ch',
    },
  },
  fr: {
    nav: {
      products: 'Produits',
      works: 'Projets',
      services: 'Services',
      about: 'À propos',
      contact: 'Contact',
      ctaHeader: 'Parler du projet',
      menuOpen: 'Ouvrir le menu',
      menuClose: 'Fermer le menu',
    },
    badges: {
      'live-saas': 'Live SaaS',
      'client-work': 'Client Work',
      'ai-division': 'Division IA',
    },
    hero: {
      eyebrow: 'GWD Group · Lugano, Suisse',
      title: 'Digital Venture Studio & Agency',
      subtitle:
        'Un groupe à double moteur : nous créons des plateformes SaaS B2B propriétaires et concevons des sites rapides, du SEO local et des agents vocaux IA pour les entreprises du Tessin.',
      ctaPrimary: 'Découvrir les produits',
      ctaSecondary: 'Demander un devis',
      metrics: [
        { value: '10', label: 'Domaines de projet' },
        { value: '13', label: 'Fiches indexables' },
        { value: '4', label: 'Langues : IT · DE · FR · EN' },
        { value: '90+', label: 'Objectif Lighthouse' },
      ],
      studioPreviewTitle: 'Architecture double moteur',
      studioPreviewSubtitle: 'Ventures internes & solutions clients',
      engineSaasLabel: 'Moteur SaaS · 6 Plateformes',
      engineAgencyLabel: 'Moteur Agence · Tessin & IA',
      statsBar: {
        activeUsersLabel: 'Utilisateurs SaaS actifs',
        activeUsersSub: 'Sur {count} plateformes cloud live',
        projectsDeliveredLabel: 'Projets livrés',
        projectsDeliveredSub: 'Sites, WebApps & IA en Suisse',
        yearsExperienceLabel: 'Années d’expérience',
        yearsExperienceSub: 'Depuis 2018 · Studio à Lugano',
      },
    },
    dualEngine: {
      sectionTitle: 'Deux moteurs, une même exigence technique',
      sectionSubtitle:
        'L’ingénierie éprouvée sur nos produits SaaS alimente chaque mandat client avec des objectifs mesurables de vitesse et de conversion.',
      saasTitle: 'Moteur Venture SaaS',
      saasTag: 'Produits propriétaires',
      saasDescription:
        'Logiciels cloud dédiés à la prospection B2B en Suisse, au SEO local automatisé, à la publication sociale IA et à la gestion de données sectorielles.',
      saasPoints: [
        'Accès cloud direct avec métriques opérationnelles réelles',
        'Architectures développées en interne par GWD',
        'Intégration native des données et annuaires suisses',
      ],
      saasCta: 'Explorer les actifs SaaS',
      agencyTitle: 'Moteur Agence & IA',
      agencyTag: 'SitiTicino & Projets Clients',
      agencyDescription:
        'Sites web ultra-rapides, e-commerce, référencement local au Tessin et secrétariats vocaux IA disponibles 24h/24 pour transformer chaque visite en contact.',
      agencyPoints: [
        'Core Web Vitals optimisés dans le vert',
        'Présence locale à Lugano, Bellinzona, Locarno et Mendrisio',
        'Agents vocaux IA spécialisés pour restaurants et salons',
      ],
      agencyCta: 'Explorer les réalisations',
    },
    filterSection: {
      sectionTitle: 'Écosystème projets et plateformes',
      sectionSubtitle:
        'Filtrez instantanément entre nos produits SaaS propriétaires et les projets livrés pour nos clients.',
      all: 'Tous',
      saas: 'Produits SaaS',
      agency: 'Projets agence',
      countLabel: 'fiches visibles',
      viewCard: 'Voir la fiche',
      openPlatform: 'Ouvrir la plateforme ↗',
      visitSite: 'Visiter le site',
      showTechStack: 'Stack & Tags techniques',
      hideTechStack: 'Masquer la stack',
      techStackHeading: 'Stack Technologique',
      technicalTagsHeading: 'Tags Techniques',
    },
    featuredSaas: {
      sectionTitle: 'Produits SaaS en vedette',
      sectionSubtitle:
        'Trois plateformes actives sur le marché suisse avec accès direct et résultats vérifiés.',
      viewAll: 'Voir les 6 SaaS',
      openPlatform: 'Ouvrir la plateforme ↗',
      technicalSheet: 'Fiche produit',
    },
    caseStudies: {
      sectionTitle: 'Études de cas : Défi, Solution, Résultat',
      sectionSubtitle:
        'Basculez entre les aperçus desktop et mobile pour vérifier la structure, la rapidité et l’impact commercial.',
      challengeLabel: 'Le défi',
      solutionLabel: 'La solution',
      resultLabel: 'Le résultat',
      desktopView: 'Desktop',
      mobileView: 'Mobile',
      viewCaseStudy: 'Lire l’étude de cas',
      viewAllWorks: 'Tous les projets agence',
    },
    servicesSection: {
      sectionTitle: 'Services à fort impact pour le Tessin',
      sectionSubtitle:
        'Du site vitrine performant au SEO local Google jusqu’aux agents vocaux IA répondant à chaque appel.',
      exploreService: 'Découvrir le service',
      aiRestaurantsCta: 'Agents IA Restaurants',
      aiSalonsCta: 'Agents IA Coiffeurs',
    },
    socialProof: {
      sectionTitle: 'Clients, avis Google et ancrage au Tessin',
      sectionSubtitle:
        'Nous accompagnons entreprises locales et marques digitales dans tout le canton avec des gains mesurables.',
      clientsLabel: 'Marques et clients accompagnés',
      reviewsLabel: 'Avis vérifiés au Tessin',
      zonesLabel: 'Zones desservies avec pages dédiées',
      zonesSubtitle: 'Sélectionnez une ville pour découvrir les mots-clés locaux et cas de référence.',
      exploreZone: 'Voir le focus local',
    },
    quickContact: {
      sectionTitle: 'Parlez-nous de votre projet',
      sectionSubtitle:
        'Remplissez ce formulaire court en moins de 60 secondes ou réservez un créneau d’appel avec notre équipe à Lugano.',
      whatsappDirect: 'Écrire sur WhatsApp ↗',
      whatsappSub: 'Réponse rapide en italien, allemand, français ou anglais',
      bookCallTitle: 'Réserver un appel de 20 min',
      bookCallSub: 'Choisissez le jour et le créneau pour analyser votre besoin.',
      selectDay: 'Jour souhaité',
      selectSlot: 'Créneau horaire',
      confirmCall: 'Confirmer le créneau',
      callConfirmed: 'Appel pré-réservé',
      responseTime: 'Délai moyen de réponse : sous 4 heures ouvrées (Lun–Ven, Lugano)',
    },
    form: {
      nameLabel: 'Nom et Entreprise',
      namePlaceholder: 'ex. Claire Rochat · Maison Lugano',
      emailLabel: 'E-mail professionnel',
      emailPlaceholder: 'claire@entreprise.ch',
      needLabel: 'Besoin principal',
      needOptions: [
        'Nouveau site web ou refonte haute performance',
        'Référencement SEO local au Tessin',
        'Agent vocal IA (Restaurant / Salon / PME)',
        'Démo ou partenariat plateformes SaaS',
      ],
      consentLabel: 'J’accepte la politique de confidentialité conforme à la nLPD suisse et au RGPD.',
      submit: 'Demander un devis',
      submitting: 'Envoi en cours...',
      errorName: 'Veuillez saisir au moins 2 caractères pour votre nom ou entreprise.',
      errorEmail: 'Veuillez saisir une adresse e-mail valide.',
      errorConsent: 'Veuillez confirmer votre accord nLPD / RGPD pour continuer.',
      successTitle: 'Demande enregistrée avec succès',
      successBody:
        'Merci pour votre message. Notre équipe à Lugano vous répondra sous 4 heures ouvrées.',
      reset: 'Envoyer une autre demande',
    },
    productDetail: {
      backToHub: 'Retour aux Produits SaaS',
      problemSolved: 'Problème résolu',
      keyFeatures: '3 fonctionnalités clés',
      targetAudience: 'Pour qui est conçu ce produit',
      interactivePreview: 'Aperçu interactif de la plateforme',
      openPlatform: 'Ouvrir la plateforme ↗',
      relatedProducts: 'Produits SaaS associés',
      nextActionTitle: 'Vous souhaitez déployer cet outil dans votre entreprise ?',
      nextActionCta: 'Demander une démo guidée',
    },
    caseDetail: {
      backToHub: 'Retour aux Projets Agence',
      clientSector: 'Client et secteur',
      challenge: 'Le défi',
      solution: 'La solution déployée',
      results: 'Résultats obtenus',
      previewTitle: 'Aperçu multi-appareils',
      servicesUsed: 'Services mobilisés',
      visitLiveSite: 'Visiter le site live ↗',
      similarProjectTitle: 'Vous souhaitez un projet similaire ?',
      similarProjectSub:
        'Nous concevons l’architecture technique, l’UI et le SEO local selon vos objectifs commerciaux.',
      similarProjectCta: 'Vous voulez un projet similaire ?',
      relatedWorks: 'Autres études de cas similaires',
    },
    serviceDetail: {
      allServices: 'Tous les services',
      mainBenefit: 'Bénéfice principal',
      howItWorks: 'Comment ça marche en 3 étapes',
      whatIncluded: 'Ce qui est inclus',
      examplesTitle: 'Exemples et études de cas liés',
      faqTitle: 'Questions fréquentes',
      localTitle: 'Positionnement local au Tessin',
      localSubtitle: 'Stratégies et contenus dédiés pour chaque pôle cantonal.',
      ctaQuote: 'Demander un devis personnalisé',
      aiVerticalsTitle: 'Solutions verticales Agents IA vocaux',
      appsSectionTag: 'SitiTicino.ch · Écosystème numérique',
      appsSectionTitle: 'Projets / Apps',
      appsSectionSubtitle:
        'Plateformes SaaS, outils IA et WebApps PWA conçus pour les artisans, PME suisses, e-commerçants et commerces locaux.',
    },
    about: {
      title: 'Le groupe derrière GWD et SitiTicino',
      subtitle:
        'Nous unissons la rigueur d’un Venture Studio SaaS et l’efficacité terrain d’une agence digitale ancrée à Lugano.',
      groupStoryTitle: 'Un modèle intégré, sans intermédiaires',
      groupStoryBody:
        'GWD Group comble le fossé entre les agences traditionnelles lentes et les éditeurs logiciels éloignés des PME locales. Nos propres SaaS imposent un niveau d’exigence technique appliqué à chaque projet client au Tessin.',
      brandsTitle: 'Architecture des marques du groupe',
      gwdTitle: 'GWD · Digital Venture Studio',
      gwdDesc:
        'Le pôle produit et ingénierie IA : conçoit, lance et fait évoluer des plateformes SaaS B2B et des moteurs d’automatisation vocale.',
      sitiTicinoTitle: 'SitiTicino · Agency & Local Growth',
      sitiTicinoDesc:
        'La marque dédiée aux entreprises de Lugano, Bellinzona, Locarno et Mendrisio : sites rapides, e-commerce et SEO cantonal.',
      standardsTitle: 'Standards techniques & transparence E-E-A-T',
      standards: [
        { metric: '< 2.5 s', target: 'Chargement LCP', desc: 'Ressources optimisées et rendu immédiat.' },
        { metric: '< 200 ms', target: 'Réactivité INP', desc: 'Interactions fluides sur mobile et desktop.' },
        { metric: '< 0.1', target: 'Stabilité CLS', desc: 'Dimensions fixes garantissant zéro décalage.' },
        { metric: '90+', target: 'Score Lighthouse', desc: 'Audit continu performance, WCAG 2.2 AA et SEO.' },
      ],
      ctaTitle: 'Prêt à collaborer avec notre équipe à Lugano ?',
      ctaButton: 'Parler de votre projet',
    },
    contactPage: {
      title: 'Contact · GWD Group Lugano',
      subtitle:
        'Présentez-nous votre objectif. Nous revenons vers vous le jour même avec une analyse claire.',
      directChannels: 'Canaux directs en Suisse',
      phoneLabel: 'Téléphone suisse',
      emailLabel: 'E-mail direct',
      addressLabel: 'Bureaux',
      hoursLabel: 'Horaires',
      hoursValue: 'Lun–Ven · 08:30 – 18:30 CET',
      responseTitle: 'Délais de réponse garantis',
      responseValue: 'Sous 4 heures ouvrées pour devis et démos SaaS ; réponse rapide sur WhatsApp en journée.',
      mapTitle: 'Lugano · Centre & Pôle Digital',
      mapSubtitle: 'Rendez-vous sur place à Lugano ou en visioconférence dans toute la Suisse.',
    },
    footer: {
      tagline: 'Digital Venture Studio & Agency Group — Plateformes SaaS propriétaires, sites web performants et agents vocaux IA.',
      address: 'Lugano',
      vat: 'GWD Group',
      navigationTitle: 'Plan du site',
      legalTitle: 'Conformité & Légal',
      privacyLink: 'Confidentialité (nLPD / RGPD)',
      cookieLink: 'Préférences Cookies',
      languageTitle: 'Langue',
      copyright: '© 2026 GWD Group (GWD + SitiTicino). Tous droits réservés.',
    },
    whatsapp: {
      label: 'WhatsApp',
      ariaLabel: 'Contacter GWD Group sur WhatsApp',
    },
    cookieBanner: {
      title: 'Respect de votre vie privée (nLPD / RGPD)',
      description:
        'Nous utilisons des cookies techniques indispensables et, uniquement avec votre accord explicite, des statistiques agrégées respectueuses de la loi suisse.',
      acceptAll: 'Tout accepter',
      onlyNecessary: 'Nécessaires uniquement',
      customize: 'Personnaliser',
      savePreferences: 'Enregistrer',
      necessaryLabel: 'Cookies techniques nécessaires (toujours actifs)',
      analyticsLabel: 'Statistiques agrégées sans suivi invasif',
    },
    seoUi: {
      homeLabel: 'Accueil',
      heroImageAlt: 'Écosystème digital GWD Group à Lugano : plateformes SaaS, développement web, SEO local Tessin et agents IA',
      districtsLabel: 'Communes et quartiers couverts',
      industriesLabel: 'Secteurs clés locaux',
      serviceAngleLabel: 'Approche dédiée au territoire',
      keywordsLabel: 'Requêtes locales ciblées',
      relatedServiceLabel: 'Service agence associé',
      sitiTicinoNetworkLabel: 'Réseau territorial SitiTicino.ch',
    },
  },
  en: {
    nav: {
      products: 'Products',
      works: 'Works',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      ctaHeader: 'Discuss your project',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    badges: {
      'live-saas': 'Live SaaS',
      'client-work': 'Client Work',
      'ai-division': 'AI Division',
    },
    hero: {
      eyebrow: 'GWD Group · Lugano, Switzerland',
      title: 'Digital Venture Studio & Agency',
      subtitle:
        'One group powered by two engines: we build proprietary B2B SaaS platforms while delivering high-speed websites, local SEO, and AI voice agents for businesses across Ticino.',
      ctaPrimary: 'Explore products',
      ctaSecondary: 'Request a quote',
      metrics: [
        { value: '10', label: 'Project areas' },
        { value: '13', label: 'Indexable project pages' },
        { value: '4', label: 'Languages: IT · DE · FR · EN' },
        { value: '90+', label: 'Lighthouse target' },
      ],
      studioPreviewTitle: 'Dual-engine architecture',
      studioPreviewSubtitle: 'Internal ventures & client builds',
      engineSaasLabel: 'SaaS Engine · 6 Platforms',
      engineAgencyLabel: 'Agency Engine · Ticino & AI',
      statsBar: {
        activeUsersLabel: 'Active SaaS users',
        activeUsersSub: 'Across {count} live cloud platforms',
        projectsDeliveredLabel: 'Projects delivered',
        projectsDeliveredSub: 'Web, SaaS & AI builds across CH',
        yearsExperienceLabel: 'Years of experience',
        yearsExperienceSub: 'Since 2018 · Lugano Studio',
      },
    },
    dualEngine: {
      sectionTitle: 'Two engines, one engineering standard',
      sectionSubtitle:
        'The same product engineering behind our proprietary SaaS powers every agency client engagement with measurable speed and conversion targets.',
      saasTitle: 'SaaS Venture Engine',
      saasTag: 'Proprietary products',
      saasDescription:
        'Focused cloud software for Swiss B2B lead generation, automated local SEO, AI social publishing, and vertical data intelligence.',
      saasPoints: [
        'Direct cloud access backed by live operational metrics',
        'Architected and maintained in-house by GWD',
        'Native Swiss business directory and geo-data pipelines',
      ],
      saasCta: 'Explore SaaS assets',
      agencyTitle: 'Agency & AI Engine',
      agencyTag: 'SitiTicino & Client Works',
      agencyDescription:
        'High-speed websites, e-commerce, Ticino Google ranking, and 24/7 AI voice receptionists built to turn local traffic into booked revenue.',
      agencyPoints: [
        'Core Web Vitals engineered into the green zone',
        'Dedicated local coverage for Lugano, Bellinzona, Locarno & Mendrisio',
        'Vertical AI voice agents for restaurants and hair salons',
      ],
      agencyCta: 'Explore client works',
    },
    filterSection: {
      sectionTitle: 'Project & platform ecosystem',
      sectionSubtitle:
        'Filter instantaneously between proprietary SaaS assets and agency client builds without reloading.',
      all: 'All',
      saas: 'SaaS Products',
      agency: 'Agency Works',
      countLabel: 'visible entries',
      viewCard: 'Open sheet',
      openPlatform: 'Open platform ↗',
      visitSite: 'Visit website',
      showTechStack: 'Tech Stack & Tags',
      hideTechStack: 'Hide stack',
      techStackHeading: 'Technology Stack',
      technicalTagsHeading: 'Technical Tags',
    },
    featuredSaas: {
      sectionTitle: 'Featured SaaS platforms',
      sectionSubtitle:
        'Three live platforms operating across Switzerland with direct launch access and verified metrics.',
      viewAll: 'View all 6 SaaS',
      openPlatform: 'Open platform ↗',
      technicalSheet: 'Product sheet',
    },
    caseStudies: {
      sectionTitle: 'Case studies: Challenge, Solution, Result',
      sectionSubtitle:
        'Inspect interactive desktop and mobile previews to verify responsive architecture, speed, and commercial outcomes.',
      challengeLabel: 'Challenge',
      solutionLabel: 'Solution',
      resultLabel: 'Result',
      desktopView: 'Desktop',
      mobileView: 'Mobile',
      viewCaseStudy: 'Read case study',
      viewAllWorks: 'All agency works',
    },
    servicesSection: {
      sectionTitle: 'High-impact services for Ticino',
      sectionSubtitle:
        'From sub-second corporate websites and local Google SEO to 24/7 AI voice receptionists.',
      exploreService: 'Explore service',
      aiRestaurantsCta: 'AI Agents Restaurants',
      aiSalonsCta: 'AI Agents Hair Salons',
    },
    socialProof: {
      sectionTitle: 'Clients, Google reviews & Ticino footprint',
      sectionSubtitle:
        'Trusted by local SMEs and digital brands across Canton Ticino with verifiable search and booking gains.',
      clientsLabel: 'Clients & group brands',
      reviewsLabel: 'Verified Ticino reviews',
      zonesLabel: 'Dedicated Ticino service hubs',
      zonesSubtitle: 'Select a city to inspect localized SEO keywords and reference work.',
      exploreZone: 'View local focus',
    },
    quickContact: {
      sectionTitle: 'Discuss your project',
      sectionSubtitle:
        'Complete the 4-field brief in under 60 seconds or reserve a 20-minute technical call with our Lugano team.',
      whatsappDirect: 'Message on WhatsApp ↗',
      whatsappSub: 'Fast response in Italian, German, French, or English',
      bookCallTitle: 'Book a 20-minute call',
      bookCallSub: 'Pick your preferred day and time slot.',
      selectDay: 'Preferred day',
      selectSlot: 'Time slot',
      confirmCall: 'Reserve call slot',
      callConfirmed: 'Call slot reserved',
      responseTime: 'Average response time: within 4 business hours (Mon–Fri, Lugano)',
    },
    form: {
      nameLabel: 'Name & Company',
      namePlaceholder: 'e.g. Elena Rossi · Studio Lugano',
      emailLabel: 'Work email',
      emailPlaceholder: 'elena@company.ch',
      needLabel: 'Primary goal',
      needOptions: [
        'New high-performance website or redesign',
        'Local SEO visibility in Ticino',
        'AI Voice Agent (Restaurant / Salon / SME)',
        'SaaS platform demo or partnership',
      ],
      consentLabel: 'I accept the privacy policy compliant with Swiss FADP (nLPD) and GDPR.',
      submit: 'Request quote',
      submitting: 'Sending...',
      errorName: 'Please enter at least 2 characters for your name or company.',
      errorEmail: 'Please enter a valid email address.',
      errorConsent: 'Please confirm Swiss FADP / GDPR consent to proceed.',
      successTitle: 'Inquiry received',
      successBody:
        'Thank you. Our Lugano engineering and strategy team will reply within 4 business hours.',
      reset: 'Send another inquiry',
    },
    productDetail: {
      backToHub: 'Back to SaaS Products',
      problemSolved: 'Problem solved',
      keyFeatures: '3 key capabilities',
      targetAudience: 'Built for',
      interactivePreview: 'Interactive platform preview',
      openPlatform: 'Open platform ↗',
      relatedProducts: 'Related SaaS products',
      nextActionTitle: 'Ready to deploy this platform for your team?',
      nextActionCta: 'Request a guided demo',
    },
    caseDetail: {
      backToHub: 'Back to Agency Works',
      clientSector: 'Client & sector',
      challenge: 'The challenge',
      solution: 'The solution',
      results: 'Measured results',
      previewTitle: 'Multi-device preview',
      servicesUsed: 'Services delivered',
      visitLiveSite: 'Visit live website ↗',
      similarProjectTitle: 'Want a similar build for your business?',
      similarProjectSub:
        'We architect performance, design, and local search visibility around your exact conversion targets.',
      similarProjectCta: 'Want a similar project?',
      relatedWorks: 'Related case studies',
    },
    serviceDetail: {
      allServices: 'All services',
      mainBenefit: 'Primary outcome',
      howItWorks: 'How it works in 3 steps',
      whatIncluded: 'What is included',
      examplesTitle: 'Connected case studies',
      faqTitle: 'Frequently asked questions',
      localTitle: 'Ticino local search positioning',
      localSubtitle: 'Tailored strategies and keywords for each cantonal hub.',
      ctaQuote: 'Request dedicated quote',
      aiVerticalsTitle: 'Vertical AI Voice Agent solutions',
      appsSectionTag: 'SitiTicino.ch · Digital Ecosystem',
      appsSectionTitle: 'Projects / Apps',
      appsSectionSubtitle:
        'Proprietary SaaS platforms, AI tools, and PWA web apps built for Swiss trades, SMEs, e-commerce sellers, and local venues.',
    },
    about: {
      title: 'The group behind GWD and SitiTicino',
      subtitle:
        'Combining the product discipline of a SaaS Venture Studio with the execution speed of a Lugano-rooted digital agency.',
      groupStoryTitle: 'An integrated model with zero handoff friction',
      groupStoryBody:
        'GWD Group bridges the gap between slow traditional agencies and remote software vendors. Our live SaaS platforms set the engineering bar applied directly to every client build across Ticino and Switzerland.',
      brandsTitle: 'Group brand architecture',
      gwdTitle: 'GWD · Digital Venture Studio',
      gwdDesc:
        'Our product & AI engineering unit: designs, ships, and scales proprietary B2B SaaS products, Swiss data pipelines, and conversational voice agents.',
      sitiTicinoTitle: 'SitiTicino · Agency & Local Growth',
      sitiTicinoDesc:
        'Our regional growth brand serving Lugano, Bellinzona, Locarno, and Mendrisio with fast websites, e-commerce, and local SEO.',
      standardsTitle: 'Technical benchmarks & E-E-A-T transparency',
      standards: [
        { metric: '< 2.5 s', target: 'LCP Load Speed', desc: 'Optimized hero media and zero render blocking.' },
        { metric: '< 200 ms', target: 'INP Responsiveness', desc: 'Lightweight components and instant touch feedback.' },
        { metric: '< 0.1', target: 'CLS Stability', desc: 'Explicit container dimensions for zero layout shift.' },
        { metric: '90+', target: 'Lighthouse Score', desc: 'Verified performance, WCAG 2.2 AA accessibility, and SEO.' },
      ],
      ctaTitle: 'Ready to work with our Lugano team?',
      ctaButton: 'Discuss your project',
    },
    contactPage: {
      title: 'Contact · GWD Group Lugano',
      subtitle:
        'Tell us what you want to launch or optimize. We reply the same business day with a clear technical assessment.',
      directChannels: 'Direct Swiss channels',
      phoneLabel: 'Swiss phone',
      emailLabel: 'Direct email',
      addressLabel: 'Lugano office',
      hoursLabel: 'Office hours',
      hoursValue: 'Mon–Fri · 08:30 – 18:30 CET',
      responseTitle: 'Guaranteed response times',
      responseValue: 'Within 4 business hours for quotes and SaaS demos; immediate via WhatsApp during daytime hours.',
      mapTitle: 'Lugano · Center & Digital Hub',
      mapSubtitle: 'In-person meetings in Lugano or video consultations across Switzerland.',
    },
    footer: {
      tagline: 'Digital Venture Studio & Agency Group — Proprietary SaaS platforms, high-performance websites, and AI voice agents.',
      address: 'Lugano',
      vat: 'GWD Group',
      navigationTitle: 'Sitemap',
      legalTitle: 'Compliance & Legal',
      privacyLink: 'Privacy Policy (Swiss FADP / GDPR)',
      cookieLink: 'Cookie Preferences',
      languageTitle: 'Language',
      copyright: '© 2026 GWD Group (GWD + SitiTicino). All rights reserved.',
    },
    whatsapp: {
      label: 'WhatsApp',
      ariaLabel: 'Contact GWD Group on WhatsApp',
    },
    cookieBanner: {
      title: 'Your privacy matters (Swiss FADP / GDPR)',
      description:
        'We use strictly necessary technical cookies and, only with your explicit consent, privacy-respecting aggregated analytics.',
      acceptAll: 'Accept all',
      onlyNecessary: 'Necessary only',
      customize: 'Customize',
      savePreferences: 'Save preferences',
      necessaryLabel: 'Strictly necessary cookies (always active)',
      analyticsLabel: 'Privacy-first aggregated analytics',
    },
    seoUi: {
      homeLabel: 'Home',
      heroImageAlt: 'GWD Group digital ecosystem in Lugano: proprietary SaaS platforms, web development, Ticino local SEO, and AI agents',
      districtsLabel: 'Districts & municipalities served',
      industriesLabel: 'Key local industries',
      serviceAngleLabel: 'Tailored regional strategy',
      keywordsLabel: 'Target local search queries',
      relatedServiceLabel: 'Connected agency service',
      sitiTicinoNetworkLabel: 'SitiTicino.ch regional network',
    },
  },
};
