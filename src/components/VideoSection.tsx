import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface VideoSectionProps {
  videoSrc: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  reverse?: boolean;
}

export const VideoSection = ({
  videoSrc,
  title,
  description,
  icon,
  iconColor,
  reverse = false,
}: VideoSectionProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.play().catch((error) => {
            console.log("Video play failed:", error);
            video.muted = true;
            video.play().catch((e) => console.log("Retry failed:", e));
          });
        } else {
          video.pause();
        }
      });
    }, observerOptions);

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden"
    >
      <div
        className={cn(
          "container mx-auto flex flex-col gap-12 items-center",
          reverse ? "md:flex-row-reverse" : "md:flex-row"
        )}
      >
        {/* Video Card */}
        <div className="w-full md:w-1/2 lg:w-5/12 scroll-animate opacity-0 transition-all duration-1000 ease-out transform translate-x-0">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              loop
              preload="metadata"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
            <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
              <div className={cn("mb-6 p-4 rounded-full bg-background/10 backdrop-blur-sm", iconColor)}>
                {icon}
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold text-white">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full md:w-1/2 lg:w-7/12 text-center md:text-left scroll-animate opacity-0 transition-all duration-1000 ease-out delay-200">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
