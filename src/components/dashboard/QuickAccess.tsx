import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Brain, Bot, BookOpen, LineChart, Languages, Users, Heart,
  Settings, User, ArrowRight, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  gradient: string;
  badge?: string;
}

const QUICK_ACCESS_ITEMS: QuickAccessItem[] = [
  {
    title: 'Skills Assessment',
    description: 'Test your interpretation skills with AI',
    icon: <Bot className="w-6 h-6" />,
    route: '/interpretest',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    badge: 'Free'
  },
  {
    title: 'AI Coach',
    description: 'Get real-time assistance during calls',
    icon: <Brain className="w-6 h-6" />,
    route: '/interprecoach',
    gradient: 'from-purple-500/10 to-pink-500/10',
    badge: 'Live'
  },
  {
    title: 'Study Tools',
    description: 'Learn terminology and practice scenarios',
    icon: <BookOpen className="w-6 h-6" />,
    route: '/interprestudy',
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
  {
    title: 'Call Tracker',
    description: 'Track earnings and performance',
    icon: <LineChart className="w-6 h-6" />,
    route: '/interpretrack/dashboard',
    gradient: 'from-orange-500/10 to-red-500/10'
  },
  {
    title: 'Sign Language',
    description: 'Practice ASL with AI recognition',
    icon: <Languages className="w-6 h-6" />,
    route: '/interpresigns',
    gradient: 'from-indigo-500/10 to-blue-500/10'
  },
  {
    title: 'Community',
    description: 'Connect with fellow interpreters',
    icon: <Users className="w-6 h-6" />,
    route: '/interprelink',
    gradient: 'from-teal-500/10 to-cyan-500/10'
  },
  {
    title: 'Wellness',
    description: 'Mental health support and resources',
    icon: <Heart className="w-6 h-6" />,
    route: '/interpre-wellness',
    gradient: 'from-rose-500/10 to-pink-500/10'
  },
  {
    title: 'Settings',
    description: 'Manage your preferences',
    icon: <Settings className="w-6 h-6" />,
    route: '/settings',
    gradient: 'from-gray-500/10 to-slate-500/10'
  },
  {
    title: 'Profile',
    description: 'View and edit your account',
    icon: <User className="w-6 h-6" />,
    route: '/account',
    gradient: 'from-amber-500/10 to-yellow-500/10'
  }
];

export function QuickAccess() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Quick Access
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Jump to your frequently used tools
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/resources">
              Resources
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              className="group"
            >
              <div
                className={cn(
                  "relative p-4 rounded-xl border bg-gradient-to-br",
                  item.gradient,
                  "hover:shadow-md hover:border-primary/50 transition-all hover:-translate-y-0.5"
                )}
              >
                {item.badge && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                      {item.badge}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/50 text-primary group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
