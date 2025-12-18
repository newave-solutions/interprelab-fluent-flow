import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, TrendingUp, BarChart3, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PainPointBadge } from "@/components/PainPointBadge";
import { GetStartedSteps } from "@/components/GetStartedSteps";
import { FeatureGrid } from "@/components/FeatureGrid";
import callTrackerPreview from "@/assets/coach-frontned-design.png";

const InterpreTrackFeature = () => {
    return (
        <Layout>
            {/* Enhanced Hero Section with Split Layout */}
            <section className="relative min-h-[70vh] bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-background dark:to-stone-900 overflow-hidden">
                {/* Background Pattern with Shadow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(var(--nobel-gold)/0.08)_0%,_transparent_50%)] shadow-inner" />

                <div className="container mx-auto px-6 py-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-6 animate-fade-in">
                            <PainPointBadge painPoint="Addressing Pain Point #1: Transparency in Compensation" />
                            <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
                                InterpreTrack
                            </h1>
                            <p className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed mb-6 font-light">
                                Every second matters. Every call counts. Precision logging that reveals the truth about your earnings.
                            </p>
                            <div className="glass p-6 rounded-xl mb-6 shadow-card-light dark:shadow-card border border-stone-200/50 dark:border-border/50">
                                <p className="text-sm text-stone-600 dark:text-muted-foreground leading-relaxed">
                                    💡 <strong className="text-stone-900 dark:text-foreground">Built for transparency.</strong> We know the frustration of seeing your actual work time differ from what platforms report. InterpreTrack gives you the data to advocate for yourself.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signin">
                                    <Button size="lg" className="glass-button shadow-button-light hover:shadow-button-hover-light dark:shadow-md dark:hover:shadow-xl transition-all w-full sm:w-auto">
                                        <Clock className="w-5 h-5 mr-2" />
                                        Start Tracking Free
                                    </Button>
                                </Link>
                                <Link to="/interpretrack/dashboard">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
                                        View Dashboard Demo
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Visual - Call Tracking Preview with Enhanced Shadows */}
                        <div className="relative animate-fade-in">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-card-hover-light dark:shadow-xl dark:hover:shadow-2xl transition-shadow duration-300">
                                <img
                                    src={callTrackerPreview}
                                    alt="InterpreTrack dashboard showing call logging interface"
                                    className="w-full h-auto"
                                />
                                {/* Subtle gradient overlay for depth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
                            </div>
                            {/* Floating stats cards with enhanced shadows */}
                            <div className="absolute -bottom-6 -left-6 glass p-4 rounded-xl shadow-xl dark:shadow-2xl border border-white/20 dark:border-border/50 backdrop-blur-lg">
                                <p className="text-xs text-muted-foreground mb-1">Time Saved</p>
                                <p className="text-2xl font-bold text-primary">18m 45s</p>
                            </div>
                            <div className="absolute -top-6 -right-6 glass p-4 rounded-xl shadow-xl dark:shadow-2xl border border-white/20 dark:border-border/50 backdrop-blur-lg">
                                <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                                <p className="text-2xl font-bold text-success">99.9%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features with Enhanced Card Shadows */}
            <FeatureGrid
                title="Everything You Need to Track Your Worth"
                subtitle="Precision tracking with transparency-focused analytics"
                features={[
                    {
                        icon: Clock,
                        title: "Real-Time Tracking",
                        description: "Start and stop call tracking with a single tap. Accurate to the second, with automatic session logging.",
                    },
                    {
                        icon: DollarSign,
                        title: "Earnings Transparency",
                        description: "See exactly what you've earned vs. what platforms report. Track discrepancies and time rounding practices.",
                    },
                    {
                        icon: BarChart3,
                        title: "Advanced Analytics",
                        description: "Visualize call volume patterns by hour, day, week, month, or year. Compare across multiple platforms and clients.",
                    },
                    {
                        icon: TrendingUp,
                        title: "Platform Comparison",
                        description: "Multi-line graphs showing Platform A vs B vs C. Identify which clients value your time fairly.",
                    },
                    {
                        icon: Shield,
                        title: "Your Data, Your Control",
                        description: "Export your logs anytime. Use your data to negotiate better rates or file complaints.",
                    },
                    {
                        icon: Zap,
                        title: "VRI & OPI Support",
                        description: "Track both video and phone interpretation sessions. Categorize by call type for better insights.",
                    },
                ]}
            />

            {/* How It Works */}
            <GetStartedSteps
                title="Start Tracking in 3 Simple Steps"
                subtitle="From your first call to full transparency"
                steps={[
                    {
                        showIcon: true,
                        icon: CheckCircle,
                        title: "Create Your Free Account",
                        description: "Sign up with your email and set your pay rate and preferred currency.",
                        content: (
                            <div className="p-4 glass rounded-lg shadow-card-light dark:shadow-md">
                                <p className="text-sm font-semibold mb-1">Set Your Rate</p>
                                <p className="text-xs text-muted-foreground">$0.20/min or $12/hour</p>
                            </div>
                        ),
                    },
                    {
                        showIcon: true,
                        icon: Clock,
                        title: "Log Your Calls",
                        description: "One-tap start/stop tracking. Add notes, call type (VRI/OPI), and any relevant details.",
                        content: (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-success rounded-full shadow-sm" />
                                    <span className="text-sm">Call started: 10:42 AM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full shadow-sm" />
                                    <span className="text-sm">VRI - Hospital intake</span>
                                </div>
                            </div>
                        ),
                    },
                    {
                        showIcon: true,
                        icon: BarChart3,
                        title: "Analyze & Export",
                        description: "View detailed analytics, identify discrepancies, and export your data for record-keeping or advocacy.",
                        content: (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 glass rounded-lg shadow-card-light dark:shadow-md">
                                    <p className="text-sm font-semibold mb-1">This Month</p>
                                    <p className="text-xs text-muted-foreground">$847.50 earned</p>
                                </div>
                                <div className="p-4 glass rounded-lg shadow-card-light dark:shadow-md">
                                    <p className="text-sm font-semibold mb-1">Time Lost</p>
                                    <p className="text-xs text-muted-foreground">18m 45s unpaid</p>
                                </div>
                            </div>
                        ),
                    },
                ]}
                finalCTAText="Start Tracking Now"
                finalCTAIcon={Clock}
                finalCTAAction={() => window.location.href = '/signin'}
            />

            {/* Transparency Report Section with Enhanced Card */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-warning/10 text-warning border-warning/20 shadow-sm">
                            The Truth About Time Rounding
                        </Badge>
                        <h2 className="text-3xl font-bold mb-6">The Seconds Add Up</h2>
                        <Card className="border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10 shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300">
                            <CardContent className="pt-6">
                                <p className="text-stone-700 dark:text-muted-foreground mb-4 leading-relaxed">
                                    At 18-25 calls per day with minimal wait time, platforms that round down to the nearest minute are systematically underpaying you. A 47-second call becomes 0 minutes. A 1 minute 15 second call becomes 1 minute.
                                </p>
                                <p className="text-stone-700 dark:text-muted-foreground mb-4 leading-relaxed">
                                    <strong className="text-stone-900 dark:text-foreground">The math is simple:</strong> If each of your 20 daily calls loses an average of 30 seconds to rounding, that's <strong className="text-warning">10 minutes of unpaid work per day</strong>. Over a month, that's <strong className="text-destructive">5 hours of free labor</strong>.
                                </p>
                                <p className="text-stone-700 dark:text-muted-foreground leading-relaxed">
                                    InterpreTrack shows you the real numbers. No judgment, no accusations—just transparency so you can make informed decisions about your career.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to See the Full Picture?</h2>
                    <p className="text-xl text-stone-600 dark:text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of interpreters who track their work with precision and transparency.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signin">
                            <Button size="lg" className="glass-button shadow-button-light hover:shadow-button-hover-light dark:shadow-lg dark:hover:shadow-xl transition-all">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/interpretrack/dashboard">
                            <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow">
                                View Live Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default InterpreTrackFeature;
