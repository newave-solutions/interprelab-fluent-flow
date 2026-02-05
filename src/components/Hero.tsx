import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronDown, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from '../assets/hero-homepage.jpg';
import CardStackStacked from './CardStackStacked';

export const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background" />
      </div>

      {/* Radial Glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 30%, hsl(41 52% 56% / 0.1), transparent 60%)' }}
        aria-hidden="true"
      />

      {/* Content - Centered Layout */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 max-w-7xl mx-auto">

          {/* Left Column - Text */}
          <div className="flex-1 max-w-xl space-y-6 animate-fade-in text-center lg:text-left">
            <Badge className="glass px-4 py-2 text-sm font-medium border-nobel-gold/20 bg-white/10 backdrop-blur-sm inline-flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              The Interpreter's Choice for Excellence
            </Badge>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
              <span className="text-nobel-gold">Elevate Your</span>
              <br />
              <span className="text-white">Practice</span>
            </h1>

            <p className="text-lg text-white/80 font-light leading-relaxed">
              Join the elite community of interpreters who refuse to settle for outdated training methods. Your expertise deserves cutting-edge tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center">
              <Button
                variant="default"
                size="lg"
                className="px-8 py-6 bg-nobel-gold hover:bg-nobel-gold/90 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                asChild
              >
                <Link to="/interpretest">
                  Discover Your Potential
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 text-sm text-white/60">
              <p className="font-light">Chosen by 10,000+ interpreters across 50+ countries</p>
              <div className="flex lg:justify-start justify-center gap-4 mt-3 flex-wrap text-xs">
                <span className="flex items-center gap-1">🏆 NBCMI Approved</span>
                <span className="flex items-center gap-1">📜 CCHI Approved</span>
                <span className="flex items-center gap-1">🌍 Global Community</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stacked Cards */}
          <div className="flex-shrink-0 animate-fade-in">
            <CardStackStacked />
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
