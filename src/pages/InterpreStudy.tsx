import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, MessageSquare, Layers, Settings, Brain, Languages, Accessibility, GraduationCap, HelpCircle, PlayCircle } from 'lucide-react';
import { PainPointBadge } from '@/components/PainPointBadge';
import { MissionCollaborationCTA } from '@/components/MissionCollaborationCTA';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { lazy, Suspense } from 'react';

// Lazy load components
const InteractiveModulePlayer = lazy(() => import('@/components/interprestudy/modules/InteractiveModulePlayer').then(m => ({ default: m.InteractiveModulePlayer })));
const CoreDynamicsTraining = lazy(() => import('@/components/interprestudy/modules/CoreDynamicsTraining').then(m => ({ default: m.CoreDynamicsTraining })));
const ConversationMode = lazy(() => import('@/components/interprestudy/modules/ConversationMode').then(m => ({ default: m.ConversationMode })));
const SmartFlashcards = lazy(() => import('@/components/interprestudy/modules/SmartFlashcards').then(m => ({ default: m.SmartFlashcards })));
const AiQuiz = lazy(() => import('@/components/interprestudy/modules/AiQuiz').then(m => ({ default: m.AiQuiz })));
const BodyMapper = lazy(() => import('@/components/interprestudy/modules/BodyMapper').then(m => ({ default: m.BodyMapper })));
const ScenarioGenerator = lazy(() => import('@/components/interprestudy/modules/ScenarioGenerator').then(m => ({ default: m.ScenarioGenerator })));
const TerminologyLookup = lazy(() => import('@/components/interprestudy/TerminologyLookup'));
const InteractiveChat = lazy(() => import('@/components/interprestudy/InteractiveChat').then(m => ({ default: m.InteractiveChat })));
const StudySettings = lazy(() => import('@/components/interprestudy/StudySettings').then(m => ({ default: m.StudySettings })));

export default function InterpreStudy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div
          className="relative text-center mb-16 animate-fade-in py-20 px-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/studying-learning.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/70 rounded-3xl" />
          <div className="relative z-10">
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
            <TabsTrigger value="modules" aria-label="Modules" className="flex items-center gap-2 py-2">
              <PlayCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Modules</span>
            </TabsTrigger>
            <TabsTrigger value="training" aria-label="Training" className="flex items-center gap-2 py-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden lg:inline">Training</span>
            </TabsTrigger>
            <TabsTrigger value="chat" aria-label="Simulation" className="flex items-center gap-2 py-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden lg:inline">Sim</span>
            </TabsTrigger>
            <TabsTrigger value="flashcards" aria-label="Flashcards" className="flex items-center gap-2 py-2">
              <Layers className="w-4 h-4" />
              <span className="hidden lg:inline">Cards</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" aria-label="Quiz" className="flex items-center gap-2 py-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden lg:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="body" aria-label="Body Mapper" className="flex items-center gap-2 py-2">
              <Accessibility className="w-4 h-4" />
              <span className="hidden lg:inline">Body</span>
            </TabsTrigger>
            <TabsTrigger value="scenarios" aria-label="Scripts" className="flex items-center gap-2 py-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden lg:inline">Scripts</span>
            </TabsTrigger>
            <TabsTrigger value="terminology" aria-label="Terminology" className="flex items-center gap-2 py-2">
              <Languages className="w-4 h-4" />
              <span className="hidden lg:inline">Terms</span>
            </TabsTrigger>
            <TabsTrigger value="interactive_chat" aria-label="AI Chat" className="flex items-center gap-2 py-2">
               <MessageSquare className="w-4 h-4" />
               <span className="hidden lg:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="settings" aria-label="Settings" className="flex items-center gap-2 py-2">
              <Settings className="w-4 h-4" />
              <span className="hidden lg:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <Suspense fallback={<div className="flex justify-center p-10"><LoadingSpinner size="lg" /></div>}>
            <TabsContent value="modules" className="animate-fade-in">
              <InteractiveModulePlayer />
            </TabsContent>

            <TabsContent value="training" className="animate-fade-in">
              <CoreDynamicsTraining />
            </TabsContent>

            <TabsContent value="chat" className="animate-fade-in">
              <ConversationMode />
            </TabsContent>

            <TabsContent value="flashcards" className="animate-fade-in">
              <SmartFlashcards />
            </TabsContent>

            <TabsContent value="quiz" className="animate-fade-in">
              <AiQuiz />
            </TabsContent>

            <TabsContent value="body" className="animate-fade-in">
              <BodyMapper />
            </TabsContent>

            <TabsContent value="scenarios" className="animate-fade-in">
              <ScenarioGenerator />
            </TabsContent>

            <TabsContent value="terminology" className="animate-fade-in">
              <TerminologyLookup />
            </TabsContent>

            <TabsContent value="interactive_chat" className="animate-fade-in">
              <InteractiveChat />
            </TabsContent>

            <TabsContent value="settings" className="animate-fade-in">
              <StudySettings />
            </TabsContent>
          </Suspense>
        </Tabs>

        {/* Quick Actions - Only show if not on Training tab ideally, but keeping for footer access */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
