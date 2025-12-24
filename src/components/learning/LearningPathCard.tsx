import { LearningPath } from '@/types/learning-path';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Award, BookOpen, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProgress } from '@/contexts/ProgressContext';

interface LearningPathCardProps {
  path: LearningPath;
  onClick?: () => void;
}

export function LearningPathCard({ path, onClick }: LearningPathCardProps) {
  const { getPathProgressPercent } = useProgress();
  const progressPercent = getPathProgressPercent(path.id);
  const isStarted = progressPercent > 0;
  const isCompleted = progressPercent >= 100;

  const difficultyColors = {
    beginner: 'bg-green-500/10 text-green-700 dark:text-green-400',
    intermediate: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    advanced: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    expert: 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  const categoryIcons = {
    'core-skills': '🎯',
    'specialization': '⚕️',
    'certification-prep': '🎓',
    'continuing-education': '📚',
  };

  return (
    <Card 
      className={cn(
        'group hover:shadow-lg transition-all duration-300 cursor-pointer',
        isCompleted && 'border-success bg-success/5',
        !path.isActive && 'opacity-60 cursor-not-allowed'
      )}
      onClick={path.isActive ? onClick : undefined}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="text-3xl">{categoryIcons[path.category]}</div>
          <Badge className={difficultyColors[path.difficulty]}>
            {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
          </Badge>
        </div>

        <CardTitle className="group-hover:text-primary transition-colors">
          {path.title}
          {path.prerequisites.length > 0 && !path.isActive && (
            <Lock className="inline-block ml-2 w-4 h-4 text-muted-foreground" />
          )}
        </CardTitle>

        <CardDescription>{path.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        {isStarted && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {Math.round(progressPercent)}%
                {isCompleted && ' ✅'}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        {/* Path Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{path.estimatedHours}h</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{path.modules.length} modules</span>
          </div>
          {path.badge && (
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>Badge available</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant={isStarted ? 'default' : 'outline'}
          disabled={!path.isActive}
        >
          {isCompleted ? (
            <>Review Modules</>
          ) : isStarted ? (
            <>Continue Learning</>
          ) : (
            <>Start Learning</>
          )}
          <ChevronRight className="ml-2 w-4 h-4" />
        </Button>

        {/* Prerequisites Warning */}
        {path.prerequisites.length > 0 && !path.isActive && (
          <p className="text-xs text-muted-foreground text-center">
            Complete required prerequisites to unlock
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface LearningPathGridProps {
  paths: LearningPath[];
  onPathClick?: (pathId: string) => void;
}

export function LearningPathGrid({ paths, onPathClick }: LearningPathGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {paths.map((path) => (
        <LearningPathCard
          key={path.id}
          path={path}
          onClick={() => onPathClick?.(path.id)}
        />
      ))}
    </div>
  );
}
