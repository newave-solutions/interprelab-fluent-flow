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
                            Become <span className="text-nobel-gold">Certified</span> in 6 Weeks
                        </h2>
                        <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto">
                            Course approved for written exam prerequisite by NBCMI and CCHI
                        </p>
                    </div>

                    {/* Main Content - Coming Soon Overlay */}
                    <div className="relative">
                        {/* Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left - Certificate Visual */}
                            <div className="relative">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-double border-nobel-gold/60 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-50 aspect-[4/3]">
                                    {/* Premium Certificate Design */}
                                    <div className="w-full h-full p-8 relative">
                                        {/* Ornate Border */}
                                        <div className="absolute inset-0 border-[12px] border-double border-nobel-gold/30 m-4" />

                                        {/* Certificate Content */}
                                        <div className="relative z-10 h-full flex flex-col items-center justify-between py-6">
                                            {/* Top - InterpreLab Logo & Title */}
                                            <div className="text-center space-y-3">
                                                <div className="font-serif text-2xl font-bold text-nobel-gold tracking-wider">
                                                    INTERPRELAB
                                                </div>
                                                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-nobel-gold to-transparent" />
                                            </div>

                                            {/* Main Title */}
                                            <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                                                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                                                    Certificate of Completion
                                                </h3>
                                                <p className="text-sm text-muted-foreground italic">This certifies that</p>
                                                <div className="border-b-2 border-dotted border-nobel-gold/40 w-48 mx-auto py-2">
                                                    <span className="text-sm text-muted-foreground">[Student Name]</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">has successfully completed the</p>
                                                <h4 className="font-serif text-lg md:text-xl font-bold text-nobel-gold">
                                                    40-Hour Medical Interpreter<br />Training Course
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-4">
                                                    Approved Prerequisite for NBCMI & CCHI Written Exams
                                                </p>
                                            </div>

                                            {/* Bottom - Badges & Signatures */}
                                            <div className="w-full">
                                                <div className="flex justify-between items-end">
                                                    {/* NBCMI Badge */}
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-2 border-4 border-yellow-400/80">
                                                            <Award className="w-8 h-8 text-white" />
                                                        </div>
                                                        <div className="text-[8px] font-bold text-center">
                                                            NBCMI<br />APPROVED
                                                        </div>
                                                    </div>

                                                    {/* Center - Date & Signature */}
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <div className="border-t border-foreground/30 w-32 pt-1">
                                                            <p className="text-[8px] text-center text-muted-foreground">Director Signature</p>
                                                        </div>
                                                        <p className="text-[8px] text-muted-foreground">Date: __/__/____</p>
                                                    </div>

                                                    {/* CCHI Badge */}
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center mb-2 border-4 border-yellow-400/80">
                                                            <Award className="w-8 h-8 text-white" />
                                                        </div>
                                                        <div className="text-[8px] font-bold text-center">
                                                            CCHI<br />APPROVED
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Watermark Pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-6xl font-bold text-nobel-gold rotate-[-45deg]">
                                                INTERPRELAB
                                            </div>
                                        </div>

                                        {/* Corner Decorations */}
                                        <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-nobel-gold/40" />
                                        <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-nobel-gold/40" />
                                        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-nobel-gold/40" />
                                        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-nobel-gold/40" />
                                    </div>
                                </div>
                                {/* Decorative glows */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-nobel-gold to-amber-500 rounded-full blur-3xl opacity-40" />
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-nobel-gold rounded-full blur-3xl opacity-30" />
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

                        {/* COMING SOON Overlay - Gradient from bottom */}
                        <div className="absolute inset-0 rounded-2xl flex items-end justify-center z-20">
                            {/* Gradient blur overlay from bottom-up */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent dark:from-black/95 dark:via-black/60 dark:to-transparent backdrop-blur-md rounded-2xl" />

                            {/* Coming Soon Banner */}
                            <div className="relative z-30 text-center space-y-6 pb-12 px-8">
                                <div className="inline-block px-16 py-8 bg-gradient-to-r from-nobel-gold via-yellow-500 to-amber-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
                                    <h3 className="text-5xl md:text-6xl font-bold text-white tracking-wider drop-shadow-lg">
                                        COMING SOON
                                    </h3>
                                </div>
                                <p className="text-xl text-foreground font-semibold drop-shadow-md">
                                    Be the first to know when enrollment opens
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <span className="px-4 py-2 bg-white/80 dark:bg-black/80 rounded-full text-sm font-medium backdrop-blur-sm">
                                        40 Hours
                                    </span>
                                    <span className="px-4 py-2 bg-white/80 dark:bg-black/80 rounded-full text-sm font-medium backdrop-blur-sm">
                                        NBCMI & CCHI Approved
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
