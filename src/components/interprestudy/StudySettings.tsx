import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const StudySettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [settings, setSettings] = useState({
    difficulty: 'intermediate',
    specialty: 'medical',
    targetLanguage: 'spanish',
    providerAccent: 'neutral',
    providerGender: 'any',
    responseTime: '8',
    preferredVocabulary: '',
    autoSave: true,
    audioFeedback: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setInitialLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('study_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
            // If error is PGRST116, it means no rows returned, which is fine (defaults used)
            if (error.code !== 'PGRST116') {
                console.error('Error fetching study settings:', error);
                toast({
                  title: "Error",
                  description: "Failed to load settings. Please try again.",
                  variant: "destructive",
                });
            }
        }

        if (data) {
          setSettings({
            difficulty: data.difficulty,
            specialty: data.specialty,
            targetLanguage: data.target_language,
            providerAccent: data.provider_accent,
            providerGender: data.provider_gender,
            responseTime: data.response_time.toString(),
            preferredVocabulary: data.preferred_vocabulary,
            autoSave: data.auto_save,
            audioFeedback: data.audio_feedback,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save settings.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('study_settings')
        .upsert({
          user_id: user.id,
          difficulty: settings.difficulty,
          specialty: settings.specialty,
          target_language: settings.targetLanguage,
          provider_accent: settings.providerAccent,
          provider_gender: settings.providerGender,
          response_time: parseInt(settings.responseTime) || 8,
          preferred_vocabulary: settings.preferredVocabulary,
          auto_save: settings.autoSave,
          audio_feedback: settings.audioFeedback,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study preferences saved successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          Study Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Level */}
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select
              value={settings.difficulty}
              onValueChange={(value) => setSettings({ ...settings, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specialty */}
          <div className="space-y-2">
            <Label>Specialty/Field</Label>
            <Select
              value={settings.specialty}
              onValueChange={(value) => setSettings({ ...settings, specialty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social-services">Social Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Language */}
          <div className="space-y-2">
            <Label>Target Language</Label>
            <Select
              value={settings.targetLanguage}
              onValueChange={(value) => setSettings({ ...settings, targetLanguage: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="mandarin">Mandarin</SelectItem>
                <SelectItem value="arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Provider Accent */}
          <div className="space-y-2">
            <Label>Provider Accent</Label>
            <Select
              value={settings.providerAccent}
              onValueChange={(value) => setSettings({ ...settings, providerAccent: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="native">Native</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Provider Gender */}
          <div className="space-y-2">
            <Label>Provider Gender</Label>
            <Select
              value={settings.providerGender}
              onValueChange={(value) => setSettings({ ...settings, providerGender: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Response Time */}
          <div className="space-y-2">
            <Label>Max Response Time (seconds)</Label>
            <Input
              type="number"
              value={settings.responseTime}
              onChange={(e) => setSettings({ ...settings, responseTime: e.target.value })}
              min="5"
              max="15"
            />
          </div>
        </div>

        {/* Preferred Vocabulary */}
        <div className="space-y-2">
          <Label>Preferred Vocabulary to Practice</Label>
          <Input
            placeholder="Enter terms separated by commas (e.g., diagnosis, treatment, prescription)"
            value={settings.preferredVocabulary}
            onChange={(e) => setSettings({ ...settings, preferredVocabulary: e.target.value })}
          />
        </div>

        {/* Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save progress</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your study progress
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Audio feedback</Label>
              <p className="text-sm text-muted-foreground">
                Get audio confirmation for correct answers
              </p>
            </div>
            <Switch
              checked={settings.audioFeedback}
              onCheckedChange={(checked) => setSettings({ ...settings, audioFeedback: checked })}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={loading}>
          {loading ? (
             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
             <Save className="w-4 h-4 mr-2" />
          )}
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
};
