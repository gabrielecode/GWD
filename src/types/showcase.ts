export type Language = 'it' | 'de' | 'fr' | 'en';

export type ProjectEngine = 'saas' | 'agency';
export type ProjectFilter = 'all' | 'saas' | 'agency';
export type StatusBadgeType = 'live-saas' | 'client-work' | 'ai-division';
export type TicinoCitySlug = 'lugano' | 'bellinzona' | 'locarno' | 'mendrisio';

export interface LocalizedText {
  it: string;
  de: string;
  fr: string;
  en: string;
}

export interface LocalizedStringList {
  it: string[];
  de: string[];
  fr: string[];
  en: string[];
}

export interface ProjectMetric {
  value: string;
  label: LocalizedText;
}

export interface ProjectFeature {
  title: LocalizedText;
  description: LocalizedText;
}

export interface PreviewHighlight {
  label: string;
  value: string;
}

export interface ProjectItem {
  slug: string;
  name: string;
  engine: ProjectEngine;
  status: StatusBadgeType;
  featured: boolean;
  activeUsersCount?: number;
  category: LocalizedText;
  sector: LocalizedText;
  tagline: LocalizedText;
  shortDescription: LocalizedText;
  heroMetric: ProjectMetric;
  secondaryMetrics: ProjectMetric[];
  problemOrChallenge: LocalizedText;
  solution: LocalizedText;
  results: LocalizedText;
  keyFeatures: ProjectFeature[];
  targetAudience: LocalizedText;
    servicesUsed: LocalizedStringList;
  techStack: string[];
  externalUrl: string;
  relatedSlugs: string[];
  previewTheme: {
    primaryHex: string;
    domainUrl: string;
    desktopHeadline: LocalizedText;
    desktopSubline: LocalizedText;
    highlights: PreviewHighlight[];
    uiModules: LocalizedStringList;
  };
}

export interface ServiceStep {
  stepNumber: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface ServiceFaq {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ServiceItem {
  slug: string;
  isAiVertical?: boolean;
  accentType: 'saas' | 'agency' | 'ai';
  title: LocalizedText;
  shortTitle: LocalizedText;
  subtitle: LocalizedText;
  mainBenefit: LocalizedText;
  steps: ServiceStep[];
  includedItems: LocalizedStringList;
  relatedCaseSlugs: string[];
  faqs: ServiceFaq[];
  targetKeywords: LocalizedStringList;
}

export interface TicinoCityProfile {
  slug: TicinoCitySlug;
  name: string;
  regionLabel: LocalizedText;
  headline: LocalizedText;
  description: LocalizedText;
  localFocus: LocalizedText;
  districtsAndHubs: LocalizedText;
  keyIndustries: LocalizedStringList;
  serviceAngles: {
    web: LocalizedText;
    ecommerce: LocalizedText;
    seo: LocalizedText;
    ai: LocalizedText;
  };
  localKeywords: LocalizedStringList;
  primaryKeyword: string;
  featuredCaseSlug: string;
  stats: {
    businessesServed: string;
    avgLighthouse: string;
    responseTime: string;
  };
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  role: LocalizedText;
  company: string;
  city: string;
  rating: number;
  quote: LocalizedText;
  outcome: LocalizedText;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  decided: boolean;
}

export interface SitiTicinoAppItem {
  id: 'pratiko' | 'rankuplist' | 'swissleadfinder' | 'karepet' | 'demapp';
  name: string;
  category: LocalizedText;
  url: string;
  domainLabel: string;
  description: LocalizedText;
  buttonText: LocalizedText;
  accentHex: string;
  badgeText: string;
  activeUsersCount?: number;
  techStack: string[];
  technicalTags: LocalizedStringList;
}

