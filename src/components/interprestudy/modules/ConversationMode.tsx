import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Volume2, Loader2, ThumbsUp, ThumbsDown, User, Smile, Languages, ClipboardList, Clock, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

// --- TYPES ---
type Role = 'Doctor' | 'Patient' | 'Interpreter';

interface ConversationMessage {
  role: Role;
  text: string;
  feedback?: AssessmentFeedback;
}

interface AssessmentFeedback {
  score: number;
  feedback: string;
  strong_point: string;
  weak_point: string;
}

// --- SPEECH RECOGNITION TYPES ---
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

interface CustomWindow extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

// --- API HELPER ---

interface Metrics {
  score: number;
  turns: number;
  strongAreas: string[];
  weakAreas: string[];
}

// --- API PAYLOAD TYPES ---
interface StartScenarioPayload {
  topic: string;
  difficulty: string;
}

interface AssessMessagePayload {
  topic: string;
  originalText: string;
  originalLang: string;
  studentInterpretation: string;
}

interface NextTurnPayload {
  topic: string;
  difficulty: string;
  history: ConversationMessage[];
  latestInterpretation: string;
  nextRole: Role;
}

interface GenerateSoapPayload {
  history: ConversationMessage[];
}

type InteractiveAIPayload = StartScenarioPayload | AssessMessagePayload | NextTurnPayload | GenerateSoapPayload;

const callInteractiveAI = async (action: string, payload: InteractiveAIPayload) => {
  const { data, error } = await supabase.functions.invoke('interactive-module-ai', {
    body: { action, payload }
  });

  if (error) throw error;
  if (data.error) throw new Error(data.error);
  return data.result;
};

// --- ENHANCED SPEECH UTILS (NATURAL SOUNDING) ---
const speakText = (text: string, lang = 'en-US') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any current speech
    const utterance = new SpeechSynthesisUtterance(text);

    // Try to select a better voice if available (Chrome/Edge)
    const voices = window.speechSynthesis.getVoices();
    let preferredVoice = null;

    if (lang === 'en-US') {
      preferredVoice = voices.find(v => v.name.includes('Google US English')) ||
        voices.find(v => v.name.includes('Samantha')) ||
        voices.find(v => v.lang === 'en-US');
    } else if (lang === 'es-MX') {
      preferredVoice = voices.find(v => v.name.includes('Google español')) ||
        voices.find(v => v.name.includes('Monica')) ||
        voices.find(v => v.lang === 'es-MX') ||
        voices.find(v => v.lang.startsWith('es'));
    }

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.lang = lang;
    utterance.rate = 0.95; // Natural conversational pace
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  }
};

// --- CUSTOM HOOKS ---
const useSpeechRecognition = (onTranscriptChange: (transcript: string) => void, onListeningChange: (isListening: boolean) => void) => {
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    // Check for browser support
    const customWindow = window as unknown as CustomWindow;
    const SpeechRecognition = customWindow.SpeechRecognition || customWindow.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false; // Stop after one sentence/pause
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const results: SpeechRecognitionResult[] = Array.from(event.results);
          const transcript = results
            .map((result) => result[0].transcript)
            .join('');
          onTranscriptChange(transcript);
        };

        recognitionRef.current.onend = () => {
          onListeningChange(false);
        };
      }
    }
  }, [onTranscriptChange, onListeningChange]); // Run once on mount

  const startListening = (lang: string) => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
      onListeningChange(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      onListeningChange(false);
    }
  };

  return { startListening, stopListening, recognitionRef };
};

export const ConversationMode = () => {
  // Configuration
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");

  // Session State
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState<ConversationMessage[]>([]);
  const [currentTurn, setCurrentTurn] = useState('init'); // 'doctor', 'patient', 'interpreter'
  const [loading, setLoading] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [soapNote, setSoapNote] = useState<string | null>(null);

  // Timer
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Metrics
  const [metrics, setMetrics] = useState<Metrics>({
    score: 100,
    turns: 0,
    strongAreas: ['Vocabulary'],
    weakAreas: []
  });



  // Timer Logic
  useEffect(() => {
    if (started && !soapNote) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, soapNote]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- LOGIC HELPERS ---
  const handleStartScenario = async () => {
    if (!topic) return;

    // Reset State
    setStarted(true);
    setLoading(true);
    setSoapNote(null);
    setSeconds(0);
    setHistory([]);
    setMetrics({ score: 100, turns: 0, strongAreas: ['Vocabulary'], weakAreas: [] });

    try {
      // API Call
      const firstLine = await callInteractiveAI('start-scenario', { topic, difficulty });

      // Update State
      setHistory([{ role: 'Doctor', text: firstLine }]);
      setLoading(false);
      setCurrentTurn('doctor');
      speakText(firstLine, 'en-US');
    } catch (e) {
      console.error("Start Scenario Error", e);
      setLoading(false);
      setStarted(false); // Abort start
      alert("Failed to start simulation. Please try again.");
    }
  };

  const assessStudentPerformance = async (lastMessage: ConversationMessage, transcript: string) => {
    const lang = lastMessage.role === 'Doctor' ? 'English' : 'Spanish';
    // const prompt = createAssessmentPrompt(topic, lastMessage.text, lang, transcript);

    try {
      const result = await callInteractiveAI('assess-message', {
        topic,
        originalText: lastMessage.text,
        originalLang: lang,
        studentInterpretation: transcript
      });

      // Backend should return JSON string, but sometimes it might be just string if prompt failed compliance. 
      // Safe parse handled in backend but result is stringified JSON.
      return JSON.parse(result);
    } catch (e) {
      console.error("Assessment Error", e);
      return { score: 85, feedback: "Good effort (Offline fallback)", strong_point: "Flow", weak_point: "None" }; // Fallback
    }
  };

  const generateNextResponse = async (history: ConversationMessage[], transcript: string, lastRole: Role) => {
    const nextRole: Role = lastRole === 'Doctor' ? 'Patient' : 'Doctor';
    try {
      const nextLine = await callInteractiveAI('next-turn', {
        topic,
        difficulty,
        history,
        latestInterpretation: transcript,
        nextRole
      });
      return { role: nextRole, text: nextLine };
    } catch (e) {
      console.error("Next Turn Error", e);
      return { role: nextRole, text: "..." };
    }
  };

  const processInterpretation = async () => {
    if (!userTranscript) return;
    setLoading(true);

    const lastMessage = history[history.length - 1];

    // Parallel execution for faster response
    try {
      const [assessment, nextMsg] = await Promise.all([
        assessStudentPerformance(lastMessage, userTranscript),
        generateNextResponse(history, userTranscript, lastMessage.role)
      ]);

      // Update Metrics
      setMetrics(prev => {
        const newWeakness = assessment.weak_point !== 'None' && !prev.weakAreas.includes(assessment.weak_point)
          ? [...prev.weakAreas, assessment.weak_point]
          : prev.weakAreas;
        return {
          score: Math.floor((prev.score * prev.turns + assessment.score) / (prev.turns + 1)),
          turns: prev.turns + 1,
          strongAreas: assessment.score > 90 ? [...new Set([...prev.strongAreas, assessment.strong_point])] : prev.strongAreas,
          weakAreas: newWeakness
        };
      });

      const interpMsg: ConversationMessage = {
        role: 'Interpreter',
        text: userTranscript,
        feedback: assessment
      };

      // Update history with BOTH the interpretation and the NEXT line
      setHistory(prev => [...prev, interpMsg, nextMsg]);
      setLoading(false);
      setUserTranscript("");
      setCurrentTurn(nextMsg.role.toLowerCase());

      speakText(nextMsg.text, nextMsg.role === 'Doctor' ? 'en-US' : 'es-MX');
    } catch (e) {
      console.error("Process Interpretation Error", e);
      setLoading(false);
    }
  };


  // Speech Hook
  const { startListening, stopListening } = useSpeechRecognition(setUserTranscript, setIsListening);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setUserTranscript("");
      const lastRole = history.length > 0 ? history[history.length - 1].role : 'Doctor';
      // If Doctor spoke (EN), I interpret to ES-MX. If Patient spoke (ES), I interpret to EN-US.
      const targetLang = lastRole === 'Doctor' ? 'es-MX' : 'en-US';
      startListening(targetLang);
    }
  };




  const generateSoapNote = async () => {
    setLoading(true);
    try {
      const result = await callInteractiveAI('generate-soap', { history });
      setSoapNote(result);
    } catch (e) {
      console.error("SOAP Note Error", e);
      setSoapNote("Failed to generate note.");
    }
    setLoading(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (!started) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-slate-900 rounded-3xl shadow-2xl text-white animate-fade-in border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mb-6 shadow-lg shadow-indigo-900/50">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-5xl font-black mb-4 leading-tight tracking-tight">Premium Voice<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Simulator</span></h2>
            <p className="text-slate-400 text-lg mb-8 font-light leading-relaxed">Immerse yourself in a high-fidelity medical encounter. Listen to AI-generated patients, interpret in real-time, and receive instant, professional grading.</p>

            <div className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2">Scenario Topic</label>
                <Input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Chest Pain Triage..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-lg placeholder:text-slate-600 mb-4 h-14"
                />

                <label className="block text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2">Difficulty Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Easy', 'Intermediate', 'Hard', 'Pro'].map(level => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`py-2 rounded-lg text-sm font-bold transition-all border ${difficulty === level ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStartScenario}
                disabled={!topic || loading}
                className="w-full py-4 bg-white text-indigo-900 rounded-xl font-bold text-lg shadow-xl shadow-indigo-900/20 hover:bg-indigo-50 hover:scale-[1.02] transition-all flex justify-center items-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                Begin Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-2 md:p-4 animate-fade-in grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">

      {/* LEFT: QA DASHBOARD */}
      <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-6 text-white flex flex-col gap-6 shadow-2xl border border-slate-800 overflow-y-auto">
        <div className="pb-4 border-b border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Live Session</h3>
            <span className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">
              <Clock className="w-3 h-3" /> {formatTime(seconds)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-6xl font-black tracking-tighter ${metrics.score > 80 ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300' : 'text-yellow-400'}`}>{metrics.score}</span>
            <span className="text-lg text-slate-500 font-medium">/100</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
            Level: {difficulty}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><ThumbsUp className="w-4 h-4 text-green-500" /> Strengths</h4>
          <div className="flex flex-wrap gap-2">
            {metrics.strongAreas.map((area, i) => (
              <span key={i} className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg text-xs font-semibold text-green-300">{area}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><ThumbsDown className="w-4 h-4 text-red-500" /> Needs Work</h4>
          {metrics.weakAreas.length === 0 ? <span className="text-sm text-slate-600 italic pl-2">Clean record so far...</span> : (
            <div className="flex flex-wrap gap-2">
              {metrics.weakAreas.map((area, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-semibold text-red-300">{area}</span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button
            onClick={generateSoapNote}
            disabled={history.length < 3}
            className="w-full py-3 bg-indigo-600/20 border border-indigo-500/50 text-indigo-200 rounded-xl font-bold text-sm hover:bg-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <ClipboardList className="w-4 h-4" />
            Finish & Generate SOAP
          </button>
        </div>
      </div>

      {/* CENTER: CONVERSATION STREAM */}
      <div className="lg:col-span-3 flex flex-col gap-4 h-full relative">
        {soapNote && (
          <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-full">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-600" /> SOAP Note</h3>
                <button onClick={() => { setSoapNote(null); setStarted(false); }} className="p-2 hover:bg-slate-100 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
              </div>
              <div className="prose prose-slate max-w-none whitespace-pre-wrap font-mono text-sm bg-slate-50 p-6 rounded-xl border border-slate-200">
                {soapNote}
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 overflow-y-auto shadow-sm space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'Interpreter' ? 'items-end' : 'items-start'} animate-fade-in`}>
              <div className={`relative max-w-[85%] p-5 rounded-3xl text-sm shadow-sm transition-all hover:shadow-md
                ${msg.role === 'Doctor' ? 'bg-white border border-blue-100 text-slate-800 rounded-tl-none' :
                  msg.role === 'Patient' ? 'bg-white border border-green-100 text-slate-800 rounded-tl-none' :
                    'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200'}`}>

                <div className="flex items-center justify-between gap-4 mb-2 border-b border-black/5 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wide opacity-70 flex items-center gap-1">
                    {msg.role === 'Doctor' && <User className="w-3 h-3" />}
                    {msg.role === 'Patient' && <Smile className="w-3 h-3" />}
                    {msg.role === 'Interpreter' && <Languages className="w-3 h-3" />}
                    {msg.role}
                  </span>
                  {msg.role !== 'Interpreter' && (
                    <button onClick={() => speakText(msg.text, msg.role === 'Doctor' ? 'en-US' : 'es-MX')} className="opacity-50 hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-full">
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="leading-relaxed text-base font-medium">{msg.text}</p>
              </div>

              {/* QA Bubble for Interpreter */}
              {msg.feedback && (
                <div className="mt-2 mr-2 flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${msg.feedback.score > 80 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  AI Feedback: <span className={msg.feedback.score > 80 ? "text-green-600" : "text-yellow-600"}>{msg.feedback.feedback}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* INPUT AREA */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xl flex items-center gap-4">
          <button
            onClick={toggleListening}
            disabled={loading}
            className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-lg
              ${isListening ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105'}`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={userTranscript}
              onChange={(e) => setUserTranscript(e.target.value)}
              placeholder={isListening ? "Listening... (Speak now)" : "Type interpretation here..."}
              className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-700 font-medium"
              disabled={loading}
              onKeyDown={(e) => e.key === 'Enter' && processInterpretation()}
            />
            {loading && <div className="absolute right-4 top-4"><Loader2 className="w-6 h-6 text-indigo-500 animate-spin" /></div>}
          </div>

          <button
            onClick={processInterpretation}
            disabled={!userTranscript || loading}
            className="h-14 px-8 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
