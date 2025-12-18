import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Trash2 } from 'lucide-react';

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  pronunciation: string;
  translation: string;
  category: string;
  createdAt: string;
}

interface GlossaryTermItemProps {
  term: GlossaryTerm;
  isPlaying: boolean;
  onPlay: (term: string, id: string) => void;
  onDelete: (id: string) => void;
}

export const GlossaryTermItem = React.memo(({ term, isPlaying, onPlay, onDelete }: GlossaryTermItemProps) => {
  return (
    <Card className="glass border-border/30">
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
                  onClick={() => onPlay(term.term, term.id)}
                  aria-label={`Play pronunciation for ${term.term}`}
                  className={isPlaying ? 'text-primary animate-pulse' : ''}
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
            onClick={() => onDelete(term.id)}
            className="text-destructive hover:text-destructive"
            aria-label={`Delete term ${term.term}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

GlossaryTermItem.displayName = 'GlossaryTermItem';
