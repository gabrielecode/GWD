import { ServiceItem, TestimonialItem, TicinoCityProfile } from '../types/showcase';

export const SERVICES: ServiceItem[] = [
  {
    slug: 'siti-web',
    accentType: 'agency',
    title: {
      it: 'Siti Web ad Alte Prestazioni',
      de: 'High-Performance Websites',
      fr: 'Sites Web Haute Performance',
      en: 'High-Performance Websites',
    },
    shortTitle: {
      it: 'Siti Web',
      de: 'Websites',
      fr: 'Sites Web',
      en: 'Websites',
    },
    subtitle: {
      it: 'Architetture veloci, accessibili e pensate per trasformare le visite locali in contatti reali.',
      de: 'Schnelle, barrierefreie Architekturen, die lokale Besucher in qualifizierte Anfragen verwandeln.',
      fr: 'Architectures rapides et accessibles conçues pour convertir les visites locales en contacts qualifiés.',
      en: 'Fast, accessible web architectures built to turn local search traffic into qualified inquiries.',
    },
    mainBenefit: {
      it: 'Caricamento sotto i 2.5 secondi, Core Web Vitals tutti in verde e percorsi di contatto chiari su smartphone (dove arriva oltre il 60% del traffico ticinese).',
      de: 'Ladezeiten unter 2,5 Sekunden, grüne Core Web Vitals und klare Kontaktpfade auf dem Smartphone.',
      fr: 'Chargement sous 2,5 secondes, Core Web Vitals au vert et parcours de contact fluides sur mobile.',
      en: 'Sub-2.5s load times, green Core Web Vitals across the board, and frictionless mobile conversion paths.',
    },
    steps: [
      {
        stepNumber: '01',
        title: {
          it: 'Audit obiettivi & architettura',
          de: 'Ziel-Audit & Informationsarchitektur',
          fr: 'Audit objectifs & architecture',
          en: 'Goal audit & architecture',
        },
        description: {
          it: 'Definiamo mappa del sito, parole chiave locali e azioni di conversione entro 3 clic.',
          de: 'Wir definieren Sitemap, lokale Keywords und klare Conversion-Pfade in maximal 3 Klicks.',
          fr: 'Définition de l’arborescence, des mots-clés locaux et des actions en 3 clics maximum.',
          en: 'Define sitemap, local search terms, and conversion actions reachable within 3 clicks.',
        },
      },
      {
        stepNumber: '02',
        title: {
          it: 'Design UI scuro o su misura & codice leggero',
          de: 'Maßgeschneidertes UI-Design & schlanker Code',
          fr: 'Design UI sur mesure & code léger',
          en: 'Tailored UI design & lean build',
        },
        description: {
          it: 'Costruiamo interfacce con zero librerie superflue, contrasto WCAG 2.2 AA e anteprime multi-dispositivo.',
          de: 'Wir bauen Interfaces ohne Ballast, mit WCAG 2.2 AA Kontrast und Multi-Device-Tests.',
          fr: 'Interfaces sans scripts superflus, contraste WCAG 2.2 AA et aperçu multi-écrans.',
          en: 'Build interfaces free of bloatware, compliant with WCAG 2.2 AA contrast and mobile-first ergonomics.',
        },
      },
      {
        stepNumber: '03',
        title: {
          it: 'Lancio, Lighthouse 90+ e tracciamento',
          de: 'Launch, Lighthouse 90+ & Tracking',
          fr: 'Mise en ligne, Lighthouse 90+ & mesure',
          en: 'Launch, 90+ Lighthouse & tracking',
        },
        description: {
          it: 'Pubblicazione sicura, configurazione Search Console, nLPD/GDPR e monitoraggio conversioni.',
          de: 'Sicherer Go-Live, Search-Console-Setup, nDSG/DSGVO-Konformität und Conversion-Messung.',
          fr: 'Déploiement sécurisé, Search Console, conformité nLPD/RGPD et suivi des conversions.',
          en: 'Secure rollout, Search Console setup, Swiss FADP/GDPR compliance, and conversion measurement.',
        },
      },
    ],
    includedItems: {
      it: [
        'Struttura responsive 12 colonne desktop / 1 colonna mobile',
        'Moduli contatto brevi con protezione anti-spam e consenso nLPD',
        'Pulsante WhatsApp e tracciamento eventi privacy-first',
        'Supporto multilingua IT / DE / FR / EN con tag hreflang',
      ],
      de: [
        'Responsive 12-Spalten-Desktop / 1-Spalten-Mobil-Raster',
        'Schlanke Kontaktformulare mit Spam-Schutz und nDSG-Einwilligung',
        'WhatsApp-Direktkontakt und datenschutzfreundliches Event-Tracking',
        'Mehrsprachigkeit IT / DE / FR / EN mit sauberem hreflang-Setup',
      ],
      fr: [
        'Grille responsive 12 colonnes desktop / 1 colonne mobile',
        'Formulaires courts avec protection anti-spam et consentement nLPD',
        'Bouton WhatsApp et suivi d’événements respectueux de la vie privée',
        'Support multilingue IT / DE / FR / EN avec balises hreflang',
      ],
      en: [
        '12-column desktop / 1-column mobile responsive grid',
        'Short 4-field lead forms with anti-spam and FADP/GDPR consent',
        'Floating WhatsApp deep link and privacy-first event tracking',
        'Multilingual IT / DE / FR / EN architecture with hreflang links',
      ],
    },
    relatedCaseSlugs: ['reverse-editing', 'aurora-adv', 'dj-magix'],
    faqs: [
      {
        question: {
          it: 'In quanto tempo viene consegnato un nuovo sito?',
          de: 'Wie schnell wird eine neue Website geliefert?',
          fr: 'Quel est le délai de livraison d’un nouveau site ?',
          en: 'How long does it take to launch a new website?',
        },
        answer: {
          it: 'Un sito aziendale strutturato richiede in media 3–5 settimane dall’allineamento iniziale al collaudo Lighthouse.',
          de: 'Eine strukturierte Unternehmenswebsite benötigt im Schnitt 3–5 Wochen bis zur finalen Lighthouse-Abnahme.',
          fr: 'Un site d’entreprise structuré est livré en 3 à 5 semaines entre le brief initial et l’audit Lighthouse.',
          en: 'A structured corporate website typically ships in 3–5 weeks from architecture alignment to final Lighthouse verification.',
        },
      },
      {
        question: {
          it: 'Il sito sarà aggiornabile senza modificare il design?',
          de: 'Lassen sich Inhalte später ohne Design-Änderungen pflegen?',
          fr: 'Le site reste-t-il facile à mettre à jour sans casser le design ?',
          en: 'Can we add new projects or offers without changing the design?',
        },
        answer: {
          it: 'Sì: progettiamo strutture dati centralizzate così ogni nuovo caso studio o prodotto eredita automaticamente layout e SEO.',
          de: 'Ja: Durch zentrale Datenstrukturen erbt jede neue Referenz automatisch Layout und SEO-Struktur.',
          fr: 'Oui : nos catalogues centralisés appliquent automatiquement la mise en page et le SEO à chaque nouvelle fiche.',
          en: 'Yes: centralized content catalogs ensure new products or case studies automatically inherit layout and SEO metadata.',
        },
      },
      {
        question: {
          it: 'Come viene gestito il preventivo e la proprietà di dominio e codice?',
          de: 'Wie sind Offerte sowie Eigentum an Domain und Code geregelt?',
          fr: 'Comment sont gérés le devis ainsi que la propriété du domaine et du code ?',
          en: 'How are pricing and ownership of the domain and codebase handled?',
        },
        answer: {
          it: 'Ogni progetto parte da un preventivo trasparente a fasi fisse; dominio, hosting svizzero e codice sorgente restano al 100% di proprietà della tua azienda.',
          de: 'Jedes Projekt basiert auf einer transparenten Fixpreis-Offerte; Domain, Schweizer Hosting und Quellcode bleiben zu 100 % Eigentum Ihres Unternehmens.',
          fr: 'Chaque mandat repose sur un devis transparent par phases ; le nom de domaine, l’hébergement suisse et le code restent à 100 % votre propriété.',
          en: 'Every build starts with a fixed-scope milestone quote; your domain, Swiss hosting, and source code remain 100% owned by your business.',
        },
      },
    ],
    targetKeywords: {
      it: ['web agency Lugano', 'siti web Ticino', 'sviluppo web veloce Svizzera'],
      de: ['Webagentur Lugano', 'Websites Tessin', 'Webentwicklung Schweiz'],
      fr: ['agence web Lugano', 'sites web Tessin', 'création site rapide Suisse'],
      en: ['web agency Lugano', 'websites Ticino', 'fast web development Switzerland'],
    },
  },
  {
    slug: 'ecommerce',
    accentType: 'agency',
    title: {
      it: 'E-commerce & Booking Diretto',
      de: 'E-Commerce & Direktbuchung',
      fr: 'E-commerce & Réservation Directe',
      en: 'E-Commerce & Direct Booking',
    },
    shortTitle: {
      it: 'E-commerce',
      de: 'E-Commerce',
      fr: 'E-commerce',
      en: 'E-commerce',
    },
    subtitle: {
      it: 'Piattaforme di vendita e prenotazione senza attriti, ottimizzate per pagamenti svizzeri e conversione mobile.',
      de: 'Reibungslose Verkaufs- und Buchungssysteme optimiert für Schweizer Zahlungsarten und Mobilnutzung.',
      fr: 'Plateformes de vente et réservation fluides optimisées pour les paiements suisses et le mobile.',
      en: 'Frictionless commerce and booking storefronts engineered for Swiss payment methods and mobile checkout.',
    },
    mainBenefit: {
      it: 'Riduci le commissioni verso portali terzi e aumenta il valore medio dell’ordine con schede prodotto chiare e checkout rapido.',
      de: 'Reduzieren Sie Plattform-Provisionen und steigern Sie Direktabschlüsse durch klaren mobilen Checkout.',
      fr: 'Réduisez les commissions d’intermédiaires et augmentez vos ventes directes via un tunnel mobile rapide.',
      en: 'Cut third-party marketplace commissions and lift direct conversion rates with clear pricing and fast mobile checkout.',
    },
    steps: [
      {
        stepNumber: '01',
        title: {
          it: 'Catalogo e flusso d’acquisto',
          de: 'Katalog- & Checkout-Architektur',
          fr: 'Catalogue & parcours d’achat',
          en: 'Catalog & checkout flow',
        },
        description: {
          it: 'Rimuoviamo i passaggi superflui tra scoperta del prodotto/soggiorno e conferma ordine.',
          de: 'Wir eliminieren unnötige Zwischenschritte zwischen Produktauswahl und Bestellbestätigung.',
          fr: 'Suppression des frictions entre la fiche produit/séjour et la confirmation de paiement.',
          en: 'Strip away unnecessary steps between product or date selection and confirmed payment.',
        },
      },
      {
        stepNumber: '02',
        title: {
          it: 'Pagamenti svizzeri e multivaluta',
          de: 'Schweizer Zahlungen & Mehrwährung',
          fr: 'Paiements suisses & multidevise',
          en: 'Swiss payments & multi-currency',
        },
        description: {
          it: 'Integrazione con TWINT, carte di credito, Apple Pay e fatturazione CHF/EUR.',
          de: 'Integration von TWINT, Kreditkarten, Apple Pay und CHF/EUR-Abrechnung.',
          fr: 'Intégration TWINT, cartes, Apple Pay et facturation fluide en CHF/EUR.',
          en: 'Native checkout support for TWINT, major cards, Apple Pay, and CHF/EUR pricing.',
        },
      },
      {
        stepNumber: '03',
        title: {
          it: 'Automazione conferme e upsell',
          de: 'Automatisierte Bestätigungen',
          fr: 'Automatisation des confirmations',
          en: 'Automated confirmations',
        },
        description: {
          it: 'Email transazionali, notifiche WhatsApp e sincronizzazione con gestionali.',
          de: 'Transaktionsmails, WhatsApp-Hinweise und Anbindung an Ihre Warenwirtschaft.',
          fr: 'E-mails transactionnels, alertes WhatsApp et synchronisation gestion.',
          en: 'Transactional emails, WhatsApp order updates, and inventory/calendar synchronization.',
        },
      },
    ],
    includedItems: {
      it: [
        'Integrazione pagamenti TWINT, Stripe, PostFinance',
        'Schede prodotto indicizzabili con Schema Product / Offer',
        'Gestione lingue IT / DE / FR / EN per vendere in tutta la Svizzera',
        'Ottimizzazione velocità carrello e checkout mobile',
      ],
      de: [
        'Integration von TWINT, Stripe und PostFinance',
        'Indexierbare Produktseiten mit Product- & Offer-Schema',
        'Mehrsprachiger Verkauf IT / DE / FR / EN in die ganze Schweiz',
        'Geschwindigkeitsoptimierung für mobilen Warenkorb & Checkout',
      ],
      fr: [
        'Intégration paiements TWINT, Stripe et PostFinance',
        'Fiches produits indexables avec balisage Schema Product',
        'Vente quadrilingue IT / DE / FR / EN sur toute la Suisse',
        'Optimisation vitesse du panier et du tunnel mobile',
      ],
      en: [
        'TWINT, Stripe, and PostFinance payment support',
        'Indexable product pages with Product / Offer structured data',
        '4-language storefront support across all Swiss regions',
        'Sub-second mobile cart and checkout interactions',
      ],
    },
    relatedCaseSlugs: ['reverse-editing-shop', 'il-vicolo-lugano', 'salviapet'],
    faqs: [
      {
        question: {
          it: 'Supportate pagamenti locali come TWINT?',
          de: 'Wird TWINT als Zahlungsart unterstützt?',
          fr: 'Prenez-vous en charge le paiement par TWINT ?',
          en: 'Do you support local Swiss payment methods like TWINT?',
        },
        answer: {
          it: 'Sì, integriamo nativamente TWINT accanto a carte di credito, Apple Pay e bonifico bancario svizzero.',
          de: 'Ja, wir integrieren TWINT nativ neben Kreditkarten, Apple Pay und Schweizer Banküberweisung.',
          fr: 'Oui, nous intégrons nativement TWINT avec les cartes, Apple Pay et le virement suisse.',
          en: 'Yes, TWINT is natively integrated alongside cards, Apple Pay, and Swiss bank transfers.',
        },
      },
      {
        question: {
          it: 'È possibile gestire prezzi in CHF/EUR e spedizioni o ritiri in Ticino?',
          de: 'Können Preise in CHF/EUR sowie lokaler Versand im Tessin verwaltet werden?',
          fr: 'Peut-on gérer des tarifs CHF/EUR et le retrait local au Tessin ?',
          en: 'Can we handle CHF/EUR pricing and local Ticino pickup or Swiss Post shipping?',
        },
        answer: {
          it: 'Certamente: configuriamo listini CHF/EUR, aliquote IVA svizzere (8.1% / 2.6%), tariffe Posta Svizzera e ritiro in sede.',
          de: 'Ja: Wir richten CHF/EUR-Preise, Schweizer MwSt-Sätze (8,1 % / 2,6 %), Post-Tarife und Abholung vor Ort ein.',
          fr: 'Oui : gestion CHF/EUR, TVA suisse (8,1 % / 2,6 %), tarifs Poste Suisse et retrait sur place.',
          en: 'Yes: we configure CHF/EUR pricing, Swiss VAT rates (8.1% / 2.6%), Swiss Post shipping rules, and local pickup.',
        },
      },
      {
        question: {
          it: 'Possiamo migrare prodotti e ordini da un vecchio shop senza perdere traffico Google?',
          de: 'Können Produkte und Bestellungen ohne Google-Ranking-Verlust migriert werden?',
          fr: 'Peut-on migrer catalogue et commandes sans perdre le référencement Google ?',
          en: 'Can we migrate products and orders from an older store without losing Google rankings?',
        },
        answer: {
          it: 'Sì: mappiamo redirect 301 per ogni URL esistente, preserviamo i metadati indicizzati e validiamo i dati strutturati Product prima della messa online.',
          de: 'Ja: Wir richten saubere 301-Weiterleitungen für jede bestehende URL ein, übernehmen indexierte Metadaten und prüfen Product-Schema vor dem Go-Live.',
          fr: 'Oui : nous configurons des redirections 301 pour chaque URL existante, conservons les métadonnées indexées et validons le balisage Product.',
          en: 'Yes: we map 301 redirects for every existing URL, preserve indexed metadata, and validate Product structured data prior to launch.',
        },
      },
    ],
    targetKeywords: {
      it: ['e-commerce Lugano', 'booking diretto Ticino', 'sviluppo shop online TWINT'],
      de: ['E-Commerce Agentur Tessin', 'Direktbuchung Hotels', 'Online-Shop TWINT'],
      fr: ['e-commerce Lugano', 'réservation directe Tessin', 'boutique en ligne TWINT'],
      en: ['ecommerce agency Lugano', 'direct booking engine Ticino', 'Swiss TWINT online store'],
    },
  },
  {
    slug: 'seo-locale',
    accentType: 'saas',
    title: {
      it: 'SEO Locale & Google Business Ticino',
      de: 'Lokale SEO & Google Business Tessin',
      fr: 'SEO Local & Google Business Tessin',
      en: 'Local SEO & Google Business Ticino',
    },
    shortTitle: {
      it: 'SEO Locale',
      de: 'Lokale SEO',
      fr: 'SEO Local',
      en: 'Local SEO',
    },
    subtitle: {
      it: 'Posizionamento organico su Google Search e Google Maps a Lugano, Bellinzona, Locarno e Mendrisio.',
      de: 'Organische Spitzenplätze bei Google Suche & Maps in Lugano, Bellinzona, Locarno und Mendrisio.',
      fr: 'Positionnement organique sur Google Search et Maps à Lugano, Bellinzona, Locarno et Mendrisio.',
      en: 'Organic visibility across Google Search and Maps in Lugano, Bellinzona, Locarno, and Mendrisio.',
    },
    mainBenefit: {
      it: 'Intercetta clienti pronti ad acquistare nella tua zona grazie a schede verificate, coerenza NAP e contenuti locali autentici potenziati dai nostri SaaS.',
      de: 'Erreichen Sie kaufbereite Kunden in Ihrer Region durch verifizierte Profile, NAP-Konsistenz und echte lokale Inhalte.',
      fr: 'Captez les clients locaux prêts à acheter grâce aux fiches vérifiées, à la cohérence NAP et aux contenus géolocalisés.',
      en: 'Capture high-intent local buyers through verified profiles, NAP consistency, and geo-targeted content backed by our SaaS stack.',
    },
    steps: [
      {
        stepNumber: '01',
        title: {
          it: 'Audit RankUpList & Google Business',
          de: 'RankUpList & Google-Business-Audit',
          fr: 'Audit RankUpList & Google Business',
          en: 'RankUpList & Google Business audit',
        },
        description: {
          it: 'Analizziamo parole chiave locali, recensioni e discrepanze su directory svizzere.',
          de: 'Analyse lokaler Keywords, Bewertungen und Abweichungen in Schweizer Verzeichnissen.',
          fr: 'Analyse des requêtes locales, avis et incohérences sur les annuaires suisses.',
          en: 'Audit target local keywords, review velocity, and Swiss directory citations.',
        },
      },
      {
        stepNumber: '02',
        title: {
          it: 'Pagine geografiche differenziate',
          de: 'Eigenständige Standortseiten',
          fr: 'Pages géographiques différenciées',
          en: 'Differentiated geo-pages',
        },
        description: {
          it: 'Creiamo pagine dedicate per Lugano, Bellinzona, Locarno e Mendrisio con casi e dati locali reali.',
          de: 'Erstellung individueller Seiten für Lugano, Bellinzona, Locarno und Mendrisio mit echten lokalen Referenzen.',
          fr: 'Création de pages distinctes pour Lugano, Bellinzona, Locarno et Mendrisio avec preuves locales réelles.',
          en: 'Publish unique service hubs for Lugano, Bellinzona, Locarno, and Mendrisio with real local proof.',
        },
      },
      {
        stepNumber: '03',
        title: {
          it: 'Rete interna e monitoraggio Top 10',
          de: 'Internes Linknetz & Top-10-Monitoring',
          fr: 'Maillage interne & suivi Top 10',
          en: 'Internal linking & Top 10 tracking',
        },
        description: {
          it: 'Collegamenti contestuali da SitiTicino.ch e report mensili su chiamate e richieste.',
          de: 'Kontextuelle Verlinkung über SitiTicino.ch und monatliches Reporting zu Anrufen und Klicks.',
          fr: 'Liens contextuels depuis SitiTicino.ch et suivi mensuel des appels et clics.',
          en: 'Contextual authority signals from SitiTicino.ch paired with monthly call and click reporting.',
        },
      },
    ],
    includedItems: {
      it: [
        'Ottimizzazione completa Google Business Profile a Lugano e in Ticino',
        'Coerenza NAP garantita su portali e directory svizzere',
        'Dati strutturati Organization, LocalBusiness, FAQ e Breadcrumb',
        'Monitoraggio Search Console e parole chiave DE/FR per clientela d’oltralpe',
      ],
      de: [
        'Vollständige Optimierung Ihres Google Business Profile im Tessin',
        'Garantierte NAP-Konsistenz in Schweizer Portalen und Verzeichnissen',
        'Strukturierte Daten: Organization, LocalBusiness, FAQ & Breadcrumb',
        'Search-Console-Monitoring inklusive DE/FR-Keywords für Gäste aus der übrigen Schweiz',
      ],
      fr: [
        'Optimisation complète de votre fiche Google Business au Tessin',
        'Cohérence NAP garantie sur les annuaires et portails suisses',
        'Données structurées Organization, LocalBusiness, FAQ & Breadcrumb',
        'Suivi Search Console et mots-clés DE/FR pour la clientèle suisse',
      ],
      en: [
        'Full Google Business Profile optimization across Ticino',
        'Verified NAP consistency on Swiss directories and SitiTicino.ch',
        'Organization, LocalBusiness, FAQ, and Breadcrumb structured data',
        'Search Console monitoring including DE/FR queries from across Switzerland',
      ],
    },
    relatedCaseSlugs: ['rankuplist', 'sititicino-geoboost', 'il-vicolo-lugano'],
    faqs: [
      {
        question: {
          it: 'In quanto tempo si vedono i risultati sulla prima pagina di Google?',
          de: 'Wann zeigen sich erste Ergebnisse auf Seite 1 bei Google?',
          fr: 'Sous quel délai observe-t-on les résultats en première page Google ?',
          en: 'How quickly do local SEO improvements show up on Google Page 1?',
        },
        answer: {
          it: 'Le ottimizzazioni su Google Business Profile portano miglioramenti già in 4–6 settimane; l’obiettivo Top 10 organico si consolida entro 3–6 mesi.',
          de: 'Optimierungen am Google Business Profile wirken oft nach 4–6 Wochen; organische Top-10-Rankings festigen sich in 3–6 Monaten.',
          fr: 'Les optimisations Google Business agissent en 4 à 6 semaines ; les positions organiques Top 10 se consolident sous 3 à 6 mois.',
          en: 'Google Business Profile updates typically show traction in 4–6 weeks, while organic Top 10 rankings consolidate within 3–6 months.',
        },
      },
      {
        question: {
          it: 'Come evitate la penalizzazione per pagine locali duplicate tra le città del Ticino?',
          de: 'Wie vermeiden Sie Duplicate-Content-Strafen bei Tessiner Standortseiten?',
          fr: 'Comment évitez-vous la duplication de contenu entre les villes du Tessin ?',
          en: 'How do you avoid duplicate content penalties across Ticino city pages?',
        },
        answer: {
          it: 'Ogni polo (Lugano, Bellinzona, Locarno, Mendrisio) riceve dati settoriali distinti, riferimenti reali ai quartieri, casi studio locali e Schema.org dedicato.',
          de: 'Jeder Standort (Lugano, Bellinzona, Locarno, Mendrisio) erhält eigene Branchendaten, reale Quartierbezüge, lokale Fallstudien und spezifisches Schema.org.',
          fr: 'Chaque pôle (Lugano, Bellinzona, Locarno, Mendrisio) dispose de données sectorielles propres, quartiers réels, cas locaux et balisage Schema.org dédié.',
          en: 'Each district hub (Lugano, Bellinzona, Locarno, Mendrisio) features distinct industry context, neighborhood signals, local case studies, and tailored Schema.org markup.',
        },
      },
      {
        question: {
          it: 'La scheda Google Business Profile rimane di proprietà esclusiva della nostra azienda?',
          de: 'Bleibt das Google Business Profile vollständig im Eigentum unseres Unternehmens?',
          fr: 'La fiche Google Business Profile reste-t-elle la propriété exclusive de notre entreprise ?',
          en: 'Does our Google Business Profile remain 100% owned by our company?',
        },
        answer: {
          it: 'Sempre: operiamo come gestori autorizzati sul tuo account Google Business e forniamo report mensili verificabili su chiamate, indicazioni e clic.',
          de: 'Immer: Wir arbeiten als autorisierte Verwalter in Ihrem Google-Konto und liefern monatliche Berichte zu Anrufen, Routenanfragen und Klicks.',
          fr: 'Toujours : nous intervenons en tant que gestionnaire autorisé sur votre compte Google et livrons des rapports mensuels sur appels et clics.',
          en: 'Always: we work as authorized managers inside your own Google Business account and deliver transparent monthly call and click reports.',
        },
      },
    ],
    targetKeywords: {
      it: ['SEO locale Ticino', 'posizionamento Google Lugano', 'Google Business Profile Bellinzona'],
      de: ['Lokale SEO Tessin', 'Google Ranking Lugano', 'Google Business Optimierung'],
      fr: ['SEO local Tessin', 'référencement Google Lugano', 'Google Business Bellinzona'],
      en: ['local SEO Ticino', 'Google ranking Lugano', 'Google Business Profile Ticino'],
    },
  },
  {
    slug: 'agenti-ai-vocali',
    accentType: 'ai',
    title: {
      it: 'Agenti AI Vocali 24/7',
      de: 'KI-Sprachagenten 24/7',
      fr: 'Agents Vocaux IA 24/7',
      en: '24/7 AI Voice Agents',
    },
    shortTitle: {
      it: 'Agenti AI Vocali',
      de: 'KI-Sprachagenten',
      fr: 'Agents IA Vocaux',
      en: 'AI Voice Agents',
    },
    subtitle: {
      it: 'Segreterie telefoniche intelligenti in IT, DE, FR ed EN che rispondono sempre, qualificano e prenotano.',
      de: 'Intelligente Telefonassistenten in IT, DE, FR & EN, die jederzeit antworten und Termine direkt buchen.',
      fr: 'Secrétariats téléphoniques intelligents en IT, DE, FR et EN qui répondent et réservent en direct.',
      en: 'Intelligent phone receptionists fluent in IT, DE, FR & EN that answer every call and book appointments live.',
    },
    mainBenefit: {
      it: 'Non perdere mai più una prenotazione o un nuovo cliente mentre il tuo staff è impegnato al servizio, in sala o con i clienti.',
      de: 'Verpassen Sie keine Buchung mehr, während Ihr Team im Service, am Stuhl oder im Kundengespräch ist.',
      fr: 'Ne perdez plus aucune réservation lorsque votre équipe est occupée en salle ou en prestation.',
      en: 'Never miss another reservation or client inquiry while your team is busy serving guests or customers.',
    },
    steps: [
      {
        stepNumber: '01',
        title: {
          it: 'Addestramento su servizi, orari e tono',
          de: 'Training auf Leistungen, Zeiten & Tonalität',
          fr: 'Entraînement sur services, horaires et ton',
          en: 'Training on services, hours & tone',
        },
        description: {
          it: 'Importiamo listini, regole sui tavoli o sulle poltrone, allergeni e FAQ della tua attività.',
          de: 'Wir übernehmen Preislisten, Tisch- oder Stuhlregeln sowie häufige Kundenfragen.',
          fr: 'Intégration de vos tarifs, règles de capacité, horaires et FAQ réelles.',
          en: 'Ingest service menus, seating or chair capacity rules, opening hours, and FAQs.',
        },
      },
      {
        stepNumber: '02',
        title: {
          it: 'Collegamento numero svizzero e calendario',
          de: 'Anbindung Schweizer Rufnummer & Kalender',
          fr: 'Connexion numéro suisse & agenda',
          en: 'Swiss phone & calendar wiring',
        },
        description: {
          it: 'Attiviamo il trasferimento in caso di mancata risposta o gestione diretta 24 ore su 24.',
          de: 'Aktivierung als Überlauf bei Nichtannahme oder als direkter 24/7-Empfang.',
          fr: 'Activation en débordement d’appels ou prise en charge directe 24h/24.',
          en: 'Configure as overflow fallback or full 24/7 inbound reception tied to your live calendar.',
        },
      },
      {
        stepNumber: '03',
        title: {
          it: 'Conferma WhatsApp/SMS e monitoraggio',
          de: 'WhatsApp/SMS-Bestätigung & Monitoring',
          fr: 'Confirmation WhatsApp/SMS & suivi',
          en: 'WhatsApp/SMS confirmation & insights',
        },
        description: {
          it: 'Ogni appuntamento confermato invia un riepilogo automatico al cliente e al gestore.',
          de: 'Jeder gebuchte Termin sendet eine automatische Zusammenfassung an Gast und Team.',
          fr: 'Chaque rendez-vous validé déclenche un récapitulatif automatique.',
          en: 'Every confirmed booking dispatches instant confirmation to the caller and summary logs to staff.',
        },
      },
    ],
    includedItems: {
      it: [
        'Riconoscimento automatico della lingua (IT / DE / FR / EN)',
        'Integrazione calendari prenotazione ristoranti e saloni',
        'Passaggio istantaneo a operatore umano per richieste speciali',
        'Riepilogo giornaliero e conformità nLPD svizzera',
      ],
      de: [
        'Automatische Spracherkennung (IT / DE / FR / EN)',
        'Nahtlose Anbindung an Restaurant- und Salon-Kalender',
        'Sofortige Weiterleitung an Mitarbeitende bei Sonderwünschen',
        'Tageszusammenfassung & Einhaltung des Schweizer nDSG',
      ],
      fr: [
        'Détection automatique de la langue (IT / DE / FR / EN)',
        'Intégration aux agendas de restaurants et salons de coiffure',
        'Transfert instantané vers un humain pour demandes spécifiques',
        'Synthèse quotidienne conforme à la nLPD suisse',
      ],
      en: [
        'Automatic language detection (IT / DE / FR / EN)',
        'Live sync with restaurant and salon booking calendars',
        'Instant warm handoff to staff for special requests',
        'Daily call summaries with full Swiss FADP compliance',
      ],
    },
    relatedCaseSlugs: ['aurora-ai', 'il-vicolo-lugano', 'auto-social-publisher'],
    faqs: [
      {
        question: {
          it: 'La voce suona naturale o robotica?',
          de: 'Klingt die Stimme natürlich oder roboterhaft?',
          fr: 'La voix est-elle naturelle ou robotique ?',
          en: 'Does the AI voice sound natural or robotic?',
        },
        answer: {
          it: 'Utilizziamo modelli vocali neurali a bassa latenza (< 800 ms) con intonazione naturale e pause realistiche in italiano, tedesco, francese e inglese.',
          de: 'Wir nutzen neuronale Sprachmodelle mit geringer Latenz (< 800 ms) und natürlicher Intonation in allen vier Sprachen.',
          fr: 'Nous utilisons des voix neuronales à faible latence (< 800 ms) à l’intonation naturelle en IT, DE, FR et EN.',
          en: 'We deploy low-latency neural voice models (< 800 ms) with natural inflection and pacing across IT, DE, FR, and EN.',
        },
      },
      {
        question: {
          it: 'Il trattamento delle chiamate è conforme alla legge svizzera nLPD?',
          de: 'Entspricht die Anrufbearbeitung dem Schweizer Datenschutzgesetz (nDSG)?',
          fr: 'Le traitement des appels est-il conforme à la nLPD suisse ?',
          en: 'Is call handling compliant with the Swiss Federal Data Protection Act (FADP/nLPD)?',
        },
        answer: {
          it: 'Sì: informiamo il chiamante in apertura, raccogliamo solo i dati minimi per la prenotazione e proteggiamo i log secondo i requisiti nLPD e GDPR.',
          de: 'Ja: Anrufer werden zu Beginn informiert, es werden nur notwendige Buchungsdaten erfasst und gemäß nDSG/DSGVO geschützt.',
          fr: 'Oui : l’appelant est informé dès l’accueil, seules les données minimales de réservation sont collectées selon la nLPD et le RGPD.',
          en: 'Yes: callers receive an upfront notice, only minimal booking fields are stored, and logs follow strict Swiss FADP and GDPR safeguards.',
        },
      },
      {
        question: {
          it: 'Cosa succede se un cliente fa una richiesta imprevista o urgente?',
          de: 'Was passiert bei unerwarteten oder dringenden Anliegen am Telefon?',
          fr: 'Que se passe-t-il si un client formule une demande imprévue ou urgente ?',
          en: 'What happens when a caller has an unexpected or urgent request?',
        },
        answer: {
          it: 'L’agente riconosce le parole chiave prioritarie e trasferisce subito la chiamata al numero di reperibilità oppure invia un avviso immediato su WhatsApp.',
          de: 'Der Agent erkennt definierte Prioritätskriterien und stellt sofort an Ihre Notfallnummer durch oder sendet eine Sofortmeldung per WhatsApp.',
          fr: 'L’agent détecte les critères prioritaires et transfère aussitôt l’appel vers votre ligne directe ou envoie une alerte WhatsApp immédiate.',
          en: 'The agent detects priority keywords and immediately transfers the call to your designated staff line or triggers an instant WhatsApp alert.',
        },
      },
    ],
    targetKeywords: {
      it: ['agente AI ristorante', 'segreteria AI parrucchiere', 'centralino AI Ticino'],
      de: ['KI Telefonassistent Restaurant', 'KI Rezeption Friseur', 'KI Sprachagent Schweiz'],
      fr: ['agent vocal IA restaurant', 'secrétariat IA coiffeur', 'standard IA Suisse'],
      en: ['AI voice agent restaurant', 'AI salon receptionist', 'multilingual AI phone Switzerland'],
    },
  },
  {
    slug: 'agenti-ai-ristoranti',
    isAiVertical: true,
    accentType: 'ai',
    title: {
      it: 'Agenti AI per Ristoranti',
      de: 'KI-Sprachagenten für Restaurants',
      fr: 'Agents IA pour Restaurants',
      en: 'AI Voice Agents for Restaurants',
    },
    shortTitle: {
      it: 'AI Ristoranti',
      de: 'KI Restaurants',
      fr: 'IA Restaurants',
      en: 'AI Restaurants',
    },
    subtitle: {
      it: 'Prenotazione tavoli, gestione allergeni e risposte automatiche durante il picco di servizio serale.',
      de: 'Tischreservierungen, Allergen-Infos und automatische Annahme während der Stoßzeiten.',
      fr: 'Réservation de tables, gestion des allergènes et réponse continue pendant le service.',
      en: 'Automated table reservations, dietary guidance, and zero missed calls during busy lunch and dinner service.',
    },
    mainBenefit: {
      it: 'Recupera ogni tavolo perso quando nessuno in sala riesce a rispondere al telefono tra le 12:00 e le 14:00 o dopo le 19:30.',
      de: 'Gewinnen Sie jeden Tisch zurück, wenn im Service zwischen 12–14 Uhr oder ab 19:30 Uhr niemand ans Telefon gehen kann.',
      fr: 'Captez chaque table perdue lorsque l’équipe est en salle entre 12h–14h ou après 19h30.',
      en: 'Capture every table booking lost when front-of-house staff cannot answer the phone during peak service windows.',
    },
    steps: [
      {
        stepNumber: '01',
        title: {
          it: 'Regole sala, turni e menu',
          de: 'Saalregeln, Schichten & Speisekarte',
          fr: 'Règles de salle, services & carte',
          en: 'Floor rules, shifts & menu sync',
        },
        description: {
          it: 'Configuriamo capienza interna/terrazza, durata media del tavolo e piatti del giorno.',
          de: 'Konfiguration von Innen-/Terrassenplätzen, Verweildauer und Tagesgerichten.',
          fr: 'Paramétrage des places salle/terrasse, durée moyenne et suggestions du jour.',
          en: 'Configure indoor/terrace seating capacity, turn times, and daily specials.',
        },
      },
      {
        stepNumber: '02',
        title: {
          it: 'Risposta in 4 lingue per turisti e locali',
          de: 'Antworten in 4 Sprachen für Gäste & Touristen',
          fr: 'Accueil en 4 langues pour locaux et touristes',
          en: '4-language service for locals & tourists',
        },
        description: {
          it: 'Accoglie ospiti ticinesi, svizzero-tedeschi e internazionali senza barriere linguistiche.',
          de: 'Begrüßt Tessiner, Deutschschweizer und internationale Gäste ohne Sprachbarrieren.',
          fr: 'Accueille clients locaux, alémaniques et internationaux sans barrière de langue.',
          en: 'Welcomes Ticino locals, Swiss-German visitors, and international tourists effortlessly.',
        },
      },
      {
        stepNumber: '03',
        title: {
          it: 'Conferma WhatsApp e promemoria anti no-show',
          de: 'WhatsApp-Bestätigung & No-Show-Schutz',
          fr: 'Confirmation WhatsApp & anti no-show',
          en: 'WhatsApp confirmation & no-show reduction',
        },
        description: {
          it: 'Invia conferma tavolo e permette modifica o cancellazione rapida con un clic.',
          de: 'Sendet Tischbestätigung inklusive einfacher Umbuchung per Klick.',
          fr: 'Envoie la confirmation avec lien de modification rapide.',
          en: 'Dispatches booking confirmation with one-tap modify or cancel links.',
        },
      },
    ],
    includedItems: {
      it: [
        'Prenotazione e modifica tavoli in tempo reale',
        'Risposte su parcheggio, terrazza, menu vegetariano/senza glutine',
        'Gestione chiamate per gruppi > 8 persone con inoltro al responsabile',
        'Zero commissioni per coperto prenotato',
      ],
      de: [
        'Tischbuchung und -änderung in Echtzeit',
        'Auskünfte zu Parkplätzen, Terrasse und Allergenen',
        'Weiterleitung von Gruppen ab 8 Personen an die Leitung',
        'Keine Provisionen pro reserviertem Gast',
      ],
      fr: [
        'Réservation et modification de table en direct',
        'Réponses sur parking, terrasse, options sans gluten/végan',
        'Transfert des demandes de groupes (> 8 pers.) au gérant',
        'Zéro commission par couvert réservé',
      ],
      en: [
        'Real-time table booking and rescheduling',
        'Answers on parking, terrace seating, and dietary/allergen options',
        'Smart routing for large party inquiries (> 8 guests)',
        'Zero per-cover booking commissions',
      ],
    },
    relatedCaseSlugs: ['il-vicolo-lugano', 'aurora-ai', 'aurora-phone'],
    faqs: [
      {
        question: {
          it: 'Si integra con il nostro gestionale tavoli attuale?',
          de: 'Funktioniert der Agent mit unserem bestehenden Tischsystem?',
          fr: 'Est-ce compatible avec notre logiciel de réservation actuel ?',
          en: 'Does it integrate with our existing table booking system?',
        },
        answer: {
          it: 'Sì, colleghiamo Google Calendar, TheFork Manager, Resmio o inviamo conferme dirette via WhatsApp/email.',
          de: 'Ja, wir binden Google Kalender, Resmio oder direkte WhatsApp/E-Mail-Bestätigungen an.',
          fr: 'Oui, connexion avec Google Agenda, TheFork Manager, Resmio ou notifications directes.',
          en: 'Yes, we integrate with Google Calendar, Resmio, TheFork Manager, or direct WhatsApp/email workflows.',
        },
      },
      {
        question: {
          it: 'Riesce a gestire ospiti svizzero-tedeschi o turisti in inglese durante la stagione alta?',
          de: 'Kann der Agent Deutschschweizer und internationale Gäste in der Hochsaison bedienen?',
          fr: 'Gère-t-il les clients alémaniques et touristes anglophones en haute saison ?',
          en: 'Can it serve Swiss-German visitors and international tourists during peak season?',
        },
        answer: {
          it: 'Sì, l’agente rileva la lingua nei primi 2 secondi e risponde in italiano, tedesco, francese o inglese applicando le stesse regole di sala e terrazza.',
          de: 'Ja, der Agent erkennt die Sprache in den ersten 2 Sekunden und antwortet fließend auf IT, DE, FR oder EN.',
          fr: 'Oui, l’agent détecte la langue en 2 secondes et répond naturellement en italien, allemand, français ou anglais.',
          en: 'Yes, the agent detects the caller’s language within 2 seconds and switches seamlessly between Italian, German, French, and English.',
        },
      },
      {
        question: {
          it: 'Possiamo aggiornare rapidamente giorni di chiusura straordinaria o piatti del giorno?',
          de: 'Können Ruhetage oder Tagesmenüs kurzfristig angepasst werden?',
          fr: 'Peut-on mettre à jour rapidement les fermetures exceptionnelles ou plats du jour ?',
          en: 'Can we quickly update holiday closures or daily specials?',
        },
        answer: {
          it: 'Sì: basta un messaggio o una modifica rapida dal pannello dedicato per aggiornare in tempo reale regole di disponibilità, terrazza e menu.',
          de: 'Ja: Eine kurze Nachricht oder Anpassung im Dashboard genügt, um Verfügbarkeiten, Terrassenregeln und Menühinweise in Echtzeit zu aktualisieren.',
          fr: 'Oui : un simple message ou ajustement dans l’interface met à jour en temps réel disponibilités, terrasse et suggestions du chef.',
          en: 'Yes: a quick update in the control panel—or even a short message—updates availability rules, terrace status, and daily specials immediately.',
        },
      },
    ],
    targetKeywords: {
      it: ['agente AI ristorante', 'prenotazione tavoli AI Lugano', 'segreteria ristorante Ticino'],
      de: ['KI Telefonassistent Restaurant', 'Tischreservierung KI Tessin'],
      fr: ['agent vocal IA restaurant', 'réservation table IA Lugano'],
      en: ['AI restaurant voice agent', 'automated table booking Lugano'],
    },
  },
  {
    slug: 'agenti-ai-parrucchieri',
    isAiVertical: true,
    accentType: 'ai',
    title: {
      it: 'Segreteria AI per Parrucchieri & Saloni',
      de: 'KI-Empfang für Friseursalons',
      fr: 'Secrétariat IA pour Coiffeurs & Salons',
      en: 'AI Receptionist for Hair Salons',
    },
    shortTitle: {
      it: 'AI Parrucchieri',
      de: 'KI Friseure',
      fr: 'IA Coiffeurs',
      en: 'AI Salons',
    },
    subtitle: {
      it: 'Prenota tagli, colore e trattamenti mentre sei al lavoro con il cliente, senza mai posare le forbici.',
      de: 'Bucht Schnitte, Colorationen und Behandlungen, während Sie direkt am Kunden arbeiten.',
      fr: 'Planifie coupes, couleurs et soins pendant que vous travaillez, sans jamais poser les ciseaux.',
      en: 'Book cuts, color sessions, and treatments automatically while stylists stay focused on clients in the chair.',
    },
    mainBenefit: {
      it: 'Elimina le interruzioni continue in salone e riempi i buchi in agenda grazie a prenotazioni telefoniche istantanee 24/7.',
      de: 'Schluss mit ständigen Telefonunterbrechungen am Stuhl – füllen Sie freie Termine rund um die Uhr automatisch.',
      fr: 'Supprimez les interruptions au salon et remplissez vos créneaux vides 24h/24 par téléphone.',
      en: 'Eliminate front-desk interruptions and fill open chair gaps automatically with 24/7 phone scheduling.',
    },
    steps: [
      {
        stepNumber: '01',
        title: {
          it: 'Mappatura durata trattamenti & stylist',
          de: 'Mapping von Behandlungsdauer & Stylisten',
          fr: 'Paramétrage durées & coiffeurs',
          en: 'Service duration & stylist mapping',
        },
        description: {
          it: 'Distingue taglio uomo (30 min), piega (45 min), balayage (150 min) e preferenza operatore.',
          de: 'Unterscheidet Herrenschnitt (30 Min.), Föhnen (45 Min.), Balayage (150 Min.) und Wunsch-Stylist.',
          fr: 'Distingue coupe (30 min), brushing (45 min), balayage (150 min) et préférence de coiffeur.',
          en: 'Accounts for cut (30m), blowout (45m), balayage (150m), and preferred stylist availability.',
        },
      },
      {
        stepNumber: '02',
        title: {
          it: 'Gestione spostamenti e disdette',
          de: 'Umbuchungen & Terminabsagen',
          fr: 'Gestion reports et annulations',
          en: 'Rescheduling & cancellation handling',
        },
        description: {
          it: 'Consente ai clienti di spostare un appuntamento in autonomia liberando subito lo slot.',
          de: 'Ermöglicht einfache Terminverschiebungen und gibt freie Zeiten sofort wieder frei.',
          fr: 'Permet de déplacer un rendez-vous et libère instantanément le créneau.',
          en: 'Lets callers reschedule effortlessly and immediately re-opens canceled slots.',
        },
      },
      {
        stepNumber: '03',
        title: {
          it: 'Promemoria automatico il giorno prima',
          de: 'Automatische Erinnerung am Vortag',
          fr: 'Rappel automatique la veille',
          en: 'Day-before reminder alerts',
        },
        description: {
          it: 'Riduce i no-show fino all’80% con un messaggio WhatsApp o SMS di conferma.',
          de: 'Reduziert Terminausfälle um bis zu 80 % durch WhatsApp- oder SMS-Erinnerungen.',
          fr: 'Réduit les absences jusqu’à 80 % grâce aux rappels SMS ou WhatsApp.',
          en: 'Cuts no-shows by up to 80% via automated SMS or WhatsApp confirmations.',
        },
      },
    ],
    includedItems: {
      it: [
        'Prenotazione per singolo stylist o cabina estetica',
        'Calcolo automatico della durata combinata dei trattamenti',
        'Risposta alle domande su listino prezzi, orari e parcheggio',
        'Sincronizzazione agenda salone in tempo reale',
      ],
      de: [
        'Buchung nach einzelnem Stylisten oder Behandlungskabine',
        'Automatische Berechnung kombinierter Behandlungszeiten',
        'Auskünfte zu Preisliste, Öffnungszeiten und Parkmöglichkeiten',
        'Echtzeit-Synchronisation mit dem Salon-Kalender',
      ],
      fr: [
        'Réservation par coiffeur ou cabine esthétique',
        'Calcul automatique des durées combinées de soins',
        'Réponses sur tarifs, horaires et accès parking',
        'Synchronisation en temps réel avec l’agenda du salon',
      ],
      en: [
        'Stylist-specific and treatment-room scheduling',
        'Automatic duration calculation for combined services',
        'Instant answers on pricing tiers, hours, and parking',
        'Real-time synchronization with salon booking calendars',
      ],
    },
    relatedCaseSlugs: ['aurora-ai', 'rankuplist', 'aurora-adv'],
    faqs: [
      {
        question: {
          it: 'Come gestisce richieste tecniche complesse come correzioni colore?',
          de: 'Wie geht die KI mit komplexen Farbwünschen um?',
          fr: 'Comment gère-t-elle les demandes techniques complexes (correction couleur) ?',
          en: 'How does it handle complex color consultations?',
        },
        answer: {
          it: 'Prenota automaticamente uno slot gratuito di consulenza colore da 15 minuti o inoltra la richiesta con foto su WhatsApp alla titolare.',
          de: 'Sie bucht automatisch einen kurzen Beratungstermin oder leitet den Wunsch per WhatsApp an die Salonleitung weiter.',
          fr: 'Elle réserve un créneau diagnostic couleur de 15 min ou transfère la demande sur WhatsApp au responsable.',
          en: 'It automatically schedules a 15-minute color consultation slot or forwards a WhatsApp photo request to the lead stylist.',
        },
      },
      {
        question: {
          it: 'Quanto tempo serve per attivare la segreteria AI in un salone di parrucchieri?',
          de: 'Wie schnell ist der KI-Empfang für einen Friseursalon einsatzbereit?',
          fr: 'Combien de temps faut-il pour activer le secrétariat IA dans un salon ?',
          en: 'How fast can an AI voice receptionist go live for a hair salon?',
        },
        answer: {
          it: 'In 5–7 giorni lavorativi importiamo listino trattamenti, durata per stylist, orari del salone e trasferimento dal numero fisso.',
          de: 'In 5–7 Arbeitstagen übernehmen wir Behandlungsliste, Stylisten-Zeiten, Öffnungszeiten und Rufumleitung.',
          fr: 'En 5 à 7 jours ouvrés, nous intégrons vos prestations, durées par coiffeur et renvoi d’appel.',
          en: 'Within 5–7 business days we configure your treatment durations, stylist schedules, and Swiss phone forwarding.',
        },
      },
      {
        question: {
          it: 'È necessario cambiare il numero di telefono attuale del salone?',
          de: 'Muss die bestehende Telefonnummer des Salons geändert werden?',
          fr: 'Faut-il changer le numéro de téléphone actuel du salon ?',
          en: 'Do we need to change our salon’s existing phone number?',
        },
        answer: {
          it: 'No: manteniamo il vostro numero fisso o mobile storico attivando la deviazione automatica su occupato, mancata risposta o fuori orario.',
          de: 'Nein: Ihre bestehende Festnetz- oder Mobilnummer bleibt erhalten – wir aktivieren die Weiterleitung bei Besetzt, Nichtannahme oder nach Feierabend.',
          fr: 'Non : vous conservez votre numéro habituel grâce au renvoi d’appel automatique sur occupation, non-réponse ou hors horaires.',
          en: 'No: you keep your existing landline or mobile number using automatic forwarding on busy, unanswered, or after-hours calls.',
        },
      },
    ],
    targetKeywords: {
      it: ['segreteria AI parrucchiere', 'prenotazioni AI salone bellezza Ticino'],
      de: ['KI Rezeption Friseur', 'Terminbuchung KI Friseursalon Schweiz'],
      fr: ['secrétariat IA coiffeur', 'prise de rendez-vous IA salon'],
      en: ['AI salon receptionist', 'hair salon voice booking agent'],
    },
  },
];

export const TICINO_CITIES: TicinoCityProfile[] = [
  {
    slug: 'lugano',
    name: 'Lugano',
    regionLabel: {
      it: 'Sede Centrale · Sottoceneri',
      de: 'Hauptsitz · Sottoceneri',
      fr: 'Siège Principal · Sottoceneri',
      en: 'Headquarters · Sottoceneri',
    },
    headline: {
      it: 'Web Agency, SaaS & Agenti AI a Lugano',
      de: 'Webagentur, SaaS & KI-Agenten in Lugano',
      fr: 'Agence Web, SaaS & Agents IA à Lugano',
      en: 'Web Agency, SaaS & AI Agents in Lugano',
    },
    description: {
      it: 'Da Lugano seguiamo studi fiduciari, ristoranti del centro, boutique hotel e aziende tech con siti ad alte prestazioni, SEO locale e segreterie vocali AI.',
      de: 'Von Lugano aus betreuen wir Treuhandbüros, Restaurants, Boutique-Hotels und Tech-Firmen in der Region.',
      fr: 'Depuis Lugano, nous accompagnons fiduciaires, restaurants, hôtels et sociétés tech de la région.',
      en: 'From Lugano we partner with financial firms, downtown restaurants, boutique hotels, and tech companies across the region.',
    },
    localFocus: {
      it: 'Focus su ricerche ad alta concorrenza ("web agency Lugano", "ristorante centro Lugano") e clientela internazionale in 4 lingue.',
      de: 'Fokus auf wettbewerbsstarke Suchbegriffe und internationale Kundschaft in 4 Sprachen.',
      fr: 'Focus sur les requêtes concurrentielles et une clientèle internationale en 4 langues.',
      en: 'Focused on high-competition commercial queries and 4-language international clientele.',
    },
    districtsAndHubs: {
      it: 'Lugano Centro, Paradiso, Cassarate, Pregassona, Viganello, Lamone',
      de: 'Lugano Zentrum, Paradiso, Cassarate, Pregassona, Viganello, Lamone',
      fr: 'Lugano Centre, Paradiso, Cassarate, Pregassona, Viganello, Lamone',
      en: 'Lugano City Center, Paradiso, Cassarate, Pregassona, Viganello, Lamone',
    },
    keyIndustries: {
      it: ['Studi fiduciari & legali', 'Ristorazione fine dining', 'Wealth & Tech B2B', 'Saloni & Estetica'],
      de: ['Treuhand & Kanzleien', 'Gastronomie & Hospitality', 'Wealth & Tech B2B', 'Salons & Beauty'],
      fr: ['Fiduciaires & Cabinets', 'Restauration & Hôtellerie', 'Tech B2B & Finance', 'Salons & Beauté'],
      en: ['Trust & Legal Practices', 'Fine Dining & Hospitality', 'B2B Tech & Wealth', 'Salons & Wellness'],
    },
    serviceAngles: {
      web: {
        it: 'Portali corporate multilingua per fiduciarie e studi a Lugano con caricamento sotto 1.5s, conformità nLPD svizzera e moduli di qualificazione lead.',
        de: 'Mehrsprachige Unternehmensportale für Treuhandbüros und Kanzleien in Lugano unter 1,5s Ladezeit und voller nDSG-Konformität.',
        fr: 'Portails corporate multilingues pour fiduciaires et cabinets à Lugano sous 1,5s avec conformité nLPD suisse.',
        en: 'Multilingual corporate portals for Lugano trust firms and practices loading under 1.5s with full Swiss FADP compliance.',
      },
      ecommerce: {
        it: 'Prenotazione tavoli, gift card digitali e vendita diretta con TWINT e Apple Pay per boutique, enoteche e locali di Lugano Centro e Paradiso.',
        de: 'Tischbuchung, digitale Gutscheine und Direktverkauf mit TWINT & Apple Pay für Boutiquen und Gastronomie in Lugano.',
        fr: 'Réservation directe, cartes cadeaux et vente en ligne avec TWINT pour boutiques et tables du centre de Lugano.',
        en: 'Direct table reservations, digital vouchers, and TWINT/Apple Pay checkout for Lugano boutiques and dining venues.',
      },
      seo: {
        it: 'Dominio del Google Map Pack su Lugano Centro, Paradiso e Cassarate grazie alla verifica NAP con RankUpList e alle citazioni editoriali di SitiTicino.ch.',
        de: 'Top-Platzierungen im Google Map Pack für Lugano Zentrum, Paradiso und Cassarate durch RankUpList-NAP-Abgleich.',
        fr: 'Domination du Map Pack Google sur Lugano Centre, Paradiso et Cassarate via la cohérence NAP RankUpList.',
        en: 'Google Map Pack leadership across Lugano Center, Paradiso, and Cassarate via RankUpList NAP verification and SitiTicino.ch.',
      },
      ai: {
        it: 'Centralini vocali AI in 4 lingue per ristoranti e saloni luganesi: gestiscono richieste in italiano, tedesco e inglese durante il picco del pranzo e della sera.',
        de: 'Viersprachige KI-Telefonassistenten für Luganeser Restaurants und Salons zur Entlastung während der Stoßzeiten.',
        fr: 'Standards vocaux IA en 4 langues pour restaurants et salons de Lugano durant les heures de pointe.',
        en: '4-language AI voice receptionists for Lugano restaurants and salons handling lunch and dinner rush calls seamlessly.',
      },
    },
    localKeywords: {
      it: ['web agency Lugano', 'siti web Lugano', 'SEO locale Lugano', 'agente AI ristorante Lugano'],
      de: ['Webagentur Lugano', 'Website erstellen Lugano', 'Lokale SEO Lugano'],
      fr: ['agence web Lugano', 'création site Lugano', 'SEO local Lugano'],
      en: ['web agency Lugano', 'Lugano local SEO', 'AI voice agent Lugano'],
    },
    primaryKeyword: 'web agency Lugano',
    featuredCaseSlug: 'il-vicolo-lugano',
    stats: {
      businessesServed: '42+',
      avgLighthouse: '96/100',
      responseTime: '< 2h in loco',
    },
  },
  {
    slug: 'bellinzona',
    name: 'Bellinzona',
    regionLabel: {
      it: 'Polo Istituzionale & PMI',
      de: 'Verwaltungs- & KMU-Zentrum',
      fr: 'Pôle Institutionnel & PME',
      en: 'Institutional & SME Hub',
    },
    headline: {
      it: 'Siti Web, Automazione B2B e SEO a Bellinzona',
      de: 'Websites, B2B-Automatisierung & SEO in Bellinzona',
      fr: 'Sites Web, Automatisation B2B & SEO à Bellinzona',
      en: 'Websites, B2B Automation & Local SEO in Bellinzona',
    },
    description: {
      it: 'Affianchiamo imprese edili, studi medici, attività commerciali e fornitori del Bellinzonese con portali veloci, coerenza directory svizzere e acquisizione contatti tracciata.',
      de: 'Wir unterstützen Bauunternehmen, Arztpraxen und KMU im Raum Bellinzona mit schnellen Portalen und Schweizer Verzeichnis-SEO.',
      fr: 'Nous accompagnons entreprises, cabinets médicaux et PME de Bellinzona avec des portails rapides et un SEO local structuré.',
      en: 'Supporting construction firms, medical practices, and regional suppliers in Bellinzona with fast portals and Swiss directory SEO.',
    },
    localFocus: {
      it: 'Ottimizzazione schede Google Business su tutto il comprensorio di Bellinzona, Giubiasco e valli superiori.',
      de: 'Optimierung der Google-Business-Profile für Bellinzona, Giubiasco und die oberen Täler.',
      fr: 'Optimisation Google Business sur Bellinzona, Giubiasco et les vallées du nord.',
      en: 'Google Business Profile optimization spanning Bellinzona, Giubiasco, and northern valleys.',
    },
    districtsAndHubs: {
      it: 'Bellinzona Centro, Giubiasco, Monte Carasso, Sementina, Arbedo-Castione, Riviera',
      de: 'Bellinzona Zentrum, Giubiasco, Monte Carasso, Sementina, Arbedo-Castione',
      fr: 'Bellinzona Centre, Giubiasco, Monte Carasso, Sementina, Arbedo-Castione',
      en: 'Bellinzona Center, Giubiasco, Monte Carasso, Sementina, Arbedo-Castione',
    },
    keyIndustries: {
      it: ['Edilizia & Artigianato', 'Studi medici & dentistici', 'Fornitori enti pubblici', 'Servizi B2B & Mobilità'],
      de: ['Bauwesen & Handwerk', 'Arzt- & Zahnarztpraxen', 'Öffentliche Zulieferer', 'B2B-Dienstleister'],
      fr: ['Construction & Artisanat', 'Cabinets médicaux', 'Fournisseurs publics', 'Services B2B'],
      en: ['Construction & Trades', 'Medical & Dental Clinics', 'Public Sector Suppliers', 'B2B Regional Services'],
    },
    serviceAngles: {
      web: {
        it: 'Siti accessibili WCAG 2.2 AA e portali istituzionali per studi tecnici, imprese edili e fornitori dell’Alto Ticino con preventivazione chiara e schede certificate.',
        de: 'Barrierefreie WCAG 2.2 AA Websites und klare Angebotsportale für Bauunternehmen, Praxen und Dienstleister in Bellinzona.',
        fr: 'Sites accessibles WCAG 2.2 AA et portails techniques rapides pour entreprises du bâtiment et cabinets du Bellinzonese.',
        en: 'WCAG 2.2 AA compliant corporate sites and fast technical portals for Bellinzona trades, clinics, and B2B suppliers.',
      },
      ecommerce: {
        it: 'Cataloghi B2B e prenotazione appuntamenti online per cliniche, officine e rivenditori di Giubiasco e Castione con fatturazione QR svizzera.',
        de: 'B2B-Kataloge und Online-Terminbuchung für Praxen und Fachbetriebe in Giubiasco und Castione mit Schweizer QR-Rechnung.',
        fr: 'Catalogues B2B et prise de rendez-vous en ligne pour cliniques et commerces de Giubiasco avec facturation QR suisse.',
        en: 'B2B order catalogs and online appointment booking for Giubiasco clinics and suppliers integrated with Swiss QR invoicing.',
      },
      seo: {
        it: 'Posizionamento organico su tutto l’agglomerato di Bellinzona e valli (Biasca, Mesolcina) con allineamento directory Search.ch, Local.ch e SitiTicino.ch.',
        de: 'Organische Sichtbarkeit für Bellinzona, Giubiasco und obere Täler inklusive Search.ch-, Local.ch- und SitiTicino.ch-Abgleich.',
        fr: 'Positionnement organique sur Bellinzona et les vallées du nord avec synchronisation Search.ch, Local.ch et SitiTicino.ch.',
        en: 'Organic search visibility across Bellinzona, Giubiasco, and northern valleys backed by Search.ch, Local.ch, and SitiTicino.ch.',
      },
      ai: {
        it: 'Segreteria telefonica AI per studi medici, dentistici e artigiani del Bellinzonese: filtra urgenze, prenota visite e invia promemoria SMS anti no-show.',
        de: 'KI-Telefonsekretariat für Arztpraxen und Handwerksbetriebe in Bellinzona mit Triage und automatischer Terminerinnerung.',
        fr: 'Secrétariat vocal IA pour cabinets médicaux et artisans de Bellinzona : filtrage des urgences et rappels SMS.',
        en: 'AI phone reception for Bellinzona medical practices and trades handling appointment triage and SMS reminders.',
      },
    },
    localKeywords: {
      it: ['siti web Bellinzona', 'SEO Bellinzona', 'web agency Alto Ticino', 'gestionale artigiani Ticino'],
      de: ['Websites Bellinzona', 'SEO Bellinzona', 'Webagentur Nordtessin'],
      fr: ['sites web Bellinzona', 'SEO Bellinzona', 'agence digitale Haut-Tessin'],
      en: ['websites Bellinzona', 'Bellinzona SEO', 'Ticino B2B digital agency'],
    },
    primaryKeyword: 'siti web Bellinzona',
    featuredCaseSlug: 'swiss-lead-finder',
    stats: {
      businessesServed: '24+',
      avgLighthouse: '95/100',
      responseTime: 'Stessa giornata',
    },
  },
  {
    slug: 'locarno',
    name: 'Locarno',
    regionLabel: {
      it: 'Ospitalità, Turismo & Retail',
      de: 'Hospitality, Tourismus & Retail',
      fr: 'Hôtellerie, Tourisme & Commerce',
      en: 'Hospitality, Tourism & Retail',
    },
    headline: {
      it: 'Prenotazioni Dirette & Siti Multilingua a Locarno e Ascona',
      de: 'Direktbuchungen & mehrsprachige Websites in Locarno und Ascona',
      fr: 'Réservations Directes & Sites Multilingues à Locarno et Ascona',
      en: 'Direct Bookings & Multilingual Web in Locarno & Ascona',
    },
    description: {
      it: 'Progettiamo piattaforme turistiche, ristoranti sul lungolago e saloni del Locarnese pensate per attrarre ospiti dalla Svizzera tedesca grazie a versioni DE/FR native.',
      de: 'Tourismus-Plattformen, Restaurants und Salons im Raum Locarno – gezielt optimiert für Gäste aus der Deutschschweiz.',
      fr: 'Plateformes touristiques, restaurants et salons de Locarno optimisés pour capter les visiteurs suisses alémaniques.',
      en: 'Hospitality platforms, lakeside dining, and salons in Locarno & Ascona engineered to convert Swiss-German visitors.',
    },
    localFocus: {
      it: 'SEO bilingue IT/DE su soggiorni, ristorazione e servizi benessere tra Locarno, Muralto e Ascona.',
      de: 'Zweisprachige IT/DE-SEO für Aufenthalte, Gastronomie und Wellness rund um Locarno und Ascona.',
      fr: 'SEO bilingue IT/DE pour séjours, restauration et bien-être entre Locarno et Ascona.',
      en: 'Bilingual IT/DE search strategy for stays, dining, and wellness across Locarno, Muralto, and Ascona.',
    },
    districtsAndHubs: {
      it: 'Piazza Grande, Muralto, Ascona, Losone, Minusio, Tenero, Valle Maggia',
      de: 'Piazza Grande, Muralto, Ascona, Losone, Minusio, Tenero, Maggiatal',
      fr: 'Piazza Grande, Muralto, Ascona, Losone, Minusio, Tenero, Val Maggia',
      en: 'Piazza Grande, Muralto, Ascona, Losone, Minusio, Tenero, Valle Maggia',
    },
    keyIndustries: {
      it: ['Hotel & Case vacanza', 'Ristoranti sul lungolago', 'Saloni Beauty & Spa', 'Retail & Esperienze locali'],
      de: ['Hotels & Ferienwohnungen', 'See-Gastronomie', 'Beauty & Spa Salons', 'Retail & Erlebnisse'],
      fr: ['Hôtels & Résidences', 'Restaurants lacustres', 'Salons Beauté & Spa', 'Commerce & Loisirs'],
      en: ['Hotels & Holiday Stays', 'Lakeside Restaurants', 'Beauty Salons & Spas', 'Local Retail & Tours'],
    },
    serviceAngles: {
      web: {
        it: 'Esperienze editoriali veloci IT/DE/FR/EN per strutture ricettive, grotto e boutique di Ascona e Locarno con gallerie leggere e zero PDF pesanti.',
        de: 'Schnelle viersprachige Websites für Hotels, Grotti und Boutiquen in Ascona und Locarno ohne schwere PDF-Dateien.',
        fr: 'Sites quadrilingues rapides pour hôtels, grotti et boutiques d’Ascona et Locarno sans PDF lourds.',
        en: 'Fast 4-language editorial storefronts for Ascona & Locarno hotels, grotti, and boutiques with lightweight media.',
      },
      ecommerce: {
        it: 'Motori di prenotazione diretta senza commissioni OTA: pacchetti weekend, camere e tavoli pagabili in CHF/EUR con conferma immediata.',
        de: 'Provisionsfreie Direktbuchungssysteme für Zimmer, Wochenendpakete und Tische mit CHF/EUR-Zahlung.',
        fr: 'Moteurs de réservation directe sans commission OTA pour séjours et tables en CHF/EUR.',
        en: 'Commission-free direct booking engines for rooms, weekend stays, and tables with instant CHF/EUR checkout.',
      },
      seo: {
        it: 'Strategia SEO bilingue italiano/tedesco pensata per intercettare i turisti da Zurigo, Basilea e Berna che cercano soggiorni e ristoranti sul Lago Maggiore.',
        de: 'Zweisprachige IT/DE-SEO-Strategie gezielt für Gäste aus Zürich, Basel und Bern auf der Suche nach Urlaub am Lago Maggiore.',
        fr: 'Stratégie SEO bilingue IT/DE ciblant les voyageurs de Zurich, Bâle et Berne sur le Lac Majeur.',
        en: 'Bilingual IT/DE search positioning capturing Zurich, Basel, and Bern travelers searching Lake Maggiore stays and dining.',
      },
      ai: {
        it: 'Agenti vocali AI ideali per terrazze, pizzerie e saloni di bellezza tra Locarno e Ascona: rispondono in tedesco svizzero/standard, italiano e inglese durante l’alta stagione.',
        de: 'KI-Sprachagenten für Terrassenrestaurants und Salons in Locarno und Ascona – beantworten Anrufe in DE, IT und EN in der Hochsaison.',
        fr: 'Agents vocaux IA pour terrasses et salons de Locarno et Ascona : accueil fluide en allemand, italien et anglais en saison.',
        en: 'AI voice agents for Locarno & Ascona restaurants and salons answering German, Italian, and English peak-season calls.',
      },
    },
    localKeywords: {
      it: ['siti web Locarno', 'booking diretto hotel Ticino', 'SEO turismo Ascona', 'segreteria AI salone Locarno'],
      de: ['Website Hotel Tessin', 'Direktbuchung Ascona', 'SEO Locarno Tourismus'],
      fr: ['site web Locarno', 'réservation directe Ascona', 'SEO tourisme Tessin'],
      en: ['Locarno web agency', 'Ascona hotel direct booking', 'Lake Maggiore local SEO'],
    },
    primaryKeyword: 'siti web Locarno ospitalità',
    featuredCaseSlug: 'il-vicolo-lugano',
    stats: {
      businessesServed: '28+',
      avgLighthouse: '96/100',
      responseTime: '< 4h lavorative',
    },
  },
  {
    slug: 'mendrisio',
    name: 'Mendrisio',
    regionLabel: {
      it: 'Distretto Industriale & Servizi',
      de: 'Industrie- & Dienstleistungsbezirk',
      fr: 'Pôle Industriel & Services',
      en: 'Industrial & Cross-Border Hub',
    },
    headline: {
      it: 'Digitalizzazione PMI, E-commerce & AI a Mendrisio e Chiasso',
      de: 'KMU-Digitalisierung, E-Commerce & KI in Mendrisio und Chiasso',
      fr: 'Digitalisation PME, E-commerce & IA à Mendrisio et Chiasso',
      en: 'SME Digitalization, E-Commerce & AI in Mendrisio & Chiasso',
    },
    description: {
      it: 'Soluzioni B2B, automazione lead e segreterie vocali AI per aziende manifatturiere, logistica, retail e studi professionali del Mendrisiotto.',
      de: 'B2B-Lösungen, Lead-Automatisierung und KI-Telefonempfang für Industrie, Logistik und Dienstleister im Mendrisiotto.',
      fr: 'Solutions B2B, génération de leads et secrétariat vocal IA pour l’industrie, la logistique et le retail du Mendrisiotto.',
      en: 'B2B portals, lead automation, and AI receptionists tailored for manufacturing, logistics, and retail across Mendrisiotto.',
    },
    localFocus: {
      it: 'Integrazione B2B cross-border CH/IT, cataloghi digitali veloci e campagne Google mirate sul Sottoceneri.',
      de: 'Grenzüberschreitende B2B-Integration CH/IT, schnelle Produktkataloge und gezielte Google-Kampagnen.',
      fr: 'Intégration B2B transfrontalière CH/IT, catalogues rapides et campagnes Google ciblées.',
      en: 'Cross-border CH/IT B2B lead pipelines, fast digital catalogs, and targeted Sottoceneri Google campaigns.',
    },
    districtsAndHubs: {
      it: 'Mendrisio, Chiasso, Balerna, Stabio, Riva San Vitale, Coldrerio, Morbio Inferiore',
      de: 'Mendrisio, Chiasso, Balerna, Stabio, Riva San Vitale, Coldrerio',
      fr: 'Mendrisio, Chiasso, Balerna, Stabio, Riva San Vitale, Coldrerio',
      en: 'Mendrisio, Chiasso, Balerna, Stabio, Riva San Vitale, Coldrerio',
    },
    keyIndustries: {
      it: ['Manifattura & Precisione', 'Logistica & Dogana', 'Retail & Showrooms', 'Servizi B2B Chiasso'],
      de: ['Fertigung & Präzision', 'Logistik & Zoll', 'Retail & Showrooms', 'B2B-Dienstleister Chiasso'],
      fr: ['Industrie & Précision', 'Logistique & Douane', 'Retail & Showrooms', 'Services B2B Chiasso'],
      en: ['Precision Manufacturing', 'Logistics & Trade', 'Retail & Showrooms', 'Chiasso B2B Services'],
    },
    serviceAngles: {
      web: {
        it: 'Portali industriali B2B, schede tecniche indicizzabili e landing ad alta conversione per aziende di Stabio, Balerna e zona doganale di Chiasso.',
        de: 'Industrielle B2B-Portale und technische Produktkataloge für Betriebe in Stabio, Balerna und Chiasso.',
        fr: 'Portails industriels B2B et fiches techniques indexables pour entreprises de Stabio, Balerna et Chiasso.',
        en: 'B2B industrial portals and indexable technical spec sheets for companies in Stabio, Balerna, and Chiasso.',
      },
      ecommerce: {
        it: 'E-commerce B2B e D2C con listini differenziati per rivenditori, gestione IVA CH/EU e metodi di pagamento TWINT, carte e fattura aziendale.',
        de: 'B2B- und D2C-Shops mit Händlerpreisen, CH/EU-MwSt-Logik sowie TWINT- und Rechnungszahlung.',
        fr: 'E-commerce B2B et D2C avec grilles revendeurs, gestion TVA CH/UE, TWINT et facturation entreprise.',
        en: 'B2B and D2C storefronts featuring wholesale price tiers, CH/EU VAT rules, TWINT, and corporate invoicing.',
      },
      seo: {
        it: 'Presidio Google per parole chiave B2B, logistica e servizi locali nel Mendrisiotto con supporto di Swiss Lead Finder per l’espansione commerciale in Svizzera.',
        de: 'Google-Präsenz für B2B-, Logistik- und lokale Dienstleistungs-Keywords im Mendrisiotto inklusive Swiss Lead Finder.',
        fr: 'Visibilité Google sur les requêtes B2B et services du Mendrisiotto appuyée par Swiss Lead Finder.',
        en: 'Search visibility for B2B, logistics, and local service queries across Mendrisiotto paired with Swiss Lead Finder outreach.',
      },
      ai: {
        it: 'Centralini AI vocali e automazione richieste per PMI ad alto volume di chiamate tra Mendrisio e Chiasso: qualifica preventivi e smista reparti in tempo reale.',
        de: 'KI-Sprachagenten für KMU mit hohem Anrufaufkommen in Mendrisio und Chiasso zur Offert-Vorqualifizierung.',
        fr: 'Agents vocaux IA pour PME à fort volume d’appels entre Mendrisio et Chiasso : qualification et routage direct.',
        en: 'AI voice reception for high-volume Mendrisio & Chiasso SMEs qualifying quote requests and routing departments live.',
      },
    },
    localKeywords: {
      it: ['web agency Mendrisio', 'siti web Chiasso', 'e-commerce B2B Ticino', 'automazione AI Mendrisiotto'],
      de: ['Webagentur Mendrisio', 'B2B E-Commerce Chiasso', 'KMU Digitalisierung Tessin'],
      fr: ['agence web Mendrisio', 'e-commerce B2B Chiasso', 'automatisation IA Tessin'],
      en: ['web agency Mendrisio', 'Chiasso B2B websites', 'Mendrisiotto AI automation'],
    },
    primaryKeyword: 'web agency Mendrisio',
    featuredCaseSlug: 'aurora-ai',
    stats: {
      businessesServed: '19+',
      avgLighthouse: '95/100',
      responseTime: '< 4h lavorative',
    },
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'rev-vicolo',
    authorName: 'Matteo Bernasconi',
    role: {
      it: 'Titolare',
      de: 'Inhaber',
      fr: 'Propriétaire',
      en: 'Owner',
    },
    company: 'Il Vicolo Lugano',
    city: 'Lugano',
    rating: 5,
    quote: {
      it: 'Prima avevamo un menu PDF pesantissimo e perdevamo prenotazioni ogni sera. Con il nuovo sito veloce e il profilo Google ottimizzato i tavoli da ricerca locale sono quasi raddoppiati.',
      de: 'Früher hatten wir ein schweres PDF-Menü und verloren jeden Abend Anfragen. Mit der neuen Website und Google-Optimierung haben sich unsere Tischbuchungen fast verdoppelt.',
      fr: 'Avant, notre menu PDF lourd faisait fuir les clients mobiles. Avec le nouveau site rapide et Google optimisé, nos réservations ont presque doublé.',
      en: 'We used to rely on a heavy PDF menu and lost dinner bookings daily. With our fast new site and local Google optimization, table bookings nearly doubled.',
    },
    outcome: {
      it: '+88% prenotazioni tavolo da Google in 4 mesi',
      de: '+88 % Tischbuchungen über Google in 4 Monaten',
      fr: '+88 % réservations via Google en 4 mois',
      en: '+88% table bookings from Google in 4 months',
    },
  },
  {
    id: 'rev-speedyjob',
    authorName: 'Chiara Fontana',
    role: {
      it: 'Head of Operations',
      de: 'Leiterin Operations',
      fr: 'Directrice des Opérations',
      en: 'Head of Operations',
    },
    company: 'SpeedyJob',
    city: 'Lugano',
    rating: 5,
    quote: {
      it: 'Avevamo bisogno di un portale veloce dove i candidati potessero inviare la candidatura da smartphone in meno di un minuto. Le candidature completate sono più che raddoppiate.',
      de: 'Wir brauchten ein schnelles Portal, auf dem Bewerber mobil in unter einer Minute abschließen können. Die abgeschlossenen Bewerbungen haben sich mehr als verdoppelt.',
      fr: 'Il nous fallait un portail rapide où les candidats postulent sur mobile en moins d’une minute. Les candidatures finalisées ont plus que doublé.',
      en: 'We needed a fast portal where applicants could apply on mobile in under a minute. Completed mobile applications more than doubled.',
    },
    outcome: {
      it: '+110% candidature mobile completate',
      de: '+110 % abgeschlossene Mobil-Bewerbungen',
      fr: '+110 % candidatures mobiles finalisées',
      en: '+110% completed mobile applications',
    },
  },
  {
    id: 'rev-reverse',
    authorName: 'Davide Cattaneo',
    role: {
      it: 'Founder & Lead Editor',
      de: 'Gründer & Lead Editor',
      fr: 'Fondateur & Lead Editor',
      en: 'Founder & Lead Editor',
    },
    company: 'Reverse Editing',
    city: 'Lugano',
    rating: 5,
    quote: {
      it: 'Avevamo bisogno di mostrare video pesanti mantenendo un sito fulmineo. kreativalab Group ha ricostruito l’intera esperienza e il numero di preventivi qualificati è salito subito.',
      de: 'Wir mussten schwere Videos blitzschnell präsentieren. kreativalab Group hat das Portal komplett neu gedacht und die Anfragen stiegen sofort.',
      fr: 'Il fallait exposer des vidéos lourdes sur un site ultra-rapide. kreativalab Group a tout repensé et nos demandes qualifiées ont décollé.',
      en: 'We needed to showcase heavy video reels while keeping load speeds instant. kreativalab Group rebuilt the entire flow and qualified quote volume surged.',
    },
    outcome: {
      it: '+145% richieste preventivo qualificate · 97/100 Lighthouse',
      de: '+145 % qualifizierte Offerten · 97/100 Lighthouse',
      fr: '+145 % devis qualifiés · 97/100 Lighthouse',
      en: '+145% qualified quotes · 97/100 Lighthouse',
    },
  },
];

export const CLIENT_LOGOS = [
  'SpeedyJob',
  'Reverse Editing Shop',
  'Aurora Phone',
  'PixaSolar',
  'Visual Studio Facile',
  'Il Vicolo Lugano',
  'SitiTicino.ch',
  'SalviaPet',
];
