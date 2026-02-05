import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SolutionsShowcase } from "@/components/SolutionsShowcase";
import { StatsSection } from "@/components/StatsSection";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* How It Works - 3 Step Process */}
        <HowItWorks />

        {/* Solutions Showcase */}
        <SolutionsShowcase />

        {/* Social Proof & Stats */}
        <StatsSection />

        {/* Testimonials */}
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
