import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronDown, Crown } from "lucide-react";
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
              <Crown className="w-4 h-4 mr-2" />
              The Interpreter's Choice for Excellence
            </Badge>

            {/* Main Headline - Elegant serif style */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-tight">
              <span className="text-nobel-gold">
                Elevate Your
              </span>
              <br />
              <span className="text-white">
                Practice
              </span>
            </h1>

            {/* Subtitle - Prestige messaging */}
            <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed max-w-2xl lg:max-w-none">
              Join the elite community of interpreters who refuse to settle for outdated training methods. Your expertise deserves cutting-edge tools.
            </p>

            {/* Personal Connection Paragraph */}
            <p className="text-base text-white/60 font-light leading-relaxed max-w-2xl lg:max-w-none italic border-l-2 border-nobel-gold/40 pl-4">
              We remember the feeling—finishing a complex cardiac procedure interpretation, knowing we nailed every term, but having no one to share that victory with. No feedback. No recognition. Just silence and the next call. That's why we built InterpreLab.
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
                  Discover Your Potential
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 text-sm text-white/60 animate-slide-up">
              <p className="font-light">Chosen by 10,000+ elite interpreters across 50+ countries</p>
              <div className="flex lg:justify-start justify-center gap-6 mt-4 flex-wrap">
                <span className="flex items-center gap-2"><span role="img" aria-label="trophy">🏆</span> NBCMI Approved</span>
                <span className="flex items-center gap-2"><span role="img" aria-label="certificate">📜</span> CCHI Approved</span>
                <span className="flex items-center gap-2"><span role="img" aria-label="globe">🌍</span> Global Community</span>
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