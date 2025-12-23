import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, BookMarked, Volume2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GlossaryTermItem, GlossaryTerm } from './GlossaryTermItem';
import { supabase } from '@/integrations/supabase/client';

interface TermResult {
  english: string;
  translation: string;
  pronunciation: string;
  definition: string;
  context?: string;
  notes?: string;
  relatedTerms?: string[];
  imageUrl?: string;
}

const STORAGE_KEY = 'interprestudy_glossary';

export const TerminologyLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<TermResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setGlossaryTerms(JSON.parse(stored));
      } catch {
        // Use empty array if parsing fails
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('terminology-lookup', {
        body: { term: searchTerm.trim(), targetLanguage: 'Spanish' }
      });

      if (error) throw error;

      setResult({
        english: data.english || searchTerm,
        translation: data.translation || '',
        pronunciation: data.pronunciation || '',
        definition: data.definition || '',
        context: data.context,
        notes: data.notes,
        relatedTerms: data.relatedTerms,
        imageUrl: undefined,
      });
    } catch (error) {
      console.error('Terminology lookup error:', error);
      toast({
        title: 'Error',
        description: 'Failed to look up term. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToGlossary = () => {
    if (!result) return;

    const newTerm: GlossaryTerm = {
      id: crypto.randomUUID(),
      term: result.english,
      definition: result.definition,
      pronunciation: result.pronunciation,
      translation: result.translation,
      category: 'General',
      createdAt: new Date().toISOString(),
    };

    const updated = [newTerm, ...glossaryTerms];
    setGlossaryTerms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: 'Success',
      description: 'Term added to your glossary.',
    });
  };

  const deleteTerm = useCallback((termId: string) => {
    const updated = glossaryTerms.filter((t) => t.id !== termId);
    setGlossaryTerms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: 'Success',
      description: 'Term deleted from glossary.',
    });
  }, [glossaryTerms, toast]);

  const playPronunciation = useCallback((text: string, id: string = 'main') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      setPlayingId(id);
      utterance.onend = () => setPlayingId((current) => (current === id ? null : current));
      utterance.onerror = () => setPlayingId((current) => (current === id ? null : current));

      speechSynthesis.speak(utterance);
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            Terminology Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter term in English or target language..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="Search terms"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground mt-2">Looking up term with AI...</p>
            </div>
          )}

          {result && !isLoading && (
            <Card className="glass border-primary/20 animate-fade-in">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold">{result.english}</h3>
                      <Badge variant="outline">English</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-primary">{result.translation}</h3>
                      <Badge>Spanish</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddToGlossary}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Glossary
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-mono text-lg">{result.pronunciation}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playPronunciation(result.english, 'main')}
                    aria-label="Play pronunciation"
                    className={playingId === 'main' ? 'text-primary animate-pulse' : ''}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm font-semibold mb-2">Definition:</p>
                  <p className="text-sm text-muted-foreground">{result.definition}</p>
                </div>

                {result.imageUrl && (
                  <div className="pt-4 border-t border-border/50">
                    <img
                      src={result.imageUrl}
                      alt={result.english}
                      className="rounded-lg max-w-full h-auto"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Custom Glossary Section */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-primary" />
            Your Custom Glossary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {glossaryTerms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No terms saved yet. Start searching and add terms to build your glossary!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {glossaryTerms.map((term) => (
                <GlossaryTermItem
                  key={term.id}
                  term={term}
                  isPlaying={playingId === term.id}
                  onPlay={playPronunciation}
                  onDelete={deleteTerm}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};