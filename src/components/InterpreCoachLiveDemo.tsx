import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, Video, Phone, Settings, Users } from 'lucide-react';

interface TerminologyCard {
  term: string;
  definition: string;
  pronunciation: string;
}

interface TranscriptLine {
  speaker: string;
  text: string;
  timestamp: string;
}

export const InterpreCoachLiveDemo = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [activeTerms, setActiveTerms] = useState<TerminologyCard[]>([]);
  const [transcriptLines, setTranscriptLines] = useState<TranscriptLine[]>([]);
  const [showTip, setShowTip] = useState(false);

  const demoPhases = [
    {
      duration: 3000,
      transcript: { speaker: 'Doctor', text: 'Good morning. Please tell me what seems to be the problem today.', timestamp: '00:00' },
      terms: [],
      tip: ''
    },
    {
      duration: 3500,
      transcript: { speaker: 'Interpreter', text: 'Buenos días. Por favor, dígame cuál parece ser el problema hoy.', timestamp: '00:03' },
      terms: [],
      tip: ''
    },
    {
      duration: 4000,
      transcript: { speaker: 'Patient', text: 'He estado sintiendo un dolor agudo en el pecho y me falta el aire.', timestamp: '00:07' },
      terms: [
        { term: 'Myocardial Infarction', definition: 'A blockage of blood flow to the heart muscle (Heart Attack)', pronunciation: 'my-oh-KAR-dee-ul in-FARK-shun' }
      ],
      tip: 'Chest pain + shortness of breath may indicate cardiac event'
    },
    {
      duration: 4000,
      transcript: { speaker: 'Interpreter', text: 'I have been feeling a sharp pain in my chest and I am short of breath.', timestamp: '00:11' },
      terms: [
        { term: 'Angina Pectoris', definition: 'Chest pain caused by reduced blood flow to heart', pronunciation: 'an-JY-nuh PEK-tor-is' },
        { term: 'Dyspnea', definition: 'Shortness of breath or difficulty breathing', pronunciation: 'disp-NEE-uh' }
      ],
      tip: 'Consider mentioning severity and duration'
    },
    {
      duration: 3500,
      transcript: { speaker: 'Doctor', text: 'When did this start? Is the pain constant or does it come and go?', timestamp: '00:15' },
      terms: [],
      tip: ''
    },
    {
      duration: 4000,
      transcript: { speaker: 'Interpreter', text: '¿Cuándo comenzó esto? ¿Es constante el dolor o va y viene?', timestamp: '00:19' },
      terms: [],
      tip: 'Good pacing - maintain rhythm'
    }
  ];

  useEffect(() => {
    if (currentPhase >= demoPhases.length) {
      setTimeout(() => {
        setCurrentPhase(0);
        setActiveTerms([]);
        setTranscriptLines([]);
        setShowTip(false);
      }, 2000);
      return;
    }

    const phase = demoPhases[currentPhase];

    const timer = setTimeout(() => {
      setTranscriptLines(prev => [...prev, phase.transcript]);

      if (phase.terms.length > 0) {
        setActiveTerms(phase.terms);
      }

      if (phase.tip) {
        setShowTip(true);
        setTimeout(() => setShowTip(false), phase.duration - 500);
      }

      setCurrentPhase(prev => prev + 1);
    }, phase.duration);

    return () => clearTimeout(timer);
  }, [currentPhase]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative rounded-2xl shadow-2xl border-2 border-nobel-gold/30 overflow-hidden bg-black">
        {/* Browser Chrome */}
        <div className="w-full px-4 py-3 bg-gradient-to-r from-stone-900 to-stone-800 border-b border-stone-700 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 text-xs text-stone-400">Video Call - Medical Interpretation Session</div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-stone-950">
          {/* Video Call Area - Takes 2 columns */}
          <div className="lg:col-span-2 p-4 space-y-4">
            {/* Video Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Doctor Video */}
              <div className="relative aspect-video bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg border-2 border-green-500/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-16 h-16 text-stone-600" />
                </div>
                <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs text-white font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Dr. Chen
                </div>
              </div>

              {/* Patient Video */}
              <div className="relative aspect-video bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg border-2 border-green-500/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-16 h-16 text-stone-600" />
                </div>
                <div className="absolute bottom-2 left-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs text-white font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Patient
                </div>
              </div>
            </div>

            {/* Interpreter Video (Self) */}
            <div className="relative aspect-video bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg border-2 border-nobel-gold overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-20 h-20 text-stone-600" />
              </div>
              <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-md text-sm text-nobel-gold font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-nobel-gold rounded-full animate-pulse"></div>
                You (Interpreter)
              </div>
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-nobel-gold/20 backdrop-blur-sm rounded-md text-xs text-nobel-gold font-bold border border-nobel-gold/30">
                InterpreCoach Active
              </div>
            </div>

            {/* Call Controls */}
            <div className="flex justify-center gap-4 pt-2">
              <button className="p-3 bg-stone-800 hover:bg-stone-700 rounded-full transition-colors">
                <Mic className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-stone-800 hover:bg-stone-700 rounded-full transition-colors">
                <Video className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </button>
              <button className="p-3 bg-stone-800 hover:bg-stone-700 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* InterpreCoach Panel - Takes 1 column */}
          <div className="lg:col-span-1 bg-gradient-to-b from-stone-900 to-black border-l-2 border-nobel-gold/20 p-4 flex flex-col">
            {/* Panel Header */}
            <div className="mb-4 pb-3 border-b border-nobel-gold/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-nobel-gold/20 rounded-lg flex items-center justify-center">
                  <Volume2 className="w-4 h-4 text-nobel-gold" />
                </div>
                <h3 className="text-lg font-bold text-nobel-gold">InterpreCoach</h3>
              </div>
              <p className="text-xs text-stone-400">Real-time AI assistance</p>
            </div>

            {/* Live Transcription */}
            <div className="mb-4 flex-grow">
              <h4 className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Live Transcription</h4>
              <div className="bg-black/40 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 border border-stone-800">
                <AnimatePresence mode="popLayout">
                  {transcriptLines.slice(-4).map((line, idx) => (
                    <motion.div
                      key={`${line.timestamp}-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs"
                    >
                      <span className="text-nobel-gold font-semibold">{line.speaker}:</span>
                      <span className="text-stone-300 ml-1">{line.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Terminology Suggestions */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">Terminology</h4>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {activeTerms.map((term, idx) => (
                    <motion.div
                      key={term.term}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.2 }}
                      className="bg-nobel-gold/10 border border-nobel-gold/30 rounded-lg p-3"
                    >
                      <div className="text-sm font-bold text-nobel-gold mb-1">{term.term}</div>
                      <div className="text-xs text-stone-300 mb-1">{term.definition}</div>
                      <div className="text-xs text-stone-500 italic">{term.pronunciation}</div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* QA Tips */}
            <div>
              <h4 className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-wider">AI Tips</h4>
              <AnimatePresence mode="wait">
                {showTip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-green-500/10 border border-green-500/30 rounded-lg p-3"
                  >
                    <div className="text-xs text-green-400">
                      {demoPhases[currentPhase - 1]?.tip}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Performance Indicator */}
            <div className="mt-auto pt-4 border-t border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-stone-400">Session Quality</span>
                <span className="text-xs font-bold text-green-400">Excellent</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-nobel-gold to-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '95%' }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Label */}
      <div className="text-center mt-4">
        <p className="text-sm text-stone-400">
          Live simulation of InterpreCoach during a medical interpretation session
        </p>
      </div>
    </div>
  );
};
