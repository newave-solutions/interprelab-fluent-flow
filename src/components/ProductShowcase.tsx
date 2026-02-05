import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Chrome,
  Clock,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Download,
  Sparkles,
  Eye,
  TrendingUp,
  LineChart
} from "lucide-react";
import { Link } from "react-router-dom";
import theCrewImage from "@/assets/the_crew.png";

export const ProductShowcase = () => {
  const products = [
    {
      id: "interprebot",
      name: "InterpreBot",
      tagline: "Skills Assessment",
      description: "Tired of not knowing how your skills measure up? InterpreBot has your back! Take the AI-powered language assessment to get an indepth analysis and personalized learning path.",
      icon: Brain,
      gradient: "from-purple-500 to-pink-500",
      link: "/interpretest",
      cta: "Find out more",
      ctaIcon: TrendingUp,
      features: [
        "Voice Control & Clarity",
        "Grammar & Syntax Analysis",
        "Vocabulary Assessment",
        "Ethical Decision-Making",
        "Personalized Learning Paths"
      ],
      badges: ["Hesitations", "Tone Issues", "Pacing"],
      visualType: "3d-scene"
    },
    {
      id: "interprecoach",
      name: "InterpreCoach",
      tagline: "Real-Time Assistant",
      description: "Dread unknown vocabulary? We did too, that's why we bring InterpreCoach! Instant terminology support during your encounters.",
      icon: Chrome,
      gradient: "from-success to-primary",
      link: "/interprecoach",
      cta: "Meet InterpreCoach",
      ctaIcon: Download,
      features: [
        "Browser Integration",
        "Real-time Speech-to-Text",
        "Multi-Agent Processing",
        "Context Windows",
        "QA & Ethics Feedback"
      ],
      badges: ["Medical", "Legal"],
      visualType: "image",
      imageSrc: "/interpre-hub-mockup.png",
      visualBadge: "Live Recording",
      visualText: "Real-time interpretation assistance"
    },
    {
      id: "interpretrack",
      name: "InterpreTrack",
      tagline: "Session Tracking",
      description: "Automated logging and earnings tracking for freelance interpreters. Never lose track of a billable minute again.",
      icon: Clock,
      gradient: "from-blue-500 to-cyan-500",
      link: "/interpretrack",
      cta: "Start Tracking",
      ctaIcon: LineChart,
      features: [
        "Automated Time Logging",
        "Earnings Calculator",
        "Invoice Generation",
        "Platform Analytics",
        "Goal Setting"
      ],
      badges: ["Freelance", "Agency"],
      visualType: "image",
      imageSrc: "/tech-background.jpg",
      visualBadge: "Tracking Active",
      visualText: "Precise session analytics"
    }
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="container mx-auto relative z-10">
        {/* Header - Simplified */}
        <div className="text-center mb-20 space-y-4 animate-fade-in">
          <Badge className="glass px-6 py-3 border-primary/20">
            Complete Ecosystem
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold">
            <span className="text-foreground">Three Tools.</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">One Platform.</span>
          </h2>
          <div className="relative w-full max-w-3xl mx-auto h-48 md:h-64 mt-8">
            <img
              src={theCrewImage}
              alt="InterpreLab AI Assistants - The Crew"
              className="w-full h-full object-contain animate-float"
              style={{
                filter: 'drop-shadow(0 30px 60px hsl(var(--nobel-gold) / 0.4))',
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="bg-card/50 border-border/50 backdrop-blur-sm hover-lift group relative overflow-hidden">
              <CardContent className="p-8 relative z-10 h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${product.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      <product.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={`relative aspect-video rounded-lg overflow-hidden ${product.visualType === '3d-scene' ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40' : 'bg-muted'}`}>
                    {product.visualType === '3d-scene' ? (
                      // 3D Scene for InterpreBot
                      <div className="w-full h-full relative perspective-1000">
                        {/* Main 3D Computer */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative transform-gpu hover:scale-105 transition-transform duration-500">
                            {/* Computer Base */}
                            <div
                              className="w-32 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl"
                              style={{ transform: 'rotateX(15deg) rotateY(-10deg)' }}
                            >
                              {/* Screen */}
                              <div className="absolute top-1 left-2 right-2 bottom-6 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded border border-cyan-400/30 overflow-hidden">
                                {/* Scrolling Code Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-400/10 to-transparent animate-pulse" />
                                <div className="text-cyan-300 text-xs font-mono p-1 opacity-70">
                                  <div className="animate-pulse">AI Analysis...</div>
                                  <div className="animate-pulse" style={{ animationDelay: '0.2s' }}>Voice: 92%</div>
                                  <div className="animate-pulse" style={{ animationDelay: '0.4s' }}>Grammar: 88%</div>
                                </div>
                              </div>
                              {/* Keyboard */}
                              <div className="absolute bottom-1 left-2 right-2 h-2 bg-slate-700 rounded-sm" />
                            </div>
                          </div>
                        </div>

                        {/* Floating Network Elements */}
                        <div className="absolute top-4 left-4 w-3 h-3 bg-cyan-400 rounded-full animate-float opacity-70" />
                        <div className="absolute top-6 right-6 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-70" style={{ animationDelay: '1s' }} />
                        <div className="absolute bottom-6 left-8 w-4 h-4 bg-pink-400 rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }} />
                        <div className="absolute right-4 bottom-8 w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-70" style={{ animationDelay: '1.5s' }} />

                        {/* Status Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            AI Analysis Active
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      // Standard Image Visual
                      <>
                        <img
                          src={product.imageSrc}
                          alt={`${product.name} Preview`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className={`border-0 text-white mb-2 bg-gradient-to-r ${product.gradient}`}>
                            {product.visualBadge}
                          </Badge>
                          <p className="text-white text-sm">{product.visualText}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Key Features:</h4>
                    <div className="space-y-2">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${product.gradient}`} />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges/Tags */}
                  {product.badges && (
                    <div className="space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        {product.badges.map(badge => (
                          <Badge key={badge} variant="outline" className="text-xs">{badge}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4">
                    <Button asChild className={`w-full border-0 text-white hover:opacity-90 bg-gradient-to-r ${product.gradient}`}>
                      <Link to={product.link}>
                        {product.ctaIcon && <product.ctaIcon className="w-4 h-4 mr-2" />}
                        {product.cta}
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Model Section */}
        <div className="mt-20 text-center space-y-8">
          <Badge className="bg-gradient-primary border-0 text-white px-4 py-2">
            Flexible Pricing
          </Badge>
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            Freemium to Enterprise Solutions
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-foreground mb-2">Free Tier</h4>
                <p className="text-muted-foreground mb-4">Basic features with limited usage</p>
                <Badge variant="outline">Perfect for Students</Badge>
              </CardContent>
            </Card>
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm border-primary/50">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-foreground mb-2">Professional</h4>
                <p className="text-muted-foreground mb-4">Advanced features for working interpreters</p>
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </CardContent>
            </Card>
            <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <h4 className="text-xl font-bold text-foreground mb-2">Enterprise</h4>
                <p className="text-muted-foreground mb-4">Custom solutions for organizations</p>
                <Badge variant="outline">White Glove Support</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Integration Call to Action */}
        <div className="text-center mt-16 space-y-6 animate-slide-up">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Ready to Transform Your Interpretation Practice?
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Join thousands of interpreters who trust InterpreLab's AI-powered ecosystem for training, live assistance, and continuous improvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary border-0 text-white hover:opacity-90">
              <Link to="/interprecoach">
                <ArrowRight className="w-5 h-5 mr-2" />
                Join the waitlist
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/contact">Find out more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
