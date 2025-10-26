import { Navigation } from "@/components/Navigation";
import { VideoSection } from "@/components/VideoSection";
import { SolutionHero } from "@/components/SolutionHero";
import { ProductShowcase } from "@/components/ProductShowcase";
import { StatsSection } from "@/components/StatsSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { AlertTriangle, Brain, SearchX } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.scroll-animate');

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-x-0');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        {/* Pain Point Video Sections */}
        <VideoSection
          videoSrc="videos/covid-intro.mp4"
          title="The Stark Reality of Miscommunication"
          description="Effective communication is literally a matter of life and death. Studies revealed that Limited English Proficient (LEP) patients were significantly more likely—in some cases, twice as likely—to face adverse outcomes, including mortality, during hospitalization compared to English-speaking patients. This underscores the critical need for skilled medical interpreters."
          icon={<AlertTriangle className="w-12 h-12 text-primary" />}
          iconColor="text-primary"
        />

        <VideoSection
          videoSrc="videos/stressed.mp4"
          title="Juggling Complexity Under Pressure"
          description="Medical interpreting requires immense cognitive effort. Interpreters must simultaneously listen intently, comprehend complex medical information often filled with jargon, accurately convert it to another language, and relay it clearly—all while managing the emotional weight of potentially sensitive or stressful situations."
          icon={<Brain className="w-12 h-12 text-success" />}
          iconColor="text-success"
          reverse
        />

        <VideoSection
          videoSrc="videos/no-terms.mp4"
          title="Navigating Niche Knowledge & Isolation"
          description="Mastering medical terminology is an ongoing challenge, as healthcare encompasses countless specialties, each with its own unique vocabulary. The ratio of working interpreters to Quality Assurance specialists is often overwhelmingly high, resulting in limited supervision, infrequent feedback, and fewer opportunities for targeted skill development."
          icon={<SearchX className="w-12 h-12 text-warning" />}
          iconColor="text-warning"
        />

        {/* Solution Hero Section */}
        <SolutionHero />

        {/* Existing Sections */}
        <ProductShowcase />
        <StatsSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
