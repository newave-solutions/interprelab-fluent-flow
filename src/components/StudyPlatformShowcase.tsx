import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  BookOpen,
  Scale,
  Sparkles,
  Pill,
  Shield,
  Target,
  Crown,
  Users,
  MessageSquare,
  Mic,
  Brain,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

export const StudyPlatformShowcase = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <Crown className="w-4 h-4 mr-2" />
            Professional Training Platform
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InterpreStudy Platform
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive training ecosystem for medical interpreters with AI-powered guidance,
            ethics consultation, and real-world practice scenarios.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Ethics & Standards */}
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Scale className="h-8 w-8 text-blue-600" />
                <CardTitle className="text-2xl">Ethics & Standards Consultation</CardTitle>
              </div>
              <p className="text-muted-foreground">
                AI-powered guidance on IMIA, NBCMI, NCIHC, CCHI, and CLAS standards
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Interactive ethics consultation chat</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Quiz mode for knowledge testing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Professional conduct scenarios</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terminology Hub */}
          <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl">Terminology Hub</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Searchable medical glossary with AI translations and personal collections
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Personal glossary management</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Community term sharing</span>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span className="text-sm">AI-powered definitions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medication Reference */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Pill className="h-8 w-8 text-purple-600" />
                <CardTitle className="text-2xl">Prescription Reference</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Comprehensive medication database with pronunciations and dosages
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Generic and brand name database</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Pronunciation guides</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Common dosage information</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Practice Mode */}
          <Card className="p-8 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-8 w-8 text-orange-600" />
                <CardTitle className="text-2xl">AI Voice Practice</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Real-time practice with AI-generated scenarios and performance feedback
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Live voice interpretation practice</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Performance analysis & coaching</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Multiple scenario types</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Practice Scenarios */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Available Practice Scenarios</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Medical Consultation", icon: "🏥" },
              { name: "Emergency Room", icon: "🚨" },
              { name: "Pharmacy Visit", icon: "💊" },
              { name: "Mental Health", icon: "🧠" },
              { name: "Hospital Discharge", icon: "🏠" },
              { name: "Informed Consent", icon: "📋" }
            ].map((scenario, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="text-2xl mb-2">{scenario.icon}</div>
                <h4 className="font-semibold text-sm">{scenario.name}</h4>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-primary/30">
            <h3 className="text-2xl font-bold mb-4">Ready to Master Medical Interpretation?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of professional interpreters advancing their skills with our comprehensive
              AI-powered training platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/interprestudy">
                  <Crown className="w-4 h-4 mr-2" />
                  Launch InterpreStudy
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
