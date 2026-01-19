import { InterpreCoachLiveDemo } from "@/components/InterpreCoachLiveDemo";

export const InterpreCoachShowcase = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-background to-accent/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        See <span className="text-primary">InterpreCoach</span> in Action
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Watch how InterpreCoach provides real-time AI assistance during a live medical interpretation session. Terminology suggestions, live transcription, and intelligent tips—all working together to support you.
                    </p>
                </div>

                {/* Live Demo */}
                <InterpreCoachLiveDemo />

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-6">
                        Experience the future of medical interpretation assistance
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/interprecoach"
                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                        >
                            Learn More About InterpreCoach
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};
