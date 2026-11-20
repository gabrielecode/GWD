import { Language } from '../types/showcase';
import { BUSINESS_INFO } from './business';

export interface LegalTabStrings {
  badge: string;
  tabs: {
    privacy: string;
    cookie: string;
    impressum: string;
  };
  lastUpdatedLabel: string;
  lastUpdatedValue: string;
}

export interface LegalPrivacySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalPrivacyContent {
  title: string;
  subtitle: string;
  controllerTitle: string;
  controllerBody: string;
  sections: LegalPrivacySection[];
}

export interface StorageItem {
  key: string;
  type: string;
  purpose: string;
  duration: string;
}

export interface LegalCookieContent {
  title: string;
  subtitle: string;
  intro: string;
  noProfilingNotice: string;
  storageTableTitle: string;
  storageTableHeaders: {
    key: string;
    type: string;
    purpose: string;
    duration: string;
  };
  storageItems: StorageItem[];
  settingsCardTitle: string;
  settingsCardSubtitle: string;
  browserControlTitle: string;
  browserControlBody: string;
}

export interface LegalImpressumContent {
  title: string;
  subtitle: string;
  entitySectionTitle: string;
  entityName: string;
  statusTitle: string;
  statusBadge: string;
  statusBody: string;
  headquartersTitle: string;
  locationDetails: string[];
  contactTitle: string;
  contactBody: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  copyrightTitle: string;
  copyrightBody: string;
}

export interface LegalContentBundle {
  ui: LegalTabStrings;
  privacy: LegalPrivacyContent;
  cookie: LegalCookieContent;
  impressum: LegalImpressumContent;
}

export const LEGAL_CONTENT: Record<Language, LegalContentBundle> = {
  it: {
    ui: {
      badge: 'nLPD Svizzera (RS 235.1) · GDPR UE · LCSI art. 3 cpv. 1 lett. s',
      tabs: {
        privacy: 'Informativa Privacy (nLPD)',
        cookie: 'Cookie & Local Storage',
        impressum: 'Impressum (Dati aziendali)',
      },
      lastUpdatedLabel: 'Ultimo aggiornamento normativo',
      lastUpdatedValue: 'Febbraio 2026 · Lugano, Canton Ticino',
    },
    privacy: {
      title: 'Informativa sulla Protezione dei Dati',
      subtitle:
        'Trattamento dei dati personali conforme alla Legge federale svizzera sulla protezione dei dati (nLPD, RS 235.1) e al Regolamento Generale sulla Protezione dei Dati dell’UE (GDPR).',
      controllerTitle: '1. Titolare del trattamento dei dati',
      controllerBody: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand}), con sede operativa a ${BUSINESS_INFO.address.locality} (${BUSINESS_INFO.address.regionName}, ${BUSINESS_INFO.address.countryNameIt}). Per qualsiasi richiesta o esercizio dei diritti in materia di protezione dei dati personali è possibile fare riferimento alla sezione Contatti o inoltrare comunicazione formale alla direzione del gruppo.`,
      sections: [
        {
          title: '2. Categorie di dati trattati e minimizzazione',
          paragraphs: [
            'Raccogliamo e trattiamo esclusivamente i dati personali strettamente necessari per erogare i servizi richiesti e garantire la sicurezza tecnica della piattaforma (principio di proporzionalità e minimizzazione dei dati ex art. 6 nLPD):',
          ],
          bullets: [
            'Dati di navigazione e tecnici: indirizzo IP (trattato per sicurezza di rete e diagnosi server), data e ora della richiesta, codice di risposta HTTP, tipo e versione del browser.',
            'Dati forniti volontariamente tramite modulo contatti / prenotazione call: Nome, Ragione sociale o Studio, indirizzo email aziendale, tipologia di esigenza o progetto (sviluppo web, SEO locale, Agenti AI, demo SaaS).',
          ],
        },
        {
          title: '3. Finalità del trattamento e basi giuridiche',
          paragraphs: [
            'Il trattamento dei dati personali avviene esclusivamente per le seguenti finalità legittime:',
          ],
          bullets: [
            'Risposta a richieste commerciali, preventivi dedicati e richieste di call tecnica (misure precontrattuali ex art. 31 nLPD e art. 6 par. 1 lett. b GDPR).',
            'Presentazione e fornitura di credenziali demo per le piattaforme SaaS proprietarie del gruppo.',
            'Sicurezza informatica, prevenzione di abusi e manutenzione tecnica della piattaforma.',
            'Nessun dato personale viene venduto, noleggiato o comunicato a intermediari terzi per scopi pubblicitari o di marketing massivo.',
          ],
        },
        {
          title: '4. Hosting, Fornitori tecnici e Trasferimento all’estero (art. 19 cpv. 4 nLPD)',
          paragraphs: [
            'L’infrastruttura di hosting e i server web sono erogati attraverso data center sicuri situati in Svizzera e nello Spazio Economico Europeo (SEE). Qualora per esigenze tecniche specifiche di ridondanza o instradamento si verifichi un trattamento all’estero, lo stesso avviene esclusivamente verso Paesi la cui legislazione garantisce una protezione adeguata ai sensi dell’allegato 1 all’Ordinanza federale sulla protezione dei dati (OPDa), o in base a Clausole Contrattuali Standard approvate dall’IFPDT.',
            'La piattaforma è stata ingegnerizzata secondo il principio della Privacy by Design: tutti i font grafici (Outfit, Plus Jakarta Sans, JetBrains Mono) sono ospitati direttamente in locale sul server del sito. Non vi è alcun collegamento remoto automatico né trasferimento del vostro indirizzo IP verso Google Fonts o server terzi all’apertura della pagina.',
          ],
        },
        {
          title: '5. Conservazione e cancellazione dei dati',
          paragraphs: [
            'I dati trasmessi volontariamente tramite i moduli web vengono conservati per il tempo strettamente necessario a gestire la richiesta informativa e l’eventuale successiva trattativa commerciale, nel rispetto degli obblighi contabili e fiscali svizzeri ove applicabili (fino a un massimo di 10 anni in caso di contratti conclusi ai sensi del CO svizzero). I dati di navigazione tecnica vengono cancellati o anonimizzati a intervalli regolari.',
          ],
        },
        {
          title: '6. Diritti dell’interessato e Autorità di vigilanza svizzera',
          paragraphs: [
            'Ai sensi degli articoli 25 e seguenti della nLPD e degli articoli 15 e seguenti del GDPR, avete in qualsiasi momento i seguenti diritti esigibili a titolo gratuito:',
          ],
          bullets: [
            'Diritto di accesso: ottenere conferma del trattamento dei vostri dati e riceverne copia.',
            'Diritto di rettifica: richiedere la correzione di dati inesatti o incompleti.',
            'Diritto di cancellazione: chiedere la rimozione tempestiva dei vostri dati personali non più necessari alle finalità.',
            'Diritto di limitazione o opposizione al trattamento e diritto alla portabilità dei dati.',
            'Diritto di revoca del consenso prestato in qualsiasi momento con effetto per il futuro.',
            'Diritto di presentare reclamo: qualora riteniate che il trattamento violi la legge federale, avete il diritto di ricorrere all’Incaricato federale della protezione dei dati e della trasparenza (IFPDT / FDPIC, Feldeggweg 1, CH-3003 Berna — www.edoeb.admin.ch).',
          ],
        },
      ],
    },
    cookie: {
      title: 'Politica Cookie & Gestione Archiviazione Locale',
      subtitle:
        'Trasparenza tecnica su storage e privacy: nessun cookie di profilazione pubblicitaria o tracker di terze parti.',
      intro:
        'GWD Group adotta un’architettura web orientata alla massima privacy degli utenti. Questo sito non utilizza cookie di terze parti per profilazione comportamentale (come Meta Pixel, Google Analytics convenzionale o tracker pubblicitari).',
      noProfilingNotice:
        'Zero tracker di profilazione: i font e le icone sono memorizzati in locale e non inviano dati a server esterni.',
      storageTableTitle: 'Archiviazione tecnica attiva sul vostro browser',
      storageTableHeaders: {
        key: 'Identificativo / Chiave',
        type: 'Tecnologia',
        purpose: 'Finalità operativa',
        duration: 'Durata di conservazione',
      },
      storageItems: [
        {
          key: BUSINESS_INFO.cookieStorageKey,
          type: 'Browser LocalStorage',
          purpose:
            'Memorizza le preferenze di consenso espresse dall’utente per la sessione e per le visite future, evitando la ricomparsa del banner a ogni cambio pagina.',
          duration: 'Persistente (fino a cancellazione manuale o aggiornamento scelte)',
        },
      ],
      settingsCardTitle: 'Pannello di controllo del consenso',
      settingsCardSubtitle:
        'Modificate in qualsiasi momento le preferenze di tracciamento e salvataggio sul vostro dispositivo.',
      browserControlTitle: 'Gestione manuale tramite browser',
      browserControlBody:
        'Potete inoltre visualizzare, bloccare o cancellare i dati memorizzati in qualsiasi momento direttamente dalle impostazioni del vostro browser (Chrome, Safari, Firefox, Edge o Brave) nella sezione «Privacy e sicurezza» > «Dati dei siti web».',
    },
    impressum: {
      title: 'Impressum & Dati Aziendali',
      subtitle:
        'Informazioni editoriali e societarie ai sensi dell’articolo 3 cpv. 1 lett. s della Legge federale contro la concorrenza sleale (LCSI).',
      entitySectionTitle: 'Denominazione e brand commerciale',
      entityName: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand})`,
      statusTitle: 'Stato societario e dati di registro',
      statusBadge: 'In fase di formalizzazione / costituzione notarile',
      statusBody:
        'GWD Group opera come Digital Venture Studio & Web Agency a Lugano (Canton Ticino). La ragione sociale formale, l’indirizzo civico esatto e l’eventuale iscrizione nel Registro di commercio / numero IDI (UID) e partita IVA svizzera sono attualmente in fase di definizione notarile e registrazione definitiva. I dati societari verranno aggiornati puntualmente in questo Impressum al completamento delle pratiche di registro.',
      headquartersTitle: 'Sede operativa e territorio',
      locationDetails: [
        `Località: ${BUSINESS_INFO.address.locality}`,
        `Cantone: ${BUSINESS_INFO.address.regionName} (${BUSINESS_INFO.address.region})`,
        `Paese: ${BUSINESS_INFO.address.countryNameIt} (${BUSINESS_INFO.address.countryCode})`,
        `Orari di operatività: ${BUSINESS_INFO.openingHours.displayLabel}`,
        `Sito ufficiale: ${BUSINESS_INFO.defaultSiteUrl}`,
      ],
      contactTitle: 'Contatti diretti ed esercizio diritti',
      contactBody:
        'Per comunicazioni istituzionali, richieste di preventivo, offerte o notifiche formali è attivo il modulo nella pagina Contatti (con riscontro entro 4 ore lavorative) oppure i canali diretti del gruppo indicati nel sito.',
      disclaimerTitle: 'Esclusione di responsabilità per contenuti e collegamenti esterni',
      disclaimerBody:
        'I contenuti di questo sito sono stati redatti con la massima cura e vengono regolarmente verificati. GWD Group non assume tuttavia responsabilità per l’esattezza o la completezza dei contenuti di terze parti raggiungibili tramite collegamenti esterni (link contrassegnati con ↗ verso piattaforme collegate come sititicino.ch, swissleadfinder.ch, rankuplist.com, pratiko.ch, salviapet.com), la cui responsabilità ricade esclusivamente sui rispettivi gestori.',
      copyrightTitle: 'Proprietà intellettuale e diritti d’autore',
      copyrightBody:
        'Tutti i testi, l’architettura software, il codice sorgente, le grafiche, i loghi dei prodotti proprietari e il layout visivo presenti su questo sito sono protetti dal diritto d’autore svizzero e internazionale. Qualsiasi riproduzione, elaborazione o diffusione non autorizzata per iscritto è vietata.',
    },
  },
  de: {
    ui: {
      badge: 'Schweizer nDSG (SR 235.1) · EU-DSGVO · UWG Art. 3 Abs. 1 Bst. s',
      tabs: {
        privacy: 'Datenschutz (nDSG)',
        cookie: 'Cookies & Speicher',
        impressum: 'Impressum (Unternehmen)',
      },
      lastUpdatedLabel: 'Letzte rechtliche Aktualisierung',
      lastUpdatedValue: 'Februar 2026 · Lugano, Kanton Tessin',
    },
    privacy: {
      title: 'Datenschutzerklärung (nDSG / DSGVO)',
      subtitle:
        'Verarbeitung personenbezogener Daten in Übereinstimmung mit dem Schweizer Bundesgesetz über den Datenschutz (nDSG, SR 235.1) und der Datenschutz-Grundverordnung der EU (DSGVO).',
      controllerTitle: '1. Verantwortliche Stelle (Verantwortlicher)',
      controllerBody: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand}), mit Betriebssitz in ${BUSINESS_INFO.address.locality} (${BUSINESS_INFO.address.regionName}, ${BUSINESS_INFO.address.countryNameDe}). Für Anfragen zur Ausübung Ihrer Betroffenenrechte nutzen Sie bitte das Kontaktformular oder kontaktieren Sie die Geschäftsleitung der Gruppe.`,
      sections: [
        {
          title: '2. Verarbeitete Datenkategorien und Datenminimierung',
          paragraphs: [
            'Wir erheben und verarbeiten ausschließlich personenbezogene Daten, die für den Betrieb der Plattform und die Beantwortung von Anfragen zwingend erforderlich sind (Grundsatz der Verhältnismäßigkeit nach Art. 6 nDSG):',
          ],
          bullets: [
            'Server-Protokolldaten: IP-Adresse (ausschließlich zur Gewährleistung der Netzwerksicherheit und Diagnose), Datum und Uhrzeit des Abrufs, HTTP-Statuscode und Browser-Typ.',
            'Freiwillig übermittelte Formulardaten: Name, Unternehmen/Kanzlei, geschäftliche E-Mail-Adresse und Projektanforderung (Webentwicklung, lokale SEO Tessin, KI-Sprachagenten, SaaS-Demo).',
          ],
        },
        {
          title: '3. Zwecke der Datenverarbeitung und Rechtsgrundlagen',
          paragraphs: [
            'Die Datenverarbeitung erfolgt zu folgenden berechtigten Zwecken:',
          ],
          bullets: [
            'Bearbeitung von Offertanfragen, Beratungsgesprächen und technischen Vorgesprächen (vorvertragliche Maßnahmen gemäss Art. 31 nDSG und Art. 6 Abs. 1 lit. b DSGVO).',
            'Bereitstellung von Testzugängen für unsere proprietären SaaS-Plattformen.',
            'Betriebsstabilität und IT-Sicherheit der Website.',
            'Es findet keinerlei Verkauf oder Weitergabe von Daten an werbliche Dritte oder Datenhändler statt.',
          ],
        },
        {
          title: '4. Hosting, technische Dienstleister und Auslandstransfer (Art. 19 Abs. 4 nDSG)',
          paragraphs: [
            'Das Hosting erfolgt in sicheren Rechenzentren in der Schweiz und im Europäischen Wirtschaftsraum (EWR). Soweit technisch bedingt eine Datenübermittlung ins Ausland erfolgt, geschieht dies ausschließlich in Staaten mit angemessenem Datenschutzniveau gemäß Anhang 1 der Schweizer Datenschutzverordnung (DSV) oder auf Basis genehmigter Standardvertragsklauseln.',
            'Privacy-by-Design-Architektur: Alle Schriftarten (Outfit, Plus Jakarta Sans, JetBrains Mono) werden lokal über unsere eigenen Webserver ausgeliefert. Es erfolgt keine Datenübertragung an Google Fonts oder externe Server Dritter beim Seitenaufruf.',
          ],
        },
        {
          title: '5. Speicherdauer und Datenlöschung',
          paragraphs: [
            'Anfragedaten werden nur so lange aufbewahrt, wie dies zur Bearbeitung Ihres Anliegens und für die anschließende geschäftliche Beziehung erforderlich ist, unter Beachtung der gesetzlichen Aufbewahrungsfristen nach Schweizer Obligationenrecht (OR). Technische Logdaten werden regelmäßig bereinigt.',
          ],
        },
        {
          title: '6. Ihre Rechte und Aufsichtsbehörde in der Schweiz',
          paragraphs: [
            'Nach Art. 25 ff. nDSG und Art. 15 ff. DSGVO stehen Ihnen folgende kostenlose Rechte zu:',
          ],
          bullets: [
            'Auskunftsrecht über die zu Ihrer Person gespeicherten Daten.',
            'Recht auf Berichtigung unrichtiger oder unvollständiger Daten.',
            'Recht auf Löschung («Recht auf Vergessenwerden») und Einschränkung der Verarbeitung.',
            'Recht auf Datenherausgabe und -übertragung (Datenportabilität).',
            'Recht auf Beschwerde bei der Schweizer Aufsichtsbehörde: Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB / FDPIC, Feldeggweg 1, CH-3003 Bern — www.edoeb.admin.ch).',
          ],
        },
      ],
    },
    cookie: {
      title: 'Cookie-Richtlinie & Lokale Speicherverwaltung',
      subtitle:
        'Vollständige technische Transparenz: Keine Werbe-Tracker oder Profiling-Cookies von Drittanbietern.',
      intro:
        'GWD Group verzichtet konsequent auf invasive Tracking-Technologien. Diese Website setzt keine Profiling-Cookies oder Werbepixel von Drittanbietern (wie Meta Pixel oder konventionelles Google Analytics) ein.',
      noProfilingNotice:
        'Kein Werbetracking: Schriftarten, Skripte und Icons werden vollständig lokal gehostet.',
      storageTableTitle: 'Im Browser genutzte technische Speichertechnologien',
      storageTableHeaders: {
        key: 'Schlüssel / Bezeichnung',
        type: 'Technologie',
        purpose: 'Funktion & Zweck',
        duration: 'Speicherdauer',
      },
      storageItems: [
        {
          key: BUSINESS_INFO.cookieStorageKey,
          type: 'Browser LocalStorage',
          purpose:
            'Speichert Ihre getroffene Einwilligungsentscheidung für die Sitzung und zukünftige Besuche, um ein wiederholtes Anzeigen des Banners zu vermeiden.',
          duration: 'Dauerhaft (bis zur manuellen Löschung im Browser oder Änderung der Auswahl)',
        },
      ],
      settingsCardTitle: 'Einwilligungseinstellungen',
      settingsCardSubtitle:
        'Sie können Ihre Präferenzen für zukünftige datenschutzfreundliche Statistiken jederzeit anpassen.',
      browserControlTitle: 'Manuelle Browser-Steuerung',
      browserControlBody:
        'In den Einstellungen Ihres Browsers (Chrome, Safari, Firefox, Edge, Brave) unter «Datenschutz und Sicherheit» > «Website-Daten» können Sie gespeicherte Daten jederzeit einsehen und vollständig löschen.',
    },
    impressum: {
      title: 'Impressum & Unternehmensangaben',
      subtitle:
        'Angaben gemäß Art. 3 Abs. 1 Bst. s des Schweizer Bundesgesetzes gegen den unlauteren Wettbewerb (UWG).',
      entitySectionTitle: 'Unternehmensbezeichnung & Dachmarke',
      entityName: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand})`,
      statusTitle: 'Rechtlicher Status & Registerangaben',
      statusBadge: 'In notarieller Vorbereitung / Gründung',
      statusBody:
        'GWD Group agiert als Digital Venture Studio und Webagentur in Lugano (Kanton Tessin). Die offizielle juristische Gesellschaftsform, die genaue postalische Anschrift sowie die Eintragung im Handelsregister samt Schweizer UID / MWST-Nummer befinden sich derzeit in der notariellen Gründungs- und Registrierungsphase. Nach Abschluss des Registereintrags werden die vollständigen Registerangaben umgehend hier veröffentlicht.',
      headquartersTitle: 'Standort & Betriebssitz',
      locationDetails: [
        `Ort: ${BUSINESS_INFO.address.locality}`,
        `Kanton: ${BUSINESS_INFO.address.regionName} (${BUSINESS_INFO.address.region})`,
        `Land: ${BUSINESS_INFO.address.countryNameDe} (${BUSINESS_INFO.address.countryCode})`,
        `Bürozeiten: ${BUSINESS_INFO.openingHours.displayLabel}`,
        `Offizielle Domain: ${BUSINESS_INFO.defaultSiteUrl}`,
      ],
      contactTitle: 'Direkte Kontaktaufnahme',
      contactBody:
        'Für behördliche Mitteilungen, Offertanfragen und geschäftliche Anfragen steht unser Kontaktformular (Rückmeldung innerhalb von 4 Arbeitsstunden) sowie der direkte WhatsApp-Kanal zur Verfügung.',
      disclaimerTitle: 'Haftungsausschluss für Inhalte und externe Verweise',
      disclaimerBody:
        'Die Inhalte dieses Webauftritts wurden mit größter Sorgfalt erstellt. Für externe Links zu verbundenen Gruppenplattformen (z. B. sititicino.ch, swissleadfinder.ch, rankuplist.com, pratiko.ch, salviapet.com) übernehmen wir keine Haftung; für deren Inhalte sind ausschließlich die jeweiligen Betreiber verantwortlich.',
      copyrightTitle: 'Urheberrecht & geistiges Eigentum',
      copyrightBody:
        'Die auf dieser Website veröffentlichten Inhalte, Quellcodes, Texte, Marken und Designs unterliegen dem schweizerischen Urheberrecht. Jede Vervielfältigung, Bearbeitung oder Verbreitung bedarf der vorherigen schriftlichen Zustimmung der GWD Group.',
    },
  },
  fr: {
    ui: {
      badge: 'nLPD Suisse (RS 235.1) · RGPD UE · LCD art. 3 al. 1 let. s',
      tabs: {
        privacy: 'Confidentialité (nLPD)',
        cookie: 'Cookies & Stockage',
        impressum: 'Impressum (Mentions)',
      },
      lastUpdatedLabel: 'Dernière mise à jour légale',
      lastUpdatedValue: 'Février 2026 · Lugano, Canton du Tessin',
    },
    privacy: {
      title: 'Politique de Confidentialité (nLPD / RGPD)',
      subtitle:
        'Traitement des données personnelles conforme à la Loi fédérale suisse sur la protection des données (nLPD, RS 235.1) et au Règlement général sur la protection des données de l’UE (RGPD).',
      controllerTitle: '1. Responsable du traitement des données',
      controllerBody: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand}), avec siège opérationnel à ${BUSINESS_INFO.address.locality} (${BUSINESS_INFO.address.regionName}, ${BUSINESS_INFO.address.countryNameFr}). Pour toute question ou exercice de vos droits relatifs aux données personnelles, veuillez utiliser le formulaire de contact ou contacter la direction du groupe.`,
      sections: [
        {
          title: '2. Catégories de données traitées et minimisation',
          paragraphs: [
            'Nous collectons et traitons uniquement les données strictement nécessaires au fonctionnement du site et au traitement de vos demandes (principe de proportionnalité selon l’art. 6 nLPD) :',
          ],
          bullets: [
            'Données techniques et de navigation : adresse IP (traitée pour la sécurité informatique et le diagnostic serveur), date et heure de la requête, code HTTP, type et version du navigateur.',
            'Données fournies volontairement : Nom, entreprise/cabinet, adresse e-mail professionnelle et besoin exprimé (création web, SEO local Tessin, agents vocaux IA, démo SaaS).',
          ],
        },
        {
          title: '3. Finalités du traitement et bases légales',
          paragraphs: [
            'Vos données sont traitées pour des finalités légitimes précises :',
          ],
          bullets: [
            'Réponse aux demandes de devis et d’échanges techniques (mesures précontractuelles selon l’art. 31 nLPD et l’art. 6 al. 1 let. b RGPD).',
            'Fourniture d’accès démo pour nos logiciels SaaS propriétaires.',
            'Maintien de la sécurité technique et prévention des fraudes.',
            'Aucune donnée personnelle n’est vendue, louée ou cédée à des tiers à des fins publicitaires.',
          ],
        },
        {
          title: '4. Hébergement et transfert de données à l’étranger (art. 19 al. 4 nLPD)',
          paragraphs: [
            'L’hébergement est assuré dans des centres de données sécurisés situés en Suisse et dans l’Espace Économique Européen (EEE). Tout transfert éventuel à l’étranger s’effectue exclusivement vers des pays garantissant une protection adéquate selon l’annexe 1 de l’Ordonnance suisse sur la protection des données (OPDo) ou sous clauses contractuelles types.',
            'Conception respectueuse de la vie privée (Privacy by Design) : les polices d’écriture sont hébergées localement. Aucune requête n’est envoyée vers Google Fonts lors de votre navigation.',
          ],
        },
        {
          title: '5. Durée de conservation et suppression',
          paragraphs: [
            'Les données soumises via nos formulaires sont conservées pendant la durée nécessaire au traitement de la demande et au suivi commercial, dans le respect des délais légaux de conservation suisses (Code des obligations CO).',
          ],
        },
        {
          title: '6. Vos droits et autorité de surveillance suisse',
          paragraphs: [
            'Conformément aux art. 25 et suivants de la nLPD et aux art. 15 et suivants du RGPD, vous disposez des droits suivants :',
          ],
          bullets: [
            'Droit d’accès aux données vous concernant.',
            'Droit de rectification de données inexactes.',
            'Droit à l’effacement et limitation du traitement.',
            'Droit à la portabilité des données.',
            'Droit de déposer une réclamation auprès de l’autorité suisse : Préposé fédéral à la protection des données et à la transparence (PFPDT / FDPIC, Feldeggweg 1, CH-3003 Berne — www.edoeb.admin.ch).',
          ],
        },
      ],
    },
    cookie: {
      title: 'Politique relative aux Cookies et Stockage Local',
      subtitle:
        'Transparence technique complète : aucun cookie publicitaire ou traceur invasif de tiers.',
      intro:
        'GWD Group applique les principes de minimisation : ce site ne dépose aucun cookie de profilage commercial tiers (comme Meta Pixel ou Google Analytics standard).',
      noProfilingNotice:
        'Aucun traceur publicitaire : tous les composants et polices sont servis en local.',
      storageTableTitle: 'Technologies de stockage actives sur votre terminal',
      storageTableHeaders: {
        key: 'Clé / Identifiant',
        type: 'Technologie',
        purpose: 'Finalité',
        duration: 'Conservation',
      },
      storageItems: [
        {
          key: BUSINESS_INFO.cookieStorageKey,
          type: 'LocalStorage du navigateur',
          purpose:
            'Enregistre vos choix de consentement pour éviter la réapparition systématique du bandeau lors de vos prochaines visites.',
          duration: 'Persistant (jusqu’à effacement manuel par l’utilisateur)',
        },
      ],
      settingsCardTitle: 'Gestion de vos préférences',
      settingsCardSubtitle:
        'Vous pouvez modifier à tout moment vos choix de consentement pour les futures mesures d’audience.',
      browserControlTitle: 'Paramétrage via votre navigateur',
      browserControlBody:
        'Vous pouvez supprimer ou bloquer les données stockées directement depuis les paramètres de votre navigateur dans la section « Confidentialité et sécurité ».',
    },
    impressum: {
      title: 'Impressum & Mentions Légales',
      subtitle:
        'Informations légales conformément à l’article 3 al. 1 let. s de la Loi fédérale contre la concurrence déloyale (LCD).',
      entitySectionTitle: 'Dénomination et marque du groupe',
      entityName: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand})`,
      statusTitle: 'Statut juridique et immatriculation',
      statusBadge: 'En cours de formalisation notariale / constitution',
      statusBody:
        'GWD Group opère en qualité de Venture Studio & Agence Web à Lugano (Canton du Tessin). La forme juridique définitive, l’adresse postale exacte ainsi que le numéro IDE (UID) / numéro TVA suisse sont en cours de constitution notariale et d’enregistrement au Registre du commerce. Les données d’immatriculation définitives seront publiées ici dès leur validation légale.',
      headquartersTitle: 'Siège et localisation',
      locationDetails: [
        `Localité : ${BUSINESS_INFO.address.locality}`,
        `Canton : ${BUSINESS_INFO.address.regionName} (${BUSINESS_INFO.address.region})`,
        `Pays : ${BUSINESS_INFO.address.countryNameFr} (${BUSINESS_INFO.address.countryCode})`,
        `Horaires d’ouverture : ${BUSINESS_INFO.openingHours.displayLabel}`,
        `Site internet officiel : ${BUSINESS_INFO.defaultSiteUrl}`,
      ],
      contactTitle: 'Contact direct',
      contactBody:
        'Pour toute notification ou demande formelle, le formulaire de contact en ligne (réponse sous 4 heures ouvrées) ou les lignes directes du groupe sont à votre disposition.',
      disclaimerTitle: 'Exclusion de responsabilité',
      disclaimerBody:
        'Les informations publiées sur ce site sont rédigées avec soin. GWD Group décline toute responsabilité quant aux contenus des sites tiers accessibles par des liens externes.',
      copyrightTitle: 'Propriété intellectuelle et droits d’auteur',
      copyrightBody:
        'L’ensemble des contenus, codes sources, marques et designs de ce site sont protégés par le droit d’auteur suisse et international. Toute reproduction non autorisée est interdite.',
    },
  },
  en: {
    ui: {
      badge: 'Swiss FADP (SR 235.1) · EU GDPR · UWG Art. 3 Para. 1 Let. s',
      tabs: {
        privacy: 'Privacy Policy (FADP)',
        cookie: 'Cookies & Storage',
        impressum: 'Impressum (Corporate)',
      },
      lastUpdatedLabel: 'Last Regulatory Update',
      lastUpdatedValue: 'February 2026 · Lugano, Canton Ticino',
    },
    privacy: {
      title: 'Privacy Policy (Swiss FADP / EU GDPR)',
      subtitle:
        'Personal data processing policy compliant with the Swiss Federal Act on Data Protection (FADP / nLPD, SR 235.1) and the European Union General Data Protection Regulation (GDPR).',
      controllerTitle: '1. Data Controller',
      controllerBody: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand}), with operational headquarters in ${BUSINESS_INFO.address.locality} (${BUSINESS_INFO.address.regionName}, ${BUSINESS_INFO.address.countryNameEn}). For any privacy-related requests or to exercise your statutory data protection rights, please use the Contact form or address formal notices to group leadership.`,
      sections: [
        {
          title: '2. Categories of Processed Data & Data Minimization',
          paragraphs: [
            'We strictly process only personal data required to provide our services and ensure technical system stability (data minimization principle under Art. 6 Swiss FADP):',
          ],
          bullets: [
            'Technical & Connection Data: IP address (processed strictly for network defense and server diagnostics), timestamp, HTTP response status code, and browser user-agent.',
            'Voluntarily Provided Inquiry Data: Name, company name, corporate email address, and project requirements (web development, Ticino local SEO, AI voice agents, or SaaS platform demos).',
          ],
        },
        {
          title: '3. Processing Purposes & Legal Grounds',
          paragraphs: [
            'Personal data is processed exclusively for explicit and lawful purposes:',
          ],
          bullets: [
            'Responding to business inquiries, quotes, and exploratory technical calls (pre-contractual steps under Art. 31 FADP and Art. 6(1)(b) GDPR).',
            'Provisioning demo access to proprietary group SaaS platforms.',
            'Ensuring platform cyber-resilience and operational integrity.',
            'No personal data is ever sold, rented, or transferred to third-party ad brokers for profiling or behavioral retargeting.',
          ],
        },
        {
          title: '4. Hosting, Infrastructure & Cross-Border Transfers (Art. 19 Para. 4 FADP)',
          paragraphs: [
            'Our hosting infrastructure operates across secure data centers located within Switzerland and the European Economic Area (EEA). If international data routing occurs, it is limited to jurisdictions recognized as providing adequate statutory protection under Annex 1 of the Swiss Data Protection Ordinance (DPO) or governed by FADP-approved Standard Contractual Clauses (SCCs).',
            'Privacy-by-Design Engineering: All typographic fonts (Outfit, Plus Jakarta Sans, JetBrains Mono) are hosted locally on our own web application server. No user IP addresses or request headers are transmitted to Google Fonts or remote third-party CDN endpoints upon page load.',
          ],
        },
        {
          title: '5. Data Retention & Erasure',
          paragraphs: [
            'Inquiry records are retained only as long as necessary to fulfill the operational business dialogue, subject to Swiss statutory commercial retention obligations where formal contracts arise (Swiss Code of Obligations CO). Technical server logs are purged or pseudonymized on a regular cycle.',
          ],
        },
        {
          title: '6. Data Subject Rights & Swiss Supervisory Authority',
          paragraphs: [
            'Under Articles 25 et seq. of the Swiss FADP and Articles 15 et seq. of the EU GDPR, you are entitled to the following rights free of charge:',
          ],
          bullets: [
            'Right of access to personal data retained concerning you.',
            'Right of rectification of inaccurate or outdated information.',
            'Right of erasure and restriction of unauthorized processing.',
            'Right to data portability.',
            'Right to lodge a complaint with the Swiss Federal Data Protection and Information Commissioner (FDPIC / IFPDT, Feldeggweg 1, CH-3003 Bern — www.edoeb.admin.ch).',
          ],
        },
      ],
    },
    cookie: {
      title: 'Cookie Policy & Local Storage Transparency',
      subtitle:
        'Zero behavioral tracking cookies or third-party marketing pixels.',
      intro:
        'GWD Group follows strict privacy-first web principles. This website does not deploy third-party advertising or profiling cookies (such as Meta Pixel or standard Google Analytics trackers).',
      noProfilingNotice:
        'No ad trackers deployed: all fonts, scripts, and graphical icons are self-hosted locally.',
      storageTableTitle: 'Technical Storage Employed in Your Browser',
      storageTableHeaders: {
        key: 'Key / Identifier',
        type: 'Mechanism',
        purpose: 'Operational Purpose',
        duration: 'Retention',
      },
      storageItems: [
        {
          key: BUSINESS_INFO.cookieStorageKey,
          type: 'Browser LocalStorage',
          purpose:
            'Persists your privacy consent decision across session state and future visits, preventing the modal from interrupting your browsing experience.',
          duration: 'Persistent (until browser cache/storage is cleared or settings updated)',
        },
      ],
      settingsCardTitle: 'Consent Preferences',
      settingsCardSubtitle:
        'Adjust your preferences for future privacy-respecting analytics at any time.',
      browserControlTitle: 'Direct Browser Controls',
      browserControlBody:
        'You can inspect, clear, or block stored web application data at any time through your browser settings under «Privacy & Security» > «Site Data».',
    },
    impressum: {
      title: 'Impressum & Corporate Notice',
      subtitle:
        'Statutory provider disclosure pursuant to Art. 3 Para. 1 Let. s of the Swiss Federal Act Against Unfair Competition (UWG).',
      entitySectionTitle: 'Corporate Designation & Group Brand',
      entityName: `${BUSINESS_INFO.brandName} (${BUSINESS_INFO.combinedBrand})`,
      statusTitle: 'Corporate Registration Status',
      statusBadge: 'In Formation / Notarial Formalization',
      statusBody:
        'GWD Group operates as a Digital Venture Studio & Web Agency in Lugano (Canton Ticino). Formal corporate statutory form, exact street address, and Swiss Commercial Register UID / VAT numbers are currently undergoing notarial formalization and commercial register registration. Final registration records will be updated directly in this Impressum upon formal entry.',
      headquartersTitle: 'Operational Location',
      locationDetails: [
        `Locality: ${BUSINESS_INFO.address.locality}`,
        `Canton: ${BUSINESS_INFO.address.regionName} (${BUSINESS_INFO.address.region})`,
        `Country: ${BUSINESS_INFO.address.countryNameEn} (${BUSINESS_INFO.address.countryCode})`,
        `Business Hours: ${BUSINESS_INFO.openingHours.displayLabel}`,
        `Official Site: ${BUSINESS_INFO.defaultSiteUrl}`,
      ],
      contactTitle: 'Direct Inquiries',
      contactBody:
        'For institutional inquiries, project briefs, or official communications, please utilize the Contact form (response within 4 business hours) or direct team channels on the site.',
      disclaimerTitle: 'Liability Disclaimer for Content & Links',
      disclaimerBody:
        'All contents on this site have been prepared with the highest care. GWD Group accepts no liability for third-party links to affiliated group platforms (e.g., sititicino.ch, swissleadfinder.ch, rankuplist.com, pratiko.ch, salviapet.com), for which the respective operators remain solely responsible.',
      copyrightTitle: 'Intellectual Property & Copyright',
      copyrightBody:
        'All textual content, codebases, architectures, and brand assets on this web application are protected by Swiss and international copyright laws. Unauthorized reproduction is strictly prohibited.',
    },
  },
};
