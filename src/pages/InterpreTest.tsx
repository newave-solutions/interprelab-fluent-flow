import interpreTestMockup from "@/assets/interpre-hub-mockup.png"; // TODO: Replace with InterpreTest-specific mockup
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Brain, Target, BarChart, Users, ArrowRight, Play, MessageSquare, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PainPointBadge } from "@/components/PainPointBadge";
import { GetStartedSteps } from "@/components/GetStartedSteps";
import { MissionCollaborationCTA } from "@/components/MissionCollaborationCTA";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { RelatedFeatures } from "@/components/RelatedFeatures";

const InterpreBot = () => {
  const [userQuestion, setUserQuestion] = useState("");
  const [showChat, setShowChat] = useState(false);

  const commonQuestions = [
    "How does the assessment work?",
    "What skills does InterpreBot measure?",
    "How long does the assessment take?",
    "How do I get personalized training?",
    "What languages are supported?",
  ];

  return (
    <Layout>
      {/* Hero Section with Contained Background Image */}
      <div className="container mx-auto px-4 py-12">
        <div
          className="relative text-center mb-16 animate-fade-in py-20 px-6 rounded-3xl bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('/interprebot-hero.png')" }}
        >
          <div className="absolute inset-0 bg-black/70 rounded-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <PainPointBadge painPoint="Addressing Pain Point #4: Inaccessible Professional Development" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                InterpreBot
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              AI-powered skills assessment with personalized feedback. Know exactly where you stand and how to improve—because professional development should be accessible to all.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Message + Assessment Dashboard */}
      <section className="py-12 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Know Exactly Where You Stand
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Professional development shouldn't cost $100s-$1000s or require guesswork. As working interpreters, we know the struggle. InterpreBot provides instant AI-powered assessment of your interpretation skills with detailed, personalized feedback—because you deserve to know exactly where you stand and how to improve.
              </p>
              <div className="glass p-4 rounded-lg mb-6">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Why We Built This:</strong> We've experienced the frustration of expensive courses with minimal support. We're working interpreters building tools that we wish existed—affordable, accessible, and actually helpful. This is our mission: to be a lifeline for interpreters like us.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="glass-button">
                  <Play className="w-5 h-5 mr-2" />
                  Take the Assessment
                </Button>
                <Link to="/interprecoach">
                  <Button variant="outline" size="lg">
                    Meet InterpreCoach
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="glass rounded-2xl p-8 border border-border/50">
                <img
                  src={interpreTestMockup}
                  alt="InterpreBot Assessment Dashboard"
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Particles */}
      <section className="relative py-16 overflow-hidden">
        <ParticlesBackground particleCount={80} variant="stars" />
        <div className="relative z-10">
          <FeatureGrid
            title="What We Measure"
            subtitle="Comprehensive analysis of linguistics, terminology, and communication effectiveness."
            columns="4"
            features={[
              {
                icon: Brain,
                title: "Cognitive Analysis",
                description: "Assess cognitive load, processing speed, and mental agility during interpretation.",
              },
              {
                icon: Target,
                title: "Accuracy Metrics",
                description: "Measure precision in terminology, context preservation, and cultural adaptation.",
              },
              {
                icon: BarChart,
                title: "Performance Tracking",
                description: "Monitor progress with detailed analytics and improvement suggestions.",
              },
              {
                icon: Users,
                title: "Peer Comparison",
                description: "Compare your performance with industry standards and peer benchmarks.",
              },
            ]}
          />
        </div>
      </section>

      {/* Getting Started Timeline with Particles */}
      <section className="relative py-16 overflow-hidden">
        <ParticlesBackground particleCount={100} variant="mixed" />
        <div className="relative z-10">
          <GetStartedSteps
            title="Get Started in 3 Steps"
            subtitle="Your path to improved interpretation skills"
            steps={[
              {
                icon: Play,
                title: "Take the Assessment",
                description: "Complete a 30-minute comprehensive assessment covering various interpretation scenarios in your target language pair.",
                buttonText: "Start Assessment",
                buttonAction: () => console.log("Start assessment"),
              },
              {
                icon: BarChart,
                title: "Get Your Metrics",
                description: "Receive instant AI analysis with detailed scores on accuracy, fluency, medical terminology, and cultural competence.",
                content: (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="glass p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                      <p className="text-2xl font-bold text-primary">92%</p>
                    </Card>
                    <Card className="glass p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Fluency</p>
                      <p className="text-2xl font-bold text-primary">88%</p>
                    </Card>
                    <Card className="glass p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Terminology</p>
                      <p className="text-2xl font-bold text-primary">85%</p>
                    </Card>
                    <Card className="glass p-4 text-center">
                      <p className="text-sm text-muted-foreground mb-1">Cultural</p>
                      <p className="text-2xl font-bold text-primary">90%</p>
                    </Card>
                  </div>
                ),
              },
              {
                icon: TrendingUp,
                title: "Get Personalized Training",
                description: "Access a customized training path based on your assessment results, focusing on your areas for improvement.",
                content: (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Custom practice exercises</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Targeted terminology drills</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">Progress tracking dashboard</span>
                    </div>
                  </div>
                ),
              },
            ]}
            finalCTAText="Start Your Journey Now"
            finalCTAIcon={Play}
            finalCTAAction={() => console.log("Start journey")}
          />
        </div>
      </section>

      {/* Related Features */}
      <RelatedFeatures currentFeature="interpretest" />

      {/* Mission & Collaboration CTA */}
      <MissionCollaborationCTA
        title="InterpreLab: A Lifeline for Interpreters"
        description="We're not just a platform—we're working interpreters who've lived through every challenge you face. We're passionate about being conduits of information and helping people in vulnerable situations. These pain points affect us too, and we're using our skills to lighten the load. But we can't do it alone."
        footerText="Want to discuss partnerships or broaden our reach? We're connected to this field on a deeper level—let's work together."
      />
    </Layout>
  );
};

export default InterpreBot;
