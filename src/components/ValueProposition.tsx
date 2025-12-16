import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const ValueProposition = () => {
  const benefits = [
    {
      title: "Instant AI Assessment",
      description: "Get detailed feedback on your interpretation skills in minutes, not months. No expensive courses required.",
      icon: "🎯"
    },
    {
      title: "Real-Time Assistance",
      description: "InterpreCoach acts as your AI co-pilot during live calls, providing terminology suggestions and performance insights.",
      icon: "⚡"
    },
    {
      title: "Affordable Training",
      description: "NBCMI and CCHI approved courses at a fraction of traditional costs. Professional development shouldn't break the bank.",
      icon: "💰"
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 px-6 py-3 bg-nobel-gold/10 text-nobel-gold border-nobel-gold/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Why Interpreters Choose Us
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Professional Development, <span className="text-nobel-gold">Reimagined</span>
            </h2>
            <p className="text-lg text-stone-600 dark:text-muted-foreground font-light max-w-2xl mx-auto">
              Built by working interpreters who understand your challenges. Our AI-powered platform makes professional growth accessible, affordable, and actually helpful.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-xl border border-stone-200 dark:border-border hover:border-nobel-gold/50 dark:hover:border-nobel-gold/50 transition-all duration-300 hover:shadow-lg bg-white dark:bg-card"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-serif text-xl font-medium mb-3">{benefit.title}</h3>
                <p className="text-sm text-stone-600 dark:text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button 
              size="lg"
              className="px-10 py-6 bg-nobel-gold hover:bg-nobel-gold/90 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/interprebot">
                Start Your Free Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <p className="text-sm text-stone-500 dark:text-muted-foreground mt-4">
              No credit card required • Takes less than 30 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
