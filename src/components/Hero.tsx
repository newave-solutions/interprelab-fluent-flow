import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, GraduationCap, Bot, TrendingUp, Heart, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import heroBg from '../assets/hero-homepage.jpg';
import theCrewImage from "@/assets/the_crew.png";
import CardStack3D from "@/components/CardStack3D";

export const Hero = () => {
    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

    const features = [
        { icon: GraduationCap, text: "World-class Training" },
        { icon: Bot, text: "Real-Time AI Assistant" },
        { icon: TrendingUp, text: "Performance Analytics" },
        { icon: Heart, text: "Wellness Support" },
        { icon: Award, text: "Certification Prep" },
        { icon: Users, text: "Global Community" },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" role="banner">
            <ParticlesBackground particleCount={100} variant="mixed" />

            {/* Background with strong dark overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBg})` }}
                aria-hidden="true"
            >
                <div className="absolute inset-0 bg-black/75 dark:bg-black/85" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
            </div>

            {/* Radial glow */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 40%, hsl(41 52% 56% / 0.25) 0%, transparent 65%)'
                }}
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 pt-16 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-12 animate-fade-in">
                        <Badge className="px-6 py-3 text-sm font-semibold border-nobel-gold/20 bg-nobel-gold/10 backdrop-blur-md text-nobel-gold">
                            Next-Gen AI Platform for Medical Interpreters
                        </Badge>
                    </div>



                    {/* Centered Single Column Layout */}
                    <div className="max-w-5xl mx-auto">
                        {/* Main Content Section - Headlines and CTAs */}
                        <div className="space-y-8 animate-fade-in mb-16">
                            {/* Main Headline */}
                            <div className="space-y-6 text-center">
                                <h1 className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] tracking-tight">
                                    <span className="text-white block">Master Your Craft.</span>
                                    <span className="text-white block">Elevate Your Impact.</span>
                                    <span className="bg-gradient-to-r from-nobel-gold via-yellow-400 to-amber-500 bg-clip-text text-transparent block"
                                        style={{
                                            backgroundSize: '200% auto',
                                            animation: 'shimmer 3s linear infinite'
                                        }}>
                                        Powered by AI.
                                    </span>
                                </h1>

                                {/* Subheadline */}
                                <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light tracking-wide max-w-3xl mx-auto">
                                    The complete AI-powered platform for medical interpreters
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <Button
                                    size="lg"
                                    className="px-12 py-7 bg-gradient-to-r from-nobel-gold via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-500 hover:to-nobel-gold text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-nobel-gold/50 hover:scale-105 transition-all duration-300"
                                    asChild
                                >
                                    <Link to="/interprebot">
                                        Start Free Assessment
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-12 py-7 border-2 border-white/40 text-white hover:bg-white/10 hover:border-nobel-gold/60 text-lg font-semibold rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Watch Demo
                                </Button>
                            </div>
                        </div>

                        {/* 3D Card Stack Section */}
                        <div className="flex justify-center animate-fade-in">
                            <CardStack3D />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes glow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}</style>
        </section>
    );
};
