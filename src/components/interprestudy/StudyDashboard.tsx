import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, BookOpen, Star, TrendingUp, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StudyProgress {
  xp: number;
  streak: number;
  modulesCompleted: number;
  totalModules: number;
  badges: string[];
  recentActivity: { module: string; date: string }[];
}

interface StudyDashboardProps {
  onContinueLearning?: () => void;
}

const BADGE_ICONS: Record<string, string> = {
  'First Steps': '🎯',
  'Quiz Master': '🧠',
  'Vocabulary Pro': '📚',
  'Streak Warrior': '🔥',
  'Night Owl': '🦉',
  'Early Bird': '🐦',
};

export function StudyDashboard({ onContinueLearning }: StudyDashboardProps) {
  const [progress, setProgress] = useState<StudyProgress>({
    xp: 0,
    streak: 0,
    modulesCompleted: 0,
    totalModules: 12,
    badges: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      // Try to load from localStorage first for quick display
      const localData = localStorage.getItem('interprestudy_progress');
      if (localData) {
        setProgress(JSON.parse(localData));
      }

      // Then try to sync with Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('study_progress')
          .select('*')
          .eq('user_id', user.id);

        if (data && data.length > 0) {
          // Aggregate progress from all modules
          const totalXP = data.reduce((sum, d) => sum + (d.xp_earned || 0), 0);
          const completedModules = data.filter(d => d.is_completed).length;
          const metadata = data[0]?.metadata as Record<string, unknown> | null;
          
          const newProgress: StudyProgress = {
            xp: totalXP,
            streak: (metadata?.streak_count as number) || 0,
            modulesCompleted: completedModules,
            totalModules: 12,
            badges: (metadata?.badges_earned as string[]) || [],
            recentActivity: [],
          };
          setProgress(newProgress);
          localStorage.setItem('interprestudy_progress', JSON.stringify(newProgress));
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = (progress.modulesCompleted / progress.totalModules) * 100;
  const xpToNextLevel = 1000;
  const currentLevelXP = progress.xp % xpToNextLevel;
  const level = Math.floor(progress.xp / xpToNextLevel) + 1;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level & XP */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
            <span className="font-bold text-primary">{level}</span>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Level {level}</span>
              <span className="text-muted-foreground">{currentLevelXP}/{xpToNextLevel} XP</span>
            </div>
            <Progress value={(currentLevelXP / xpToNextLevel) * 100} className="h-2" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-lg">{progress.xp}</span>
            </div>
            <span className="text-xs text-muted-foreground">Total XP</span>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-bold text-lg">{progress.streak}</span>
            </div>
            <span className="text-xs text-muted-foreground">Day Streak</span>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-bold text-lg">{progress.modulesCompleted}</span>
            </div>
            <span className="text-xs text-muted-foreground">Modules</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              Course Progress
            </span>
            <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Badges */}
        {progress.badges.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Badges Earned</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {progress.badges.slice(0, 5).map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {BADGE_ICONS[badge] || '🏅'} {badge}
                </Badge>
              ))}
              {progress.badges.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{progress.badges.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        {onContinueLearning && (
          <Button onClick={onContinueLearning} className="w-full">
            Continue Learning
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
