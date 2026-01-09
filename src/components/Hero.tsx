import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from '../assets/hero-homepage.jpg';
import CardStack3D from './CardStack3D';

export const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner">
      {/* Background Image with Enhanced Overlay for better visibility */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      >
        {/* Darker, more opaque overlay to prevent text opacity issues */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/85 to-background shadow-2xl" />
      </div>

      {/* Radial Glow Effect */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, hsl(41 52% 56% / 0.1), transparent 60%)'
        }}
        aria-hidden="true"
      />

      {/* Content - Two Column Layout */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">

          {/* Left Column - Text Content */}
          <div className="space-y-8 animate-fade-in text-center lg:text-left">

            {/* Badge */}
            <Badge className="glass px-6 py-3 text-sm font-medium border-nobel-gold/20 bg-white/10 backdrop-blur-sm inline-flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Interpretation Platform
            </Badge>

            {/* Main Headline - Elegant serif style */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-tight">
              <span className="text-nobel-gold">
                Master Medical
              </span>
              <br />
              <span className="text-white">
                Interpretation
              </span>
            </h1>

            {/* Subtitle - Lighter font weight */}
            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl lg:max-w-none">
              Train smarter with AI-driven assessment, real-time coaching, and automated tracking.
            </p>

            {/* CTA Buttons - Updated styling */}
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-start justify-center items-center animate-slide-up">
              <Button
                variant="default"
                size="lg"
                className="px-8 py-6 bg-nobel-gold hover:bg-nobel-gold/90 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link to="/interprebot" aria-label="Start your assessment">
                  Take the Assessment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 text-sm text-white/60 animate-slide-up">
              <p className="font-light">Trusted by healthcare systems and legal firms across 50+ countries</p>
              <div className="flex lg:justify-start justify-center gap-6 mt-4 flex-wrap">
                <span className="flex items-center gap-2"><span role="img" aria-label="hospital">🏥</span> Medical Centers</span>
                <span className="flex items-center gap-2"><span role="img" aria-label="scales of justice">⚖️</span> Legal Firms</span>
                <span className="flex items-center gap-2"><span role="img" aria-label="globe">🌍</span> Global Organizations</span>
              </div>
            </div>
          </div>

          {/* Right Column - CardStack3D */}
          <div className="flex items-center justify-center lg:justify-end animate-fade-in">
            <CardStack3D />
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
