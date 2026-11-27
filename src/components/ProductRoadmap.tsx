import { CheckCircle2, Clock, Sparkles, Milestone } from 'lucide-react';
import { Language, ProjectItem } from '../types/showcase';
import { PRODUCT_ROADMAPS, RoadmapMilestone } from '../data/roadmaps';
import { TRANSLATIONS } from '../data/translations';

interface ProductRoadmapProps {
  project: ProjectItem;
  lang: Language;
}

export function ProductRoadmap({ project, lang }: ProductRoadmapProps) {
  const t = TRANSLATIONS[lang];
  const roadmapData = PRODUCT_ROADMAPS[project.slug] || {
    upcomingRelease: {
      it: 'Prossimo Rilascio · Q3 2026',
      de: 'Nächstes Release · Q3 2026',
      fr: 'Prochaine Version · Q3 2026',
      en: 'Next Release · Q3 2026',
    },
    milestones: [
      {
        id: 'd1',
        quarter: { it: 'Q1 2024', de: 'Q1 2024', fr: 'Q1 2024', en: 'Q1 2024' },
        status: 'completed',
        title: {
          it: 'Architettura Core & MVP',
          de: 'Core-Architektur & MVP',
          fr: 'Architecture Core & MVP',
          en: 'Core Architecture & MVP',
        },
        description: {
          it: 'Sviluppo dell’infrastruttura di base, autenticazione sicura e test prestazionali iniziali.',
          de: 'Entwicklung der Grundinfrastruktur, sichere Authentifizierung und erste Performance-Tests.',
          fr: 'Développement de l’infrastructure de base, authentification sécurisée et tests initiaux.',
          en: 'Core infrastructure development, secure authentication, and initial performance benching.',
        },
        features: {
          it: ['Stack React / Node.js', 'Database ottimizzato', 'UI responsive'],
          de: ['React / Node.js Stack', 'Optimierte Datenbank', 'Responsive UI'],
          fr: ['Stack React / Node.js', 'Base de données optimisée', 'UI responsive'],
          en: ['React / Node.js stack', 'Optimized database', 'Responsive UI'],
        },
      },
      {
        id: 'd2',
        quarter: { it: 'Q3 2024', de: 'Q3 2024', fr: 'Q3 2024', en: 'Q3 2024' },
        status: 'completed',
        title: {
          it: 'Lancio Beta Pubblica & Feedback',
          de: 'Öffentlicher Beta-Start & Feedback',
          fr: 'Lancement Bêta Publique & Retours',
          en: 'Public Beta Launch & Feedback',
        },
        description: {
          it: 'Rilascio della versione beta ai primi utenti pilota in Ticino e Svizzera con raccolta feedback.',
          de: 'Freigabe der Beta-Version für erste Testnutzer im Tessin und der Schweiz.',
          fr: 'Sortie de la version bêta pour les premiers utilisateurs pilotes en Suisse.',
          en: 'Release of beta version to initial pilot users across Switzerland with feedback loops.',
        },
        features: {
          it: ['Onboarding guidato', 'Raccolta feedback utenti', 'Ottimizzazione UX'],
          de: ['Geführtes Onboarding', 'Nutzer-Feedback', 'UX-Optimierung'],
          fr: ['Onboarding guidé', 'Collecte de retours', 'Optimisation UX'],
          en: ['Guided onboarding', 'User feedback loops', 'UX refinement'],
        },
      },
      {
        id: 'd3',
        quarter: { it: 'Q1–Q2 2025', de: 'Q1–Q2 2025', fr: 'Q1–Q2 2025', en: 'Q1–Q2 2025' },
        status: 'in-progress',
        title: {
          it: 'Integrazione API & Automazioni',
          de: 'API-Integration & Automatisierungen',
          fr: 'Intégration API & Automatisations',
          en: 'API Integration & Automations',
        },
        description: {
          it: 'Sviluppo di connettori webhook avanzati e automazioni guidate da intelligenza artificiale.',
          de: 'Entwicklung erweiterter Webhook-Konnektoren und KI-gesteuerter Automatisierungen.',
          fr: 'Développement de connecteurs webhooks avancés et d’automatisations guidées par IA.',
          en: 'Development of advanced webhook connectors and AI-driven workflow automations.',
        },
        features: {
          it: ['API REST & Webhooks', 'Automazioni AI', 'Dashboard analitica'],
          de: ['REST API & Webhooks', 'KI-Automatisierungen', 'Analytik-Dashboard'],
          fr: ['API REST & Webhooks', 'Automatisations IA', 'Dashboard analytique'],
          en: ['REST API & Webhooks', 'AI automations', 'Analytics dashboard'],
        },
      },
      {
        id: 'd4',
        quarter: { it: 'Q3–Q4 2025', de: 'Q3–Q4 2025', fr: 'Q3–Q4 2025', en: 'Q3–Q4 2025' },
        status: 'upcoming',
        title: {
          it: 'Espansione Multi-Regione & Enterprise',
          de: 'Multi-Region- & Enterprise-Expansion',
          fr: 'Expansion Multi-Région & Enterprise',
          en: 'Multi-Region & Enterprise Expansion',
        },
        description: {
          it: 'Scalabilità cloud multi-regione con conformità rigorosa alla nLPD svizzera e GDPR europeo.',
          de: 'Multi-Regionen-Cloud-Skalierung mit strenger Konformität zu Schweizer nDSG und EU-DSGVO.',
          fr: 'Mise à l’échelle cloud multi-région conforme à la nLPD suisse et au RGPD européen.',
          en: 'Multi-region cloud scaling with strict compliance to Swiss FADP and European GDPR.',
        },
        features: {
          it: ['Conformità nLPD avanzata', 'SSO aziendale', 'Supporto dedicato 24/7'],
          de: ['Erweiterte nDSG-Konformität', 'Unternehmens-SSO', '24/7-Support'],
          fr: ['Conformité nLPD avancée', 'SSO d’entreprise', 'Support dédié 24/7'],
          en: ['Advanced FADP compliance', 'Enterprise SSO', 'Dedicated 24/7 support'],
        },
      },
    ],
  };

  const getStatusBadge = (status: RoadmapMilestone['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/12 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            <span>{lang === 'it' ? 'Completato' : lang === 'de' ? 'Abgeschlossen' : lang === 'fr' ? 'Terminé' : 'Completed'}</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#2DD4BF]/12 border border-[#0F766E]/30 dark:border-[#2DD4BF]/30 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0F766E] dark:text-[#2DD4BF]">
            <Clock className="h-3 w-3 animate-pulse" aria-hidden="true" />
            <span>{lang === 'it' ? 'In Corso' : lang === 'de' ? 'In Arbeit' : lang === 'fr' ? 'En Cours' : 'In Progress'}</span>
          </span>
        );
      case 'upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/12 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>{lang === 'it' ? 'In Arrivo' : lang === 'de' ? 'Geplant' : lang === 'fr' ? 'À Venir' : 'Upcoming'}</span>
          </span>
        );
    }
  };

  return (
    <section className="space-y-6 rounded-2xl border border-[#E5E2DC] bg-white dark:border-[#292524] dark:bg-[#1C1917] p-6 sm:p-8 shadow-sm dark:shadow-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2DC] dark:border-[#292524] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#0F766E] dark:text-[#2DD4BF]">
            <Milestone className="h-4 w-4" aria-hidden="true" />
            <span>{project.name} · Roadmap</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#141210] dark:text-[#FAFAF9]">
            {lang === 'it' ? 'Fasi di Sviluppo & Funzionalità in Arrivo' : lang === 'de' ? 'Entwicklungsphasen & Kommende Funktionen' : lang === 'fr' ? 'Phases de Développement & Fonctionnalités' : 'Development Phases & Upcoming Features'}
          </h2>
          <p className="text-sm text-[#57534E] dark:text-[#A8A29E]">
            {lang === 'it'
              ? 'L’evoluzione continua della piattaforma SaaS con rilascio iterativo e standard svizzeri di qualità.'
              : lang === 'de'
              ? 'Die kontinuierliche Weiterentwicklung der SaaS-Plattform mit iterativen Releases.'
              : lang === 'fr'
              ? 'L’évolution continue de la plateforme SaaS avec des livraisons itératives.'
              : 'The continuous evolution of the SaaS platform with iterative releases and Swiss quality.'}
          </p>
        </div>

        <div className="rounded-xl border border-[#0F766E]/30 bg-[#F3F1EC] dark:border-[#2DD4BF]/30 dark:bg-[#0C0A09] px-4 py-2.5 text-right shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#57534E] dark:text-[#A8A29E]">
            {lang === 'it' ? 'Prossimo Aggiornamento' : lang === 'de' ? 'Nächstes Update' : lang === 'fr' ? 'Prochaine Mise à Jour' : 'Next Release'}
          </div>
          <div className="font-mono text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF] mt-0.5">
            {roadmapData.upcomingRelease[lang]}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {roadmapData.milestones.map((item, idx) => (
          <div
            key={item.id}
            className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all duration-300 ${
              item.status === 'in-progress'
                ? 'border-[#0F766E]/45 bg-[#F8F7F4] dark:border-[#2DD4BF]/50 dark:bg-[#0C0A09]/80 shadow-[0_12px_32px_-12px_rgba(13,148,136,0.16)] dark:shadow-[0_12px_32px_-12px_rgba(45,212,191,0.15)]'
                : 'border-[#E5E2DC] bg-[#F8F7F4]/70 hover:border-[#D6D3CD] dark:border-[#292524] dark:bg-[#0C0A09]/40 dark:hover:border-slate-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-[#0F766E] dark:text-[#2DD4BF]">
                  {item.quarter[lang]}
                </span>
                {getStatusBadge(item.status)}
              </div>

              <div className="space-y-1.5">
                <div className="font-mono text-[10px] text-[#57534E] dark:text-[#A8A29E]">FASE 0{idx + 1}</div>
                <h3 className="font-display text-base font-bold text-[#141210] dark:text-[#FAFAF9] leading-snug">
                  {item.title[lang]}
                </h3>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                  {item.description[lang]}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E2DC] dark:border-[#292524] space-y-1.5">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#57534E] dark:text-slate-500">
                {lang === 'it' ? 'Funzionalità chiave:' : lang === 'de' ? 'Kernfunktionen:' : lang === 'fr' ? 'Fonctionnalités clés :' : 'Key features:'}
              </div>
              <ul className="space-y-1 text-xs text-[#141210] dark:text-[#FAFAF9]">
                {item.features[lang].map((feat) => (
                  <li key={feat} className="flex items-center gap-1.5 truncate">
                    <span className="h-1 w-1 rounded-full bg-[#0F766E] dark:bg-[#2DD4BF] shrink-0" aria-hidden="true" />
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
