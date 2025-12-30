import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { Brain, Bot, BookOpen, Users, Heart, LineChart, Languages } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  route: string;
}

interface RelatedFeaturesProps {
  currentFeature: string;
  maxItems?: number;
}

const ALL_FEATURES: Feature[] = [
  {
    id: 'interpretest',
    title: 'InterpreTest',
    description: 'Assess your skills with AI-powered testing and get personalized feedback',
    badge: 'Assessment',
    icon: Bot,
    route: '/interpretest'
  },
  {
    id: 'interprecoach',
    title: 'InterpreCoach',
    description: 'Get real-time AI assistance during live interpretation sessions',
    badge: 'Assistant',
    icon: Brain,
    route: '/interprecoach'
  },
  {
    id: 'interprestudy',
    title: 'InterpreStudy',
    description: 'Learn medical terminology with AI-generated flashcards and scenarios',
    badge: 'Training',
    icon: BookOpen,
    route: '/interprestudy'
  },
  {
    id: 'interpretrack',
    title: 'InterpreTrack',
    description: 'Track your earnings, calls, and performance metrics in one place',
    badge: 'Analytics',
    icon: LineChart,
    route: '/interpretrack'
  },
  {
    id: 'interprelink',
    title: 'InterpreLink',
    description: 'Connect with fellow interpreters and build your professional network',
    badge: 'Community',
    icon: Users,
    route: '/interprelink'
  },
  {
    id: 'interpresigns',
    title: 'InterpreSigns',
    description: 'Learn and practice sign language with AI-powered recognition',
    badge: 'Interactive',
    icon: Languages,
    route: '/interpresigns'
  },
  {
    id: 'interpre-wellness',
    title: 'InterpreWellness',
    description: 'Get 24/7 mental health support designed for interpreters',
    badge: 'Wellness',
    icon: Heart,
    route: '/interpre-wellness'
  }
];

// Define which features are related to each feature
const RELATED_MAP: Record<string, string[]> = {
  interpretest: ['interprecoach', 'interprestudy', 'interpretrack'],
  interprecoach: ['interpretest', 'interpre-wellness', 'interprestudy'],
  interprestudy: ['interpretest', 'interprecoach', 'interpresigns'],
  interpretrack: ['interprecoach', 'interpretest', 'interprelink'],
  interprelink: ['interpre-wellness', 'interprestudy', 'interprecoach'],
  interpresigns: ['interprestudy', 'interpretest', 'interprecoach'],
  'interpre-wellness': ['interprecoach', 'interprelink', 'interpretest']
};

export function RelatedFeatures({ currentFeature, maxItems = 3 }: RelatedFeaturesProps) {
  const relatedIds = RELATED_MAP[currentFeature] || [];
  const relatedFeatures = relatedIds
    .map(id => ALL_FEATURES.find(f => f.id === id))
    .filter(Boolean)
    .slice(0, maxItems) as Feature[];

  if (relatedFeatures.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Related Solutions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enhance your interpretation practice with these complementary tools
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(relatedFeatures.length, 3)} gap-6 max-w-6xl mx-auto`}>
          {relatedFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="group hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline">{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:text-primary" asChild>
                    <Link to={feature.route}>
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/#solutions">
              View All Solutions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
