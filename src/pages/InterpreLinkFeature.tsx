import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageCircle, Briefcase, Heart, Network, BookOpen, ArrowRight, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PainPointBadge } from "@/components/PainPointBadge";
import { GetStartedSteps } from "@/components/GetStartedSteps";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ParticlesBackground } from "@/components/ParticlesBackground";

const InterpreLinkFeature = () => {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-subtle">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <PainPointBadge painPoint="Addressing Pain Point #3: Professional Isolation & Networking" />
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                                InterpreLink
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                You're not alone. Connect with fellow medical interpreters, share experiences, find job opportunities, and build the professional network you deserve.
                            </p>
                            <div className="glass p-4 rounded-lg mb-6">
                                <p className="text-sm text-muted-foreground">
                                    🤝 <strong>Built by interpreters, for interpreters.</strong> We understand the isolation of remote work and the need for professional community. InterpreLink is where your colleagues gather.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signin">
                                    <Button size="lg" className="glass-button w-full sm:w-auto">
                                        <Users className="w-5 h-5 mr-2" />
                                        Join the Community
                                    </Button>
                                </Link>
                                <Link to="/interprelink/dashboard">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                        Explore the Hub
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="glass rounded-2xl p-8 border border-border/50">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
                                        <Users className="w-8 h-8 text-primary" />
                                        <div>
                                            <p className="font-semibold">3,247 Interpreters</p>
                                            <p className="text-sm text-muted-foreground">Active community members</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
                                        <MessageCircle className="w-8 h-8 text-success" />
                                        <div>
                                            <p className="font-semibold">1,892 Discussions</p>
                                            <p className="text-sm text-muted-foreground">Real interpreter conversations</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-warning/10 rounded-lg">
                                        <Briefcase className="w-8 h-8 text-warning" />
                                        <div>
                                            <p className="font-semibold">124 Job Postings</p>
                                            <p className="text-sm text-muted-foreground">New opportunities this month</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features with Particles */}
            <section className="relative py-16 overflow-hidden">
                <ParticlesBackground particleCount={80} variant="dots" />
                <div className="relative z-10">
                    <FeatureGrid
                        title="Your Professional Network Awaits"
                        subtitle="Community features designed for medical interpreters"
                        features={[
                            {
                                icon: MessageCircle,
                                title: "Discussion Forums",
                                description: "Ask questions, share experiences, and discuss best practices with fellow interpreters in dedicated topic channels.",
                            },
                            {
                                icon: Briefcase,
                                title: "Job Board",
                                description: "Discover new opportunities from LSCs, hospitals, and healthcare systems actively seeking qualified interpreters.",
                            },
                            {
                                icon: Network,
                                title: "Networking Requests",
                                description: "Connect with interpreters in your specialty, region, or language pairs. Build meaningful professional relationships.",
                            },
                            {
                                icon: BookOpen,
                                title: "Resource Library",
                                description: "Access community-curated glossaries, terminology guides, and educational resources shared by experienced interpreters.",
                            },
                            {
                                icon: Heart,
                                title: "Peer Support",
                                description: "Share the emotional weight of difficult calls. Find support from those who truly understand vicarious trauma.",
                            },
                            {
                                icon: TrendingUp,
                                title: "Professional Development",
                                description: "Stay updated on certification requirements, continuing education opportunities, and industry news.",
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
                        title="Join the Hub in 3 Simple Steps"
                        subtitle="From isolation to community"
                        steps={[
                            {
                                showIcon: true,
                                icon: CheckCircle,
                                title: "Create Your Profile",
                                description: "Share your certifications, language pairs, and specialties. Let others know your expertise.",
                                content: (
                                    <div className="p-4 glass rounded-lg">
                                        <p className="text-sm font-semibold mb-1">Your Profile</p>
                                        <p className="text-xs text-muted-foreground">CMI Certified • EN↔ES • Medical/Legal</p>
                                    </div>
                                ),
                            },
                            {
                                showIcon: true,
                                icon: Users,
                                title: "Explore & Connect",
                                description: "Browse discussions, respond to posts, and send connection requests to interpreters in your field.",
                                content: (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-sm">Join "Best Practices" discussion</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-sm">Answer a terminology question</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-sm">Connect with 3 interpreters</span>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                showIcon: true,
                                icon: Briefcase,
                                title: "Find Opportunities",
                                description: "Browse job postings, apply directly, and grow your career with better rates and working conditions.",
                                content: (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 glass rounded-lg">
                                            <p className="text-sm font-semibold mb-1">Your Network</p>
                                            <p className="text-xs text-muted-foreground">47 connections</p>
                                        </div>
                                        <div className="p-4 glass rounded-lg">
                                            <p className="text-sm font-semibold mb-1">Jobs Matched</p>
                                            <p className="text-xs text-muted-foreground">12 opportunities</p>
                                        </div>
                                    </div>
                                ),
                            },
                        ]}
                        finalCTAText="Join InterpreLink Now"
                        finalCTAIcon={Users}
                        finalCTAAction={() => window.location.href = '/signin'}
                    />
                </div>
            </section>

            {/* Community Testimonials Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            Real Stories from Real Interpreters
                        </Badge>
                        <h2 className="text-3xl font-bold mb-6">Why Interpreters Love InterpreLink</h2>
                        <div className="grid gap-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground italic mb-4">
                                        "I was struggling with a rare oncology term during a telehealth session. Posted in InterpreLink and had three experienced interpreters share their approaches within 20 minutes. This community is a lifeline."
                                    </p>
                                    <p className="font-semibold">— Ana S., Hospital Interpreter (CMI)</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground italic mb-4">
                                        "Found my current position through the job board. Better pay, respectful LSC, and I connected with them because another InterpreLink member vouched for the company. Game-changer."
                                    </p>
                                    <p className="font-semibold">— Marcus T., Remote Medical Interpreter</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-muted-foreground italic mb-4">
                                        "After a particularly traumatic ER interpretation involving a child, I didn't know where to turn. The peer support in InterpreLink helped me process the vicarious trauma. I'm not alone anymore."
                                    </p>
                                    <p className="font-semibold">— Chloe G., ER Interpreter</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Ready to Join Your Professional Community?</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Connect with thousands of interpreters who understand your challenges and celebrate your successes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signin">
                            <Button size="lg" className="glass-button">
                                Join Free Today
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/interprelink/dashboard">
                            <Button variant="outline" size="lg">
                                Explore Community
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default InterpreLinkFeature;
