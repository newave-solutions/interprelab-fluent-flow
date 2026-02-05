import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Mic, MicOff, Play, Volume2, Loader2, ThumbsUp, ThumbsDown,
  User, Stethoscope, Clock, FileText, Sparkles, BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Role = 'Doctor' | 'Patient' | 'Interpreter';

interface ConversationMessage {
  role: Role;
  text: string;
  feedback?: { score: number; feedback: string; strong_point: string; weak_point: string };
}

interface Metrics {
  score: number;
  turns: number;
  strongAreas: string[];
  weakAreas: string[];
}

const SETTINGS = [
  { value: 'emergency-room', label: 'Emergency Room' },
  { value: 'primary-care', label: 'Primary Care' },
  { value: 'prenatal', label: 'Prenatal' },
  { value: 'mental-health', label: 'Mental Health' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'oncology', label: 'Oncology' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

// ElevenLabs TTS with fallback to browser TTS
const speakWithElevenLabs = async (text: string, role: string, lang: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ text, role, language: lang }),
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      if (data.fallback) return false;
      throw new Error('TTS failed');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    await audio.play();
    return true;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return false;
  }
};

const speakText = async (text: string, role: Role, lang = 'en-US') => {
  const elevenLabsRole = role === 'Doctor' ? 'doctor' : role === 'Patient' ? 'patient' : 'narrator';
  const elevenLabsLang = lang.startsWith('es') ? 'es' : 'en';
  
  const success = await speakWithElevenLabs(text, elevenLabsRole, elevenLabsLang);
  
  if (!success && 'speechSynthesis' in window) {
    // Fallback to browser TTS
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};

export function VoiceSimulator() {
  const [mode, setMode] = useState<'voice' | 'text'>('voice');
  const [topic, setTopic] = useState('');
  const [setting, setSetting] = useState('primary-care');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [userTranscript, setUserTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [metrics, setMetrics] = useState<Metrics>({ score: 100, turns: 0, strongAreas: [], weakAreas: [] });
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const recognitionRef = useRef<any>(null);

  // Timer
  useEffect(() => {
    if (started) {
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
        setUserTranscript(transcript);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleStart = async () => {
    if (!topic && !setting) return;
    setLoading(true);
    setStarted(true);
    setHistory([]);
    setMetrics({ score: 100, turns: 0, strongAreas: [], weakAreas: [] });
    setSeconds(0);

    try {
      const { data, error } = await supabase.functions.invoke('interactive-module-ai', {
        body: { action: 'start-scenario', payload: { topic: topic || setting, difficulty } }
      });
      if (error) throw error;
      const firstLine = data.result || "Hello, I'm Dr. Smith. How can I help you today?";
      setHistory([{ role: 'Doctor', text: firstLine }]);
      await speakText(firstLine, 'Doctor', 'en-US');
    } catch (e) {
      console.error('Start error:', e);
      toast.error('Failed to start simulation');
      setStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setUserTranscript('');
      const lastRole = history[history.length - 1]?.role;
      recognitionRef.current.lang = lastRole === 'Doctor' ? 'es-MX' : 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const submitInterpretation = async () => {
    if (!userTranscript.trim()) return;
    setLoading(true);

    try {
      const lastMessage = history[history.length - 1];
      
      // Assess and get next turn in parallel
      const [assessResult, nextResult] = await Promise.all([
        supabase.functions.invoke('interactive-module-ai', {
          body: {
            action: 'assess-message',
            payload: {
              topic,
              originalText: lastMessage.text,
              originalLang: lastMessage.role === 'Doctor' ? 'English' : 'Spanish',
              studentInterpretation: userTranscript
            }
          }
        }),
        supabase.functions.invoke('interactive-module-ai', {
          body: {
            action: 'next-turn',
            payload: {
              topic,
              difficulty,
              history,
              latestInterpretation: userTranscript,
              nextRole: lastMessage.role === 'Doctor' ? 'Patient' : 'Doctor'
            }
          }
        })
      ]);

      let assessment = { score: 85, feedback: 'Good effort', strong_point: 'Flow', weak_point: 'None' };
      try {
        assessment = JSON.parse(assessResult.data?.result || '{}');
      } catch {}

      const nextRole: Role = lastMessage.role === 'Doctor' ? 'Patient' : 'Doctor';
      const nextText = nextResult.data?.result || '...';

      // Update metrics
      setMetrics(prev => ({
        score: Math.floor((prev.score * prev.turns + assessment.score) / (prev.turns + 1)),
        turns: prev.turns + 1,
        strongAreas: assessment.score > 90 ? [...new Set([...prev.strongAreas, assessment.strong_point])] : prev.strongAreas,
        weakAreas: assessment.weak_point !== 'None' ? [...new Set([...prev.weakAreas, assessment.weak_point])] : prev.weakAreas,
      }));

      // Update history
      setHistory(prev => [
        ...prev,
        { role: 'Interpreter', text: userTranscript, feedback: assessment },
        { role: nextRole, text: nextText }
      ]);

      setUserTranscript('');
      await speakText(nextText, nextRole, nextRole === 'Doctor' ? 'en-US' : 'es-MX');
    } catch (e) {
      console.error('Submit error:', e);
      toast.error('Failed to process interpretation');
    } finally {
      setLoading(false);
    }
  };

  if (!started) {
    return (
      <Card className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-slate-800">
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mb-4">
                <Mic className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold mb-2">
                Voice <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Simulator</span>
              </h2>
              <p className="text-slate-400">Practice real-time medical interpretation with AI voices</p>
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as 'voice' | 'text')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="voice" className="data-[state=active]:bg-indigo-600">
                  <Mic className="w-4 h-4 mr-2" /> Voice Mode
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-indigo-600">
                  <BookOpen className="w-4 h-4 mr-2" /> Text Mode
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2 block">
                  Topic (optional)
                </label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Chest pain, diabetes follow-up..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2 block">Setting</label>
                  <Select value={setting} onValueChange={setSetting}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SETTINGS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2 block">Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTIES.map(d => (
                        <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleStart}
                disabled={loading}
                className="w-full py-6 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-lg"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2 fill-current" />}
                Begin Simulation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
      {/* Sidebar */}
      <Card className="bg-slate-900 text-white border-slate-800">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <Badge variant="outline" className="text-indigo-400 border-indigo-400">Live</Badge>
            <span className="font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {formatTime(seconds)}
            </span>
          </div>

          <div className="text-center">
            <span className={cn(
              "text-5xl font-black",
              metrics.score > 80 ? "text-green-400" : "text-yellow-400"
            )}>
              {metrics.score}
            </span>
            <span className="text-slate-500">/100</span>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-2 flex items-center gap-1">
              <ThumbsUp className="w-3 h-3 text-green-500" /> Strengths
            </p>
            <div className="flex flex-wrap gap-1">
              {metrics.strongAreas.map((a, i) => (
                <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/20">{a}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase mb-2 flex items-center gap-1">
              <ThumbsDown className="w-3 h-3 text-red-500" /> Needs Work
            </p>
            <div className="flex flex-wrap gap-1">
              {metrics.weakAreas.length === 0 
                ? <span className="text-sm text-slate-600 italic">Great so far!</span>
                : metrics.weakAreas.map((a, i) => (
                    <Badge key={i} className="bg-red-500/10 text-red-400 border-red-500/20">{a}</Badge>
                  ))
              }
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chat */}
      <Card className="lg:col-span-3 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, i) => (
            <div key={i} className={cn(
              "flex gap-3",
              msg.role === 'Interpreter' && "justify-end"
            )}>
              {msg.role !== 'Interpreter' && (
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  msg.role === 'Doctor' ? "bg-blue-500/20" : "bg-green-500/20"
                )}>
                  {msg.role === 'Doctor' ? <Stethoscope className="w-4 h-4 text-blue-500" /> : <User className="w-4 h-4 text-green-500" />}
                </div>
              )}
              <div className={cn(
                "max-w-[70%] p-3 rounded-xl",
                msg.role === 'Doctor' && "bg-blue-500/10 border border-blue-500/20",
                msg.role === 'Patient' && "bg-green-500/10 border border-green-500/20",
                msg.role === 'Interpreter' && "bg-purple-500/10 border border-purple-500/20"
              )}>
                <p className="text-sm font-medium text-muted-foreground mb-1">{msg.role}</p>
                <p>{msg.text}</p>
                {msg.feedback && (
                  <Badge className="mt-2" variant="outline">
                    Score: {msg.feedback.score}/100
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t">
          {mode === 'voice' ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="rounded-full w-14 h-14"
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              <div className="flex-1">
                {isListening ? (
                  <p className="text-primary animate-pulse">Listening...</p>
                ) : userTranscript ? (
                  <p className="text-muted-foreground">{userTranscript}</p>
                ) : (
                  <p className="text-muted-foreground">Click mic to start speaking</p>
                )}
              </div>
              {userTranscript && (
                <Button onClick={submitInterpretation} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={userTranscript}
                onChange={(e) => setUserTranscript(e.target.value)}
                placeholder="Type your interpretation..."
                onKeyDown={(e) => e.key === 'Enter' && submitInterpretation()}
              />
              <Button onClick={submitInterpretation} disabled={loading || !userTranscript}>
                {loading ? <Loader2 className="animate-spin" /> : 'Submit'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
