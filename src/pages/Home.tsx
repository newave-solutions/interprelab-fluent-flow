import { Helmet } from "react-helmet-async";
import { Navigation } from "../components/Navigation";
import { FullScreenVideoHero } from "../components/VideoSection";
import { SolutionHero } from "../components/SolutionHero";
import { StatsSection } from "../components/StatsSection";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { ScrollProgress } from "../components/ScrollProgress";

export default function Home() {
  const painPoints = [
    {
      videoSrc: "/videos/lep-statistics.mp4",
      title: "Overworked & Underpaid",
      description:
        "As of the present day, research suggests remote interpreters are overworked and underpaid, so how does this reflect on the services provided?",
    },
    {
      videoSrc: "/videos/interpreter-stress.mp4",
      title: "The Unqualified Gap",
      description:
        "The shortage of qualified interpreters has led to hiring untrained bilinguals, in some cases, limited English proficient. Independent contractor relationships mean QA teams provide minimal feedback - often analyzing just one call every 4-6 months.",
    },
    {
      videoSrc: "/videos/terminology-gap.mp4",
      title: "Lives at Stake",
      description:
        "As a result, Limited English Proficiency patients are twice as likely to die when hospitalized compared to English-speaking patients. These disparities often go unreported as LEP communities face marginalization and discrimination in healthcare.",
    },
    {
      videoSrc: "/videos/lep-statistics.mp4",
      title: "The Solution: InterpreLab",
      description:
        "Embrace the change, don't get replaced by it. InterpreLab empowers interpreters with AI-driven tools for continuous learning, wellness support, and performance tracking - transforming challenges into opportunities for professional excellence.",
    },
  ];

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>InterpreLab - AI Training for Medical & Legal Interpreters | Free Assessment</title>
        <meta name="title" content="InterpreLab - AI Training for Medical & Legal Interpreters" />
        <meta
          name="description"
          content="Master medical and legal interpretation with AI-powered training. Get instant skills assessment, real-time coaching, and NBCMI/CCHI approved courses. Start free."
        />
        <meta
          name="keywords"
          content="medical interpreter training, legal interpreter certification, interpreter skills assessment, AI interpreter coach, medical interpretation courses, NBCMI certification, CCHI certification"
        />
        <link rel="canonical" href="https://interprelab.com" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://interprelab.com" />
        <meta property="og:title" content="InterpreLab - AI Training for Medical & Legal Interpreters" />
        <meta
          property="og:description"
          content="Free skills assessment for medical and legal interpreters. AI-powered training, real-time coaching, and affordable certification prep."
        />
        <meta property="og:image" content="https://interprelab.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://interprelab.com" />
        <meta name="twitter:title" content="InterpreLab - AI Training for Interpreters" />
        <meta
          name="twitter:description"
          content="Free skills assessment and AI-powered training for medical and legal interpreters. Start improving today."
        />
        <meta name="twitter:image" content="https://interprelab.com/twitter-image.jpg" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="InterpreLab" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <ScrollProgress />
        <Navigation />

      {/* Full-screen video sections with snap scrolling */}
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-snap-container" role="region" aria-label="Pain points and solutions showcase">
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
      <main role="main">
        <SolutionHero />
        <StatsSection />
        <Testimonials />
      </main>

        <Footer />
      </div>
    </>
  );
}
