import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare, Layers, Settings, Brain, Languages, Accessibility, GraduationCap, HelpCircle, PlayCircle } from 'lucide-react';
import { PainPointBadge } from '@/components/PainPointBadge';
import { MissionCollaborationCTA } from '@/components/MissionCollaborationCTA';
import { ParticlesBackground } from '@/components/ParticlesBackground';
import interprestudyBot from '@/assets/interprestudy-bot.png';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense, lazy } from 'react';

// Lazy load components for performance
const InteractiveChat = lazy(() => import('@/components/interprestudy/InteractiveChat').then(module => ({ default: module.InteractiveChat })));
const TerminologyLookup = lazy(() => import('@/components/interprestudy/TerminologyLookup').then(module => ({ default: module.TerminologyLookup })));
const StudySettings = lazy(() => import('@/components/interprestudy/StudySettings').then(module => ({ default: module.StudySettings })));
const SmartFlashcards = lazy(() => import('@/components/interprestudy/modules/SmartFlashcards').then(module => ({ default: module.SmartFlashcards })));
const ConversationMode = lazy(() => import('@/components/interprestudy/modules/ConversationMode').then(module => ({ default: module.ConversationMode })));
const BodyMapper = lazy(() => import('@/components/interprestudy/modules/BodyMapper').then(module => ({ default: module.BodyMapper })));
const ScenarioGenerator = lazy(() => import('@/components/interprestudy/modules/ScenarioGenerator').then(module => ({ default: module.ScenarioGenerator })));
const AiQuiz = lazy(() => import('@/components/interprestudy/modules/AiQuiz').then(module => ({ default: module.AiQuiz })));
const CoreDynamicsTraining = lazy(() => import('@/components/interprestudy/modules/CoreDynamicsTraining').then(module => ({ default: module.CoreDynamicsTraining })));
const InteractiveModulePlayer = lazy(() => import('@/components/interprestudy/modules/InteractiveModulePlayer').then(module => ({ default: module.InteractiveModulePlayer })));

// Loading fallback component
const TabLoading = () => (
  <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-card/50 border border-dashed border-border">
    <LoadingSpinner size="lg" text="Loading module..." />
  </div>
);

export default function InterpreStudy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section with Background Image and Bot */}
        <div
          className="relative text-center mb-16 animate-fade-in py-20 px-4 rounded-3xl bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('/interprestudy-hero.png')" }}
        >
          <div className="absolute inset-0 bg-black/70 rounded-3xl" />

          {/* Scholar Bot - Positioned on the right */}
          <img
            src={interprestudyBot}
            alt="InterpreStudy AI Scholar"
            className="absolute right-4 md:right-10 bottom-0 w-32 md:w-48 lg:w-56 animate-float z-[5] drop-shadow-2xl hidden sm:block"
            style={{
              filter: 'drop-shadow(0 10px 30px hsl(var(--nobel-gold) / 0.4))',
              animationDelay: '0.5s',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <PainPointBadge painPoint="Addressing Pain Point #4: Accessible, Specialized Training" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                InterpreStudy
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Specialized training shouldn't be a luxury. Access AI-powered learning, ethics training, and interactive scenarios tailored to your specialty.
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 h-auto mb-8 p-1">
            <TabsTrigger value="modules" className="flex items-center gap-2 py-2">
              <PlayCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Modules</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2 py-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden lg:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 py-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden lg:inline">Sim</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex items-center gap-2 py-2">
              <Layers className="w-4 h-4" />
              <span className="hidden lg:inline">Cards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2 py-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="body" className="flex items-center gap-2 py-2">
              <Accessibility className="w-4 h-4" />
              <span className="hidden lg:inline">Body</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2 py-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Scripts</span>
            </TabsTrigger>
            <TabsTrigger value="terminology" className="flex items-center gap-2 py-2">
              <Languages className="w-4 h-4" />
              <span className="hidden lg:inline">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="interactive_chat" className="flex items-center gap-2 py-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden lg:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-2">
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <InteractiveModulePlayer />
            </Suspense>
          </TabsContent>

          <TabsContent value="training" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <CoreDynamicsTraining />
            </Suspense>
          </TabsContent>

          <TabsContent value="chat" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <ConversationMode />
            </Suspense>
          </TabsContent>

          <TabsContent value="flashcards" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <SmartFlashcards />
            </Suspense>
          </TabsContent>

          <TabsContent value="quiz" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <AiQuiz />
            </Suspense>
          </TabsContent>

          <TabsContent value="body" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <BodyMapper />
            </Suspense>
          </TabsContent>

          <TabsContent value="scenarios" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <ScenarioGenerator />
            </Suspense>
          </TabsContent>

          <TabsContent value="terminology" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <TerminologyLookup />
            </Suspense>
          </TabsContent>

          <TabsContent value="interactive_chat" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <InteractiveChat />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <Suspense fallback={<TabLoading />}>
              <StudySettings />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Quick Actions with Particles Background */}
        <section className="relative py-12 overflow-hidden">
          <ParticlesBackground particleCount={100} variant="mixed" />
          <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Code of Ethics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Query and quiz yourself on professional standards and ethical guidelines
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Live Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Real-time conversation with AI in 8-second response windows
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-border/50 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-primary" />
                  Custom Glossary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Build your personal terminology library with translations and images
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission & Collaboration CTA */}
        <MissionCollaborationCTA
          title="InterpreLab: Your Lifeline in the Field"
          description="We're not building tools from an ivory tower. We're interpreters who've experienced the frustration of inaccessible training, the anxiety of specialized terminology, and the weight of serving vulnerable patients. Our mission is to use our skills to create solutions that actually help—but we need your partnership to reach every interpreter who needs these resources."
          secondaryButtonText="Join Our Community"
          footerText="Have connections to interpreter networks? Want to discuss bulk training programs? Let's talk—together we can make professional development accessible to all."
        />
      </div>
    </Layout>
  );
}
