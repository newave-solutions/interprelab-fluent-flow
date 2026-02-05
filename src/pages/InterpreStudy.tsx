import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Mic, Layers, HelpCircle, Languages, Settings } from 'lucide-react';
import { PainPointBadge } from '@/components/PainPointBadge';
import { MissionCollaborationCTA } from '@/components/MissionCollaborationCTA';
import interprestudyBot from '@/assets/interprestudy-bot.png';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Suspense, lazy, useState } from 'react';
import { StudyDashboard } from '@/components/interprestudy/StudyDashboard';

// Lazy load components
const CoreDynamicsTraining = lazy(() => import('@/components/interprestudy/modules/CoreDynamicsTraining').then(m => ({ default: m.CoreDynamicsTraining })));
const VoiceSimulator = lazy(() => import('@/components/interprestudy/VoiceSimulator').then(m => ({ default: m.VoiceSimulator })));
const SmartFlashcards = lazy(() => import('@/components/interprestudy/modules/SmartFlashcards').then(m => ({ default: m.SmartFlashcards })));
const AiQuiz = lazy(() => import('@/components/interprestudy/modules/AiQuiz').then(m => ({ default: m.AiQuiz })));
const TerminologyLookup = lazy(() => import('@/components/interprestudy/TerminologyLookup').then(m => ({ default: m.TerminologyLookup })));
const BodyMapper = lazy(() => import('@/components/interprestudy/modules/BodyMapper').then(m => ({ default: m.BodyMapper })));
const StudySettings = lazy(() => import('@/components/interprestudy/StudySettings').then(m => ({ default: m.StudySettings })));

const TabLoading = () => (
  <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-card/50 border border-dashed border-border">
    <LoadingSpinner size="lg" text="Loading module..." />
  </div>
);

export default function InterpreStudy() {
  const [activeTab, setActiveTab] = useState('training');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div
          className="relative text-center mb-10 py-16 px-4 rounded-3xl bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('/interprestudy-hero.png')" }}
        >
          <div className="absolute inset-0 bg-black/70 rounded-3xl" />
          
          <img
            src={interprestudyBot}
            alt="InterpreStudy AI"
            className="absolute right-4 md:right-10 bottom-0 w-28 md:w-40 animate-float z-[5] drop-shadow-2xl hidden sm:block"
            style={{ filter: 'drop-shadow(0 10px 30px hsl(var(--nobel-gold) / 0.4))' }}
          />

          <div className="relative z-10 max-w-3xl mx-auto">
            <PainPointBadge painPoint="Accessible, Specialized Training" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              InterpreStudy
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered learning tailored to your specialty and skill level
            </p>
          </div>
        </div>

        {/* Main Layout: Dashboard + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Dashboard */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <StudyDashboard onContinueLearning={() => setActiveTab('training')} />
              
              {/* Settings Button */}
              <button
                onClick={() => setActiveTab('settings')}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors text-sm text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto mb-6 p-1">
                <TabsTrigger value="training" className="flex items-center gap-2 py-2.5">
                  <GraduationCap className="w-4 h-4" />
                  <span className="hidden sm:inline">Training</span>
                </TabsTrigger>
                <TabsTrigger value="voice-sim" className="flex items-center gap-2 py-2.5">
                  <Mic className="w-4 h-4" />
                  <span className="hidden sm:inline">Voice Sim</span>
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="flex items-center gap-2 py-2.5">
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">Flashcards</span>
                </TabsTrigger>
                <TabsTrigger value="quiz" className="flex items-center gap-2 py-2.5">
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Quiz</span>
                </TabsTrigger>
                <TabsTrigger value="terminology" className="flex items-center gap-2 py-2.5">
                  <Languages className="w-4 h-4" />
                  <span className="hidden sm:inline">Terminology</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="training" className="animate-fade-in">
                <Suspense fallback={<TabLoading />}>
                  <CoreDynamicsTraining />
                </Suspense>
              </TabsContent>

              <TabsContent value="voice-sim" className="animate-fade-in">
                <Suspense fallback={<TabLoading />}>
                  <VoiceSimulator />
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

              <TabsContent value="terminology" className="animate-fade-in">
                <Suspense fallback={<TabLoading />}>
                  <div className="space-y-6">
                    <TerminologyLookup />
                    <BodyMapper />
                  </div>
                </Suspense>
              </TabsContent>

              <TabsContent value="settings" className="animate-fade-in">
                <Suspense fallback={<TabLoading />}>
                  <StudySettings />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <MissionCollaborationCTA
            title="InterpreLab: Your Lifeline in the Field"
            description="We're interpreters who've experienced the frustration of inaccessible training. Our mission is to create solutions that actually help."
            secondaryButtonText="Join Our Community"
            footerText="Have connections to interpreter networks? Let's talk."
          />
        </div>
      </div>
    </Layout>
  );
}
