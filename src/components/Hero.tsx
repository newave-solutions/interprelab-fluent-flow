import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, GraduationCap, Bot, TrendingUp, Heart, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import heroBg from '../assets/hero-homepage.jpg';
import interprebotsGroup from "@/assets/interprebots-group-features.png";

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
            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Badge */}
                    <div className="flex justify-center mb-10 animate-fade-in">
                        <Badge className="px-6 py-3 text-sm font-semibold border-nobel-gold/30 bg-gradient-to-r from-nobel-gold/20 to-yellow-500/20 backdrop-blur-md text-nobel-gold">
                            Next-Gen AI Platform for Medical Interpreters
                        </Badge>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                        {/* Left Column - Bold Headlines and Features */}
                        <div className="space-y-10 animate-fade-in">
                            {/* Main Headline */}
                            <div className="space-y-5">
                                <h1 className="text-center lg:text-left font-bold text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight">
                                    <span className="text-white block mb-2">Your Interpreter</span>
                                    <span className="text-white block mb-2">Career,</span>
                                    <span className="bg-gradient-to-r from-nobel-gold via-yellow-400 to-amber-500 bg-clip-text text-transparent inline-block"
                                        style={{
                                            backgroundSize: '200% auto',
                                            animation: 'shimmer 3s linear infinite'
                                        }}>
                                        Supercharged
                                    </span>
                                    <span className="text-white"> by AI</span>
                                </h1>

                                {/* Subheadline */}
                                <p className="text-center lg:text-left text-2xl md:text-3xl text-white/70 font-light tracking-wide">
                                    Train smarter. Interpret better. Earn more.
                                </p>
                            </div>

                            {/* Compact Feature Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {features.map((feature, index) => {
                                    const Icon = feature.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-nobel-gold/50 hover:scale-105 transition-all duration-300"
                                            style={{
                                                animationDelay: `${index * 100}ms`,
                                                animation: 'fadeInScale 0.6s ease-out forwards',
                                                opacity: 0
                                            }}
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nobel-gold/30 to-nobel-gold/10 flex items-center justify-center">
                                                <Icon className="w-5 h-5 text-nobel-gold" />
                                            </div>
                                            <span className="text-xs font-medium text-white/90 text-center leading-tight">
                                                {feature.text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button
                                    size="lg"
                                    className="px-10 py-7 bg-gradient-to-r from-nobel-gold via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-500 hover:to-nobel-gold text-white text-lg font-bold rounded-full shadow-2xl hover:shadow-nobel-gold/50 hover:scale-105 transition-all duration-300"
                                    asChild
                                >
                                    <Link to="/interprebot">
                                        Start Free
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-10 py-7 border-2 border-white/40 text-white hover:bg-white/10 hover:border-nobel-gold/60 text-lg font-semibold rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 mr-2" />
                                    Watch Demo
                                </Button>
                            </div>
                        </div>

                        {/* Right Column - Hero Image */}
                        <div className="relative flex justify-center lg:justify-end animate-fade-in">
                            <div className="relative">
                                <img
                                    src={interprebotsGroup}
                                    alt="InterpreLab AI Assistants"
                                    className="w-full max-w-2xl animate-float"
                                    style={{
                                        filter: 'drop-shadow(0 30px 80px hsl(var(--nobel-gold) / 0.6))',
                                    }}
                                />
                                {/* Animated glow */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-nobel-gold/30 via-yellow-400/30 to-amber-500/30 blur-3xl -z-10"
                                    style={{ animation: 'glow 4s ease-in-out infinite' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="text-center text-sm text-white/50">
                        <p className="font-light mb-4">Trusted by 10,000+ interpreters across 50+ countries</p>
                        <div className="flex flex-wrap justify-center gap-8">
                            <span className="flex items-center gap-2">
                                <span className="text-lg">🏥</span>
                                <span>Medical Centers</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-lg">⚖️</span>
                                <span>Legal Firms</span>
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="text-lg">🌍</span>
                                <span>Global NGOs</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
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
