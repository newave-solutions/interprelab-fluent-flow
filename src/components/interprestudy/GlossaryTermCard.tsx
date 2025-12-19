import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { GlossaryTerm } from '@/lib/types';

interface GlossaryTermCardProps {
  term: GlossaryTerm;
  isPlaying: boolean;
  onPlay: (text: string, id: string) => void;
  onDelete: (id: string) => void;
}

const GlossaryTermCard = memo(({ term, isPlaying, onPlay, onDelete }: GlossaryTermCardProps) => {
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
              {term.difficulty_level && (
                <Badge variant="secondary" className="text-xs">
                  {term.difficulty_level}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{term.definition}</p>
            {term.pronunciation && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{term.pronunciation}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPlay(term.term, term.id)}
                      aria-label={`Play pronunciation for ${term.term}`}
                      className={isPlaying ? 'text-primary animate-pulse' : ''}
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Play pronunciation</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            {term.translation && (
              <p className="text-sm text-primary mt-1">
                Translation: {term.translation}
              </p>
            )}
          </div>
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Delete term ${term.term}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete term</p>
              </TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the term "{term.term}" from your glossary.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(term.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
});

GlossaryTermCard.displayName = 'GlossaryTermCard';

export default GlossaryTermCard;
