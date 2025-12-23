'use client';

/**
 * Learning Progress Context
 * Manages user progress, points, badges, and achievements for InterpreStudy
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProgress, Badge } from '@/types/learning-path';
import { INTERPRETER_BADGES, checkBadgeUnlock } from '@/types/interpreter-badges';
import { getPathProgress } from '@/lib/interpreter-learning-paths';
import { toast } from 'sonner';

interface ProgressContextType {
  progress: UserProgress;
  addPoints: (points: number) => void;
  completeActivity: (activityId: string, moduleId: string, pathId: string) => void;
  isActivityCompleted: (activityId: string) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  getPathProgressPercent: (pathId: string) => number;
  incrementStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const STORAGE_KEY = 'interprelab-learning-progress';

const defaultProgress: UserProgress = {
  totalPoints: 0,
  level: 1,
  badges: INTERPRETER_BADGES.map((b) => ({ ...b, earned: false })),
  completedActivities: [],
  streakDays: 0,
  lastActivityDate: undefined,
};

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with default badges to ensure new badges are included
        const mergedBadges = INTERPRETER_BADGES.map((defaultBadge) => {
          const storedBadge = parsed.badges?.find((b: Badge) => b.id === defaultBadge.id);
          return storedBadge || { ...defaultBadge, earned: false };
        });
        setProgress({ ...defaultProgress, ...parsed, badges: mergedBadges });
      } catch {
        setProgress(defaultProgress);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isHydrated]);

  // Check and unlock badges based on current progress
  const checkBadges = useCallback((currentProgress: UserProgress) => {
    const updatedBadges = currentProgress.badges.map((badge) => {
      if (badge.earned) return badge;

      const shouldUnlock = checkBadgeUnlock(badge, {
        totalPoints: currentProgress.totalPoints,
        completedActivities: currentProgress.completedActivities,
        streakDays: currentProgress.streakDays,
      });

      if (shouldUnlock) {
        // Show toast notification
        toast.success(`🎉 Badge Earned: ${badge.name}`, {
          description: badge.description,
          duration: 5000,
        });
        return { ...badge, earned: true, earnedAt: new Date().toISOString() };
      }

      return badge;
    });

    return updatedBadges;
  }, []);

  const addPoints = useCallback(
    (points: number) => {
      setProgress((prev) => {
        const newTotalPoints = prev.totalPoints + points;
        const newLevel = Math.floor(newTotalPoints / 50) + 1;

        // Show level up notification
        if (newLevel > prev.level) {
          toast.success(`🎉 Level Up!`, {
            description: `You've reached Level ${newLevel}!`,
            duration: 5000,
          });
        }

        const updatedProgress = {
          ...prev,
          totalPoints: newTotalPoints,
          level: newLevel,
        };

        // Check for newly unlocked badges
        const updatedBadges = checkBadges(updatedProgress);

        return {
          ...updatedProgress,
          badges: updatedBadges,
        };
      });
    },
    [checkBadges]
  );

  const completeActivity = useCallback(
    (activityId: string, moduleId: string, pathId: string) => {
      setProgress((prev) => {
        // Don't re-complete activities
        if (prev.completedActivities.includes(activityId)) {
          return prev;
        }

        const updatedProgress = {
          ...prev,
          completedActivities: [...prev.completedActivities, activityId],
          lastActivityDate: new Date().toISOString(),
        };

        // Check for newly unlocked badges
        const updatedBadges = checkBadges(updatedProgress);

        // Show completion toast
        toast.success('Activity Completed! ✅', {
          description: `Keep up the great work!`,
        });

        return {
          ...updatedProgress,
          badges: updatedBadges,
        };
      });
    },
    [checkBadges]
  );

  const isActivityCompleted = useCallback(
    (activityId: string) => {
      return progress.completedActivities.includes(activityId);
    },
    [progress.completedActivities]
  );

  const isModuleCompleted = useCallback(
    (moduleId: string) => {
      // A module is completed if all its activities are completed
      // This would need access to the module definition to check
      // For now, we return false (can be enhanced)
      return false;
    },
    []
  );

  const getPathProgressPercent = useCallback(
    (pathId: string) => {
      return getPathProgress(pathId, progress.completedActivities);
    },
    [progress.completedActivities]
  );

  const incrementStreak = useCallback(() => {
    setProgress((prev) => {
      const today = new Date().toDateString();
      const lastActivity = prev.lastActivityDate ? new Date(prev.lastActivityDate).toDateString() : null;

      // Only increment if not already counted today
      if (lastActivity === today) {
        return prev;
      }

      const updatedProgress = {
        ...prev,
        streakDays: prev.streakDays + 1,
        lastActivityDate: new Date().toISOString(),
      };

      // Check for streak badges
      const updatedBadges = checkBadges(updatedProgress);

      return {
        ...updatedProgress,
        badges: updatedBadges,
      };
    });
  }, [checkBadges]);

  const unlockBadge = useCallback((badgeId: string) => {
    setProgress((prev) => ({
      ...prev,
      badges: prev.badges.map((badge) =>
        badge.id === badgeId ? { ...badge, earned: true, earnedAt: new Date().toISOString() } : badge
      ),
    }));

    // Find badge and show notification
    const badge = INTERPRETER_BADGES.find((b) => b.id === badgeId);
    if (badge) {
      toast.success(`🎉 Badge Earned: ${badge.name}`, {
        description: badge.description,
        duration: 5000,
      });
    }
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
    toast.info('Progress Reset', {
      description: 'Your learning progress has been reset.',
    });
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addPoints,
        completeActivity,
        isActivityCompleted,
        isModuleCompleted,
        getPathProgressPercent,
        incrementStreak,
        unlockBadge,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
