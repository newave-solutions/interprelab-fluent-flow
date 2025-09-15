import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Chrome, 
  Mic, 
  Brain, 
  Languages, 
  Shield, 
  Zap, 
  MonitorSpeaker,
  Stethoscope,
  Scale,
  ArrowRight,
  Sparkles
} from "lucide-react";
import extensionPreview from "@/assets/extension-preview.jpg";
import techBackground from "@/assets/tech-background.jpg";

export const ProductShowcase = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={techBackground} 
          alt="Advanced AI technology background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="secondary" className="glass mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Two Revolutionary Products
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Complete Interpretation
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Ecosystem
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From browser-based real-time assistance to comprehensive platform solutions
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* InterpreCoach - Browser Extension */}
          <Card className="glass hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Chrome className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">InterpreCoach</CardTitle>
                  <CardDescription>Browser Extension</CardDescription>
                </div>
              </div>
              
              <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
                <img 
                  src={extensionPreview} 
                  alt="InterpreCoach browser extension interface with real-time interpretation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                
                {/* Floating UI Elements Overlay */}
                <div className="absolute top-4 left-4 bg-success/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-success-foreground">
                  🟢 Live Translation
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-primary-foreground">
                  AI Analysis
                </div>
                <div className="absolute bottom-4 left-4 bg-secondary/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-secondary-foreground">
                  Multi-Context
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              <p className="text-muted-foreground">
                Revolutionary browser extension that provides real-time interpretation assistance directly in your workflow. 
                Semi-transparent, resizable context windows display live translations, AI analysis, and cultural insights.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-success" />
                  <span>Live Audio Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" />
                  <span>Real-time Translation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-secondary" />
                  <span>AI Context Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <MonitorSpeaker className="w-4 h-4 text-warning" />
                  <span>Multi-Window Display</span>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  Medical
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  Legal
                </Badge>
              </div>

              <Button variant="premium" className="w-full group">
                Install Extension
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* InterpreLab Platform */}
          <Card className="glass hover-lift group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">InterpreLab Platform</CardTitle>
                  <CardDescription>Enterprise Solution</CardDescription>
                </div>
              </div>

              {/* Architecture Visualization */}
              <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/10 rounded-lg p-6 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-glow opacity-20" />
                
                {/* Mermaid-inspired Architecture Display */}
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center items-center gap-4">
                      <div className="bg-success/20 border border-success/30 rounded-lg p-3 text-xs font-medium">
                        🌐 Frontend
                      </div>
                      <div className="text-success">→</div>
                      <div className="bg-primary/20 border border-primary/30 rounded-lg p-3 text-xs font-medium">
                        🔐 Auth
                      </div>
                    </div>
                    
                    <div className="flex justify-center items-center gap-2">
                      <div className="text-primary">↓</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-warning/20 border border-warning/30 rounded-lg p-2">
                        📡 Secure Ingestion
                      </div>
                      <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-2">
                        ⚡ Real-time Delivery
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              <p className="text-muted-foreground">
                Comprehensive enterprise platform providing secure, scalable interpretation services. 
                Complete backend infrastructure with advanced AI processing and human oversight.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Cloud Infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-secondary" />
                  <span>Multi-Agent AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <MonitorSpeaker className="w-4 h-4 text-warning" />
                  <span>WebSocket Streaming</span>
                </div>
              </div>

              {/* Compliance */}
              <div className="flex gap-2">
                <Badge variant="outline" className="text-success border-success/30">
                  HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="text-primary border-primary/30">
                  SOC 2 Type II
                </Badge>
              </div>

              <Button variant="hero" className="w-full group">
                Request Demo
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integration CTA */}
        <div className="text-center mt-16 animate-slide-up">
          <p className="text-lg text-muted-foreground mb-6">
            Seamless integration into existing healthcare and legal workflows
          </p>
          <Button variant="glass" size="lg">
            Explore Integration Options
          </Button>
        </div>
      </div>
    </section>
  );
};