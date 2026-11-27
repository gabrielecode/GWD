import { LocalizedText, LocalizedStringList } from '../types/showcase';

export interface RoadmapMilestone {
  id: string;
  quarter: LocalizedText;
  status: 'completed' | 'in-progress' | 'upcoming';
  title: LocalizedText;
  description: LocalizedText;
  features: LocalizedStringList;
}

export interface ProductRoadmapData {
  milestones: RoadmapMilestone[];
  upcomingRelease: LocalizedText;
}

export const PRODUCT_ROADMAPS: Record<string, ProductRoadmapData> = {
  'swiss-lead-finder': {
    upcomingRelease: {
      it: 'Versione 3.2 · Q2 2026',
      de: 'Version 3.2 · Q2 2026',
      fr: 'Version 3.2 · Q2 2026',
      en: 'Version 3.2 · Q2 2026',
    },
    milestones: [
      {
        id: 'm1',
        quarter: { it: 'Q3 2024', de: 'Q3 2024', fr: 'Q3 2024', en: 'Q3 2024' },
        status: 'completed',
        title: {
          it: 'Scraping Registri CH & Core Engine',
          de: 'Schweizer Register-Scraping & Core Engine',
          fr: 'Scraping Registres CH & Core Engine',
          en: 'Swiss Registry Scraping & Core Engine',
        },
        description: {
          it: 'Indicizzazione iniziale di 48.000+ aziende svizzere con filtri per Cantone e codice NOGA.',
          de: 'Erste Indizierung von 48.000+ Schweizer Firmen mit Kantons- und NOGA-Filtern.',
          fr: 'Indexation initiale de 48 000+ entreprises suisses avec filtres cantonaux et NOGA.',
          en: 'Initial indexing of 48,000+ Swiss companies with canton and NOGA code filters.',
        },
        features: {
          it: ['Database 26 Cantoni', 'Filtri settore NOGA', 'Export CSV rapido'],
          de: ['Datenbank 26 Kantone', 'NOGA-Branchenfilter', 'Schneller CSV-Export'],
          fr: ['Base 26 cantons', 'Filtres secteur NOGA', 'Export CSV rapide'],
          en: ['26 Canton database', 'NOGA industry filters', 'Fast CSV export'],
        },
      },
      {
        id: 'm2',
        quarter: { it: 'Q4 2024', de: 'Q4 2024', fr: 'Q4 2024', en: 'Q4 2024' },
        status: 'completed',
        title: {
          it: 'Audit Automatico Web & Core Web Vitals',
          de: 'Automatisierter Web- & Core-Web-Vitals-Check',
          fr: 'Audit Automatique Web & Core Web Vitals',
          en: 'Automated Web & Core Web Vitals Audit',
        },
        description: {
          it: 'Integrazione del motore di analisi per rilevare HTTPS, velocità mobile e schede Google incomplete.',
          de: 'Integration des Analyse-Moduls für HTTPS, Mobilgeschwindigkeit und Google-Einträge.',
          fr: 'Intégration du moteur d’analyse pour détecter HTTPS, vitesse mobile et fiches Google.',
          en: 'Integration of analysis engine to detect HTTPS, mobile speed, and incomplete Google listings.',
        },
        features: {
          it: ['Verifica HTTPS istantanea', 'Test LCP / CLS mobile', 'Score di ottimizzazione'],
          de: ['Sofortiger HTTPS-Check', 'Mobile LCP / CLS Tests', 'Optimierungs-Score'],
          fr: ['Vérification HTTPS instantanée', 'Tests LCP / CLS mobile', 'Score d’optimisation'],
          en: ['Instant HTTPS check', 'Mobile LCP / CLS tests', 'Optimization scoring'],
        },
      },
      {
        id: 'm3',
        quarter: { it: 'Q1–Q2 2025', de: 'Q1–Q2 2025', fr: 'Q1–Q2 2025', en: 'Q1–Q2 2025' },
        status: 'in-progress',
        title: {
          it: 'Sincronizzazione CRM & Webhook Diretti',
          de: 'CRM-Synchronisation & Direkte Webhooks',
          fr: 'Synchronisation CRM & Webhooks Directs',
          en: 'CRM Synchronization & Direct Webhooks',
        },
        description: {
          it: 'Connettori nativi per HubSpot, Salesforce e flussi webhook personalizzati per agenzie commerciali.',
          de: 'Native Konnektoren für HubSpot, Salesforce und benutzerdefinierte Webhook-Flows.',
          fr: 'Connecteurs natifs pour HubSpot, Salesforce et flux webhooks personnalisés.',
          en: 'Native connectors for HubSpot, Salesforce, and custom webhook streams for sales agencies.',
        },
        features: {
          it: ['HubSpot & Pipedrive sync', 'Webhook in tempo reale', 'Notifiche lead caldi'],
          de: ['HubSpot & Pipedrive Sync', 'Echtzeit-Webhooks', 'Hot-Lead-Benachrichtigungen'],
          fr: ['Sync HubSpot & Pipedrive', 'Webhooks en temps réel', 'Alertes leads chauds'],
          en: ['HubSpot & Pipedrive sync', 'Real-time webhooks', 'Hot lead alerts'],
        },
      },
      {
        id: 'm4',
        quarter: { it: 'Q3–Q4 2025', de: 'Q3–Q4 2025', fr: 'Q3–Q4 2025', en: 'Q3–Q4 2025' },
        status: 'upcoming',
        title: {
          it: 'AI Outreach Copilot & Email Scoring',
          de: 'KI-Outreach-Copilot & E-Mail-Scoring',
          fr: 'AI Outreach Copilot & Scoring Email',
          en: 'AI Outreach Copilot & Email Scoring',
        },
        description: {
          it: 'Generazione automatica di sequenze email personalizzate basate sui punti deboli riscontrati nell’audit.',
          de: 'Automatische Erstellung personalisierter E-Mail-Sequenzen basierend auf Audit-Schwachstellen.',
          fr: 'Génération automatique de séquences d’emails personnalisées basées sur les failles de l’audit.',
          en: 'Automated generation of tailored outreach sequences based on website audit weaknesses.',
        },
        features: {
          it: ['Email multilingua IT/DE/FR/EN', 'A/B testing sequenze', 'Analisi tassi risposta'],
          de: ['Mehrsprachige E-Mails IT/DE/FR/EN', 'Sequenz-A/B-Testing', 'Antwortraten-Analyse'],
          fr: ['Emails multilingues IT/DE/FR/EN', 'A/B testing séquences', 'Analyse taux de réponse'],
          en: ['Multilingual email IT/DE/FR/EN', 'Sequence A/B testing', 'Response rate analytics'],
        },
      },
    ],
  },
  'rankuplist': {
    upcomingRelease: {
      it: 'Versione 2.8 · Q2 2026',
      de: 'Version 2.8 · Q2 2026',
      fr: 'Version 2.8 · Q2 2026',
      en: 'Version 2.8 · Q2 2026',
    },
    milestones: [
      {
        id: 'm1',
        quarter: { it: 'Q2 2024', de: 'Q2 2024', fr: 'Q2 2024', en: 'Q2 2024' },
        status: 'completed',
        title: {
          it: 'Sincronizzazione NAP & Directory CH',
          de: 'NAP-Sync & Schweizer Verzeichnisse',
          fr: 'Sync NAP & Annuaires CH',
          en: 'NAP Sync & Swiss Directories',
        },
        description: {
          it: 'Centralizzazione di nome, indirizzo e telefono su oltre 35 portali svizzeri e Google Business.',
          de: 'Zentralisierung von Name, Adresse und Telefon auf 35+ Schweizer Portalen und Google Business.',
          fr: 'Centralisation nom, adresse et téléphone sur 35+ portails suisses et Google Business.',
          en: 'Centralization of business records across 35+ Swiss portals and Google Business Profile.',
        },
        features: {
          it: ['Controllo coerenza dati', 'Rilevamento duplicati', 'Aggiornamento 1-clic'],
          de: ['Datenkonsistenzprüfung', 'Dubletten-Erkennung', '1-Klick-Aktualisierung'],
          fr: ['Contrôle de cohérence', 'Détection des doublons', 'Mise à jour en 1 clic'],
          en: ['Data consistency check', 'Duplicate detection', '1-click updates'],
        },
      },
      {
        id: 'm2',
        quarter: { it: 'Q4 2024', de: 'Q4 2024', fr: 'Q4 2024', en: 'Q4 2024' },
        status: 'completed',
        title: {
          it: 'Map Pack Rank Tracker per Quartiere',
          de: 'Map Pack Rank Tracker nach Stadtteil',
          fr: 'Suivi Map Pack par Quartier',
          en: 'Neighborhood Map Pack Rank Tracker',
        },
        description: {
          it: 'Monitoraggio granulare delle posizioni su Google Maps da Lugano, Bellinzona, Locarno e Mendrisio.',
          de: 'Granulares Tracking von Google-Maps-Positionen aus Lugano, Bellinzona, Locarno und Mendrisio.',
          fr: 'Suivi granulaire des positions Google Maps depuis Lugano, Bellinzona, Locarno et Mendrisio.',
          en: 'Granular rank tracking across Google Maps from Lugano, Bellinzona, Locarno, and Mendrisio.',
        },
        features: {
          it: ['Griglia posizioni locali', 'Confronto competitor', 'Storico visibilità +64%'],
          de: ['Lokales Positionen-Grid', 'Mitbewerber-Vergleich', 'Sichtbarkeits-Historie +64%'],
          fr: ['Grille de positions locales', 'Comparaison concurrents', 'Historique visibilité +64%'],
          en: ['Local position grid', 'Competitor benchmarking', 'Visibility history +64%'],
        },
      },
      {
        id: 'm3',
        quarter: { it: 'Q2 2025', de: 'Q2 2025', fr: 'Q2 2025', en: 'Q2 2025' },
        status: 'in-progress',
        title: {
          it: 'AI Review & Reputation Response Engine',
          de: 'KI-Bewertungs- & Reputations-Engine',
          fr: 'Moteur IA de Réponses aux Avis',
          en: 'AI Review & Reputation Response Engine',
        },
        description: {
          it: 'Generazione automatica di risposte professionali multilingua alle recensioni Google con tone of voice personalizzato.',
          de: 'Automatische Generierung professioneller mehrsprachiger Antworten auf Google-Bewertungen.',
          fr: 'Génération automatique de réponses professionnelles multilingues aux avis Google.',
          en: 'Automated generation of professional multilingual replies to Google reviews with brand voice tuning.',
        },
        features: {
          it: ['Risposte IT/DE/FR/EN', 'Sentiment analysis recensioni', 'Approvazione rapida'],
          de: ['Antworten IT/DE/FR/EN', 'Sentiment-Analyse', 'Schnellfreigabe'],
          fr: ['Réponses IT/DE/FR/EN', 'Analyse de sentiment', 'Validation rapide'],
          en: ['Multilingual replies IT/DE/FR/EN', 'Review sentiment analysis', 'Fast approval flow'],
        },
      },
      {
        id: 'm4',
        quarter: { it: 'Q4 2025', de: 'Q4 2025', fr: 'Q4 2025', en: 'Q4 2025' },
        status: 'upcoming',
        title: {
          it: 'White-Label Agency Client Dashboard',
          de: 'White-Label-Agentur-Dashboard',
          fr: 'Dashboard Agence White-Label',
          en: 'White-Label Agency Client Dashboard',
        },
        description: {
          it: 'Portale brandizzato per web agency ticinesi per mostrare report SEO in tempo reale ai propri clienti finali.',
          de: 'Branding-Portal für Tessiner Webagenturen zur Darstellung von SEO-Berichten für Endkunden.',
          fr: 'Portail personnalisé pour les agences web tessinoises afin de partager des rapports SEO aux clients finaux.',
          en: 'Branded client reporting portal for Ticino web agencies to display live SEO metrics to SMEs.',
        },
        features: {
          it: ['Logo agenzia personalizzato', 'Report PDF automatici', 'Accesso cliente protetto'],
          de: ['Eigenes Agentur-Logo', 'Automatische PDF-Berichte', 'Geschützter Kundenzugang'],
          fr: ['Logo agence personnalisé', 'Rapports PDF auto', 'Accès client sécurisé'],
          en: ['Custom agency branding', 'Automated PDF reports', 'Secured client logins'],
        },
      },
    ],
  },
  'sititicino-geoboost': {
    upcomingRelease: {
      it: 'Versione 2.0 · Q3 2026',
      de: 'Version 2.0 · Q3 2026',
      fr: 'Version 2.0 · Q3 2026',
      en: 'Version 2.0 · Q3 2026',
    },
    milestones: [
      {
        id: 'm1',
        quarter: { it: 'Q1 2024', de: 'Q1 2024', fr: 'Q1 2024', en: 'Q1 2024' },
        status: 'completed',
        title: {
          it: 'Matrice Territoriale 4 Distretti Ticinesi',
          de: 'Gebietsmatrix 4 Tessiner Bezirke',
          fr: 'Matrice Territoriale 4 Districts',
          en: '4-District Ticino Matrix Engine',
        },
        description: {
          it: 'Strutturazione di pagine geografiche differenziate per Lugano, Bellinzona, Locarno e Mendrisio.',
          de: 'Strukturierung differenzierter Standortseiten für Lugano, Bellinzona, Locarno und Mendrisio.',
          fr: 'Structuration de pages géolocalisées uniques pour Lugano, Bellinzona, Locarno et Mendrisio.',
          en: 'Structuring of genuinely differentiated geo-pages for Lugano, Bellinzona, Locarno, and Mendrisio.',
        },
        features: {
          it: ['Zero contenuti duplicati', 'Dati locali autentici', 'Link contestuali SitiTicino'],
          de: ['Keine doppelten Inhalte', 'Authentische lokale Daten', 'Kontextuelle Links'],
          fr: ['Zéro contenu dupliqué', 'Données locales authentiques', 'Liens contextuels'],
          en: ['Zero duplicate content', 'Authentic local proofs', 'Contextual SitiTicino links'],
        },
      },
      {
        id: 'm2',
        quarter: { it: 'Q3 2024', de: 'Q3 2024', fr: 'Q3 2024', en: 'Q3 2024' },
        status: 'completed',
        title: {
          it: 'Validazione Schema.org & JSON-LD',
          de: 'Schema.org- & JSON-LD-Validierung',
          fr: 'Validation Schema.org & JSON-LD',
          en: 'Schema.org & JSON-LD Validation',
        },
        description: {
          it: 'Generazione automatica di markup LocalBusiness, Breadcrumb e FAQ per rich snippet Google.',
          de: 'Automatische Generierung von LocalBusiness-, Breadcrumb- und FAQ-Markup für Google Rich Snippets.',
          fr: 'Génération automatique de balisage LocalBusiness, Breadcrumb et FAQ pour rich snippets.',
          en: 'Automated LocalBusiness, Breadcrumb, and FAQ schema markup generation for Google rich snippets.',
        },
        features: {
          it: ['Markup LocalBusiness validato', 'FAQ rich snippet attive', 'Breadcrumb strutturate'],
          de: ['Validiertes LocalBusiness-Markup', 'Aktive FAQ-Snippets', 'Strukturierte Breadcrumbs'],
          fr: ['Balisage LocalBusiness validé', 'Rich snippets FAQ actifs', 'Fil d’Ariane structuré'],
          en: ['Validated LocalBusiness schema', 'Active FAQ rich snippets', 'Structured breadcrumbs'],
        },
      },
      {
        id: 'm3',
        quarter: { it: 'Q2 2025', de: 'Q2 2025', fr: 'Q2 2025', en: 'Q2 2025' },
        status: 'in-progress',
        title: {
          it: 'Hyper-Local Backlink Syndicate CH',
          de: 'Hyper-Lokales Backlink-Syndikat CH',
          fr: 'Syndicat de Backlinks Hyper-Locaux CH',
          en: 'Hyper-Local Swiss Backlink Syndicate',
        },
        description: {
          it: 'Rete di scambi editoriali verificati tra portali locali del Canton Ticino per rafforzare l’autorità di dominio.',
          de: 'Netzwerk verifizierter redaktioneller Verweise zwischen Tessiner Portalen zur Domain-Autorität.',
          fr: 'Réseau d’échanges éditoriaux vérifiés entre portails locaux du Tessin pour renforcer l’autorité.',
          en: 'Network of verified editorial citations across Canton Ticino portals to build robust domain authority.',
        },
        features: {
          it: ['Backlink editoriali CH', 'Controllo anchor text', 'Crescita organica protetta'],
          de: ['Redaktionelle CH-Backlinks', 'Ankertext-Kontrolle', 'Geschütztes organisches Wachstum'],
          fr: ['Backlinks éditoriaux CH', 'Contrôle des ancres', 'Croissance organique protégée'],
          en: ['Editorial Swiss backlinks', 'Anchor text governance', 'Protected organic growth'],
        },
      },
      {
        id: 'm4',
        quarter: { it: 'Q1 2026', de: 'Q1 2026', fr: 'Q1 2026', en: 'Q1 2026' },
        status: 'upcoming',
        title: {
          it: 'AI Local Intent & Voice Search Optimizer',
          de: 'KI Local Intent & Voice Search Optimizer',
          fr: 'Optimiseur Vocal & Local Intent IA',
          en: 'AI Local Intent & Voice Search Optimizer',
        },
        description: {
          it: 'Adattamento automatico dei contenuti per le ricerche vocali di Siri, Google Assistant e query conversazionali geolocalizzate.',
          de: 'Automatische Inhaltsanpassung für Sprachsuche von Siri, Google Assistant und lokale Suchanfragen.',
          fr: 'Adaptation automatique des contenus pour la recherche vocale Siri, Google Assistant et requêtes locales.',
          en: 'Automatic content adaptation for Siri, Google Assistant voice searches and geo-conversational queries.',
        },
        features: {
          it: ['Ottimizzazione query vocali', 'FAQ conversazionali', 'Analisi intent geografico'],
          de: ['Sprachabfrage-Optimierung', 'Konversationelle FAQs', 'Geo-Intent-Analyse'],
          fr: ['Optimisation requêtes vocales', 'FAQ conversationnelles', 'Analyse d’intention géographique'],
          en: ['Voice query optimization', 'Conversational FAQs', 'Geo-intent keyword mapping'],
        },
      },
    ],
  },
  'auto-social-publisher': {
    upcomingRelease: {
      it: 'Versione 2.1 · Q3 2026',
      de: 'Version 2.1 · Q3 2026',
      fr: 'Version 2.1 · Q3 2026',
      en: 'Version 2.1 · Q3 2026',
    },
    milestones: [
      {
        id: 'm1',
        quarter: { it: 'Q3 2024', de: 'Q3 2024', fr: 'Q3 2024', en: 'Q3 2024' },
        status: 'completed',
        title: {
          it: 'Pipeline AI Quadrilingue (IT/DE/FR/EN)',
          de: 'Viersprachige KI-Pipeline (IT/DE/FR/EN)',
          fr: 'Pipeline IA Quadrilingue (IT/DE/FR/EN)',
          en: 'Quad-Language AI Pipeline (IT/DE/FR/EN)',
        },
        description: {
          it: 'Generazione simultanea di post social e aggiornamenti Google Business in 4 lingue native a partire da un singolo brief.',
          de: 'Gleichzeitige Generierung von Social-Beiträgen und Google-Updates in 4 nativen Sprachen.',
          fr: 'Génération simultanée de posts sociaux et actus Google Business en 4 langues natives.',
          en: 'Simultaneous generation of social posts and Google Business updates in 4 native languages.',
        },
        features: {
          it: ['Traduzione contestuale svizzera', 'Tone of voice personalizzabile', 'Adattamento LinkedIn/Instagram'],
          de: ['Schweizer Kontext-Übersetzung', 'Anpassbare Tonalität', 'LinkedIn/Instagram-Anpassung'],
          fr: ['Traduction contextuelle suisse', 'Ton de voix personnalisable', 'Adaptation LinkedIn/Instagram'],
          en: ['Swiss context translation', 'Custom tone of voice', 'LinkedIn & Instagram formats'],
        },
      },
      {
        id: 'm2',
        quarter: { it: 'Q1 2025', de: 'Q1 2025', fr: 'Q1 2025', en: 'Q1 2025' },
        status: 'completed',
        title: {
          it: 'Coda di Approvazione 1-Clic & Scheduler',
          de: '1-Klick-Freigabe-Queue & Scheduler',
          fr: 'File d’Approbation 1-Clic & Planificateur',
          en: '1-Click Approval Queue & Scheduler',
        },
        description: {
          it: 'Interfaccia calendario unificata per rivedere, modificare e pubblicare un intero mese di contenuti in 10 minuti.',
          de: 'Einheitliche Kalenderoberfläche zum Prüfen, Bearbeiten und Veröffentlichen eines Monats.',
          fr: 'Interface de calendrier unifiée pour relire, éditer et publier un mois entier en 10 minutes.',
          en: 'Unified calendar console to review, edit, and queue an entire month of posts in 10 minutes.',
        },
        features: {
          it: ['Calendario drag-and-drop', 'Anteprima post per canale', 'Approvazione rapida team'],
          de: ['Drag-and-Drop-Kalender', 'Kanal-Vorschau', 'Schnelle Team-Freigabe'],
          fr: ['Calendrier drag-and-drop', 'Aperçu par canal', 'Validation rapide en équipe'],
          en: ['Drag-and-drop calendar', 'Per-channel post preview', 'Fast team sign-off'],
        },
      },
      {
        id: 'm3',
        quarter: { it: 'Q3 2025', de: 'Q3 2025', fr: 'Q3 2025', en: 'Q3 2025' },
        status: 'in-progress',
        title: {
          it: 'AI Image & Carousel Brand Generator',
          de: 'KI-Bild- & Karussell-Brand-Generator',
          fr: 'Générateur IA d’Images & Carrousels',
          en: 'AI Image & Carousel Brand Generator',
        },
        description: {
          it: 'Creazione automatica di grafiche coordinate con i colori e il logo del brand per Instagram e LinkedIn.',
          de: 'Automatische Erstellung von Grafiken im Corporate Design für Instagram und LinkedIn.',
          fr: 'Création automatique de visuels aux couleurs et au logo de la marque pour Instagram et LinkedIn.',
          en: 'Automated generation of brand-aligned graphics and carousels for Instagram and LinkedIn.',
        },
        features: {
          it: ['Template grafici coordinati', 'Generazione immagini AI', 'Palette colori brand'],
          de: ['Koordiniert Grafik-Templates', 'KI-Bildgenerierung', 'Marken-Farbpalette'],
          fr: ['Templates graphiques cordonnés', 'Génération d’images IA', 'Palette de couleurs marque'],
          en: ['Coordinated graphic templates', 'AI image rendering', 'Brand color palettes'],
        },
      },
      {
        id: 'm4',
        quarter: { it: 'Q2 2026', de: 'Q2 2026', fr: 'Q2 2026', en: 'Q2 2026' },
        status: 'upcoming',
        title: {
          it: 'Analytics & UTM ROI Attribution Engine',
          de: 'Analytics & UTM ROI Attribution Engine',
          fr: 'Moteur d’Attribution UTM & ROI Analytics',
          en: 'Analytics & UTM ROI Attribution Engine',
        },
        description: {
          it: 'Tracciamento completo delle conversioni e delle vendite generate dai post social pubblicati automaticamente.',
          de: 'Vollständiges Tracking von Conversions und Verkäufen aus automatisch veröffentlichten Posts.',
          fr: 'Suivi complet des conversions et ventes générées par les publications automatiques.',
          en: 'End-to-end tracking of website leads and sales generated from automated social campaigns.',
        },
        features: {
          it: ['Parametri UTM automatici', 'Dashboard conversioni', 'Report ROI mensile'],
          de: ['Automatische UTM-Parameter', 'Conversion-Dashboard', 'Monats-ROI-Bericht'],
          fr: ['Paramètres UTM automatiques', 'Dashboard conversions', 'Rapport ROI mensuel'],
          en: ['Automated UTM tagging', 'Conversion attribution dashboard', 'Monthly ROI reports'],
        },
      },
    ],
  },
  'karepet': {
    upcomingRelease: {
      it: 'Versione 3.0 · Q3 2026',
      de: 'Version 3.0 · Q3 2026',
      fr: 'Version 3.0 · Q3 2026',
      en: 'Version 3.0 · Q3 2026',
    },
    milestones: [
      {
        id: 'm1',
        quarter: { it: 'Q4 2023', de: 'Q4 2023', fr: 'Q4 2023', en: 'Q4 2023' },
        status: 'completed',
        title: {
          it: 'Passaporto Sanitario Mobile & QR Code',
          de: 'Mobiler Gesundheitspass & QR-Code',
          fr: 'Passeport Santé Mobile & QR Code',
          en: 'Mobile Health Passport & QR Code',
        },
        description: {
          it: 'Lancio della web app PWA per proprietari con scheda di emergenza accessibile istantaneamente tramite QR.',
          de: 'Start der PWA-Web-App für Tierhalter mit sofort über QR abrufbarem Notfallprofil.',
          fr: 'Lancement de la PWA web app pour propriétaires avec fiche d’urgence accessible par QR.',
          en: 'Launch of pet owner PWA web app with instant emergency medical profile via scannable QR tag.',
        },
        features: {
          it: ['Scheda emergenza &lt; 1.2s', 'Anagrafica microchip', 'PWA installabile senza store'],
          de: ['Notfallkarte &lt; 1.2s', 'Mikrochip-Stammdaten', 'PWA ohne Store installierbar'],
          fr: ['Fiche d’urgence &lt; 1.2s', 'Données puce', 'PWA installable sans store'],
          en: ['Emergency load &lt; 1.2s', 'Microchip registry', 'Storeless PWA install'],
        },
      },
      {
        id: 'm2',
        quarter: { it: 'Q2 2024', de: 'Q2 2024', fr: 'Q2 2024', en: 'Q2 2024' },
        status: 'completed',
        title: {
          it: 'Promemoria Vaccini & Archivio Referti',
          de: 'Impf-Erinnerungen & Befund-Archiv',
          fr: 'Rappels Vaccins & Archive de Rapports',
          en: 'Vaccine Reminders & Lab Vault',
        },
        description: {
          it: 'Sistema di notifiche automatiche prima delle scadenze di profilassi e archiviazione sicura dei documenti clinici.',
          de: 'Automatische Benachrichtigungen vor Prophylaxe-Fristen und sichere Archivierung von Befunden.',
          fr: 'Système d’alertes automatiques avant les échéances et archivage sécurisé des documents.',
          en: 'Automated notification system ahead of prophylactic deadlines and secure clinical document storage.',
        },
        features: {
          it: ['Alert scadenze vaccinali', 'Archivio referti PDF', 'Conformità nLPD svizzera'],
          de: ['Impf-Fristen-Alerts', 'PDF-Befundarchiv', 'Schweizer nDSG-Konformität'],
          fr: ['Alertes échéances vaccins', 'Archive PDF', 'Conformité nLPD suisse'],
          en: ['Booster deadline alerts', 'PDF lab report vault', 'Swiss FADP compliance'],
        },
      },
      {
        id: 'm3',
        quarter: { it: 'Q1 2025', de: 'Q1 2025', fr: 'Q1 2025', en: 'Q1 2025' },
        status: 'in-progress',
        title: {
          it: 'Integrazione Cliniche Veterinarie B2B',
          de: 'Integration Tierarztpraxen B2B',
          fr: 'Intégration Cliniques Vétérinaires B2B',
          en: 'Veterinary Clinic B2B Portal',
        },
        description: {
          it: 'Portale dedicato per studi veterinari per aggiornare direttamente la cartella clinica digitale del paziente.',
          de: 'Spezielles Portal für Tierarztpraxen zur direkten Aktualisierung der digitalen Patientenakte.',
          fr: 'Portail dédié aux cliniques vétérinaires pour mettre à jour directement le dossier médical.',
          en: 'Dedicated portal for veterinary clinics to update patient digital records directly in real time.',
        },
        features: {
          it: ['Accesso protetto veterinario', 'Aggiornamento prescrizioni', 'Condivisione storico visite'],
          de: ['Geschützter Tierarzt-Zugang', 'Rezeptur-Aktualisierung', 'Besuchsverlauf teilen'],
          fr: ['Accès vétérinaire sécurisé', 'Mise à jour ordonnances', 'Partage historique'],
          en: ['Secured vet portal', 'Prescription updates', 'Visit history sharing'],
        },
      },
      {
        id: 'm4',
        quarter: { it: 'Q3 2025', de: 'Q3 2025', fr: 'Q3 2025', en: 'Q3 2025' },
        status: 'upcoming',
        title: {
          it: 'BARF Diet Calculator & AI Nutritionist',
          de: 'BARF-Ernährungsrechner & KI-Ernährungsberater',
          fr: 'Calculateur BARF & Nutritionniste IA',
          en: 'BARF Diet Calculator & AI Nutritionist',
        },
        description: {
          it: 'Calcolatore nutrizionale avanzato per diete BARF e consigli alimentari personalizzati in base a razza, età e livello di attività.',
          de: 'Erweiterter Ernährungsrechner für BARF-Diäten und personalisierte Futtermpfehlungen.',
          fr: 'Calculateur nutritionnel avancé pour régimes BARF et conseils personnalisés selon la race.',
          en: 'Advanced nutritional calculator for BARF diets and tailored feeding plans by breed, age, and activity.',
        },
        features: {
          it: ['Calcolo grammature BARF', 'Piani nutrizionali personalizzati', 'Consigli allergie alimentari'],
          de: ['BARF-Gramm-Berechnung', 'Personalisierte Ernährungspläne', 'Allergie-Tipps'],
          fr: ['Calcul portions BARF', 'Plans nutritionnels sur mesure', 'Conseils allergies'],
          en: ['BARF portion calculation', 'Personalized nutrition plans', 'Food allergy guidelines'],
        },
      },
    ],
  },
  'ata-school-scraper': {
    upcomingRelease: {
      it: 'Versione 2.0 · Q2 2026',
      de: 'Version 2.0 · Q2 2026',
      fr: 'Version 2.0 · Q2 2026',
      en: 'Version 2.0 · Q2 2026',
    },
    milestones: [
      {
        id: 'm1',
        quarter: { it: 'Q1 2024', de: 'Q1 2024', fr: 'Q1 2024', en: 'Q1 2024' },
        status: 'completed',
        title: {
          it: 'Scraping 1.800+ Istituti & Albi Scolastici',
          de: 'Scraping 1.800+ Institute & Schwarze Bretter',
          fr: 'Scraping 1.800+ Établissements & Tableaux',
          en: 'Crawling 1.800+ Schools & Notice Boards',
        },
        description: {
          it: 'Indicizzazione automatica giornaliera di oltre 1.800 siti scolastici italiani per bandi e interpelli.',
          de: 'Tägliche automatische Indizierung von über 1.800 italienischen Schulwebsites für Ausschreibungen.',
          fr: 'Indexation quotidienne automatique de plus de 1 800 sites scolaires pour les appels d’offres.',
          en: 'Automated daily crawling of 1,800+ school websites and public notice boards for recruitment calls.',
        },
        features: {
          it: ['Monitoraggio 1.800+ scuole', 'Controllo albi online', 'Aggiornamento h24'],
          de: ['Überwachung von 1.800+ Schulen', 'Online-Aushang-Check', '24h-Aktualisierung'],
          fr: ['Suivi de 1 800+ écoles', 'Vérification tableautins', 'Mise à jour 24h/24'],
          en: ['1,800+ school monitoring', 'Online notice board check', '24/7 crawling frequency'],
        },
      },
      {
        id: 'm2',
        quarter: { it: 'Q3 2024', de: 'Q3 2024', fr: 'Q3 2024', en: 'Q3 2024' },
        status: 'completed',
        title: {
          it: 'AI PDF Tabular Parser & Extractor',
          de: 'KI-PDF-Tabellen-Parser & Extraktor',
          fr: 'Extracteur & Parser Tabulaire PDF par IA',
          en: 'AI PDF Tabular Parser & Extractor',
        },
        description: {
          it: 'Estrazione intelligente di graduatorie, punteggi e scadenze direttamente da documenti PDF non strutturati.',
          de: 'Intelligente Extraktion von Ranglisten, Punkten und Fristen aus unstrukturierten PDF-Dokumenten.',
          fr: 'Extraction intelligente des classements, scores et échéances directement depuis des PDF non structurés.',
          en: 'Intelligent extraction of rankings, scores, and deadlines directly from unstructured PDF notices.',
        },
        features: {
          it: ['Precisione parsing 99.4%', 'Estrazione tabelle PDF', 'Rilevamento scadenze critiche'],
          de: ['Parser-Genauigkeit 99.4%', 'PDF-Tabellen-Extraktion', 'Erkennung kritischer Fristen'],
          fr: ['Précision extraction 99.4%', 'Extraction tableaux PDF', 'Détection échéances critiques'],
          en: ['99.4% parsing accuracy', 'PDF table data extraction', 'Critical deadline detection'],
        },
      },
      {
        id: 'm3',
        quarter: { it: 'Q2 2025', de: 'Q2 2025', fr: 'Q2 2025', en: 'Q2 2025' },
        status: 'in-progress',
        title: {
          it: 'Alert Telegram & Push Istantanei',
          de: 'Telegram- & Push-Sofort-Alerts',
          fr: 'Alertes Telegram & Push Instantanées',
          en: 'Instant Telegram & Push Alerts',
        },
        description: {
          it: 'Invio di notifiche push e messaggi Telegram personalizzati per provincia e profilo entro 5 minuti dalla pubblicazione.',
          de: 'Versand von Push-Benachrichtigungen und Telegram-Nachrichten nach Provinz binnen 5 Minuten.',
          fr: 'Envoi de notifications push et messages Telegram personnalisés par province sous 5 minutes.',
          en: 'Dispatch of push notifications and tailored Telegram alerts by province within 5 minutes of release.',
        },
        features: {
          it: ['Notifiche Telegram &lt; 5 min', 'Filtri per provincia e profilo', 'Canali preferiti custom'],
          de: ['Telegram-Alerts &lt; 5 min', 'Filter nach Provinz und Profil', 'Benutzerdefinierte Kanäle'],
          fr: ['Alertes Telegram &lt; 5 min', 'Filtres par province et profil', 'Canaux personnalisés'],
          en: ['Telegram alerts &lt; 5 min', 'Province & profile filters', 'Custom notification channels'],
        },
      },
      {
        id: 'm4',
        quarter: { it: 'Q1 2026', de: 'Q1 2026', fr: 'Q1 2026', en: 'Q1 2026' },
        status: 'upcoming',
        title: {
          it: 'AI Application Assistant & Auto-Submit',
          de: 'KI-Bewerbungsassistent & Auto-Submit',
          fr: 'Assistant de Candidature IA & Auto-Submit',
          en: 'AI Application Assistant & Auto-Submit',
        },
        description: {
          it: 'Compilazione assistita e invio guidato delle domande di messa a disposizione (MAD) per gli istituti scolastici.',
          de: 'Unterstütztes Ausfüllen und geführter Versand von Verfügbarkeitsanfragen (MAD) an Bildungseinrichtungen.',
          fr: 'Remplissage assisté et envoi guidé des demandes de mise à disposition (MAD) pour les écoles.',
          en: 'Guided preparation and direct submission assistant for school availability notices and applications.',
        },
        features: {
          it: ['Compilazione MAD guidata', 'Archivio moduli personali', 'Tracciamento invii'],
          de: ['Geführtes MAD-Ausfüllen', 'Persönliches Formular-Archiv', 'Versand-Tracking'],
          fr: ['Remplissage MAD guidé', 'Archive de formulaires', 'Suivi des envois'],
          en: ['Guided MAD generation', 'Personal document vault', 'Application tracking dashboard'],
        },
      },
    ],
  },
};
