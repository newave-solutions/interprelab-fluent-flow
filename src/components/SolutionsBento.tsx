import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Brain, GraduationCap, Heart, Users, Clock, Search, TrendingUp, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import interprebotsGroup from "@/assets/interprebots-group-features.png";
import interpretestBot from "/interpretest-bot.png";
import interprecoachBot from "/interprecoach-bot.png";
import interprestudyBot from "/interprestudy-bot.png";
import interpretrackBot from "/interpretrack-bot.png";
import interprewellnessBot from "/interpre-wellness-bot.png";
import interprelinkBot from "/interprelink-bot.png";
import interpresignsBot from "/interpresigns-bot.png";

export const SolutionsBento = () => {
    const mainSolutions = [
        {
            id: "interpretest",
            title: "InterpreTest",
            subtitle: "Know Where You Stand",
            description: "Find out your exact skill level in 30 minutes. Get honest, detailed feedback that shows you exactly what to work on—no guessing games",
            icon: Bot,
            imageSrc: interpretestBot,
            gradient: "from-blue-500/20 to-cyan-500/20",
            route: "/interpretest"
        },
        {
            id: "interprecoach",
            title: "InterpreCoach",
            subtitle: "Your Live Call Sidekick",
            description: "Never get stuck on terminology again. Get instant suggestions and context during live sessions, like having a senior interpreter whispering in your ear",
            icon: Brain,
            imageSrc: interprecoachBot,
            gradient: "from-purple-500/20 to-pink-500/20",
            route: "/interprecoach"
        },
        {
            id: "interprestudy",
            title: "InterpreStudy",
            subtitle: "Learn What You Actually Need",
            description: "Skip the one-size-fits-all courses. Focus on what you need to improve based on your assessment, with practice scenarios that feel real",
            icon: GraduationCap,
            imageSrc: interprestudyBot,
            gradient: "from-amber-500/20 to-orange-500/20",
            route: "/interprestudy"
        }
    ];

    const additionalSolutions = [
        { icon: Clock, title: "InterpreTrack", subtitle: "Track Your Growth", imageSrc: interpretrackBot, route: "/interpretrack" },
        { icon: Heart, title: "InterpreWellness", subtitle: "Stay Balanced", imageSrc: interprewellnessBot, route: "/interpre-wellness" },
        { icon: MessageCircle, title: "InterpreLink", subtitle: "Find Your People", imageSrc: interprelinkBot, route: "/interprelink" },
        { icon: Users, title: "InterpreSigns", subtitle: "ASL Practice", imageSrc: interpresignsBot, route: "/interpresigns" },
    ];

    return (
        <section id="solutions-section" className="py-32 bg-gradient-to-b from-white via-stone-50 to-white dark:from-background dark:via-stone-950 dark:to-background relative overflow-hidden">
            <ParticlesBackground particleCount={80} variant="dots" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <Badge className="mb-6 px-8 py-3 bg-nobel-gold/10 text-nobel-gold border-nobel-gold/20 text-sm font-semibold backdrop-blur-md">
                            Everything You Need, One Place
                        </Badge>
                        <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
                            Your Complete{" "}
                            <span className="bg-gradient-to-r from-nobel-gold via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                                AI Toolkit
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
                            Whether you're just starting out or you've been interpreting for years, these seven tools have your back at every step
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="space-y-6">
                        {/* Top Row - 3 Main Solutions */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {mainSolutions.map((solution) => {
                                const Icon = solution.icon;
                                return (
                                    <Link key={solution.id} to={solution.route}>
                                        <Card className="group h-full hover:scale-[1.02] transition-all duration-300 border-2 hover:border-nobel-gold/50 hover:shadow-2xl hover:shadow-nobel-gold/20 bg-gradient-to-br from-white to-stone-50/50 dark:from-stone-900 dark:to-stone-950/50 overflow-hidden">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                            <CardHeader className="relative z-10 pb-4">
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-nobel-gold/20 to-nobel-gold/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                    <Icon className="w-7 h-7 text-nobel-gold" />
                                                </div>

                                                {/* Bot Image */}
                                                {solution.imageSrc && (
                                                    <div className="mb-4 flex justify-center">
                                                        <img
                                                            src={solution.imageSrc}
                                                            alt={`${solution.title} preview`}
                                                            className="w-48 h-48 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
                                                        />
                                                    </div>
                                                )}

                                                <CardTitle className="text-2xl font-bold">{solution.title}</CardTitle>
                                                <CardDescription className="text-base font-medium text-nobel-gold">
                                                    {solution.subtitle}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="relative z-10">
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {solution.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Bottom Row - 6 Additional Solutions in Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {additionalSolutions.map((solution, index) => {
                                const Icon = solution.icon;
                                return (
                                    <Link key={index} to={solution.route}>
                                        <Card className="group h-full hover:scale-105 transition-all duration-300 border hover:border-nobel-gold/50 hover:shadow-lg hover:shadow-nobel-gold/10 bg-gradient-to-br from-white to-stone-50/30 dark:from-stone-900 dark:to-stone-950/30">
                                            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-nobel-gold/20 to-nobel-gold/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Icon className="w-6 h-6 text-nobel-gold" />
                                                </div>

                                                {/* Bot Image for smaller cards */}
                                                {solution.imageSrc && (
                                                    <img
                                                        src={solution.imageSrc}
                                                        alt={`${solution.title} preview`}
                                                        className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                )}

                                                <div>
                                                    <p className="font-semibold text-sm text-foreground">{solution.title}</p>
                                                    <p className="text-xs text-muted-foreground">{solution.subtitle}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-20 text-center">
                        <div className="inline-block p-12 rounded-3xl bg-gradient-to-br from-nobel-gold/10 via-amber-500/5 to-nobel-gold/10 border-2 border-nobel-gold/20 backdrop-blur-sm">
                            <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ready to See What You're Capable Of?
                            </h3>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Take the free assessment and find out where you stand. It only takes 30 minutes, and you'll get a personalized roadmap to level up your skills
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="px-10 py-7 bg-gradient-to-r from-nobel-gold to-amber-600 hover:from-amber-600 hover:to-nobel-gold text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                    asChild
                                >
                                    <Link to="/interpretest">
                                        Start Free Assessment
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-10 py-7 border-2 border-nobel-gold/30 hover:border-nobel-gold/50 hover:bg-nobel-gold/5 text-lg font-semibold rounded-full transition-all"
                                    asChild
                                >
                                    <Link to="/resources">
                                        Explore All Tools
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
