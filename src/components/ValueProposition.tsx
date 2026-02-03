import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const ValueProposition = () => {
  const benefits = [
    {
      title: "Know Your Strengths Fast",
      description: "Find out exactly where you stand in 30 minutes. Get specific feedback you can actually use—not vague suggestions that leave you guessing what to do next.",
      icon: "🎯"
    },
    {
      title: "Help When You Need It",
      description: "Stuck on terminology during a call? InterpreCoach has your back with instant suggestions. It's like having an experienced interpreter ready to help 24/7.",
      icon: "⚡"
    },
    {
      title: "Training You Can Actually Afford",
      description: "Get NBCMI and CCHI-aligned courses without the huge price tag. Advancing your career shouldn't mean choosing between rent and professional development.",
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
            <h2 id="value-proposition-heading" className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6">
              Built By Interpreters, <span className="text-nobel-gold">For Interpreters</span>
            </h2>
            <p className="text-lg text-stone-600 dark:text-muted-foreground font-light max-w-2xl mx-auto">
              We've been in your shoes. We know the challenges. So we built the tools we wish we'd had—affordable, accessible, and actually helpful when you need them most.
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
