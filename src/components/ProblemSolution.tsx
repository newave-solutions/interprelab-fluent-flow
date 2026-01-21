import { CheckCircle2, Sparkles, Clock, Brain } from "lucide-react";

export const ProblemSolution = () => {
  const transformations = [
    {
      icon: Sparkles,
      before: "Expensive, Outdated Courses",
      after: "Smart investment in NBCMI and CCHI approved AI-powered training",
      benefit: "Save 90% compared to traditional courses"
    },
    {
      icon: Clock,
      before: "Months of Guesswork",
      after: "Instant feedback and personalized learning paths in minutes",
      benefit: "30-minute assessments, not months of uncertainty"
    },
    {
      icon: Brain,
      before: "Navigating Calls Alone",
      after: "InterpreCoach provides real-time AI support during actual calls",
      benefit: "24/7 guidance when you need it most"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-nobel-gold uppercase">
              Your Transformation
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Transform Every Aspect of Your Practice
            </h2>
          </div>

          {/* Personal Story Introduction */}
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <p className="text-lg text-stone-600 dark:text-muted-foreground font-light leading-relaxed">
              We've walked every step of this journey. Early mornings cramming terminology before certification exams. Late nights replaying difficult calls in our heads, wondering if we could have done better. Years of feeling like we were navigating this career alone.
            </p>
            <p className="text-lg text-foreground font-medium mt-4">
              These aren't just features we built—they're solutions to problems we've lived.
            </p>
          </div>

          {/* Transformation Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {transformations.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="bg-stone-50 dark:bg-stone-950 rounded-xl p-8 border border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50 transition-all duration-300"
                >
                  {/* Before */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-lg">
                      <Icon className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-stone-500 dark:text-stone-400 mb-1">Before</p>
                      <h3 className="font-serif text-lg font-medium text-stone-600 dark:text-stone-300">
                        {item.before}
                      </h3>
                    </div>
                  </div>

                  {/* Transformation Arrow */}
                  <div className="h-px bg-gradient-to-r from-stone-200 via-nobel-gold to-green-300 dark:from-stone-800 dark:via-nobel-gold dark:to-green-700 my-6" />

                  {/* After */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-600 dark:text-green-400 mb-1">With InterpreLab</p>
                      <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {item.after}
                      </p>
                    </div>
                  </div>

                  {/* Benefit */}
                  <div className="mt-6 p-3 bg-nobel-gold/10 rounded-lg border border-nobel-gold/20">
                    <p className="text-sm font-bold text-nobel-gold text-center">
                      {item.benefit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-stone-50 dark:bg-stone-950 rounded-xl p-8 border border-stone-200 dark:border-border">
            <h3 className="font-serif text-2xl font-medium mb-4">
              Ready to Join the Elite?
            </h3>
            <p className="text-stone-600 dark:text-stone-400 mb-6 max-w-2xl mx-auto">
              Join thousands of interpreters who've elevated their practice with smarter, more accessible professional development.
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