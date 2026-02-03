import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SolutionsBento } from "@/components/SolutionsBento";
import { CertificateSection } from "@/components/CertificateSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section - Bold introduction */}
        <Hero />

        {/* Solutions Bento - Complete AI toolkit showcase */}
        <SolutionsBento />

        {/* Certificate Section - 40-hour training course */}
        <CertificateSection />

        {/* How It Works - Simple 3-step process */}
        <HowItWorks />

        {/* Testimonials - Social proof */}
        <Testimonials />

      </main>

      <Footer />
    </div>
  );
};

export default Index;
