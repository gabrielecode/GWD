import { PROJECTS } from '../data/projects';
import { SITITICINO_APPS } from '../data/sitiTicinoApps';
import { TICINO_CITIES } from '../data/services';
import { Language } from '../types/showcase';

export const STUDIO_FOUNDED_YEAR = 2018;

const SHARED_APP_IDS_IN_PROJECTS = new Set(['rankuplist', 'swissleadfinder']);

export interface HeroStudioStats {
  activeSaasUsersFormatted: string;
  activeSaasPlatformsCount: number;
  projectsDeliveredFormatted: string;
  yearsOfExperienceFormatted: string;
}

export function getHeroStudioStats(lang: Language): HeroStudioStats {
  const saasProjects = PROJECTS.filter((p) => p.engine === 'saas');
  const uniqueSitiTicinoApps = SITITICINO_APPS.filter(
    (app) => !SHARED_APP_IDS_IN_PROJECTS.has(app.id)
  );

  const activeSaasUsersTotal =
    saasProjects.reduce((sum, item) => sum + (item.activeUsersCount ?? 0), 0) +
    uniqueSitiTicinoApps.reduce(
      (sum, app) => sum + (app.activeUsersCount ?? 0),
      0
    );

  const activeSaasPlatformsCount =
    saasProjects.length + uniqueSitiTicinoApps.length;

  const regionalBusinessesServed = TICINO_CITIES.reduce((sum, city) => {
    const parsed = Number.parseInt(city.stats.businessesServed, 10);
    return sum + (Number.isNaN(parsed) ? 0 : parsed);
  }, 0);

  const showcasePortfolioCount =
    PROJECTS.length + uniqueSitiTicinoApps.length;

  const totalProjectsDelivered =
    regionalBusinessesServed + showcasePortfolioCount;

  const currentYear = Math.max(STUDIO_FOUNDED_YEAR, new Date().getFullYear());
  const yearsOfExperience = currentYear - STUDIO_FOUNDED_YEAR;

  const locale =
    lang === 'en' ? 'en-US' : lang === 'it' ? 'it-IT' : 'de-CH';

  return {
    activeSaasUsersFormatted: `${new Intl.NumberFormat(locale).format(
      activeSaasUsersTotal
    )}+`,
    activeSaasPlatformsCount,
    projectsDeliveredFormatted: `${new Intl.NumberFormat(locale).format(
      totalProjectsDelivered
    )}+`,
    yearsOfExperienceFormatted: `${yearsOfExperience}+`,
  };
}
