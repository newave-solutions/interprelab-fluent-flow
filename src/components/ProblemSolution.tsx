import { CheckCircle2, DollarSign, Clock, Brain } from "lucide-react";

const challenges = [
  {
    icon: DollarSign,
    problem: "Expensive Training",
    solution: "Affordable AI-powered assessment and courses approved by NBCMI and CCHI",
    stat: "90% less expensive than traditional courses"
  },
  {
    icon: Clock,
    problem: "Time-Consuming Process",
    solution: "Get instant feedback and personalized learning paths in minutes",
    stat: "30-minute assessments vs. months of coursework"
  },
  {
    icon: Brain,
    problem: "No Real-Time Support",
    solution: "InterpreCoach provides live assistance during actual calls",
    stat: "24/7 AI support when you need it"
  }
];

export const ProblemSolution = () => {
  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">
              The Challenge
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Professional Development Shouldn't Be This Hard
            </h2>
            <p className="text-lg text-stone-600 dark:text-muted-foreground font-light max-w-3xl mx-auto">
              As working interpreters, we've experienced the frustration firsthand. Expensive courses with minimal support. No real-time assistance during calls. Guesswork about where to improve. <strong>There had to be a better way.</strong>
            </p>
          </div>

          {/* Problem-Solution Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {challenges.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-stone-50 dark:bg-stone-950 rounded-xl p-8 border border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50 transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-medium mb-2 text-red-900 dark:text-red-200">
                        {item.problem}
                      </h3>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-red-200 via-nobel-gold to-green-200 dark:from-red-900 dark:via-nobel-gold dark:to-green-900 my-6" />

                  {/* Solution */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {item.solution}
                      </p>
                    </div>
                  </div>

                  {/* Stat */}
                  <div className="mt-6 p-3 bg-nobel-gold/10 rounded-lg border border-nobel-gold/20">
                    <p className="text-sm font-bold text-nobel-gold text-center">
                      {item.stat}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-stone-50 dark:bg-stone-950 rounded-xl p-8 border border-stone-200 dark:border-border">
            <h3 className="font-serif text-2xl font-medium mb-4">
              Ready to Transform Your Practice?
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-2xl mx-auto">
              Join thousands of interpreters who've made the switch to smarter, more affordable professional development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>NBCMI & CCHI approved</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
