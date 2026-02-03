import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, Clock, Users, Video, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export const CertificateSection = () => {
    const benefits = [
        { icon: Clock, text: "40 Hours of Training" },
        { icon: Award, text: "NBCMI & CCHI Approved" },
        { icon: Video, text: "Live Interactive Sessions" },
        { icon: Users, text: "Expert Instructors" },
        { icon: FileText, text: "Comprehensive Materials" },
        { icon: CheckCircle2, text: "Certificate of Completion" },
    ];

    return (
        <section className="py-32 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--nobel-gold)) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <Badge className="mb-6 px-6 py-3 bg-nobel-gold/10 text-nobel-gold border-nobel-gold/20 font-semibold backdrop-blur-md">
                            <span className="animate-pulse mr-2">●</span>
                            NEW OFFERING
                        </Badge>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Earn Your <span className="text-nobel-gold">Gold Standard</span>
                        </h2>
                        <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
                            You've probably taken a few training courses throughout your career as an interpreter,
                            but how many have actually been approved by NBCMI and CCHI? Here's what we came up with:
                            a 40-hour course that checks all the boxes and gets you one step closer to certification.
                        </p>
                    </div>

                    {/* Main Content - Coming Soon Overlay */}
                    <div className="relative">
                        {/* Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left - Certificate Visual */}
                            <div className="relative certificate-paper">
                                <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-double border-nobel-gold/70 bg-gradient-to-br from-amber-50 via-white to-stone-50 aspect-[4/3]">
                                    {/* Gold/Black Diagonal Stripes (top-right corner) */}
                                    <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                                        <div className="absolute top-0 right-0 w-48 h-48 transform rotate-45 translate-x-1/4 -translate-y-1/4">
                                            <div className="h-full w-full flex">
                                                <div className="flex-1 bg-nobel-gold"></div>
                                                <div className="flex-1 bg-black"></div>
                                                <div className="flex-1 bg-nobel-gold"></div>
                                                <div className="flex-1 bg-black"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Seal (top-left) */}
                                    <div className="absolute top-6 left-6 w-16 h-16 rounded-full border-4 border-double border-nobel-gold/80 bg-gradient-to-br from-yellow-400 to-nobel-gold flex items-center justify-center shadow-lg">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Certificate Content */}
                                    <div className="w-full h-full p-8 relative flex flex-col items-center justify-center">
                                        {/* Ornate Border */}
                                        <div className="absolute inset-0 border-[12px] border-double border-nobel-gold/30 m-6" />

                                        {/* Center Content */}
                                        <div className="relative z-10 text-center space-y-4">
                                            <div className="font-serif text-3xl font-bold text-nobel-gold tracking-wider">
                                                INTERPRELAB
                                            </div>
                                            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-nobel-gold to-transparent" />

                                            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground pt-4">
                                                Certificate of Completion
                                            </h3>
                                            <p className="text-sm text-muted-foreground italic">This certifies that</p>
                                            <div className="border-b-2 border-dotted border-nobel-gold/40 w-56 mx-auto py-3">
                                                <span className="text-base text-foreground font-medium">[Student Name]</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">has successfully completed the</p>
                                            <h4 className="font-serif text-xl md:text-2xl font-bold text-nobel-gold pt-2">
                                                40-Hour Medical Interpreter<br />Training Course
                                            </h4>
                                            <p className="text-xs text-muted-foreground pt-3">
                                                Approved Prerequisite for NBCMI & CCHI Written Exams
                                            </p>

                                            {/* Bottom badges */}
                                            <div className="flex justify-center gap-8 pt-6">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center border-4 border-yellow-400">
                                                        <Award className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div className="text-[9px] font-bold text-center mt-1">NBCMI<br />APPROVED</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center border-4 border-yellow-400">
                                                        <Award className="w-7 h-7 text-white" />
                                                    </div>
                                                    <div className="text-[9px] font-bold text-center mt-1">CCHI<br />APPROVED</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Watermark */}
                                        <div className="absolute inset-0 opacity-5 flex items-center justify-center">
                                            <div className="font-serif text-7xl font-bold text-nobel-gold rotate-[-30deg]">
                                                INTERPRELAB
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative glows */}
                                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-nobel-gold to-amber-500 rounded-full blur-3xl opacity-30" />
                                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-nobel-gold rounded-full blur-3xl opacity-25" />
                                </div>
                            </div>

                            {/* Right - Benefits */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="font-serif text-3xl font-semibold text-foreground mb-6">
                                        What You'll Get:
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {benefits.map((benefit, index) => {
                                            const Icon = benefit.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-3 p-4 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-nobel-gold/50 transition-all"
                                                >
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-nobel-gold/20 to-nobel-gold/5 flex items-center justify-center">
                                                        <Icon className="w-5 h-5 text-nobel-gold" />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground">
                                                        {benefit.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Certification Info */}
                                <div className="p-6 rounded-xl bg-gradient-to-br from-nobel-gold/10 to-amber-500/5 border border-nobel-gold/20">
                                    <div className="flex items-start gap-3 mb-3">
                                        <Award className="w-6 h-6 text-nobel-gold flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2">Official Prerequisite Course</h4>
                                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                                This 40-hour course is approved by NBCMI and CCHI as a prerequisite for their written certification exams, helping you advance your interpreting career.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        size="lg"
                                        className="px-8 py-6 bg-gradient-to-r from-nobel-gold to-amber-600 hover:from-amber-600 hover:to-nobel-gold text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all"
                                        asChild
                                    >
                                        <Link to="/waitlist">
                                            Join Waitlist
                                            <CheckCircle2 className="w-5 h-5 ml-2" />
                                        </Link>
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="px-8 py-6 border-2 border-nobel-gold/30 hover:border-nobel-gold/50 hover:bg-nobel-gold/5 font-semibold rounded-full transition-all"
                                        asChild
                                    >
                                        <Link to="/resources">
                                            Learn More
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* COMING SOON Overlay - Gradient Blur (40% start → 100% at bottom) */}
                        <div className="absolute inset-0 rounded-2xl flex items-end justify-center z-20 pointer-events-none">
                            {/* Gradient blur - starts at 40% */}
                            <div
                                className="absolute inset-0 rounded-2xl"
                                style={{
                                    background: `linear-gradient(
                                        180deg,
                                        transparent 0%,
                                        transparent 40%,
                                        rgba(0, 0, 0, 0.3) 50%,
                                        rgba(0, 0, 0, 0.6) 60%,
                                        rgba(0, 0, 0, 0.85) 100%
                                    )`,
                                    backdropFilter: 'blur(2px)',
                                }}
                            />

                            {/* Coming Soon Text */}
                            <div className="relative z-30 pb-12 px-4 text-center">
                                <h3 className="text-5xl md:text-6xl font-bold text-nobel-gold tracking-wider drop-shadow-2xl" style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)' }}>
                                    COMING SOON
                                </h3>
                                <p className="text-lg md:text-xl text-white/90 font-semibold mt-4 drop-shadow-lg">
                                    Be the first to know when enrollment opens
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Paper Texture and Animation Styles */}
            <style>{`
                @keyframes subtle-float {
                    0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
                    50% { transform: translateY(-5px) rotate(-0.3deg); }
                }

                .certificate-paper {
                    position: relative;
                    filter: contrast(1.03) brightness(0.98);
                    transform: rotate(-0.5deg);
                    animation: subtle-float 8s ease-in-out infinite;
                }

                .certificate-paper::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image:
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(0, 0, 0, 0.01) 2px,
                            rgba(0, 0, 0, 0.01) 4px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 2px,
                            rgba(0, 0, 0, 0.01) 2px,
                            rgba(0, 0, 0, 0.01) 4px
                        );
                    opacity: 0.3;
                    pointer-events: none;
                    border-radius: inherit;
                }

                .certificate-paper::after {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: inherit;
                    pointer-events: none;
                }
            `}</style>
        </section>
    );
};
