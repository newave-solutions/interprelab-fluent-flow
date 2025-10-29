import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Bot,
  Headphones,
  BookOpen,
  BarChart3,
  ArrowRight,
  Sparkles,
  Brain,
  Timer,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

export const PlatformOverview = () => {
  const platforms = [
    {
      name: "InterpreBot",
      description: "AI-powered skill assessment and personalized development recommendations",
      icon: Bot,
      color: "from-purple-600 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      features: [
        "Comprehensive skill assessment",
        "Personalized learning paths",
        "Performance analytics",
        "Certification tracking"
      ],
      link: "/interprebot",
      badge: "Assessment"
    },
    {
      name: "InterpreCoach",
      description: "Real-time assistance and guidance during interpretation sessions",
      icon: Headphones,
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      features: [
        "Live session assistance",
        "Real-time terminology lookup",
        "Context-aware suggestions",
        "Browser extension"
      ],
      link: "/interprecoach",
      badge: "Live Support"
    },
    {
      name: "InterpreStudy",
      description: "Comprehensive training platform with ethics, terminology, and practice modes",
      icon: BookOpen,
      color: "from-green-600 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      features: [
        "Ethics consultation",
        "Medical terminology hub",
        "AI practice scenarios",
        "Prescription reference"
      ],
      link: "/interprestudy",
      badge: "Training"
    },
    {
      name: "InterpreTrack",
      description: "Professional call tracking, earnings management, and performance analytics",
      icon: BarChart3,
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-50 to-red-50",
      borderColor: "border-orange-200",
      features: [
        "Automated call logging",
        "Earnings calculation",
        "Performance dashboard",
        "AI-powered insights"
      ],
      link: "/interpretrack",
      badge: "Analytics"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Complete Ecosystem
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InterpreLab Platform Suite
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Four integrated platforms designed to support every aspect of your interpretation career -
            from assessment and training to live support and performance tracking.
          </p>
        </div>

        {/* Platform Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {platforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <Card
                key={index}
                className={`p-8 bg-gradient-to-br ${platform.bgColor} ${platform.borderColor} hover:shadow-xl transition-all hover:-translate-y-2 group`}
              >
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <Badge className={`bg-gradient-to-r ${platform.color} text-white`}>
                      {platform.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2">{platform.name}</CardTitle>
                  <p className="text-muted-foreground">{platform.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {platform.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${platform.color} rounded-full`} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className={`w-full bg-gradient-to-r ${platform.color} text-white hover:opacity-90 group-hover:scale-105 transition-all`}
                    asChild
                  >
                    <Link to={platform.link}>
                      Launch {platform.name}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Integration Benefits */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Seamless Integration Benefits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h4 className="font-semibold mb-2">Unified Learning</h4>
              <p className="text-sm text-muted-foreground">
                Data flows between platforms to create personalized learning experiences
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Target className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h4 className="font-semibold mb-2">Comprehensive Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Monitor progress across assessment, training, and professional practice
              </p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <Timer className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h4 className="font-semibold mb-2">Real-time Support</h4>
              <p className="text-sm text-muted-foreground">
                Access tools and resources instantly during live interpretation sessions
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-primary/30">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Interpretation Career?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of professional interpreters who use the InterpreLab ecosystem to
              assess their skills, enhance their training, get live support, and track their performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/interprebot">
                  Start Your Assessment
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More About InterpreLab
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
