import { Badge } from '@/types/learning-path';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { badgeRarityColors } from '@/lib/design-tokens';
import { CheckCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badge: Badge;
  progress?: number; // 0-100 for badges not yet earned
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export function BadgeDisplay({ badge, progress = 0, size = 'md', showProgress = false }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl',
  };

  const rarity = 'common'; // Default, could be passed as prop for PathBadges
  const rarityColor = badgeRarityColors[rarity];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full transition-all duration-300',
          sizeClasses[size],
          badge.earned
            ? 'bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary shadow-lg'
            : 'bg-muted border-2 border-border opacity-60 grayscale'
        )}
        style={
          badge.earned
            ? {
                boxShadow: `0 4px 20px ${rarityColor.glow}`,
              }
            : undefined
        }
      >
        {badge.earned ? (
          <>
            <span className="text-center">{badge.icon}</span>
            <div className="absolute -top-1 -right-1 bg-success rounded-full p-1">
              <CheckCircle className="w-4 h-4 text-success-foreground" />
            </div>
          </>
        ) : (
          <>
            <span className="text-center opacity-40">{badge.icon}</span>
            <div className="absolute -top-1 -right-1 bg-muted rounded-full p-1">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          </>
        )}
      </div>

      <div className="text-center max-w-[120px]">
        <p
          className={cn(
            'font-semibold text-sm',
            badge.earned ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {badge.name}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>

        {!badge.earned && showProgress && progress > 0 && (
          <div className="mt-2 space-y-1">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
          </div>
        )}

        {badge.earned && badge.earnedAt && (
          <p className="text-xs text-muted-foreground mt-1">
            Earned {new Date(badge.earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}

interface BadgeGridProps {
  badges: Badge[];
  title?: string;
  showProgress?: boolean;
}

export function BadgeGrid({ badges, title, showProgress = false }: BadgeGridProps) {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title || 'Badges'}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {earnedCount} / {badges.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {badges.map((badge) => (
            <BadgeDisplay key={badge.id} badge={badge} showProgress={showProgress} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface BadgeShowcaseProps {
  badges: Badge[];
  limit?: number;
}

export function BadgeShowcase({ badges, limit = 5 }: BadgeShowcaseProps) {
  const earnedBadges = badges.filter((b) => b.earned).slice(0, limit);

  if (earnedBadges.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No badges earned yet. Keep learning to earn your first badge!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {earnedBadges.map((badge) => (
        <BadgeDisplay key={badge.id} badge={badge} size="sm" />
      ))}
    </div>
  );
}
