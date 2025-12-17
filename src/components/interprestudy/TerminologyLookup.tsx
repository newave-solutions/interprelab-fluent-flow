import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, BookMarked, Volume2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  pronunciation: string;
  translation: string;
  category: string;
  createdAt: string;
}

interface TermResult {
  english: string;
  translation: string;
  pronunciation: string;
  definition: string;
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

    // Simulate AI lookup for demo purposes
    setTimeout(() => {
      setResult({
        english: searchTerm,
        translation: 'Diagnóstico',
        pronunciation: '/di.aɡˈnos.ti.ko/',
        definition: 'The identification of the nature of an illness or other problem by examination of the symptoms.',
        imageUrl: undefined,
      });
      setIsLoading(false);
    }, 1000);
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

  const deleteTerm = (termId: string) => {
    const updated = glossaryTerms.filter(t => t.id !== termId);
    setGlossaryTerms(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    toast({
      title: 'Success',
      description: 'Term deleted from glossary.',
    });
  };

  const playPronunciation = (text: string, id: string = 'main') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';

      setPlayingId(id);
      utterance.onend = () => setPlayingId((current) => (current === id ? null : current));
      utterance.onerror = () => setPlayingId((current) => (current === id ? null : current));

      speechSynthesis.speak(utterance);
    }
  };

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
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground mt-2">Looking up term...</p>
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
                <Card key={term.id} className="glass border-border/30">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{term.term}</h4>
                          {term.category && (
                            <Badge variant="outline" className="text-xs">
                              {term.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{term.definition}</p>
                        {term.pronunciation && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{term.pronunciation}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => playPronunciation(term.term, term.id)}
                              aria-label={`Play pronunciation for ${term.term}`}
                              className={playingId === term.id ? 'text-primary animate-pulse' : ''}
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        {term.translation && (
                          <p className="text-sm text-primary mt-1">
                            Translation: {term.translation}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTerm(term.id)}
                        className="text-destructive hover:text-destructive"
                        aria-label={`Delete term ${term.term}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};