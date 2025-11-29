import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FullScreenVideoHero } from "@/components/VideoSection";
import { SolutionsShowcase } from "@/components/SolutionsShowcase";
import { StatsSection } from "@/components/StatsSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Brain, AlertTriangle, DollarSign, TrendingDown } from "lucide-react";
import cognitiveOverloadImg from "@/assets/pain-point-cognitive-overload.png";
import healthcareCrisisImg from "@/assets/pain-point-healthcare-crisis.png";
import exploitationImg from "@/assets/pain-point-exploitation.png";

const Index = () => {
  const painPoints = [
    {
      videoSrc: "/videos/lep-statistics.mp4",
      title: "30 Seconds to Reset, Lives on the Line",
      description:
        "Back-to-back calls across diverse medical specialties. Interpreters have 30 seconds or less to completely reset their brain, begin active listening and note-taking, search unfamiliar terminology while continuing to absorb the message, and start interpreting within seconds—all while preserving every word without additions, omissions, or summarizations. Voice clarity, pacing, and smoothness are non-negotiable. In healthcare, lives are directly in their hands. Every. Single. Call.",
      dataOverlays: [
        { stat: "30 SEC", label: "Reset Time", icon: <Brain className="w-5 h-5" /> },
        { stat: "5-10", label: "Specialties Per Day", icon: <AlertTriangle className="w-5 h-5" /> },
        { stat: "100%", label: "Accuracy Required" },
      ],
      illustrationSrc: cognitiveOverloadImg,
      illustrationPosition: 'center' as const,
    },
    {
      videoSrc: "/videos/interpreter-stress.mp4",
      title: "20 Million Lives, Double the Risk",
      description:
        "Over 20 million Limited English Proficient individuals in the U.S. (not counting undocumented immigrants) face a stark reality: they are twice as likely to die when hospitalized compared to English-speaking patients due to language barriers. Despite these alarming mortality rates, interpreters are being onboarded with little to no true training—thrown into life-or-death situations unprepared.",
      dataOverlays: [
        { stat: "20M+", label: "LEP Patients in U.S.", icon: <AlertTriangle className="w-5 h-5" /> },
        { stat: "2x", label: "Mortality Risk", icon: <TrendingDown className="w-5 h-5" /> },
        { stat: "Minimal", label: "Training Provided" },
      ],
      illustrationSrc: healthcareCrisisImg,
      illustrationPosition: 'center' as const,
    },
    {
      videoSrc: "/videos/terminology-gap.mp4",
      title: "Undervalued, Underpaid, Overworked",
      description:
        "Major Language Service Providers justify extreme undercompensation with the excuse: 'Pay ranges according to interpreter's location and economy.' Meanwhile, they're meeting demand and maximizing profits—all at the expense of LEP communities who deserve qualified, fairly-compensated professionals. The interpreters bearing this impossible burden deserve better. The LEP patients depending on them deserve better.",
      dataOverlays: [
        { stat: "$0.10/min", label: "Offshore Pay", icon: <DollarSign className="w-5 h-5" /> },
        { stat: "$4.95/min", label: "LSP Charges", icon: <TrendingDown className="w-5 h-5" /> },
        { stat: "4-6 MOS", label: "QA Feedback Gap" },
      ],
      illustrationSrc: exploitationImg,
      illustrationPosition: 'center' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ThemeToggle />
      
      <main>
        <Hero />
        
        {/* Pain Points Video Sections with Data Overlays */}
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {painPoints.map((painPoint, index) => (
            <FullScreenVideoHero
              key={index}
              videoSrc={painPoint.videoSrc}
              title={painPoint.title}
              description={painPoint.description}
              index={index}
              dataOverlays={painPoint.dataOverlays}
              illustrationSrc={painPoint.illustrationSrc}
              illustrationPosition={painPoint.illustrationPosition}
            />
          ))}
          
          {/* Solutions Showcase - 4th section */}
          <SolutionsShowcase />
        </div>

        {/* Social Proof & Stats */}
        <StatsSection />
        <Testimonials />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
