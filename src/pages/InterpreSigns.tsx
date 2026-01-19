import { Layout } from "@/components/Layout";
import SignDetection from "@/components/interpresigns/SignDetection";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Hand, Brain, TrendingUp, Target, Zap, BookOpen } from "lucide-react";
import { PainPointBadge } from "@/components/PainPointBadge";
import { getGestureHint, isMotionGesture } from "@/components/interpresigns/motion-gestures";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Type definition for ASL progress data
interface ASLProgress {
  id: string;
  user_id: string;
  sign_letter: string;
  attempts: number;
  success_count: number;
  last_practiced?: string;
  created_at?: string;
}

// Extended to include all 26 letters including motion-based gestures J, X, Z
const signsToPractice = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const ASLTeacher = () => {
  const { user } = useAuth();
  const [currentTargetSign, setCurrentTargetSign] = useState('A');
  const [isCorrect, setIsCorrect] = useState(false);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);

  // Memoized function to save ASL practice progress to Supabase
  const saveProgress = useCallback(async (sign: string) => {
    if (!user) return;

    try {
      const { data: existingData, error } = await supabase
        .from('asl_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('sign_letter', sign)
        .maybeSingle<ASLProgress>();

      if (error) {
        console.error('Error fetching ASL progress:', error);
        toast.error("Failed to fetch progress.");
        return;
      }

      if (existingData) {
        // Update existing progress record
        const { error: updateError } = await supabase
          .from('asl_progress')
          .update({
            attempts: (existingData.attempts || 0) + 1,
            success_count: (existingData.success_count || 0) + 1,
            last_practiced: new Date().toISOString(),
          })
          .eq('id', existingData.id);

        if (updateError) {
          console.error('Error updating ASL progress:', updateError);
          toast.error("Failed to update progress.");
          return;
        }
      } else {
        // Create new progress record
        const { error: insertError } = await supabase
          .from('asl_progress')
          .insert({
            user_id: user.id,
            sign_letter: sign,
            attempts: 1,
            success_count: 1,
          });

        if (insertError) {
          console.error('Error inserting ASL progress:', insertError);
          toast.error("Failed to save progress.");
          return;
        }
      }
      toast.success(`Progress saved for sign ${sign}!`);
    } catch (error) {
      console.error('Error saving ASL progress:', error);
      toast.error("Failed to save progress.");
    }
  }, [user]);

  // Effect to handle successful sign detection
  useEffect(() => {
    if (detectedSign && detectedSign === currentTargetSign) {
      setIsCorrect(true);
      saveProgress(currentTargetSign);

      // Advance to next sign after 2 seconds
      const timeoutId = setTimeout(() => {
        const nextSignIndex = (signsToPractice.indexOf(currentTargetSign) + 1) % signsToPractice.length;
        setCurrentTargetSign(signsToPractice[nextSignIndex]);
        setIsCorrect(false);
        setDetectedSign(null);
      }, 2000);

      // Cleanup timeout on unmount or dependency change
      return () => clearTimeout(timeoutId);
    }
  }, [detectedSign, currentTargetSign, saveProgress]);

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

        {/* What is InterpreSigns? - Service Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-center">What is InterpreSigns?</h2>
              <div className="space-y-6 text-lg">
                <p className="text-stone-700 dark:text-muted-foreground leading-relaxed">
                  <strong className="text-stone-900 dark:text-foreground">InterpreSigns is your AI-powered companion for mastering the ASL alphabet</strong>—the essential building block for every aspiring American Sign Language interpreter. Just as spoken language interpreters must master pronunciation and phonetics, ASL interpreters must perfect fingerspelling to communicate effectively in professional settings.
                </p>
                <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                  <p className="text-stone-700 dark:text-muted-foreground leading-relaxed">
                    <strong className="text-stone-900 dark:text-foreground">In healthcare settings, 60-70% of medical terminology requires fingerspelling.</strong> Medication names like "I-B-U-P-R-O-F-E-N," patient identifiers, and specialized vocabulary that don't have dedicated signs all depend on your fingerspelling accuracy and speed.
                  </p>
                </div>
                <p className="text-stone-700 dark:text-muted-foreground leading-relaxed">
                  Powered by <strong className="text-stone-900 dark:text-foreground">TensorFlow.js and advanced computer vision</strong>, InterpreSigns provides instant, accurate feedback on your hand positions—like having a personal ASL tutor available 24/7, wherever you are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How InterpreSigns Helps Aspiring Interpreters */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">How InterpreSigns Helps Aspiring Interpreters</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <Hand className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Master All 26 Letters</h3>
                    <p className="text-stone-700 dark:text-muted-foreground">
                      Practice static signs (A, B, C, etc.) and motion-based gestures (J, X, Z) with separate guidance for each type. Our AI recognizes all variations.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <Zap className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Build Professional Speed</h3>
                    <p className="text-stone-700 dark:text-muted-foreground">
                      Medical interpreters need to fingerspell at <strong className="text-stone-900 dark:text-foreground">60+ letters per minute</strong>. Track your recognition time and accuracy to reach professional standards.
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <Brain className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Develop Muscle Memory</h3>
                    <p className="text-stone-700 dark:text-muted-foreground">
                      Repetitive practice with instant AI feedback reinforces correct hand shapes, essential for certification exams (NBCMI, CCHI).
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <TrendingUp className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-xl font-semibold mb-2">Track Your Journey</h3>
                    <p className="text-stone-700 dark:text-muted-foreground">
                      Visual progress dashboards show mastery levels for each letter, practice streaks, and improvement trends over time.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Current Capabilities */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">Current Capabilities - What You Can Do Today</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Complete ASL Alphabet Recognition</h3>
                    <p className="text-sm text-stone-700 dark:text-muted-foreground">All 26 letters including motion gestures (J, X, Z)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Real-Time Hand Tracking</h3>
                    <p className="text-sm text-stone-700 dark:text-muted-foreground">Advanced pose estimation detects 21 hand landmarks per frame</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Instant Accuracy Feedback</h3>
                    <p className="text-sm text-stone-700 dark:text-muted-foreground">Know immediately if your hand shape matches the target sign</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Motion Detection</h3>
                    <p className="text-sm text-stone-700 dark:text-muted-foreground">Specialized algorithms recognize movement-based letters like J and Z</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Progress Persistence</h3>
                    <p className="text-sm text-stone-700 dark:text-muted-foreground">Your practice history syncs across devices via cloud storage</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold mb-1">Works Anywhere</h3>
                    <p className="text-sm text-stone-700 dark:text-muted-foreground">Browser-based platform—no downloads, just a webcam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Limitations - Transparency Matters */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 text-center">Current Limitations - Transparency Matters</h2>
              <p className="text-center text-stone-700 dark:text-muted-foreground mb-8 text-lg">
                We believe in complete transparency about what InterpreSigns can and cannot do today.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <strong className="text-stone-900 dark:text-foreground">Alphabet Focus:</strong>
                    <span className="text-stone-700 dark:text-muted-foreground"> Currently supports fingerspelling only (full ASL vocabulary coming in 2026)</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <strong className="text-stone-900 dark:text-foreground">Lighting Dependency:</strong>
                    <span className="text-stone-700 dark:text-muted-foreground"> Requires good lighting conditions for optimal hand detection</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <strong className="text-stone-900 dark:text-foreground">Camera Quality:</strong>
                    <span className="text-stone-700 dark:text-muted-foreground"> Works best with 720p+ webcams; lower resolutions may affect accuracy</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <strong className="text-stone-900 dark:text-foreground">Browser Compatibility:</strong>
                    <span className="text-stone-700 dark:text-muted-foreground"> Optimized for Chrome, Firefox, and Edge; Safari support in progress</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
                  <div className="text-xl">⚠️</div>
                  <div>
                    <strong className="text-stone-900 dark:text-foreground">Single-Hand Detection:</strong>
                    <span className="text-stone-700 dark:text-muted-foreground"> Tracks dominant hand only; two-handed signs not yet supported</span>
                  </div>
                </div>

                <div className="mt-6 p-6 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                  <p className="text-stone-700 dark:text-muted-foreground flex items-start gap-2">
                    <span className="text-2xl">💡</span>
                    <span><strong className="text-stone-900 dark:text-foreground">Our Commitment:</strong> We're actively addressing these limitations. See our exciting roadmap below!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Future of ASL Technology - What's Coming */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-muted/30 to-primary/10">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">The Future of ASL Technology</h2>
                <p className="text-xl text-stone-700 dark:text-muted-foreground">
                  Here's what we're building—an exciting roadmap to revolutionize ASL learning
                </p>
              </div>

              <div className="space-y-8">
                {/* Phase 1 */}
                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-primary text-white">Phase 1 - Q1 2026</Badge>
                      <h3 className="text-2xl font-bold">Enhanced Fingerspelling</h3>
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Speed drills for timed practice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Word and phrase recognition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Common medical term dictionaries</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Phase 2 */}
                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-blue-500 text-white">Phase 2 - Q2-Q3 2026</Badge>
                      <h3 className="text-2xl font-bold">Core ASL Vocabulary</h3>
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">500+ medical ASL signs (pain, medication, symptoms, body parts)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Two-handed sign detection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Facial expression recognition (critical for ASL grammar)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Phase 3 */}
                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-purple-500 text-white">Phase 3 - Q4 2026</Badge>
                      <h3 className="text-2xl font-bold">Conversational ASL</h3>
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Full sentence recognition and grammar feedback</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Real-time conversation simulation with AI</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Role-play scenarios (patient intake, diagnosis, informed consent)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Phase 4 */}
                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-green-500 text-white">Phase 4 - 2027</Badge>
                      <h3 className="text-2xl font-bold">Immersive VR/AR Learning</h3>
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Virtual hospital environments for practice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Holographic ASL tutors and 3D hand modeling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Haptic feedback gloves for tactile learning</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Phase 5 */}
                <Card className="shadow-card-light hover:shadow-card-hover-light dark:shadow-lg dark:hover:shadow-xl transition-shadow duration-300 border-l-4 border-l-orange-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-orange-500 text-white">Phase 5 - 2027+</Badge>
                      <h3 className="text-2xl font-bold">Professional Integration</h3>
                    </div>
                    <ul className="space-y-2 ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Live telehealth interpretation assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Real-time ASL-to-text transcription</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Integration with EHR systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">▸</span>
                        <span className="text-stone-700 dark:text-muted-foreground">Cultural competency modules and Deaf community insights</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Vision Statement */}
              <div className="mt-12 text-center p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                <p className="text-xl text-stone-700 dark:text-muted-foreground leading-relaxed">
                  <strong className="text-stone-900 dark:text-foreground text-2xl">Our Vision:</strong><br />
                  We're building toward a future where every medical interpreter has access to cutting-edge AI tools that bridge communication gaps and improve patient outcomes for Deaf and Hard-of-Hearing communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to Begin? */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold mb-8 text-center">Ready to Begin? Here's What You Need</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-card-light dark:shadow-lg">
                  <CardContent className="pt-6">
                    <Target className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">System Requirements</h3>
                    <ul className="text-sm text-stone-700 dark:text-muted-foreground space-y-1">
                      <li>• Modern browser (Chrome/Firefox/Edge)</li>
                      <li>• Webcam (720p+ recommended)</li>
                      <li>• Stable internet connection</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-card-light dark:shadow-lg">
                  <CardContent className="pt-6">
                    <Zap className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Optimal Setup</h3>
                    <ul className="text-sm text-stone-700 dark:text-muted-foreground space-y-1">
                      <li>• Good lighting (face a window)</li>
                      <li>• Clear background</li>
                      <li>• Sit 2-3 feet from camera</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-card-light dark:shadow-lg">
                  <CardContent className="pt-6">
                    <BookOpen className="w-10 h-10 text-primary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
                    <ul className="text-sm text-stone-700 dark:text-muted-foreground space-y-1">
                      <li>• Practice 10-15 minutes daily</li>
                      <li>• Focus on quality over speed</li>
                      <li>• Use motion hints for J/X/Z</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
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
      </div>
    </Layout>
  );
};

export default ASLTeacher;
