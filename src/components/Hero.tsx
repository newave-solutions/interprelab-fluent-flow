import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Shield, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-interprelab.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Advanced medical interpretation technology with AI interfaces"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          
          {/* Badge */}
          <Badge variant="secondary" className="glass px-6 py-2 text-sm font-medium">
            <Zap className="w-4 h-4 mr-2" />
            Revolutionary AI-Powered Interpretation Platform
          </Badge>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent animate-pulse-glow">
              InterpreLab
            </span>
            <br />
            <span className="text-foreground">
              Redefining Medical &amp; Legal
            </span>
            <br />
            <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl">
              Interpretation
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Advanced real-time interpretation powered by AI, designed for critical healthcare and legal environments. 
            Where technology meets human expertise for life-changing communication.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-slide-up">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Real-time Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" />
              <span>Human-AI Collaboration</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button variant="hero" size="xl" className="group">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="glass" size="xl" className="group">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 text-sm text-muted-foreground animate-slide-up">
            <p>Trusted by healthcare systems and legal firms across 50+ countries</p>
            <div className="flex justify-center gap-8 mt-4 opacity-60">
              <span>🏥 Medical Centers</span>
              <span>⚖️ Legal Firms</span>
              <span>🌍 Global Organizations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-success/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};