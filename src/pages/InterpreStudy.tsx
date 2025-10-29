import { useState } from "react";
import Navigation from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { BookOpen, Scale, Sparkles, Pill, Shield, Target, Crown, Users } from "lucide-react";

const InterpreStudy = () => {
  const [activeTab, setActiveTab] = useState("ethics");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      <main className="container mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white">
                <Crown className="w-3 h-3 mr-1" />
                Professional Training Platform
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              InterpreStudy Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Master ethics, expand your vocabulary, and practice real-world scenarios with AI-powered guidance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <Card className="p-6 border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <Shield className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Ethics Guidance</h3>
              <p className="text-sm text-muted-foreground">
                IMIA, CCHI, NBCMI, NCIHC standards
              </p>
            </Card>

            <Card className="p-6 border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Terminology Hub</h3>
              <p className="text-sm text-muted-foreground">
                Searchable glossary with AI translations
              </p>
            </Card>

            <Card className="p-6 border-2 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <Target className="w-10 h-10 mx-auto mb-3 text-secondary" />
              <h3 className="font-semibold mb-2">Personal Library</h3>
              <p className="text-sm text-muted-foreground">
                Build your custom glossary
              </p>
            </Card>

            <Card className="p-6 border-2 border-accent/30 bg-gradient-to-br from-card/80 to-accent/5 backdrop-blur-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <Sparkles className="w-10 h-10 mx-auto mb-3 text-accent" />
              <h3 className="font-semibold mb-2 flex items-center justify-center gap-1">
                AI Practice Mode
                <Crown className="w-4 h-4 text-yellow-500" />
              </h3>
              <p className="text-sm text-muted-foreground">
                AI scenarios with performance feedback
              </p>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 h-auto p-2 bg-card/80 border-2 border-primary/20">
              <TabsTrigger
                value="ethics"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Scale className="w-4 h-4 mr-2" />
                Ethics & Standards
              </TabsTrigger>
              <TabsTrigger
                value="terminology"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Terminology
              </TabsTrigger>
              <TabsTrigger
                value="medications"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Pill className="w-4 h-4 mr-2" />
                Rx Reference
              </TabsTrigger>
              <TabsTrigger
                value="practice"
                className="h-14 text-sm lg:text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Practice
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ethics" className="mt-0">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Code of Ethics & Standards Instructor</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive guidance on IMIA, NBCMI, NCIHC, CCHI, and CLAS standards. Get expert advice on ethics,
                      professional conduct, and take quizzes to test your understanding.
                    </p>
                    <Button className="bg-primary hover:bg-primary/90">
                      Launch Ethics Consultation
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="terminology" className="mt-0">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <div className="flex items-start gap-4">
                  <BookOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Terminology Consultation Hub</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Search medical terminology with AI-powered definitions, manage your personal glossary,
                      and view recently referenced terms from the community.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <Card className="p-4 text-center">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h4 className="font-semibold mb-1">Search Terms</h4>
                        <p className="text-xs text-muted-foreground">AI-powered medical dictionary</p>
                      </Card>
                      <Card className="p-4 text-center">
                        <Target className="h-8 w-8 mx-auto mb-2 text-secondary" />
                        <h4 className="font-semibold mb-1">My Glossary</h4>
                        <p className="text-xs text-muted-foreground">Personal term collection</p>
                      </Card>
                      <Card className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
                        <h4 className="font-semibold mb-1">Community</h4>
                        <p className="text-xs text-muted-foreground">Trending medical terms</p>
                      </Card>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="medications" className="mt-0">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <div className="flex items-start gap-4">
                  <Pill className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prescription Reference Guide</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive medication database with pronunciations, generic/brand names,
                      and common dosages for medical interpreters.
                    </p>
                    <Button className="bg-primary hover:bg-primary/90">
                      Access Medication Database
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="practice" className="mt-0">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <div className="flex items-start gap-4">
                  <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI-Powered Voice Practice</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Practice with realistic AI-generated scenarios featuring provider and patient voices.
                      Get comprehensive performance feedback based on professional interpreting standards.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">Practice Scenarios</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Medical Consultations</li>
                          <li>• Emergency Room</li>
                          <li>• Mental Health Sessions</li>
                          <li>• Informed Consent</li>
                        </ul>
                      </Card>
                      <Card className="p-4">
                        <h4 className="font-semibold mb-2">AI Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Real-time transcription</li>
                          <li>• Performance analysis</li>
                          <li>• Coaching recommendations</li>
                          <li>• Multiple languages</li>
                        </ul>
                      </Card>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-4">
                      <Crown className="w-4 h-4 mr-2" />
                      Start Premium Practice
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-primary/30">
            <h2 className="text-2xl font-bold mb-4">Ready to Advance Your Interpreting Skills?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of professional interpreters who use InterpreStudy to stay current with
              ethics standards, expand their medical vocabulary, and practice with AI-powered scenarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline">
                View Pricing Plans
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InterpreStudy;
