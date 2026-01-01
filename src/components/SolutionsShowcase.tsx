import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Bot, BookOpen, Users, Heart, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import interprebotsGroup from "@/assets/interprebots-group-features.png";
import interpretrackBot from "/interpretrack-bot.png";
import interprewellnessBot from "/interpre-wellness-bot.png";
import interprecoachBot from "/interprecoach-bot.png";
import interprestudyBot from "/interprestudy-bot.png";
import interpresignsBot from "/interpresigns-bot.png";
import interprelinkBot from "/interprelink-bot.png";
import interpretestBot from "/interpretest-bot.png";

interface Solution {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  icon: React.ReactNode;
  videoSrc?: string;
  imageSrc?: string;
  route: string;
  badge?: string;
}

const solutions: Solution[] = [
  {
    id: "interpretest",
    title: "InterpreTest",
    description: "AI-Powered Skills Assessment",
    badge: "Assessment",
    highlights: [
      "Free professional assessment",
      "Real-time performance feedback",
      "Personalized improvement roadmap",
      "Track your progress over time"
    ],
    icon: <Bot className="w-8 h-8" />,
    imageSrc: interpretestBot,
    route: "/interprebot"
  },
  {
    id: "interprecoach",
    title: "InterpreCoach",
    description: "Real-Time AI Companion",
    badge: "Assistant",
    highlights: [
      "Live call support & guidance",
      "Terminology suggestions",
      "Performance insights",
      "Confidence booster during high-stakes calls"
    ],
    icon: <Brain className="w-8 h-8" />,
    imageSrc: interprecoachBot,
    route: "/interprecoach"
  },
  {
    id: "interprestudy",
    title: "InterpreStudy",
    description: "Personalized Learning Path",
    badge: "Training",
    highlights: [
      "Specialized medical terminology",
      "AI-generated flashcards",
      "Interactive mock scenarios",
      "Accessible training at your fingertips"
    ],
    icon: <BookOpen className="w-8 h-8" />,
    imageSrc: interprestudyBot,
    route: "/interprestudy"
  },
  {
    id: "interprelink",
    title: "InterpreLink",
    description: "Professional Networking",
    badge: "Community",
    highlights: [
      "Connect with fellow interpreters",
      "Share experiences & strategies",
      "Community support network",
      "The professional network you deserve"
    ],
    icon: <Users className="w-8 h-8" />,
    imageSrc: interprelinkBot,
    route: "/interprelink"
  },
  {
    id: "interprewellness",
    title: "InterpreWellness",
    description: "Mental Health Support",
    badge: "Wellness",
    highlights: [
      "24/7 AI wellness coach",
      "Vicarious trauma support",
      "Stress management tools",
      "Understanding your unique burden"
    ],
    icon: <Heart className="w-8 h-8" />,
    imageSrc: interprewellnessBot,
    route: "/interpre-wellness"
  },
  {
    id: "interpresigns",
    title: "InterpreSigns",
    description: "Interactive Sign Language Learning",
    badge: "Interactive",
    highlights: [
      "AI-powered sign detection",
      "Real-time feedback",
      "Progress tracking",
      "Medical ASL focus"
    ],
    icon: <div className="text-xl font-bold">🤟</div>,
    imageSrc: interpresignsBot,
    route: "/interpresigns"
  },
  {
    id: "interpretrack",
    title: "InterpreTrack",
    description: "Precision Interpretation Logging",
    badge: "Productivity",
    highlights: [
      "Track earnings in real-time",
      "VRI & OPI call logging",
      "Transparency reports",
      "Detailed session analytics"
    ],
    icon: <Clock className="w-8 h-8" />,
    imageSrc: interpretrackBot,
    route: "/interpretrack"
  }
];

export const SolutionsShowcase = () => {
  return (
    <section data-section="solutions" className="py-24 bg-gradient-to-b from-stone-50 via-stone-50 to-white dark:from-stone-950 dark:via-stone-950 dark:to-background relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground particleCount={150} variant="mixed" />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--nobel-gold)/0.05)_0%,_transparent_65%)]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">
            Our Solutions
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-foreground">
            Empower Your Practice with <span className="text-nobel-gold">AI-Enhanced Tools</span>
          </h2>
          <p className="text-lg md:text-xl text-stone-600 dark:text-muted-foreground max-w-3xl mx-auto font-light mb-4">
            Professional tools designed to elevate your interpretation career—built by interpreters, for interpreters
          </p>
          <Link
            to="/resources/industry-challenges"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Learn about the challenges we're addressing
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Floating Bot Group Image */}
        <div className="relative mb-8 flex justify-center">
          <img
            src={interprebotsGroup}
            alt="InterpreLab AI Assistants"
            className="w-full max-w-md md:max-w-lg animate-float drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 20px 40px hsl(var(--nobel-gold) / 0.3))',
            }}
          />
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {solutions.map((solution, index) => (
            <Card
              key={solution.id}
              className={`group transition-all duration-500 hover:scale-105 hover:shadow-xl bg-white dark:bg-card border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50 flex flex-col h-full animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-nobel-gold/10 flex items-center justify-center group-hover:bg-nobel-gold/20 transition-colors">
                    <div className="text-nobel-gold">
                      {solution.icon}
                    </div>
                  </div>
                  {solution.badge && (
                    <span className="px-2 py-1 text-xs font-medium text-nobel-gold bg-nobel-gold/10 rounded-full border border-nobel-gold/20">
                      {solution.badge}
                    </span>
                  )}
                </div>

                {solution.imageSrc && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={solution.imageSrc}
                      alt={`${solution.title} preview`}
                      className={`${solution.id === 'interpretrack' ? 'w-64 h-64' : 'w-48 h-48'} object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2`}
                    />
                  </div>
                )}

                <CardTitle className="font-serif text-2xl mb-2">{solution.title}</CardTitle>
                <CardDescription className="text-base text-stone-600 dark:text-stone-400">
                  {solution.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <ul className="space-y-2 mb-6">
                  {solution.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <span className="text-nobel-gold mt-1">✓</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link to={solution.route} className="mt-auto">
                  <Button
                    className="w-full bg-nobel-gold hover:bg-nobel-gold/90 text-white rounded-full transition-all shadow-sm group-hover:shadow-lg warm-glow"
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
