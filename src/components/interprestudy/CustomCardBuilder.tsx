import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomCard {
  id?: string;
  front_text: string;
  back_text: string;
  category: string;
  tags: string[];
}

interface CustomCardBuilderProps {
  onCardCreated?: (card: CustomCard) => void;
  onClose?: () => void;
}

const CATEGORIES = [
  { value: 'vocabulary', label: 'Vocabulary' },
  { value: 'terminology', label: 'Medical Terminology' },
  { value: 'translation', label: 'Translation Pairs' },
  { value: 'ethics', label: 'Ethics & Standards' },
  { value: 'anatomy', label: 'Anatomy' },
  { value: 'custom', label: 'Custom' },
];

export function CustomCardBuilder({ onCardCreated, onClose }: CustomCardBuilderProps) {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [category, setCategory] = useState('vocabulary');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!frontText.trim() || !backText.trim()) {
      toast.error('Please fill in both front and back of the card');
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const newCard: CustomCard = {
        front_text: frontText.trim(),
        back_text: backText.trim(),
        category,
        tags,
      };

      if (user) {
        // Save to Supabase
        const { data, error } = await supabase
          .from('user_flashcards')
          .insert({
            user_id: user.id,
            front_text: newCard.front_text,
            back_text: newCard.back_text,
            category: newCard.category,
            tags: newCard.tags,
          })
          .select()
          .single();

        if (error) throw error;
        newCard.id = data.id;
      } else {
        // Save to localStorage for non-authenticated users
        const localCards = JSON.parse(localStorage.getItem('user_flashcards') || '[]');
        newCard.id = `local_${Date.now()}`;
        localCards.push(newCard);
        localStorage.setItem('user_flashcards', JSON.stringify(localCards));
      }

      toast.success('Card created successfully!');
      onCardCreated?.(newCard);
      
      // Reset form
      setFrontText('');
      setBackText('');
      setTags([]);
      setCategory('vocabulary');
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('Failed to save card. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Plus className="w-5 h-5 text-primary" />
          Create Custom Card
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Front of Card */}
        <div className="space-y-2">
          <Label htmlFor="front">Front (Question/Term)</Label>
          <Textarea
            id="front"
            placeholder="Enter the term, question, or prompt..."
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Back of Card */}
        <div className="space-y-2">
          <Label htmlFor="back">Back (Answer/Definition)</Label>
          <Textarea
            id="back"
            placeholder="Enter the answer, definition, or translation..."
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags (optional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button type="button" variant="outline" size="icon" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preview</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background rounded border text-center">
              <p className="text-xs text-muted-foreground mb-1">Front</p>
              <p className="font-medium">{frontText || 'Your term here...'}</p>
            </div>
            <div className="p-3 bg-primary/5 rounded border text-center">
              <p className="text-xs text-muted-foreground mb-1">Back</p>
              <p className="font-medium">{backText || 'Your answer here...'}</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Card
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
