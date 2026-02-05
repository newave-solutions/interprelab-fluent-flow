import React, { useState, useEffect } from 'react';
import { Book, Check, RotateCcw, ChevronRight, X, Trophy, Sparkles, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { CustomCardBuilder } from '../CustomCardBuilder';

// --- API UTILITIES ---
const callGemini = async (prompt: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('interactive-module-ai', {
      body: { action: 'completion', messages: [{ role: 'user', content: prompt }] }
    });
    if (error) throw error;
    return data.content || "No content generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Connection error. Please try again later.";
  }
};

// --- DATA ---
const VOCABULARY_DATA = [
  { id: 1, front: "Aden/o", back: "Gland / Glándula", category: "root", example: "Adenitis" },
  { id: 2, front: "Artr/o", back: "Joint / Articulación", category: "root", example: "Arthritis" },
  { id: 3, front: "Cardi/o", back: "Heart / Corazón", category: "root", example: "Bradycardia" },
  { id: 4, front: "Cito", back: "Cell / Célula", category: "root", example: "Erythrocyte" },
  { id: 5, front: "Dermat/o", back: "Skin / Piel", category: "root", example: "Dermatitis" },
  { id: 6, front: "Gastr/o", back: "Stomach / Estómago", category: "root", example: "Gastralgia" },
  { id: 7, front: "Hemat/o", back: "Blood / Sangre", category: "root", example: "Hematoma" },
  { id: 8, front: "Hepat/o", back: "Liver / Hígado", category: "root", example: "Hepatitis" },
  { id: 9, front: "Nefr/o", back: "Kidney / Riñón", category: "root", example: "Nephritis" },
  { id: 10, front: "Neur/o", back: "Nerve / Nervio", category: "root", example: "Neuralgia" },
];

const TRANSLATION_DATA = [
  { id: 101, front: "Blood pressure", back: "Presión arterial", category: "translation" },
  { id: 102, front: "Chest pain", back: "Dolor de pecho", category: "translation" },
  { id: 103, front: "Shortness of breath", back: "Falta de aire / Dificultad para respirar", category: "translation" },
  { id: 104, front: "Nausea", back: "Náusea", category: "translation" },
  { id: 105, front: "Dizziness", back: "Mareo", category: "translation" },
];

type CardType = 'vocabulary' | 'translation' | 'custom';

interface FlashcardData {
  id: number | string;
  front: string;
  back: string;
  category: string;
  example?: string;
}

export const SmartFlashcards = () => {
  const [cardType, setCardType] = useState<CardType>('vocabulary');
  const [showBuilder, setShowBuilder] = useState(false);
  const [customCards, setCustomCards] = useState<FlashcardData[]>([]);
  
  const getInitialDeck = (): FlashcardData[] => {
    switch (cardType) {
      case 'translation': return TRANSLATION_DATA;
      case 'custom': return customCards;
      default: return VOCABULARY_DATA;
    }
  };

  const [deck, setDeck] = useState<FlashcardData[]>(getInitialDeck());
  const [currentCard, setCurrentCard] = useState<FlashcardData>(deck[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [masteryCount, setMasteryCount] = useState(0);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Load custom cards from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user_flashcards');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCustomCards(parsed.map((c: any, i: number) => ({
          id: c.id || `custom_${i}`,
          front: c.front_text,
          back: c.back_text,
          category: c.category || 'custom',
        })));
      } catch {}
    }
  }, []);

  // Update deck when card type changes
  useEffect(() => {
    const newDeck = getInitialDeck();
    if (newDeck.length > 0) {
      setDeck(newDeck);
      setCurrentCard(newDeck[0]);
      setFinished(false);
      setMasteryCount(0);
      setIsFlipped(false);
      setAiInsight(null);
    }
  }, [cardType, customCards]);

  const handleKnowIt = () => {
    setIsFlipped(false);
    setAiInsight(null);
    setMasteryCount(prev => prev + 1);
    const newDeck = deck.filter(c => c.id !== currentCard.id);
    if (newDeck.length === 0) {
      setFinished(true);
    } else {
      setDeck(newDeck);
      setCurrentCard(newDeck[0]);
    }
  };

  const handleNeedPractice = () => {
    setIsFlipped(false);
    setAiInsight(null);
    const newDeck = deck.filter(c => c.id !== currentCard.id);
    newDeck.push(currentCard);
    setDeck(newDeck);
    setCurrentCard(newDeck[0]);
  };

  const fetchAIInsight = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingAi(true);
    const prompt = `For the term "${currentCard.front}" (meaning: ${currentCard.back}):
1. Provide a 1-sentence etymology or context.
2. Create a short, memorable mnemonic.
Keep it concise.`;
    const result = await callGemini(prompt);
    setAiInsight(result);
    setLoadingAi(false);
  };

  const handleCardCreated = (card: any) => {
    const newCard: FlashcardData = {
      id: card.id || `custom_${Date.now()}`,
      front: card.front_text,
      back: card.back_text,
      category: card.category || 'custom',
    };
    setCustomCards(prev => [...prev, newCard]);
    setShowBuilder(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
        <div className="p-6 bg-primary/10 rounded-full mb-6">
          <Trophy className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Review Complete!</h2>
        <p className="text-muted-foreground mb-8">You mastered {masteryCount} terms.</p>
        <Button onClick={() => {
          const newDeck = getInitialDeck();
          setDeck(newDeck);
          setFinished(false);
          setCurrentCard(newDeck[0]);
          setMasteryCount(0);
        }}>
          Start New Session
        </Button>
      </div>
    );
  }

  if (deck.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No cards in this deck yet.</p>
        {cardType === 'custom' && (
          <Button onClick={() => setShowBuilder(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Your First Card
          </Button>
        )}
        {showBuilder && (
          <div className="max-w-md mx-auto mt-6">
            <CustomCardBuilder onCardCreated={handleCardCreated} onClose={() => setShowBuilder(false)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4">
      {/* Controls */}
      <div className="w-full flex flex-wrap justify-between items-center gap-4 mb-6">
        <Select value={cardType} onValueChange={(v) => setCardType(v as CardType)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Card Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vocabulary">Medical Roots</SelectItem>
            <SelectItem value="translation">Translations</SelectItem>
            <SelectItem value="custom">My Custom Cards</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Cards: {deck.length}</span>
          <Button variant="outline" size="sm" onClick={() => setShowBuilder(!showBuilder)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Custom Card Builder */}
      {showBuilder && (
        <div className="w-full mb-6">
          <CustomCardBuilder onCardCreated={handleCardCreated} onClose={() => setShowBuilder(false)} />
        </div>
      )}

      {/* Card */}
      <div
        className="w-full h-80 perspective-1000 cursor-pointer group relative mb-6"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={cn(
          "relative w-full h-full transition-all duration-500 transform-style-preserve-3d",
          isFlipped && "rotate-y-180"
        )}>
          {/* Front - Light theme friendly */}
          <Card className="absolute w-full h-full rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 backface-hidden bg-card border-2 border-border">
            <div className="p-4 bg-primary/10 rounded-2xl mb-4">
              <Book className="w-12 h-12 text-primary" />
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-2">
              {cardType === 'translation' ? 'English' : 'Medical Root'}
            </span>
            <h3 className="text-4xl font-black text-foreground">{currentCard.front}</h3>
            {currentCard.example && (
              <p className="text-sm text-muted-foreground mt-4">Example: {currentCard.example}</p>
            )}
            <p className="text-primary/60 text-sm mt-6 flex items-center gap-2">
              Tap to Reveal <ChevronRight className="w-4 h-4" />
            </p>
          </Card>

          {/* Back - High contrast dark */}
          <Card className="absolute w-full h-full rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 rotate-y-180 backface-hidden bg-slate-900 border-2 border-slate-700">
            {aiInsight ? (
              <div className="w-full h-full flex flex-col text-left animate-fade-in">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                  <span className="text-yellow-300 font-bold flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4" /> AI Insights
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); setAiInsight(null); }}>
                    <X className="w-4 h-4 text-slate-400 hover:text-white" />
                  </button>
                </div>
                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
                  {aiInsight}
                </p>
              </div>
            ) : (
              <div className="text-center w-full">
                <p className="text-xs uppercase text-emerald-400 font-bold mb-2 tracking-wider">
                  {cardType === 'translation' ? 'Spanish' : 'Meaning'}
                </p>
                <p className="text-3xl font-bold text-white mb-4">{currentCard.back}</p>
                
                <button
                  onClick={fetchAIInsight}
                  className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold text-yellow-300 flex items-center gap-2 mx-auto transition-all border border-white/10"
                >
                  {loadingAi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  Magic Mnemonic
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button
          onClick={(e) => { e.stopPropagation(); handleNeedPractice(); }}
          variant="outline"
          className="py-6 rounded-xl border-2 border-destructive/20 text-destructive font-bold hover:bg-destructive/10 flex flex-col items-center gap-1 h-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Need Practice
        </Button>
        <Button
          onClick={(e) => { e.stopPropagation(); handleKnowIt(); }}
          variant="outline"
          className="py-6 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/10 flex flex-col items-center gap-1 h-auto"
        >
          <Check className="w-5 h-5" />
          I Knew It
        </Button>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};
