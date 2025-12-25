import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, ChevronDown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from '../assets/hero-homepage.jpg';

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

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

                    {/* Badge */}
                    <Badge className="glass px-6 py-3 text-sm font-medium border-nobel-gold/20 bg-white/10 backdrop-blur-sm">
                        <Zap className="w-4 h-4 mr-2" />
                        AI-Powered Interpretation Platform
                    </Badge>

                    {/* Main Headline - Elegant serif style */}
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-tight md:leading-[1.1]">
                        <span className="text-nobel-gold">
                            Master Medical
                        </span>
                        <br />
                        <span className="text-white">
                            Interpretation
                        </span>
                    </h1>

                    {/* Subtitle - Lighter font weight */}
                    <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
                        Train smarter with AI-driven assessment, real-time coaching, and automated tracking.
                    </p>

                    {/* CTA Buttons - Updated styling */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
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
                    <div className="pt-8 text-sm text-white/60 animate-slide-up">
                        <p className="font-light">Trusted by healthcare systems and legal firms across 50+ countries</p>
                        <div className="flex justify-center gap-8 mt-4">
                            <span><span role="img" aria-label="hospital">🏥</span> Medical Centers</span>
                            <span><span role="img" aria-label="scales of justice">⚖️</span> Legal Firms</span>
                            <span><span role="img" aria-label="globe">🌍</span> Global Organizations</span>
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
