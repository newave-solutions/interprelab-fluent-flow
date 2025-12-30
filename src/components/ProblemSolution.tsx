import { CheckCircle2, DollarSign, Clock, Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const ProblemSolution = () => {
  const benefits = [
    {
      icon: DollarSign,
      title: "Accessible & Affordable",
      description: "Professional development that fits your budget with AI-powered assessments and NBCMI/CCHI-aligned courses",
      stat: "90% more affordable than traditional programs"
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get personalized feedback and actionable insights in minutes, not months",
      stat: "Results in 30 minutes vs. months of waiting"
    },
    {
      icon: Brain,
      title: "24/7 AI Support",
      description: "InterpreCoach provides real-time assistance during live calls when you need it most",
      stat: "Always available when you need help"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">
              Why InterpreLab
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Professional Development, <span className="text-nobel-gold">Reimagined</span>
            </h2>
            <p className="text-lg text-stone-600 dark:text-muted-foreground font-light max-w-3xl mx-auto mb-4">
              As working interpreters, we built the tools we wished existed. Affordable, accessible, and available when you need them—because advancing your career shouldn't require sacrificing your livelihood.
            </p>
            <Link
              to="/resources/industry-challenges"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Learn about the industry challenges we're addressing
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-stone-50 to-nobel-gold/5 dark:from-stone-950 dark:to-nobel-gold/5 rounded-xl p-8 border border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50 transition-all duration-300 hover:shadow-lg"
                >
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-nobel-gold/10 rounded-lg">
                      <Icon className="w-6 h-6 text-nobel-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-medium mb-2 text-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-stone-700 dark:text-stone-300">
                      {item.description}
                    </p>
                  </div>

                  {/* Stat */}
                  <div className="mt-auto p-3 bg-nobel-gold/10 rounded-lg border border-nobel-gold/20">
                    <p className="text-sm font-bold text-nobel-gold text-center">
                      {item.stat}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-gradient-to-br from-nobel-gold/5 to-primary/5 dark:from-nobel-gold/10 dark:to-primary/10 rounded-xl p-8 border border-nobel-gold/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-nobel-gold" />
              <h3 className="font-serif text-2xl font-medium">
                Ready to Elevate Your Practice?
              </h3>
            </div>
            <p className="text-stone-600 dark:text-stone-300 mb-6 max-w-2xl mx-auto">
              Join thousands of interpreters who are advancing their careers with AI-powered tools designed specifically for professionals like you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>NBCMI & CCHI aligned</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Instant feedback</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
