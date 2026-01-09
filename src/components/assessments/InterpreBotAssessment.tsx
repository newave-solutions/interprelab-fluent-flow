import React, { useState, useEffect } from 'react';
import {
    Mic,
    Square,
    Play,
    CheckCircle,
    AlertCircle,
    BarChart2,
    BookOpen,
    Shield,
    Brain,
    MessageSquare,
    Activity,
    ArrowRight,
    RefreshCcw,
    Sparkles,
    Loader2,
    Cpu,
    Zap,
    Lightbulb,
    FileText,
    Clock
} from 'lucide-react';

// --- API Configuration ---
const getApiKey = () => {
    // Get from environment variable - inject your GEMINI_API_KEY
    return import.meta.env.VITE_INTERPRETEST_API_KEY || import.meta.env.GEMINI_API_KEY || "";
};

// --- Helper: Gemini API Call ---
const callGemini = async (prompt: string): Promise<string | null> => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("No API key configured");
        return null;
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            }
        );
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};

// --- Helper: Random Selection ---
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// --- Extended Mock Data ---

interface ReadingPassage {
    id: string;
    level: string;
    title: string;
    text: string;
}

interface SyntaxCase {
    sentence: string;
    options: Array<{ id: string; text: string }>;
    correctId: string;
}

interface VocabPair {
    id: number;
    en: string;
    es: string;
}

interface CulturalScenario {
    text: string;
    target: string;
    nuance: string;
}

interface EthicsCase {
    scenario: string;
    options: Array<{ id: string; text: string; score: number; feedback: string }>;
}

// Module 1.1: Spanish Reading Passages (3 Levels)
const SPANISH_READING_PASSAGES: ReadingPassage[] = [
    {
        id: 'easy',
        level: "Nivel Básico (Easy)",
        title: "Instrucciones de Cuidado en el Hogar",
        text: "Buenos días. Para mejorar su salud, es importante hacer algunos cambios pequeños en su rutina diaria. Primero, hablemos de su alimentación. Trate de comer más frutas y verduras frescas todos los días. Son buenas para su cuerpo y le dan energía. Evite las bebidas con mucha azúcar, como los refrescos, y mejor tome agua natural. El agua ayuda a que su cuerpo funcione bien. \n\nTambién es importante moverse un poco más. No necesita correr un maratón. Simplemente caminar 20 minutos al día puede hacer una gran diferencia. Puede caminar en el parque o alrededor de su casa. Si siente dolor o se cansa mucho, descanse un momento. \n\nSobre sus medicinas, recuerde tomarlas a la misma hora todos los días. Si se le olvida una dosis, no tome dos juntas. Si tiene preguntas sobre sus pastillas o si se siente mal después de tomarlas, llame a la clínica. Estamos aquí para ayudarle a sentirse mejor. Duerma bien por la noche, trate de descansar al menos 8 horas."
    },
    {
        id: 'medium',
        level: "Nivel Intermedio (Medical Narrative)",
        title: "Resumen de Historia Clínica: Diabetes Tipo 2",
        text: "El paciente es un varón de 54 años con antecedentes de diabetes mellitus tipo 2 no insulinodependiente, diagnosticada hace cinco años. Acude a la consulta de seguimiento refiriendo fatiga crónica, polidipsia y visión borrosa ocasional durante las últimas tres semanas. Niega dolor torácico, disnea o palpitaciones. Menciona que ha tenido dificultades para adherirse al régimen dietético recomendado debido a horarios laborales rotativos y estrés familiar reciente.\n\nEn la exploración física, sus signos vitales muestran una presión arterial de 135/85 mmHg y un índice de masa corporal de 29. El examen de los pies revela una sensibilidad disminuida en la región plantar bilateral, sugestiva de neuropatía periférica temprana, sin evidencia de úlceras o lesiones activas. Los resultados de laboratorio recientes indican una hemoglobina glicosilada (HbA1c) del 8.2%, lo que sugiere un control glucémico subóptimo en los últimos tres meses.\n\nEl plan de tratamiento actual incluye Metformina de 850 mg dos veces al día. Se discute con el paciente la necesidad de intensificar el tratamiento farmacológico y se considera agregar un inhibidor de SGLT2. Se le instruye sobre la importancia del monitoreo diario de glucosa en ayunas."
    },
    {
        id: 'hard',
        level: "Nivel Avanzado (High Level Reader)",
        title: "Consentimiento Informado y Protocolo de Bioética",
        text: "Por la presente, se certifica que el paciente ha sido informado exhaustivamente sobre la naturaleza, los riesgos inherentes y las alternativas terapéuticas del procedimiento de cateterismo cardíaco con posible intervención coronaria percutánea. Se ha explicado que, si bien el objetivo es la revascularización miocárdica para aliviar la isquemia, existen riesgos potenciales que incluyen, pero no se limitan a: hemorragia en el sitio de acceso femoral o radial, arritmias ventriculares malignas, infarto agudo de miocardio periprocedimiento, accidente cerebrovascular embólico, reacción anafiláctica al medio de contraste yodado y, en raras circunstancias, la necesidad de cirugía de derivación coronaria de emergencia.\n\nDesde una perspectiva bioética, se ha verificado la capacidad del paciente para otorgar su consentimiento de manera libre y voluntaria, sin coacción externa. Se ha respetado el principio de autonomía, asegurando que el paciente comprenda que tiene el derecho legal y moral de revocar este consentimiento en cualquier momento antes de la sedación, sin que ello perjudique su derecho a recibir atención médica futura. Asimismo, se han abordado las directivas anticipadas y se ha confirmado la designación de un representante legal en caso de incapacidad sobrevenida durante el procedimiento."
    }
];

// Module 1.2: Syntax Cases (4 Total)
const SYNTAX_CASES: SyntaxCase[] = [
    {
        sentence: "The patient have a severe pain in they chest since yesterday.",
        options: [
            { id: 'A', text: 'Subject-Verb Agreement ("patient have") & Pronoun Usage ("they chest")' },
            { id: 'B', text: 'Preposition error ("in they chest")' }
        ],
        correctId: 'A'
    },
    {
        sentence: "I didn't see no bleeding when I checked the wound this morning.",
        options: [
            { id: 'A', text: 'Incorrect Verb Tense ("checked")' },
            { id: 'B', text: 'Double Negative ("didn\'t see no")' }
        ],
        correctId: 'B'
    },
    {
        sentence: "The doctor assisted to the conference regarding the new vaccine protocols.",
        options: [
            { id: 'A', text: 'False Cognate ("assisted" instead of "attended")' },
            { id: 'B', text: 'Article Usage ("the conference")' }
        ],
        correctId: 'A'
    },
    {
        sentence: "The patient complains of pain abdominal and fever high.",
        options: [
            { id: 'A', text: 'Adjective Placement (Adjectives after nouns)' },
            { id: 'B', text: 'Subject Omission' }
        ],
        correctId: 'A'
    }
];

// Module 2.1: Vocab Pairs (7 Total)
const VOCAB_PAIRS: VocabPair[] = [
    { id: 1, en: "Stroke", es: "Accidente cerebrovascular" },
    { id: 2, en: "Hives", es: "Urticaria" },
    { id: 3, en: "Heartburn", es: "Acidez estomacal" },
    { id: 4, en: "Numbness", es: "Entumecimiento" },
    { id: 5, en: "Wheezing", es: "Sibilancias" },
    { id: 6, en: "Seizure", es: "Convulsión" },
    { id: 7, en: "Rash", es: "Sarpullido" }
];

// Module 2.2: Cultural Scenarios (4 Total)
const CULTURAL_SCENARIOS: CulturalScenario[] = [
    {
        text: "Doctor, honestly, I feel totally wiped out after the medication.",
        target: "exhausted / fatigué",
        nuance: "wiped out"
    },
    {
        text: "I decided to quit smoking cold turkey because I was scared.",
        target: "abruptly / de golpe",
        nuance: "cold turkey"
    },
    {
        text: "I've been feeling a bit under the weather since Tuesday.",
        target: "sick / maluco / enfermo",
        nuance: "under the weather"
    },
    {
        text: "My daughter has been feeling blue since the diagnosis.",
        target: "sad / deprimida",
        nuance: "feeling blue"
    }
];

// Module 3: Ethics Cases (4 Total)
const ETHICS_CASES: EthicsCase[] = [
    {
        scenario: "You are interpreting for a patient. In the waiting room, your neighbor sees you and asks, 'Hey! Is that Mrs. Gonzalez? What does she have? Is she okay?'",
        options: [
            { id: 'A', text: "Politely decline to answer, citing professional confidentiality protocols (HIPAA).", score: 100, feedback: "Correct. Interpreters must maintain strict confidentiality protocols regardless of personal relationships." },
            { id: 'B', text: "Say, 'She's fine, just a check-up,' to be polite to your neighbor.", score: 20, feedback: "Incorrect. Even confirming a patient's presence is a HIPAA violation." },
            { id: 'C', text: "Ignore the neighbor completely to avoid the conversation.", score: 50, feedback: "Partially correct in intent (maintaining silence), but unprofessional behavior." }
        ]
    },
    {
        scenario: "During a medical encounter, the provider looks at you and says, 'Tell him I don't have time for his long stories, just summarize it.'",
        options: [
            { id: 'A', text: "Summarize the patient's story as requested to save time.", score: 30, feedback: "Incorrect. Interpreters must interpret everything accurately and completely, without editing." },
            { id: 'B', text: "Interpret the provider's request to the patient exactly as stated.", score: 100, feedback: "Correct. The transparent approach facilitates direct communication, even when the content is uncomfortable." },
            { id: 'C', text: "Tell the provider you cannot summarize, but don't tell the patient what the doctor said.", score: 60, feedback: "Better than summarization, but lacks transparency with the patient." }
        ]
    },
    {
        scenario: "A grateful elderly patient attempts to hand you a $20 bill as a tip after the session, insisting you take it for 'coffee'.",
        options: [
            { id: 'A', text: "Accept it to avoid offending the patient's culture.", score: 40, feedback: "Incorrect. Accepting cash gifts violates professional boundaries and organizational policies." },
            { id: 'B', text: "Refuse firmly and walk away.", score: 50, feedback: "Maintains boundaries but lacks the cultural sensitivity required in the role." },
            { id: 'C', text: "Politely decline, thanking them for the gesture but explaining that your policy prevents you from accepting gifts.", score: 100, feedback: "Correct. This maintains professional boundaries while preserving the relationship." }
        ]
    },
    {
        scenario: "You arrive at an assignment and realize the patient is your cousin's ex-husband, whom you know personally.",
        options: [
            { id: 'A', text: "Say nothing and interpret to the best of your ability.", score: 20, feedback: "Incorrect. This is a clear Conflict of Interest that could compromise impartiality." },
            { id: 'B', text: "Disclose the conflict to the provider and patient immediately and offer to withdraw.", score: 100, feedback: "Correct. Transparency allows the provider to decide if a new interpreter is needed." },
            { id: 'C', text: "Ask the patient privately if they are comfortable with you interpreting.", score: 60, feedback: "This places the burden on the patient and hides the conflict from the provider." }
        ]
    }
];

// --- Sub-Components ---

interface InterpreBotProps {
    emotion?: 'neutral' | 'thinking' | 'happy';
    speaking?: string | boolean;
}

// 1. InterpreBot Avatar
const InterpreBot: React.FC<InterpreBotProps> = ({ emotion = 'neutral', speaking = false }) => {
    return (
        <div className="relative group w-full max-w-2xl mx-auto mb-10 transition-smooth">
            {/* Holographic Glow using project variables */}
            <div className={`absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full blur-3xl opacity-50 transition-all duration-1000 ${speaking ? 'scale-110 opacity-70' : 'scale-100'}`} />

            <div className="relative glass rounded-3xl p-6 flex items-start gap-6 overflow-hidden">
                {/* Avatar Core */}
                <div className={`relative shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-card to-muted shadow-inner overflow-hidden border border-border`}>
                    <div className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20`} />

                    {/* Eyes /Visor */}
                    <div className="flex gap-2 relative z-10">
                        <div className={`w-3 h-8 rounded-full bg-primary shadow-glow transition-all duration-300 ${emotion === 'thinking' ? 'animate-pulse h-4' : emotion === 'happy' ? 'h-4 bg-success' : ''}`} />
                        <div className={`w-3 h-8 rounded-full bg-primary shadow-glow transition-all duration-300 ${emotion === 'thinking' ? 'animate-pulse h-4 delay-75' : emotion === 'happy' ? 'h-4 bg-success' : ''}`} />
                    </div>

                    {/* Speaking Waveform */}
                    {speaking && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-0.5 h-4 items-end px-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-1 bg-foreground/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Bubble */}
                <div className="flex-1">
                    <h3 className="eyebrow mb-1 flex items-center gap-2">
                        <Cpu size={12} /> InterpreBot System
                    </h3>
                    <p className="text-foreground font-medium text-lg md:text-xl leading-relaxed">
                        {speaking || "System Standby..."}
                    </p>
                </div>
            </div>
        </div>
    );
};

// 2. Skill Meter
interface SkillBarProps {
    label: string;
    score: number;
    colorClass?: string;
}

const SkillBar: React.FC<SkillBarProps> = ({ label, score, colorClass = "bg-gradient-success" }) => (
    <div className="mb-6 group">
        <div className="flex justify-between mb-2 items-end">
            <span className="text-sm font-semibold text-muted-foreground tracking-wide">{label}</span>
            <span className="text-2xl font-bold text-foreground tabular-nums group-hover:scale-110 transition-transform">{score}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
            <div
                className={`${colorClass} h-full rounded-full transition-all duration-1000 ease-out relative`}
                style={{ width: `${score}%` }}
            >
                <div className="absolute inset-0 bg-white/30 animate-pulse w-full" />
            </div>
        </div>
    </div>
);

// 3. Timer Component
interface GlobalTimerProps {
    seconds: number;
    isActive: boolean;
}

const GlobalTimer: React.FC<GlobalTimerProps> = ({ seconds, isActive }) => {
    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm shadow-inner transition-colors ${seconds < 300 ? 'bg-destructive/20 text-destructive animate-pulse' : 'bg-muted text-muted-foreground'}`}>
            <Clock size={16} />
            {formatTime(seconds)}
        </div>
    );
};

// --- Main Assessment Component ---

export default function InterpreBotAssessment() {
    const [stage, setStage] = useState<string>('intro');
    const [botMessage, setBotMessage] = useState<string>("Hello! I'm InterpreBot. I'll be your guide today.");
    const [botEmotion, setBotEmotion] = useState<'neutral' | 'thinking' | 'happy'>('neutral');

    // -- Timer State --
    const TEST_DURATION_SECONDS = 30 * 60; // 30 minutes
    const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION_SECONDS);
    const [isTimerActive, setIsTimerActive] = useState(false);

    // -- Pagination/Progress State --
    const [indexes, setIndexes] = useState({
        syntax: 0,
        cultural: 0,
        ethics: 0
    });

    // Assessment Content State
    const [activeVoiceScript, setActiveVoiceScript] = useState<ReadingPassage>(SPANISH_READING_PASSAGES[0]);
    const [isRecording, setIsRecording] = useState(false);
    const [voiceProgress, setVoiceProgress] = useState(0);

    // Syntax State
    const [syntaxAnswer, setSyntaxAnswer] = useState<string | null>(null);

    // Vocab State
    const [vocabMatches, setVocabMatches] = useState<Record<number, number>>({});
    const [vocabContexts, setVocabContexts] = useState<Record<number, string>>({});
    const [generatingContextId, setGeneratingContextId] = useState<number | null>(null);

    // Cultural State
    const [culturalInput, setCulturalInput] = useState("");
    const [culturalFeedback, setCulturalFeedback] = useState<{ score: number; text: string } | null>(null);
    const [isAnalyzingCultural, setIsAnalyzingCultural] = useState(false);

    // Ethics State
    const [ethicsChoice, setEthicsChoice] = useState<string | null>(null);
    const [ethicsResult, setEthicsResult] = useState<string | null>(null);

    // Dashboard Report
    const [aiReport, setAiReport] = useState<string | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Scoring (Accumulators)
    const [scores, setScores] = useState({ voice: 0, syntax: 0, modern: 0, vocab: 0, security: 0, ethics: 0 });

    // --- Timer Effect ---
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isTimerActive && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0 && isTimerActive) {
            setIsTimerActive(false);
            setStage('processing');
            setBotMessage("Time is up! Submitting your results now.");
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive, timeRemaining]);

    // --- Handlers ---

    const startAssessment = () => {
        setIsTimerActive(true);
        setIndexes({ syntax: 0, cultural: 0, ethics: 0 });
        setActiveVoiceScript(SPANISH_READING_PASSAGES[0]);
        setStage('voice');
        setBotEmotion('happy');
        setBotMessage("Module 1: Vocal Foundations. Please read the text aloud clearly. (Passage 1 of 3)");
    };

    const handleVoiceRecord = () => {
        if (isRecording) {
            setIsRecording(false);
            setBotEmotion('thinking');
            setBotMessage("Processing audio waveform...");

            let p = 0;
            const interval = setInterval(() => {
                p += 5;
                setVoiceProgress(p);
                if (p >= 100) {
                    clearInterval(interval);
                    setScores(s => ({ ...s, voice: Math.min(s.voice + 30, 95) }));

                    setTimeout(() => {
                        setStage('syntax');
                        setBotEmotion('neutral');
                        setBotMessage("Audio captured. Moving to Module 1.2: Syntax Analysis. (Question 1 of 4)");
                    }, 1000);
                }
            }, 50);
        } else {
            setIsRecording(true);
            setBotEmotion('neutral');
            setBotMessage("Listening... enunciate clearly.");
        }
    };

    // --- Syntax Handlers (Sequential) ---
    const handleSyntaxSubmit = (selectedId: string) => {
        const currentQuestion = SYNTAX_CASES[indexes.syntax];
        const isCorrect = selectedId === currentQuestion.correctId;

        setScores(s => ({ ...s, syntax: s.syntax + (isCorrect ? 25 : 0) }));
        setSyntaxAnswer(isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            if (indexes.syntax < SYNTAX_CASES.length - 1) {
                setIndexes(prev => ({ ...prev, syntax: prev.syntax + 1 }));
                setSyntaxAnswer(null);
                setBotMessage(`Next Syntax Case (${indexes.syntax + 2} of ${SYNTAX_CASES.length}).`);
            } else {
                setStage('vocab');
                setBotEmotion('happy');
                setBotMessage("Syntax Module Complete. Moving to Module 2: Lexical Competence.");
            }
        }, 1200);
    };

    // --- Vocab Handlers ---
    const generateVocabContext = async (termId: number, termEn: string) => {
        setGeneratingContextId(termId);
        const prompt = `Generate a short (1 sentence) medical context sentence using the term "${termEn}".`;
        const text = await callGemini(prompt);
        setVocabContexts(prev => ({ ...prev, [termId]: text || "Example context unavailable" }));
        setGeneratingContextId(null);
    };

    const handleVocabMatch = (enId: number, esId: number) => {
        const newMatches = { ...vocabMatches, [enId]: esId };
        setVocabMatches(newMatches);

        const totalPairs = VOCAB_PAIRS.length;
        if (Object.keys(newMatches).length >= totalPairs) {
            let correct = 0;
            Object.entries(newMatches).forEach(([k, v]) => {
                if (parseInt(k) === parseInt(String(v))) correct++;
            });
            setScores(s => ({ ...s, vocab: Math.round((correct / totalPairs) * 100) }));

            setTimeout(() => {
                setStage('cultural');
                setBotEmotion('neutral');
                setBotMessage("Vocab Complete. Module 2.2: Cultural Adaptation. (Scenario 1 of 4)");
            }, 1000);
        }
    };

    // --- Cultural Handlers (Sequential) ---
    const analyzeCulturalInput = async () => {
        if (!culturalInput.trim()) return;
        setIsAnalyzingCultural(true);
        setBotEmotion('thinking');

        setTimeout(() => {
            setCulturalFeedback({ score: 85, text: "Good interpretation of nuance." });
            setScores(s => ({ ...s, modern: s.modern + 20 }));
            setBotEmotion('happy');
            setIsAnalyzingCultural(false);
        }, 1500);
    };

    const handleCulturalNext = () => {
        if (indexes.cultural < CULTURAL_SCENARIOS.length - 1) {
            setIndexes(prev => ({ ...prev, cultural: prev.cultural + 1 }));
            setCulturalInput("");
            setCulturalFeedback(null);
            setBotMessage(`Next Scenario (${indexes.cultural + 2} of ${CULTURAL_SCENARIOS.length}).`);
            setBotEmotion('neutral');
        } else {
            setStage('ethics');
            setBotEmotion('thinking');
            setBotMessage("Cultural Module Complete. Final Module: Ethics. (Case 1 of 4)");
        }
    };

    // --- Ethics Handlers (Sequential) ---
    const handleEthicsSubmit = (option: { id: string; text: string; score: number; feedback: string }) => {
        setEthicsChoice(option.id);
        setEthicsResult(option.feedback);
        setScores(s => ({ ...s, ethics: s.ethics + (option.score / ETHICS_CASES.length) }));

        setBotEmotion(option.score > 70 ? "happy" : "neutral");

        setTimeout(() => {
            if (indexes.ethics < ETHICS_CASES.length - 1) {
                setIndexes(prev => ({ ...prev, ethics: prev.ethics + 1 }));
                setEthicsChoice(null);
                setEthicsResult(null);
                setBotMessage(`Next Ethical Dilemma (${indexes.ethics + 2} of ${ETHICS_CASES.length}).`);
            } else {
                setIsTimerActive(false);
                setStage('processing');
                setBotEmotion('thinking');
                setBotMessage("Assessment Complete. Compiling Final Blueprint...");
                setTimeout(() => {
                    setStage('dashboard');
                    setBotEmotion('happy');
                    setBotMessage("Your InterpreLab Blueprint is ready.");
                }, 3000);
            }
        }, 2500);
    };

    // --- Report ---
    const generateAiReport = async () => {
        setIsGeneratingReport(true);
        const prompt = `Write summary for interpreter student. Voice: ${scores.voice}, Grammar: ${scores.syntax}.`;
        const text = await callGemini(prompt);
        setAiReport(text || "Excellent work. Consistency is key.");
        setIsGeneratingReport(false);
    };

    useEffect(() => {
        if (stage === 'dashboard' && !aiReport) generateAiReport();
    }, [stage, aiReport]);

    const resetApp = () => {
        setStage('intro');
        setScores({ voice: 0, syntax: 0, modern: 0, vocab: 0, security: 0, ethics: 0 });
        setIndexes({ syntax: 0, cultural: 0, ethics: 0 });
        setTimeRemaining(TEST_DURATION_SECONDS);
        setVoiceProgress(0);
        setSyntaxAnswer(null);
        setVocabMatches({});
        setVocabContexts({});
        setEthicsChoice(null);
        setEthicsResult(null);
        setCulturalInput("");
        setCulturalFeedback(null);
        setAiReport(null);
        setBotEmotion('neutral');
        setBotMessage("Hello! I'm InterpreBot. Ready to try again?");
    };

    // --- Renderers ---

    const renderIntro = () => (
        <div className="text-center max-w-2xl mx-auto animate-slideUp">
            <div className="mb-8 inline-block p-4 rounded-3xl bg-white shadow-xl rotate-3 border border-indigo-100">
                <Shield size={48} className="text-indigo-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                Medical Interpreter <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Competency Blueprint</span>
            </h2>
            <div className="flex justify-center gap-4 mb-8">
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600">
                    <Clock size={16} className="text-indigo-500" /> 30 Minutes
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-2 text-sm font-bold text-slate-600">
                    <FileText size={16} className="text-indigo-500" /> 20+ Questions
                </div>
            </div>
            <p className="text-slate-600 mb-10 text-xl leading-relaxed max-w-lg mx-auto">
                A comprehensive AI-driven assessment analyzing your Voice, Syntax, Vocabulary, Cultural Adaptation, and Ethics.
            </p>
            <button
                onClick={startAssessment}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 hover:scale-105 shadow-2xl shadow-indigo-500/30 overflow-hidden"
            >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-indigo-900"></span>
                <span className="relative flex items-center gap-3 text-lg">
                    Start Exam <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
        </div>
    );

    const renderVoice = () => (
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white animate-slideUp">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3 text-indigo-600 font-bold uppercase text-xs tracking-[0.2em]">
                    <Mic size={16} /> Module 1.1: Voice Control
                </div>
                {activeVoiceScript.level && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        {activeVoiceScript.level}
                    </span>
                )}
            </div>

            <div className="relative bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-10 shadow-inner max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-200">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-t-3xl opacity-50" />
                {activeVoiceScript.title && (
                    <h3 className="text-xl font-bold text-slate-800 mb-4">{activeVoiceScript.title}</h3>
                )}
                <p className="text-xl md:text-2xl leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                    "{activeVoiceScript.text}"
                </p>
            </div>

            <div className="flex flex-col items-center gap-6">
                {!voiceProgress ? (
                    <button
                        onClick={handleVoiceRecord}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isRecording ? 'bg-rose-500 scale-110 shadow-rose-500/40' : 'bg-gradient-to-br from-indigo-600 to-indigo-700 hover:scale-105 shadow-indigo-500/40'}`}
                    >
                        {isRecording ? <Square size={32} className="text-white fill-current" /> : <Mic size={36} className="text-white" />}
                    </button>
                ) : (
                    <div className="w-full max-w-md space-y-3">
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>Recording Analysis</span>
                            <span>{voiceProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-100 relative overflow-hidden" style={{ width: `${voiceProgress}%` }}>
                                <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSyntax = () => {
        const currentQuestion = SYNTAX_CASES[indexes.syntax];
        return (
            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white animate-slideUp">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3 text-indigo-600 font-bold uppercase text-xs tracking-[0.2em]">
                        <BookOpen size={16} /> Module 1.2: Syntax ({indexes.syntax + 1}/{SYNTAX_CASES.length})
                    </div>
                </div>

                <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-100/50 mb-8 text-center">
                    <p className="text-2xl text-slate-800 italic">
                        "{currentQuestion.sentence}"
                    </p>
                </div>

                <div className="grid gap-4">
                    {currentQuestion.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleSyntaxSubmit(opt.id)}
                            disabled={syntaxAnswer !== null}
                            className={`p-6 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden group
              ${syntaxAnswer && opt.id === currentQuestion.correctId ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' : ''}
              ${syntaxAnswer && opt.id !== currentQuestion.correctId && syntaxAnswer !== 'correct' ? 'opacity-40 grayscale' : ''}
              ${!syntaxAnswer ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-lg' : ''}
            `}
                        >
                            <div className="relative z-10 flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${syntaxAnswer && opt.id === currentQuestion.correctId ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-500 border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                                    {opt.id}
                                </span>
                                <span className="font-medium text-lg text-slate-700">{opt.text}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )
    };

    const renderVocab = () => (
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white animate-slideUp">
            <div className="flex items-center gap-3 mb-8 text-indigo-600 font-bold uppercase text-xs tracking-[0.2em]">
                <Brain size={16} /> Module 2.1: Terminology (All Pairs)
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12">
                <div className="space-y-4 flex-1">
                    {VOCAB_PAIRS.map(item => (
                        <div key={`en-${item.id}`} className="group relative p-5 bg-slate-50/80 rounded-2xl font-semibold text-slate-700 border border-slate-100 shadow-sm transition-all hover:bg-white hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <span>{item.en}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); generateVocabContext(item.id, item.en); }}
                                    className="text-slate-300 hover:text-indigo-500 transition-colors"
                                    title="Generate example sentence"
                                >
                                    {generatingContextId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Lightbulb size={16} />}
                                </button>
                            </div>
                            {vocabContexts[item.id] && (
                                <div className="mt-3 text-xs text-indigo-600 font-medium bg-indigo-50 p-2 rounded-lg animate-fadeIn border border-indigo-100">
                                    AI Context: "{vocabContexts[item.id]}"
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="hidden md:flex flex-col justify-around py-4 opacity-20">
                    <ArrowRight size={24} className="text-slate-400" />
                </div>
                <div className="space-y-4 flex-1">
                    {VOCAB_PAIRS.map(item => {
                        const isMatched = Object.values(vocabMatches).includes(item.id);
                        return (
                            <button
                                key={`es-${item.id}`}
                                onClick={() => {
                                    const nextEn = VOCAB_PAIRS.find(p => !vocabMatches[p.id]);
                                    if (nextEn) handleVocabMatch(nextEn.id, item.id);
                                }}
                                disabled={isMatched}
                                className={`w-full p-5 rounded-2xl font-medium border-2 transition-all text-left relative overflow-hidden
                  ${isMatched
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-md'
                                        : 'bg-white border-transparent shadow-sm hover:border-indigo-300 hover:shadow-lg'
                                    }`}
                            >
                                {item.es}
                                {isMatched && <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500" />}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );

    const renderCultural = () => {
        const currentScenario = CULTURAL_SCENARIOS[indexes.cultural];
        return (
            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white animate-slideUp">
                <div className="flex items-center gap-3 mb-8 text-indigo-600 font-bold uppercase text-xs tracking-[0.2em]">
                    <MessageSquare size={16} /> Module 2.2: Adaptation ({indexes.cultural + 1}/{CULTURAL_SCENARIOS.length})
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 mb-8 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
                    <h4 className="font-bold text-indigo-900 mb-2 uppercase tracking-wide text-xs opacity-70">Source Audio Transcript</h4>
                    <p className="text-xl md:text-2xl text-indigo-900 italic leading-relaxed">"{currentScenario.text}"</p>
                </div>

                <div className="mb-6 relative">
                    <textarea
                        value={culturalInput}
                        onChange={(e) => setCulturalInput(e.target.value)}
                        disabled={culturalFeedback !== null}
                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl text-lg focus:bg-white focus:border-indigo-500 focus:ring-0 focus:outline-none transition-all shadow-inner resize-none text-slate-700 placeholder:text-slate-400"
                        placeholder="Type your Spanish interpretation here..."
                        rows={3}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-bold pointer-events-none">AI-POWERED</div>
                </div>

                {!culturalFeedback ? (
                    <button
                        onClick={analyzeCulturalInput}
                        disabled={!culturalInput.trim() || isAnalyzingCultural}
                        className={`w-full py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-lg
            ${!culturalInput.trim()
                                ? 'bg-slate-100 text-slate-300'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.01]'
                            }
          `}
                    >
                        {isAnalyzingCultural ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-yellow-300" />}
                        {isAnalyzingCultural ? "Analyzing Nuance..." : "Analyze Interpretation"}
                    </button>
                ) : (
                    <div className="animate-fadeIn">
                        <div className={`p-6 rounded-3xl border mb-6 flex gap-4 ${culturalFeedback.score > 70 ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-amber-50 border-amber-100 text-amber-900'}`}>
                            <div className="shrink-0 mt-1">
                                {culturalFeedback.score > 70 ? <CheckCircle size={28} className="text-emerald-500" /> : <AlertCircle size={28} className="text-amber-500" />}
                            </div>
                            <div>
                                <div className="font-bold text-xl mb-1">Quality Score: {culturalFeedback.score}/100</div>
                                <p className="text-sm font-medium leading-relaxed opacity-90">{culturalFeedback.text}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCulturalNext}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all hover:gap-4"
                        >
                            Continue to Ethics <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        )
    };

    const renderEthics = () => {
        const currentDilemma = ETHICS_CASES[indexes.ethics];
        return (
            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white animate-slideUp">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3 text-indigo-600 font-bold uppercase text-xs tracking-[0.2em]">
                        <Shield size={16} /> Module 3: Ethics ({indexes.ethics + 1}/{ETHICS_CASES.length})
                    </div>
                </div>

                <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100/50 mb-8 relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={64} /></div>
                    <h4 className="font-bold text-amber-900/60 mb-2 uppercase text-xs tracking-wider">Scenario</h4>
                    <p className="text-lg text-amber-900 font-medium leading-relaxed">
                        {currentDilemma.scenario}
                    </p>
                </div>

                <div className="space-y-4">
                    {currentDilemma.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleEthicsSubmit(opt)}
                            disabled={ethicsChoice !== null}
                            className={`w-full text-left p-6 border rounded-2xl transition-all group relative overflow-hidden
               ${ethicsChoice === opt.id
                                    ? opt.score > 70
                                        ? 'bg-emerald-50 border-emerald-500 shadow-md'
                                        : 'bg-red-50 border-red-500 shadow-md'
                                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 hover:shadow-lg'
                                }
               ${ethicsChoice !== null && ethicsChoice !== opt.id ? 'opacity-50' : ''}
             `}
                        >
                            <div className="flex gap-4">
                                <span className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-colors ${ethicsChoice === opt.id ? 'bg-white text-slate-800' : 'bg-slate-100 text-indigo-300 group-hover:text-indigo-600'}`}>
                                    {opt.id}
                                </span>
                                <div>
                                    <span className="font-medium text-slate-700 block mb-1">{opt.text}</span>
                                    {ethicsChoice === opt.id && (
                                        <div className="mt-3 text-sm font-medium animate-fadeIn pt-3 border-t border-black/10">
                                            <span className="uppercase text-xs font-bold tracking-wider opacity-70">AI Analysis:</span> <br />
                                            {ethicsResult}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )
    };

    const renderDashboard = () => (
        <div className="animate-slideUp max-w-5xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-indigo-200/50 border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-indigo-50 to-cyan-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-8 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Metrics Blueprint</h2>
                        <p className="text-slate-500 font-medium">Candidate ID: <span className="text-indigo-600 font-mono">USR-8821X</span></p>
                    </div>
                    <div className="text-left md:text-right bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/20">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Composite Score</div>
                        <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            {Math.round((scores.voice + scores.syntax + scores.modern + scores.vocab + scores.security + scores.ethics) / 6)}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Activity size={16} /> Skill Breakdown
                        </h3>
                        <SkillBar label="Voice Control & Clarity" score={Math.min(scores.voice, 100)} />
                        <SkillBar label="Grammatical Precision" score={Math.min(scores.syntax, 100)} />
                        <SkillBar label="Cultural Adaptation" score={Math.min(scores.modern, 100)} colorClass="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <SkillBar label="Lexical Range" score={Math.min(scores.vocab, 100)} colorClass="bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <SkillBar label="Compliance (HIPAA)" score={Math.min(scores.security, 100)} colorClass="bg-gradient-to-r from-amber-400 to-orange-500" />
                        <SkillBar label="Ethical Standards" score={Math.min(scores.ethics, 100)} colorClass="bg-gradient-to-r from-amber-400 to-orange-500" />
                    </div>

                    <div className="h-full">
                        <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <Sparkles size={16} /> AI-Generated Analysis
                        </h3>

                        <div className="bg-indigo-50/50 rounded-3xl p-8 border border-indigo-100 h-fit">
                            {isGeneratingReport ? (
                                <div className="flex items-center gap-3 text-indigo-600 font-medium animate-pulse">
                                    <Loader2 className="animate-spin" /> Synthesizing final report...
                                </div>
                            ) : (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="relative">
                                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-cyan-400 rounded-full" />
                                        <p className="text-lg text-slate-700 leading-relaxed italic">
                                            "{aiReport}"
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-indigo-100">
                                        <p className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Recommended Focus</p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="bg-white px-4 py-2 rounded-xl border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">Advanced Cardiology</span>
                                            <span className="bg-white px-4 py-2 rounded-xl border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">Simultaneous Pacing</span>
                                            <span className="bg-white px-4 py-2 rounded-xl border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">Oncology Registers</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <button onClick={resetApp} className="group text-slate-400 hover:text-indigo-600 flex items-center gap-2 mx-auto transition-colors font-bold text-sm uppercase tracking-widest">
                        <RefreshCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" /> Restart Simulation
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            {/* Timer Header */}
            {stage !== 'intro' && stage !== 'dashboard' && (
                <div className="fixed top-4 right-4 z-50">
                    <GlobalTimer seconds={timeRemaining} isActive={isTimerActive} />
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 pt-8 pb-16">

                {/* Progress Stepper */}
                {stage !== 'intro' && stage !== 'dashboard' && (
                    <div className="max-w-2xl mx-auto mb-12 flex justify-between items-center px-4 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10 rounded-full"></div>
                        {['voice', 'syntax', 'vocab', 'cultural', 'ethics'].map((s, idx) => {
                            const isActive = stage === s;
                            const isPast = ['voice', 'syntax', 'vocab', 'cultural', 'ethics'].indexOf(stage) > idx;
                            return (
                                <div key={s} className={`w-4 h-4 rounded-full transition-all duration-500 border-4 border-card shadow-sm ${isActive ? 'bg-primary scale-150 ring-4 ring-primary/20' : isPast ? 'bg-primary/60' : 'bg-muted'}`} />
                            )
                        })}
                    </div>
                )}

                {/* InterpreBot - Persistent */}
                <InterpreBot emotion={botEmotion} speaking={botMessage} />

                {/* Stages */}
                <div className="transition-all duration-500 ease-in-out">
                    {stage === 'intro' && renderIntro()}
                    {stage === 'voice' && renderVoice()}
                    {stage === 'syntax' && renderSyntax()}
                    {stage === 'vocab' && renderVocab()}
                    {stage === 'cultural' && renderCultural()}
                    {stage === 'ethics' && renderEthics()}
                    {stage === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                            <div className="relative mb-8">
                                <div className="w-20 h-20 border-4 border-muted rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                                <Cpu className="absolute inset-0 m-auto text-primary animate-pulse" />
                            </div>
                            <p className="text-foreground font-bold text-lg tracking-wide animate-pulse">Synthesizing Metrics...</p>
                        </div>
                    )}
                    {stage === 'dashboard' && renderDashboard()}
                </div>

            </main>
        </div>
    );
}
