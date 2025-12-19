import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, BookMarked, Volume2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import GlossaryTermCard from './GlossaryTermCard';
import { GlossaryTerm } from '@/lib/types';

interface TermResult {
  english: string;
  translation: string;
  pronunciation: string;
  definition: string;
  imageUrl?: string;
}

export const TerminologyLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<TermResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadGlossaryTerms = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setGlossaryTerms(data as GlossaryTerm[]);
      }
    } catch (error) {
      console.error('Error loading glossary terms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load glossary terms.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadGlossaryTerms();
    }
  }, [user]);

  // Clean up speech synthesis on unmount
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

    try {
      // First, try to find the term in the database (public or user's own)
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .or(`term.ilike.%${searchTerm}%,translation.ilike.%${searchTerm}%`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const term = data[0];
        setResult({
          english: term.term,
          translation: term.translation || '',
          pronunciation: term.pronunciation || '',
          definition: term.definition || '',
          imageUrl: term.image_url || undefined,
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error('Error searching database:', err);
    }

    // If not found in DB, simulate AI lookup (as a fallback/demo)
    setTimeout(() => {
      setResult({
        english: searchTerm,
        translation: 'Diagnóstico', // This is just a placeholder simulation
        pronunciation: '/di.aɡˈnos.ti.ko/',
        definition: 'The identification of the nature of an illness or other problem by examination of the symptoms.',
        imageUrl: undefined,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleAddToGlossary = async () => {
    if (!result || !user?.id) return;

    const newTerm = {
      user_id: user.id,
      term: result.english,
      translation: result.translation,
      definition: result.definition,
      pronunciation: result.pronunciation,
      source_language: 'English',
      target_language: 'Spanish', // In a real app, this would be dynamic
      image_url: result.imageUrl,
      is_public: false,
    };

    const { error } = await supabase.from('glossary_terms').insert([newTerm]);

    if (error) {
      console.error('Error adding term:', error);
      toast({
        title: 'Error',
        description: 'Failed to add term to glossary.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Term added to glossary successfully.',
      });
      loadGlossaryTerms();
    }
  };

  const deleteTerm = useCallback(async (termId: string) => {
    try {
      const { error } = await supabase
        .from('glossary_terms')
        .delete()
        .eq('id', termId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Term deleted from glossary.',
      });
      loadGlossaryTerms();
    } catch (error) {
      console.error('Error deleting term:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete term.',
        variant: 'destructive',
      });
    }
  }, [loadGlossaryTerms, toast]);

  const playPronunciation = useCallback((text: string, id: string = 'main') => {
    if ('speechSynthesis' in window) {
      // Cancel any currently playing speech
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playPronunciation(result.english, 'main')}
                        aria-label="Play pronunciation"
                        className={playingId === 'main' ? 'text-primary animate-pulse' : ''}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Play pronunciation</p>
                    </TooltipContent>
                  </Tooltip>
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
                <GlossaryTermCard
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
