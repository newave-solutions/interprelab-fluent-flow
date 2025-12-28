import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, Clock, Brain, Users, Heart, TrendingDown,
  AlertTriangle, FileText, ArrowRight, CheckCircle2, Shield,
  BookOpen, Target, Lightbulb
} from "lucide-react";
import { Link } from "react-router-dom";

const IndustryChallenges = () => {
  const challenges = [
    {
      icon: DollarSign,
      title: "Financial Transparency & Compensation",
      severity: "Critical",
      description: "Medical and legal interpreters often face challenges with payment accuracy and transparency, particularly in VRI and OPI settings. Many platforms do not provide clear call duration data, making it difficult to verify earnings or address discrepancies.",
      stats: [
        "Average 15-20% wage discrepancy between logged and actual hours",
        "83% of interpreters report payment disputes with platforms",
        "VRI calls often unpaid for technical delays and setup time"
      ],
      impact: "Interpreters may experience financial discrepancies due to incomplete tracking systems and lack of transparent reporting mechanisms.",
      solution: "InterpreTrack provides transparent, real-time call logging and earnings verification."
    },
    {
      icon: Brain,
      title: "Cognitive Overload & Burnout",
      severity: "High",
      description: "The mental demands of simultaneous interpretation, especially in high-stakes medical and legal settings, lead to rapid cognitive fatigue. Without proper support or rest periods, interpreters face severe burnout.",
      stats: [
        "68% of interpreters report experiencing burnout symptoms",
        "Average career span: 7 years (vs. 15+ in other professions)",
        "Limited access to specialized mental health support"
      ],
      impact: "High turnover rates and declining interpretation quality as professionals leave the field prematurely.",
      solution: "InterpreCoach provides real-time assistance to reduce cognitive load, while InterpreWellness offers specialized mental health support."
    },
    {
      icon: Heart,
      title: "Vicarious Trauma & Emotional Burden",
      severity: "Critical",
      description: "Medical and legal interpreters regularly witness traumatic situations—terminal diagnoses, abuse cases, violent crimes—without adequate emotional support or debriefing resources.",
      stats: [
        "74% report symptoms of vicarious trauma",
        "Limited access to trauma-informed mental health services",
        "High rates of PTSD among court and medical interpreters"
      ],
      impact: "Silent suffering, substance abuse issues, and psychological distress that goes largely unaddressed in the profession.",
      solution: "InterpreWellness provides 24/7 AI-powered mental health support designed specifically for interpreters."
    },
    {
      icon: Clock,
      title: "Inaccessible Professional Development",
      severity: "High",
      description: "Traditional certification prep courses cost $1,500-$3,000 and require months of commitment. For working interpreters juggling multiple jobs, this creates an insurmountable barrier to advancement.",
      stats: [
        "90% of interpreters cite cost as barrier to certification",
        "Traditional courses require 6-12 months of commitment",
        "Limited feedback on specific areas for improvement"
      ],
      impact: "Many skilled interpreters remain uncertified, limiting career growth and earning potential.",
      solution: "InterpreTest offers free AI-powered assessments with personalized feedback, and InterpreStudy provides affordable, flexible training."
    },
    {
      icon: Users,
      title: "Professional Isolation",
      severity: "Medium",
      description: "Interpreters often work independently without access to mentorship, peer support, or professional communities. This isolation compounds the challenges of burnout and career development.",
      stats: [
        "62% of interpreters work as independent contractors",
        "Limited opportunities for mentorship and peer learning",
        "No centralized platform for professional networking"
      ],
      impact: "Interpreters miss opportunities to learn from peers, share coping strategies, and build supportive professional networks.",
      solution: "InterpreLink creates a dedicated professional network where interpreters can connect, share experiences, and support each other."
    },
    {
      icon: TrendingDown,
      title: "AI Displacement Anxiety",
      severity: "Emerging",
      description: "As AI translation tools improve, interpreters face legitimate concerns about job security, while simultaneously lacking tools to enhance their own practice with AI assistance.",
      stats: [
        "78% of interpreters express concern about AI replacement",
        "Growing investment in machine translation technology",
        "Limited training on how to leverage AI as a professional tool"
      ],
      impact: "Anxiety about the future of the profession without clear pathways to adapt and thrive alongside technological advancement.",
      solution: "InterpreLab positions AI as an assistant and enhancement tool, empowering interpreters to work smarter, not be replaced."
    }
  ];

  const industryStats = [
    { value: "500,000+", label: "Medical Interpreters in the U.S." },
    { value: "25M+", label: "Limited English Proficiency (LEP) Individuals" },
    { value: "$52B", label: "Annual Cost of Language Barriers in Healthcare" },
    { value: "68%", label: "Interpreters Experiencing Burnout" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              Industry Insights
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Hidden Challenges Facing Medical & Legal Interpreters
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Understanding the systemic issues that affect interpretation professionals—and how technology can help address them.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>15 min read</span>
              </div>
              <span>•</span>
              <span>Last updated: December 2024</span>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Statistics */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {industryStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
            <h2 className="text-3xl font-bold mb-6">Why This Matters</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Medical and legal interpreters serve as vital bridges in high-stakes situations where communication
              can mean the difference between life and death, justice and injustice. Yet these professionals face
              unique challenges that are often invisible to the healthcare systems, legal institutions, and
              language service providers they serve.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              At InterpreLab, we're working interpreters who've experienced these challenges firsthand.
              We built our platform to address these systemic issues head-on—not just to improve individual
              careers, but to strengthen the entire interpretation profession.
            </p>
          </div>
        </div>
      </section>

      {/* Challenges Deep Dive */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">The Six Core Challenges</h2>
              <p className="text-muted-foreground">
                A comprehensive look at the issues facing interpretation professionals
              </p>
            </div>

            <div className="space-y-8">
              {challenges.map((challenge, index) => {
                const Icon = challenge.icon;
                const severityColors = {
                  Critical: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
                  High: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900",
                  Medium: "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900",
                  Emerging: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900"
                };

                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl mb-2">{challenge.title}</CardTitle>
                            <Badge className={severityColors[challenge.severity as keyof typeof severityColors]}>
                              {challenge.severity} Impact
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {challenge.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Statistics */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Target className="w-4 h-4 text-primary" />
                          Key Statistics
                        </h4>
                        <ul className="space-y-2">
                          {challenge.stats.map((stat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <AlertTriangle className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                              <span>{stat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Impact */}
                      <div className="bg-muted/50 p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                          Impact on Profession
                        </h4>
                        <p className="text-sm">{challenge.impact}</p>
                      </div>

                      {/* Solution */}
                      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-900">
                        <h4 className="font-semibold mb-2 text-sm uppercase tracking-wide text-green-700 dark:text-green-400 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Our Solution
                        </h4>
                        <p className="text-sm text-green-900 dark:text-green-200">{challenge.solution}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Path Forward */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">The Path Forward</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                These challenges aren't insurmountable. Technology, when designed by and for interpreters,
                can provide powerful solutions. But it requires a fundamental shift in how we approach
                interpretation services:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Platforms must provide clear, verifiable data on call duration, earnings, and performance
                      metrics. No more hidden algorithms or disputed hours.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary" />
                      Mental Health Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Recognition that interpretation work carries emotional weight, with accessible support
                      systems designed for the unique needs of the profession.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Accessible Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Professional development tools that are affordable, flexible, and provide actionable
                      feedback—not gatekeeping mechanisms that exclude capable interpreters.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Community & Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Professional networks where interpreters can share strategies, support each other,
                      and collectively advocate for better working conditions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us in Transforming the Profession</h2>
            <p className="text-lg text-muted-foreground mb-8">
              InterpreLab isn't just a platform—it's a movement to address these systemic challenges
              and empower interpreters with the tools they need to thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link to="/waitlist">
                  Join the Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Built by interpreters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>For interpreters</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-6">Explore Our Solutions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link to="/interpretrack">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">InterpreTrack</CardTitle>
                    <CardDescription>
                      Ensure payment accuracy with transparent call logging and verification
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link to="/interpre-wellness">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">InterpreWellness</CardTitle>
                    <CardDescription>
                      24/7 mental health support for interpreters
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link to="/interpretest">
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">InterpreTest</CardTitle>
                    <CardDescription>
                      Free skills assessment and personalized feedback
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IndustryChallenges;
