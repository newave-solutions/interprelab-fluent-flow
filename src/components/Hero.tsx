import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import heroBg from '../assets/hero-homepage.jpg';
import theCrewImage from "@/assets/the_crew.png";

// Bot data for interactive pills
const bots = [
    {
        id: 'interpretest',
        name: 'InterpreTest',
        tagline: 'Skills Assessment Pro',
        image: '/interpretest-bot.png',
        route: '/interpretest'
    },
    {
        id: 'interprecoach',
        name: 'InterpreCoach',
        tagline: 'Real-Time Sidekick',
        image: '/interprecoach-bot.png',
        route: '/interprecoach'
    },
    {
        id: 'interprestudy',
        name: 'InterpreStudy',
        tagline: 'Personal Trainer',
        image: '/interprestudy-bot.png',
        route: '/interprestudy'
    },
    {
        id: 'interpretrack',
        name: 'InterpreTrack',
        tagline: 'Session Logger',
        image: '/interpretrack-bot.png',
        route: '/interpretrack'
    },
    {
        id: 'interpre-wellness',
        name: 'InterpreWellness',
        tagline: 'Mental Health Coach',
        image: '/interpre-wellness-bot.png',
        route: '/interpre-wellness'
    },
    {
        id: 'interprelink',
        name: 'InterpreLink',
        tagline: 'Community Hub',
        image: '/interprelink-bot.png',
        route: '/interprelink'
    },
    {
        id: 'interpresigns',
        name: 'InterpreSigns',
        tagline: 'ASL Specialist',
        image: '/interpresigns-bot.png',
        route: '/interpresigns'
    }
];

// BotPill Component - Hover reveals mini preview
const BotPill = ({ bot }: { bot: typeof bots[0] }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Pill Button */}
            <Link to={bot.route}>
                <button
                    className="px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium
                               bg-white/10 backdrop-blur-md border border-white/20
                               text-white hover:bg-nobel-gold/20 hover:border-nobel-gold/50
                               transition-all duration-300 hover:scale-105
                               focus:outline-none focus:ring-2 focus:ring-nobel-gold/50"
                    aria-expanded={isHovered}
                    aria-controls={`bot-${bot.id}-preview`}
                >
                    {bot.name}
                </button>
            </Link>

            {/* Hover Preview Card - Desktop only */}
            {isHovered && (
                <div
                    id={`bot-${bot.id}-preview`}
                    className="hidden md:block absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50
                               w-48 p-4 rounded-xl
                               bg-black/90 backdrop-blur-xl border-2 border-nobel-gold/30
                               shadow-2xl shadow-nobel-gold/20 animate-fade-in"
                >
                    {/* Mini Bot Image */}
                    <img
                        src={bot.image}
                        alt={`${bot.name} preview`}
                        className="w-20 h-20 mx-auto mb-3 object-contain"
                    />
                    {/* Tagline */}
                    <p className="text-xs text-center text-nobel-gold font-semibold">
                        {bot.tagline}
                    </p>
                    {/* Arrow pointer */}
                    <div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45
                                   bg-black/90 border-l-2 border-t-2 border-nobel-gold/30"
                    />
                </div>
            )}
        </div>
    );
};

export const Hero = () => {
    const scrollToContent = () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    };

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
                    <div className="flex justify-center mb-8 md:mb-12 animate-fade-in">
                        <Badge className="px-6 py-3 text-sm font-semibold border-nobel-gold/20 bg-nobel-gold/10 backdrop-blur-md text-nobel-gold">
                            Your 24/7 AI Support Team
                        </Badge>
                    </div>

                    {/* Main Content - Mobile-First Centered Layout */}
                    <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">

                        {/* THE CREW IMAGE - Mobile: full width, Desktop: larger */}
                        <div className="relative w-full max-w-2xl mx-auto px-4 md:px-0 animate-fade-in">
                            <img
                                src={theCrewImage}
                                alt="InterpreLab AI Team - 7 Expert Bots"
                                className="w-full h-auto rounded-2xl"
                            />
                            {/* Gold Glow Effect */}
                            <div
                                className="absolute inset-0 -z-10 blur-3xl opacity-30 rounded-2xl animate-glow"
                                style={{ background: 'radial-gradient(circle, hsl(41 52% 56%), transparent 70%)' }}
                            />
                        </div>

                        {/* Headlines */}
                        <div className="space-y-4 md:space-y-6 text-center px-4 animate-fade-in">
                            <h1 className="font-serif font-bold text-4xl md:text-6xl lg:text-7xl leading-tight tracking-tight">
                                <span className="text-white block">Meet Your AI Team</span>
                            </h1>
                            <p className="text-lg md:text-xl lg:text-2xl text-white/80 font-light max-w-3xl mx-auto">
                                Seven expert bots working 24/7 to help you master your craft
                            </p>
                            <p className="text-base md:text-lg text-nobel-gold font-medium italic">
                                Built by interpreters, for interpreters
                            </p>
                        </div>

                        {/* Bot Pills - Interactive Name Tags */}
                        <div className="flex flex-wrap justify-center gap-3 px-4 animate-fade-in">
                            {bots.map((bot) => (
                                <BotPill key={bot.id} bot={bot} />
                            ))}
                        </div>

                        {/* CTAs - Mobile: stacked, Desktop: side-by-side */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 animate-fade-in">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto px-10 py-6 md:py-7 bg-gradient-to-r from-nobel-gold via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-500 hover:to-nobel-gold text-white text-base md:text-lg font-bold rounded-full shadow-2xl hover:shadow-nobel-gold/50 hover:scale-105 transition-all duration-300"
                                asChild
                            >
                                <Link to="/interpretest">
                                    Start Free Assessment
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => {
                                    document.getElementById('solutions-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="w-full sm:w-auto px-10 py-6 md:py-7 border-2 border-white/40 text-white hover:bg-white/10 hover:border-nobel-gold/60 text-base md:text-lg font-semibold rounded-full backdrop-blur-sm hover:scale-105 transition-all duration-300"
                            >
                                Meet the Bots
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
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
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.05);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animate-glow {
                    animation: glow 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
};
