import { Navigation } from "@/components/Navigation";
import { FullScreenVideoHero } from "@/components/VideoSection";
import { SolutionHero } from "@/components/SolutionHero";
import { TrustedPartners } from "@/components/TrustedPartners";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

const Index = () => {
  const painPoints = [
    {
      videoSrc: "/videos/lep-statistics.mp4",
      title: "20 Million Americans Can't Access Quality Healthcare",
      description:
        "Over 20 million Limited English Proficient (LEP) individuals in the United States struggle to receive quality healthcare due to language barriers. These marginalized communities face adverse outcomes—including higher mortality rates—because they cannot effectively communicate their needs. Quality interpretation isn't just helpful, it's life-saving.",
    },
    {
      videoSrc: "/videos/interpreter-stress.mp4",
      title: "The Crushing Weight of Real-Time Complexity",
      description:
        "Medical interpreters face intense cognitive demands: listening intently, processing highly specialized terminology across countless medical fields, translating accurately under pressure, and managing the emotional toll of traumatic situations—all simultaneously. This mental juggling act requires exceptional focus and resilience to prevent burnout.",
    },
    {
      videoSrc: "/videos/terminology-gap.mp4",
      title: "Isolated, Overwhelmed, and Under-Supported",
      description:
        "With an overwhelming ratio of interpreters to Quality Assurance specialists, most interpreters receive minimal supervision, infrequent feedback, and limited professional development. Mastering terminology across cardiology, oncology, neurology, and dozens of other specialties feels impossible when you're navigating it alone.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation transparent />
      
      {/* Full-screen video sections with snap scrolling */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {painPoints.map((painPoint, index) => (
          <FullScreenVideoHero
            key={index}
            videoSrc={painPoint.videoSrc}
            title={painPoint.title}
            description={painPoint.description}
            index={index}
          />
        ))}
      </div>

      {/* Main content */}
      <main>
        <SolutionHero />
        <TrustedPartners />
        <Testimonials />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
