import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ValueProposition } from "@/components/ValueProposition";
import { ProblemSolution } from "@/components/ProblemSolution";
import { HowItWorks } from "@/components/HowItWorks";
import { DarkSection } from "@/components/DarkSection";
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
        
        {/* Value Proposition - Why Choose Us */}
        <ValueProposition />
        
        {/* Problem-Solution Section */}
        <ProblemSolution />
        
        {/* How It Works - 3 Step Process */}
        <HowItWorks />
        
        {/* Dark Section - Mission Statement */}
        <DarkSection />
        
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
