import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, Loader2, Play, RefreshCw, Copy, Check,
  MessageSquare, User, Stethoscope, Sparkles
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ScenarioLine {
  speaker: 'doctor' | 'patient' | 'interpreter';
  language: 'en' | 'es';
  text: string;
}

interface Scenario {
  title: string;
  setting: string;
  difficulty: string;
  lines: ScenarioLine[];
}

const SETTINGS = [
  { value: 'emergency-room', label: 'Emergency Room' },
  { value: 'primary-care', label: 'Primary Care Visit' },
  { value: 'prenatal', label: 'Prenatal Appointment' },
  { value: 'mental-health', label: 'Mental Health Session' },
  { value: 'pediatrics', label: 'Pediatric Visit' },
  { value: 'oncology', label: 'Oncology Consultation' },
  { value: 'discharge', label: 'Hospital Discharge' },
  { value: 'consent', label: 'Informed Consent' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', description: 'Simple vocabulary, short sentences' },
  { value: 'intermediate', label: 'Intermediate', description: 'Medical terminology, moderate complexity' },
  { value: 'advanced', label: 'Advanced', description: 'Complex cases, rapid exchanges' },
];

export function ScenarioGenerator() {
  const [setting, setSetting] = useState('primary-care');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [showTranslations, setShowTranslations] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateScenario = async () => {
    setIsLoading(true);
    setScenario(null);

    try {
      const { data, error } = await supabase.functions.invoke('study-chat', {
        body: {
          messages: [{
            role: 'user',
            content: `Generate a realistic medical interpretation practice scenario for a ${setting.replace('-', ' ')} at ${difficulty} level.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "title": "Brief scenario title",
  "setting": "${setting}",
  "difficulty": "${difficulty}",
  "lines": [
    {"speaker": "doctor", "language": "en", "text": "English dialogue"},
    {"speaker": "interpreter", "language": "es", "text": "Spanish interpretation"},
    {"speaker": "patient", "language": "es", "text": "Spanish response"},
    {"speaker": "interpreter", "language": "en", "text": "English interpretation"}
  ]
}

Include 8-12 dialogue exchanges. Make it realistic with appropriate medical terminology for the ${difficulty} level.`
          }],
          specialty: 'medical interpretation scenarios'
        }
      });

      if (error) throw error;

      // Handle streaming response - collect all chunks
      if (data && typeof data === 'object') {
        // If it's already parsed JSON
        setScenario(data);
      } else if (typeof data === 'string') {
        // Try to parse the string as JSON
        const cleanedData = data.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedData);
        setScenario(parsed);
      }
    } catch (error) {
      console.error('Error generating scenario:', error);
      toast.error('Failed to generate scenario. Please try again.');
      
      // Fallback scenario for demonstration
      setScenario({
        title: 'Primary Care Visit - Headache Complaint',
        setting: 'primary-care',
        difficulty: 'intermediate',
        lines: [
          { speaker: 'doctor', language: 'en', text: 'Good morning. I understand you\'ve been having headaches. Can you tell me more about them?' },
          { speaker: 'interpreter', language: 'es', text: 'Buenos días. Entiendo que ha estado teniendo dolores de cabeza. ¿Puede contarme más sobre ellos?' },
          { speaker: 'patient', language: 'es', text: 'Sí, doctor. Me duele mucho la cabeza desde hace una semana. El dolor está aquí, en la frente.' },
          { speaker: 'interpreter', language: 'en', text: 'Yes, doctor. My head has been hurting a lot for a week. The pain is here, in my forehead.' },
          { speaker: 'doctor', language: 'en', text: 'On a scale of 1 to 10, how would you rate the pain?' },
          { speaker: 'interpreter', language: 'es', text: 'En una escala del 1 al 10, ¿cómo calificaría el dolor?' },
          { speaker: 'patient', language: 'es', text: 'Cuando está muy fuerte, es como un 8. A veces siento náuseas también.' },
          { speaker: 'interpreter', language: 'en', text: 'When it\'s very strong, it\'s like an 8. Sometimes I feel nauseous too.' },
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard');
  };

  const getSpeakerIcon = (speaker: string) => {
    switch (speaker) {
      case 'doctor': return <Stethoscope className="w-4 h-4" />;
      case 'patient': return <User className="w-4 h-4" />;
      case 'interpreter': return <MessageSquare className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'doctor': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'patient': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'interpreter': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Scenario Generator</h2>
          </div>
          <p className="text-muted-foreground">
            Practice with AI-generated medical interpretation scenarios
          </p>
        </div>
      </div>

      {/* Controls */}
      <Card className="bg-card/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Setting</label>
              <Select value={setting} onValueChange={setSetting}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {SETTINGS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {DIFFICULTIES.map(d => (
                    <SelectItem key={d.value} value={d.value}>
                      <div>
                        <span>{d.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">- {d.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={generateScenario} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : scenario ? (
                  <RefreshCw className="w-4 h-4 mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {scenario ? 'New Scenario' : 'Generate Scenario'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Display */}
      {isLoading ? (
        <Card className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Generating your scenario...</p>
          </div>
        </Card>
      ) : scenario ? (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-2" variant="outline">
                  {SETTINGS.find(s => s.value === scenario.setting)?.label}
                </Badge>
                <CardTitle>{scenario.title}</CardTitle>
                <CardDescription>
                  Difficulty: {DIFFICULTIES.find(d => d.value === scenario.difficulty)?.label}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranslations(!showTranslations)}
              >
                {showTranslations ? 'Hide' : 'Show'} All Text
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {scenario.lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  getSpeakerColor(line.speaker),
                  line.speaker === 'interpreter' && !showTranslations && "opacity-50"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSpeakerIcon(line.speaker)}
                    <span className="font-medium capitalize">{line.speaker}</span>
                    <Badge variant="outline" className="text-xs">
                      {line.language.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(line.text, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className={cn(
                  "text-sm",
                  line.speaker === 'interpreter' && !showTranslations && "blur-sm select-none"
                )}>
                  {line.text}
                </p>
              </div>
            ))}

            <div className="pt-4 border-t mt-6">
              <h4 className="font-medium mb-3">Practice Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Read the doctor/patient lines and try to interpret before revealing the interpreter's version</li>
                <li>• Focus on accuracy first, then work on speed</li>
                <li>• Pay attention to register and tone appropriate to the setting</li>
                <li>• Practice sight-reading the text aloud for fluency</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="min-h-[400px] flex items-center justify-center border-dashed">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Select a medical setting and difficulty level, then generate a realistic interpretation scenario to practice.
            </p>
            <Button onClick={generateScenario}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Scenario
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
