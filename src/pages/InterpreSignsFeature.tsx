import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hand, Brain, TrendingUp, Target, Zap, BookOpen, ArrowRight, CheckCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { PainPointBadge } from "@/components/PainPointBadge";
import { GetStartedSteps } from "@/components/GetStartedSteps";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const InterpreSignsFeature = () => {
    return (
        <Layout>
            {/* Hero Section with Background Image - Matching InterpreStudy Pattern */}
            <div
                className="relative text-center mb-16 animate-fade-in py-20 px-4 rounded-3xl bg-cover bg-center shadow-2xl"
                style={{ backgroundImage: "url('/src/assets/studying-learning.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/70 rounded-3xl" />
                <div className="relative z-10">
                    <PainPointBadge painPoint="Addressing Pain Point #2: Skill Development & Training" />
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Hand className="w-12 h-12 text-primary" />
                        <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                            InterpreSigns
                        </h1>
                    </div>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-6">
                        Master ASL with AI-powered real-time feedback. Practice fingerspelling and medical signs with instant recognition.
                    </p>
                </div>
            </div>

            {/* Key Features with Particles */}
            <section className="relative py-16 overflow-hidden">
                <ParticlesBackground particleCount={80} variant="dots" />
                <div className="relative z-10">
                    <FeatureGrid
                        title="Learn Sign Language Your Way"
                        subtitle="AI-powered practice with real-time feedback and progress tracking"
                        features={[
                            {
                                icon: Brain,
                                title: "AI-Powered Recognition",
                                description: "Advanced computer vision technology detects your hand signs in real-time with high accuracy.",
                            },
                            {
                                icon: Target,
                                title: "Instant Feedback",
                                description: "Get immediate corrections on hand positioning, shape, and movement. Know exactly what to improve.",
                            },
                            {
                                icon: TrendingUp,
                                title: "Progress Tracking",
                                description: "Track which signs you've mastered, practice time, and accuracy rates over time.",
                            },
                            {
                                icon: BookOpen,
                                title: "Medical Terminology",
                                description: "Focus on ASL signs commonly used in healthcare settings. Perfect for medical interpreters.",
                            },
                            {
                                icon: Zap,
                                title: "Practice Anywhere",
                                description: "All you need is a webcam or phone camera. Practice at home, in your office, or on the go.",
                            },
                            {
                                icon: Star,
                                title: "Gamified Learning",
                                description: "Earn badges, unlock new sign sets, and compete with yourself to maintain practice streaks.",
                            },
                        ]}
                    />
                </div>
            </section>

            {/* How It Works with Particles */}
            <section className="relative py-16 overflow-hidden">
                <ParticlesBackground particleCount={100} variant="mixed" />
                <div className="relative z-10">
                    <GetStartedSteps
                        title="Start Signing in 3 Simple Steps"
                        subtitle="From your first sign to fluency"
                        steps={[
                            {
                                showIcon: true,
                                icon: CheckCircle,
                                title: "Enable Your Camera",
                                description: "Allow camera access and position yourself in frame. Our AI will guide you on optimal positioning.",
                                content: (
                                    <div className="p-4 glass rounded-lg shadow-card-light dark:shadow-md">
                                        <p className="text-sm font-semibold mb-1">Camera Setup</p>
                                        <p className="text-xs text-muted-foreground">Good lighting • Clear background • Hands visible</p>
                                    </div>
                                ),
                            },
                            {
                                showIcon: true,
                                icon: Hand,
                                title: "Practice Signs",
                                description: "Follow the on-screen prompts. Make each sign and receive instant feedback on accuracy.",
                                content: (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-success rounded-full shadow-sm" />
                                            <span className="text-sm">Sign "A" - 98% match ✓</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-success rounded-full shadow-sm" />
                                            <span className="text-sm">Sign "B" - 100% match ✓</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-warning rounded-full shadow-sm" />
                                            <span className="text-sm">Sign "C" - 75% match • Adjust thumb</span>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                showIcon: true,
                                icon: TrendingUp,
                                title: "Track Your Progress",
                                description: "View your mastery level for each sign, practice statistics, and improvement trends over time.",
                                content: (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 glass rounded-lg shadow-card-light dark:shadow-md">
                                            <p className="text-sm font-semibold mb-1">Signs Mastered</p>
                                            <p className="text-xs text-muted-foreground">18 / 26 (Alphabet)</p>
                                        </div>
                                        <div className="p-4 glass rounded-lg shadow-card-light dark:shadow-md">
                                            <p className="text-sm font-semibold mb-1">Practice Time</p>
                                            <p className="text-xs text-muted-foreground">45 minutes today</p>
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                        finalCTAText="Start Practicing Now"
                        finalCTAIcon={Hand}
                        finalCTAAction={() => window.location.href = '/signin'}
                    />
                </div>
            </section>

            {/* Medical Focus Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 shadow-sm">
                            Built for Healthcare Professionals
                        </Badge>
                        <h2 className="text-3xl font-bold mb-6">Why ASL Matters for Medical Interpreters</h2>
                        <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="pt-6">
                                <p className="text-stone-700 dark:text-muted-foreground mb-4 leading-relaxed">
                                    American Sign Language is not just another language—it's a vital communication tool in healthcare settings.
                                </p>
                                <p className="text-stone-700 dark:text-muted-foreground mb-4 leading-relaxed">
                                    <strong className="text-stone-900 dark:text-foreground">InterpreSigns focuses on medical terminology</strong> commonly used in healthcare:
                                </p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-stone-700 dark:text-muted-foreground">Common medical signs (pain, medication, doctor, emergency)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-stone-700 dark:text-muted-foreground">Fingerspelling for medical terms and medication names</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-stone-700 dark:text-muted-foreground">Numbers and time (for dosages, appointment times)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-stone-700 dark:text-muted-foreground">Body parts and symptoms commonly discussed</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Master ASL?</h2>
                    <p className="text-xl text-stone-600 dark:text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join medical interpreters worldwide improving their sign language skills with AI-powered practice.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signin">
                            <Button size="lg" className="glass-button shadow-button-light hover:shadow-button-hover-light dark:shadow-lg dark:hover:shadow-xl transition-all">
                                Start Free Practice
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/interpresigns/dashboard">
                            <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow">
                                Try Interactive Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default InterpreSignsFeature;
