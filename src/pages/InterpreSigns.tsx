import { Layout } from "@/components/Layout";
import SignDetection from "@/components/interpresigns/SignDetection";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Hand } from "lucide-react";
import { PainPointBadge } from "@/components/PainPointBadge";
import { getGestureHint, isMotionGesture } from "@/components/interpresigns/motion-gestures";

// Extended to include all 26 letters including motion-based gestures J, X, Z
const signsToPractice = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const ASLTeacher = () => {
  const [currentTargetSign, setCurrentTargetSign] = useState('A');
  const [isCorrect, setIsCorrect] = useState(false);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);

  const handleSuccessfulSign = (sign: string) => {
    toast.success(`Great job! You signed ${sign} correctly!`);
  };

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
  }, [detectedSign, currentTargetSign]);

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
            <PainPointBadge painPoint="Addressing Pain Point #4: Accessible ASL Training" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Hand className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                InterpreSigns
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              AI-powered ASL learning with real-time hand detection. Practice American Sign Language with instant feedback and progress tracking.
            </p>
          </div>
        </div>
      </div>

      {/* ASL Practice Section */}
      <div className="container mx-auto px-6 py-12">
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
    </Layout>
  );
};

export default ASLTeacher;
