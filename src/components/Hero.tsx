import { Button } from "@/components/ui/button";
import { ArrowRight, Play, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from '../assets/hero-homepage.jpg';

export const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Radial Glow Effect */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, hsl(41 52% 56% / 0.1), transparent 60%)'
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

          {/* Eyebrow Badge */}
          <div className="inline-block">
            <span className="px-4 py-2 border border-nobel-gold text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full">
              Special Report
            </span>
          </div>

          {/* Main Headline - Playfair Display */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight md:leading-[1.1] drop-shadow-sm">
            <span className="text-foreground">
              The Interpreter
            </span>
            <br />
            <span className="text-nobel-gold">
              Dilemma
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            A crisis hiding in plain sight. Lives hang in the balance as undertrained, 
            underpaid interpreters face impossible demands.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="group bg-nobel-gold text-background hover:bg-nobel-gold/90 hover:shadow-glow transition-all duration-300 rounded-full px-8" 
              asChild
            >
              <Link to="/interprebot" aria-label="Start your assessment">
                Take the Assessment
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Link>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="group border-border/50 hover:border-nobel-gold/50 hover:bg-accent transition-all duration-300 rounded-full px-8" 
              asChild
            >
              <Link to="/interprecoach" aria-label="Meet InterpreCoach AI assistant">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                Meet InterpreCoach
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 text-sm text-muted-foreground">
            <p className="font-light">Trusted by healthcare systems and legal firms across 50+ countries</p>
            <div className="flex justify-center gap-8 mt-4 text-stone-500">
              <span>🏥 Medical Centers</span>
              <span>⚖️ Legal Firms</span>
              <span>🌍 Global Organizations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button 
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 group flex flex-col items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Scroll to learn more"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};
