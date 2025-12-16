import { ArrowRight } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Take the Assessment",
      description: "Complete our AI-powered evaluation in 30 minutes. Get instant, detailed feedback on your interpretation skills, terminology usage, and areas for improvement.",
      color: "bg-blue-500"
    },
    {
      number: "02",
      title: "Get Your Personalized Path",
      description: "Receive a customized learning roadmap based on your assessment results. Focus on exactly what you need to improve—no wasted time on what you already know.",
      color: "bg-nobel-gold"
    },
    {
      number: "03",
      title: "Level Up with AI Support",
      description: "Use InterpreCoach during live calls for real-time terminology assistance. Track your progress with InterpreTrack. Build expertise with InterpreStudy's targeted modules.",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-24 bg-stone-50 dark:bg-stone-950">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">
              Simple Process
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              How It Works
            </h2>
            <p className="text-lg text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto">
              Start improving your interpretation skills today with our three-step approach
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div
              className="hidden md:block absolute top-16 left-[100px] w-[calc(100%-200px)] h-0.5 bg-gradient-to-r from-blue-500 via-nobel-gold to-green-500 opacity-20"
            />

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-card rounded-xl p-8 border border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50 transition-all duration-300 hover:shadow-lg h-full">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-serif font-bold text-xl">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="hidden md:block text-stone-300 dark:text-stone-700 absolute -right-6 top-11" size={24} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-serif text-2xl font-medium mb-4">{step.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
