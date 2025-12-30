import { Card } from "@/components/ui/card";

export const ProductDemoVideo = () => {
    return (
        <section className="py-20 bg-gradient-to-b from-white to-accent/5 dark:from-background dark:to-accent/5">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        See <span className="text-primary">InterpreLab</span> in Action
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Watch how our AI-powered solutions transform the interpretation experience
                    </p>
                </div>

                {/* Full-width video card with soft shadow */}
                <Card className="max-w-6xl mx-auto overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
                    <video
                        className="w-full h-auto"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster=""
                    >
                        <source
                            src="https://cdn.midjourney.com/video/cb84f296-92a0-4a37-a0e3-1c9c95299488/0.mp4"
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-muted-foreground text-sm">
                        Product demonstration showcasing InterpreLab's core features
                    </p>
                </div>
            </div>
        </section>
    );
};
