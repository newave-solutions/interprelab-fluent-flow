import { Layout } from "@/components/Layout";
import SignDetection from "@/components/interpresigns/SignDetection";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Hand, Award, TrendingUp } from "lucide-react";
import { BenefitBadge } from "@/components/BenefitBadge";
import { getGestureHint, isMotionGesture } from "@/components/interpresigns/motion-gestures";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent } from "@/components/ui/card";

// Extended to include all 26 letters including motion-based gestures J, X, Z
const signsToPractice = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

// Local storage key for progress
const PROGRESS_KEY = 'interpresigns_progress';

interface ASLProgress {
  [letter: string]: {
    attempts: number;
    successCount: number;
    lastPracticed: string;
  };
}

const ASLTeacher = () => {
  const [currentTargetSign, setCurrentTargetSign] = useState('A');
  const [isCorrect, setIsCorrect] = useState(false);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [progress, setProgress] = useState<ASLProgress>({});
  const [totalMastered, setTotalMastered] = useState(0);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as ASLProgress;
        setProgress(parsed);
        // Count mastered signs (3+ successful attempts)
        const mastered = Object.values(parsed).filter(p => p.successCount >= 3).length;
        setTotalMastered(mastered);
      } catch (e) {
        console.error('Failed to parse saved progress:', e);
      }
    }
  }, []);

  const saveProgress = useCallback((sign: string) => {
    setProgress(prev => {
      const existing = prev[sign] || { attempts: 0, successCount: 0, lastPracticed: '' };
      const updated = {
        ...prev,
        [sign]: {
          attempts: existing.attempts + 1,
          successCount: existing.successCount + 1,
          lastPracticed: new Date().toISOString(),
        }
      };
      
      // Save to localStorage
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
      
      // Update mastered count
      const mastered = Object.values(updated).filter(p => p.successCount >= 3).length;
      setTotalMastered(mastered);
      
      return updated;
    });
    
    toast.success(`Progress saved for sign ${sign}!`);
  }, []);

  const handleSuccessfulSign = useCallback((sign: string) => {
    saveProgress(sign);
  }, [saveProgress]);

  useEffect(() => {
    if (detectedSign && detectedSign === currentTargetSign) {
      setIsCorrect(true);
      handleSuccessfulSign(currentTargetSign);
      setTimeout(() => {
        const nextSignIndex = (signsToPractice.indexOf(currentTargetSign) + 1) % signsToPractice.length;
        setCurrentTargetSign(signsToPractice[nextSignIndex]);
        setIsCorrect(false);
        setDetectedSign(null);
      }, 2000);
    }
  }, [detectedSign, currentTargetSign, handleSuccessfulSign]);

  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <div className="container mx-auto px-4 py-12">
        <div
          className="relative text-center mb-16 animate-fade-in py-20 px-6 rounded-3xl bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: "url('/interpresigns-hero.png')" }}
        >
          <div className="absolute inset-0 bg-black/70 rounded-3xl" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <BenefitBadge benefit="Master ASL with Real-Time AI Feedback" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Hand className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                InterpreSigns
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Accelerate your ASL learning with AI-powered hand detection. Get instant feedback on your signs and track your progress as you master the complete alphabet.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <section className="container mx-auto px-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalMastered}</p>
              <p className="text-sm text-muted-foreground">Signs Mastered</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{Object.values(progress).reduce((sum, p) => sum + p.successCount, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Correct</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{signsToPractice.indexOf(currentTargetSign) + 1}</p>
              <p className="text-sm text-muted-foreground">Current Position</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{Math.round((totalMastered / 26) * 100)}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ASL Practice Section with Particles */}
      <section className="relative py-16 overflow-hidden">
        <ParticlesBackground particleCount={80} variant="mixed" />
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Practice Session</h2>
            <p className="text-muted-foreground mb-4">
              Try to make the sign for the letter shown below.
            </p>
            <div className="text-6xl font-bold mb-4 text-primary">{currentTargetSign}</div>

            {/* Motion gesture hint */}
            {isMotionGesture(currentTargetSign) && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <p className="text-amber-600 dark:text-amber-400 font-medium">
                  ⚡ Motion Required: {getGestureHint(currentTargetSign)}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <div className="w-full max-w-2xl border border-border rounded-lg p-4 relative bg-card">
                <SignDetection onSignDetected={setDetectedSign} />
                {isCorrect && (
                  <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center rounded-lg backdrop-blur-sm">
                    <p className="text-white text-4xl font-bold animate-bounce">Correct!</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
              Current Detection: {detectedSign || "None"}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ASLTeacher;
