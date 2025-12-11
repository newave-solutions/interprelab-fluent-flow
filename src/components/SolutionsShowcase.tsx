import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Bot, BookOpen, Users, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

interface Solution {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
  videoSrc?: string;
  route: string;
}

const solutions: Solution[] = [
  {
    id: "interprebot",
    title: "InterpreBot",
    description: "AI-Powered Skills Assessment",
    highlights: [
      "Free professional assessment",
      "Real-time performance feedback",
      "Personalized improvement roadmap",
      "Track your progress over time"
    ],
    icon: <Bot className="w-8 h-8" />,
    route: "/interprebot"
  },
  {
    id: "interprecoach",
    title: "InterpreCoach",
    description: "Real-Time AI Companion",
    highlights: [
      "Live call support & guidance",
      "Terminology suggestions",
      "Performance insights",
      "Confidence booster during high-stakes calls"
    ],
    icon: <Brain className="w-8 h-8" />,
    route: "/interprecoach"
  },
  {
    id: "interprestudy",
    title: "InterpreStudy",
    description: "Personalized Learning Path",
    highlights: [
      "Specialized medical terminology",
      "AI-generated flashcards",
      "Interactive mock scenarios",
      "Accessible training at your fingertips"
    ],
    icon: <BookOpen className="w-8 h-8" />,
    route: "/interprestudy"
  },
  {
    id: "interprelink",
    title: "InterpreLink",
    description: "Professional Networking",
    highlights: [
      "Connect with fellow interpreters",
      "Share experiences & strategies",
      "Community support network",
      "The professional network you deserve"
    ],
    icon: <Users className="w-8 h-8" />,
    route: "/interprelink"
  },
  {
    id: "interprewellness",
    title: "InterpreWellness",
    description: "Mental Health Support",
    highlights: [
      "24/7 AI wellness coach",
      "Vicarious trauma support",
      "Stress management tools",
      "Understanding your unique burden"
    ],
    icon: <Heart className="w-8 h-8" />,
    route: "/interpre-wellness"
  }
];

export const SolutionsShowcase = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-fade-in");
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-stone-50 via-stone-50 to-white dark:from-stone-950 dark:via-stone-950 dark:to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--nobel-gold)/0.05)_0%,_transparent_65%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">
            Our Solutions
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-foreground">
            Embrace the Change, <span className="text-nobel-gold">Don't Get Replaced By It</span>
          </h2>
          <p className="text-lg md:text-xl text-stone-600 dark:text-muted-foreground max-w-3xl mx-auto font-light">
            AI-powered solutions addressing every pain point—built by interpreters, for interpreters
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <Card
              key={solution.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group opacity-0 transition-all duration-500 hover:scale-105 hover:shadow-xl bg-white dark:bg-card border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50"
            >
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-nobel-gold/10 flex items-center justify-center mb-4 group-hover:bg-nobel-gold/20 transition-colors">
                  <div className="text-nobel-gold">
                    {solution.icon}
                  </div>
                </div>
                <CardTitle className="font-serif text-2xl mb-2">{solution.title}</CardTitle>
                <CardDescription className="text-base text-stone-600 dark:text-stone-400">
                  {solution.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {solution.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <span className="text-nobel-gold mt-1">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link to={solution.route}>
                  <Button 
                    className="w-full bg-nobel-gold hover:bg-nobel-gold/90 text-white rounded-full transition-all shadow-sm group-hover:shadow-lg"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
