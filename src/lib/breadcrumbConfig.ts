interface Breadcrumb {
  label: string;
  href?: string;
}

interface RouteConfig {
  label: string;
  parent?: string;
}

const routeConfig: Record<string, RouteConfig> = {
  // Solutions/Products
  '/interpretest': { label: 'InterpreTest', parent: '/solutions' },
  '/interprecoach': { label: 'InterpreCoach', parent: '/solutions' },
  '/interprestudy': { label: 'InterpreStudy', parent: '/solutions' },
  '/interpretrack': { label: 'InterpreTrack', parent: '/solutions' },
  '/interpresigns': { label: 'InterpreSigns', parent: '/solutions' },
  '/interprelink': { label: 'InterpreLink', parent: '/solutions' },
  '/interpre-wellness': { label: 'InterpreWellness', parent: '/solutions' },

  // Virtual parent for solutions
  '/solutions': { label: 'Solutions' },

  // Dashboard pages
  '/dashboard': { label: 'Dashboard' },
  '/interprelink/dashboard': { label: 'InterpreLink', parent: '/dashboard' },
  '/interpretrack/dashboard': { label: 'Call Tracker', parent: '/dashboard' },
  '/interpresigns/dashboard': { label: 'Sign Language', parent: '/dashboard' },
  '/interpretest/dashboard': { label: 'Skills Assessment', parent: '/dashboard' },
  '/settings': { label: 'Settings', parent: '/dashboard' },
  '/account': { label: 'Account', parent: '/dashboard' },

  // Resources
  '/resources': { label: 'Resources' },
  '/resources/industry-insights': { label: 'Industry Insights', parent: '/resources' },

  // Static pages
  '/about': { label: 'About Us' },
  '/contact': { label: 'Contact' },
  '/careers': { label: 'Careers' },
  '/get-in-touch': { label: 'Get In Touch', parent: '/contact' },
  '/waitlist': { label: 'Join Waitlist' },
  '/signin': { label: 'Sign In' },
  '/dilemma': { label: 'The Interpreter Dilemma' },
};

export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  // Don't show breadcrumbs on homepage
  if (pathname === '/' || pathname === '/home') {
    return [];
  }

  const breadcrumbs: Breadcrumb[] = [];

  // Handle dynamic article routes
  if (pathname.startsWith('/resources/articles/')) {
    breadcrumbs.push({ label: 'Resources', href: '/resources' });
    breadcrumbs.push({ label: 'Articles', href: '/resources/industry-insights' });

    // Get article title from URL slug (convert slug to title)
    const slug = pathname.split('/').pop();
    if (slug) {
      const title = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ label: title });
    }
    return breadcrumbs;
  }

  const config = routeConfig[pathname];

  if (!config) {
    // Handle unknown routes - just show the path
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const label = segments[segments.length - 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ label });
    }
    return breadcrumbs;
  }

  // Build breadcrumb trail by following parent chain
  const buildTrail = (path: string): void => {
    const cfg = routeConfig[path];
    if (!cfg) return;

    if (cfg.parent) {
      buildTrail(cfg.parent);
    }

    // Don't add virtual routes (like /solutions) to actual breadcrumbs with links
    if (!path.startsWith('/solutions')) {
      breadcrumbs.push({
        label: cfg.label,
        href: path === pathname ? undefined : path,
      });
    } else {
      // For solutions parent, just add the label without link
      breadcrumbs.push({ label: cfg.label });
    }
  };

  buildTrail(pathname);

  return breadcrumbs;
}

export function getBreadcrumbTitle(pathname: string): string {
  const config = routeConfig[pathname];
  if (config) {
    return config.label;
  }

  // For dynamic routes, try to extract title
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0) {
    return segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return 'InterpreLab';
}
