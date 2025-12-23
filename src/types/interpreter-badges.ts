/**
 * Medical Interpreter Badge System
 * Gamification and achievement tracking for InterpreStudy
 */

import { Badge, PathBadge } from './learning-path';

// ============================================================================
// INTERPRETER-SPECIFIC BADGES
// ============================================================================

export const INTERPRETER_BADGES: Badge[] = [
  // === General Milestones ===
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first learning activity',
    icon: '🎯',
    requirement: 1,
    category: 'general',
    earned: false,
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 10 learning activities',
    icon: '📚',
    requirement: 10,
    category: 'general',
    earned: false,
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Earn 100 points',
    icon: '🚀',
    requirement: 100,
    category: 'general',
    earned: false,
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Earn 500 points',
    icon: '⭐',
    requirement: 500,
    category: 'general',
    earned: false,
  },
  {
    id: 'elite-interpreter',
    name: 'Elite Interpreter',
    description: 'Earn 1000 points across all paths',
    icon: '👑',
    requirement: 1000,
    category: 'general',
    earned: false,
  },

  // === Skill-Based Badges ===
  {
    id: 'medical-terminology-foundation',
    name: 'Medical Terminology Foundation',
    description: 'Master basic medical terminology across body systems',
    icon: '🩺',
    requirement: 100,
    category: 'skill',
    earned: false,
  },
  {
    id: 'reproductive-health-specialist',
    name: 'Reproductive Health Specialist',
    description: 'Complete all reproductive health modules with 90%+ scores',
    icon: '❤️',
    requirement: 90,
    category: 'specialization',
    earned: false,
  },
  {
    id: 'dcs-master',
    name: 'DCS Schema Master',
    description: 'Master the Dynamic Conceptual Schema technique',
    icon: '🧠',
    requirement: 95,
    category: 'skill',
    earned: false,
  },
  {
    id: 'ethics-guardian',
    name: 'Ethics Guardian',
    description: 'Complete all ethics and professional standards modules',
    icon: '🛡️',
    requirement: 100,
    category: 'achievement',
    earned: false,
  },
  {
    id: 'cultural-mediator',
    name: 'Cultural Mediator',
    description: 'Excel in cultural competency scenarios',
    icon: '🌍',
    requirement: 85,
    category: 'skill',
    earned: false,
  },
  {
    id: 'sight-translation-pro',
    name: 'Sight Translation Pro',
    description: 'Master sight translation techniques',
    icon: '📄',
    requirement: 90,
    category: 'skill',
    earned: false,
  },

  // === Speed & Performance ===
  {
    id: 'rapid-response',
    name: 'Rapid Response',
    description: 'Consistently interpret within 8-second window',
    icon: '⚡',
    requirement: 8,
    category: 'achievement',
    earned: false,
  },
  {
    id: 'accuracy-champion',
    name: 'Accuracy Champion',
    description: 'Maintain 95%+ accuracy across 20 assessments',
    icon: '🎯',
    requirement: 95,
    category: 'achievement',
    earned: false,
  },

  // === Certification Prep ===
  {
    id: 'nbcmi-ready',
    name: 'NBCMI Ready',
    description: 'Complete NBCMI prerequisite course',
    icon: '📜',
    requirement: 100,
    category: 'milestone',
    earned: false,
  },
  {
    id: 'cchi-ready',
    name: 'CCHI Ready',
    description: 'Complete CCHI prerequisite course',
    icon: '🏆',
    requirement: 100,
    category: 'milestone',
    earned: false,
  },
  {
    id: 'certification-ready',
    name: 'Certification Ready',
    description: 'Complete all certification prep modules with 85%+ scores',
    icon: '🎓',
    requirement: 85,
    category: 'milestone',
    earned: false,
  },

  // === Practice & Engagement ===
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    requirement: 7,
    category: 'general',
    earned: false,
  },
  {
    id: 'marathon-learner',
    name: 'Marathon Learner',
    description: 'Maintain a 30-day learning streak',
    icon: '🏃',
    requirement: 30,
    category: 'achievement',
    earned: false,
  },
  {
    id: 'lifetime-learner',
    name: 'Lifetime Learner',
    description: 'Study for 100 consecutive days',
    icon: '💎',
    requirement: 100,
    category: 'achievement',
    earned: false,
  },

  // === Specialization Badges ===
  {
    id: 'mental-health-specialist',
    name: 'Mental Health Specialist',
    description: 'Complete mental health interpreting specialization',
    icon: '🧘',
    requirement: 100,
    category: 'specialization',
    earned: false,
  },
  {
    id: 'legal-medical-expert',
    name: 'Legal-Medical Expert',
    description: 'Master legal-medical interpretation',
    icon: '⚖️',
    requirement: 100,
    category: 'specialization',
    earned: false,
  },
  {
    id: 'pediatric-specialist',
    name: 'Pediatric Specialist',
    description: 'Complete pediatric interpreting training',
    icon: '👶',
    requirement: 100,
    category: 'specialization',
    earned: false,
  },

  // === Skill-Specific ===
  {
    id: 'vocabulary-master',
    name: 'Vocabulary Master',
    description: 'Complete 50 vocabulary exercises',
    icon: '📖',
    requirement: 50,
    category: 'reading',
    earned: false,
  },
  {
    id: 'conversation-expert',
    name: 'Conversation Expert',
    description: 'Complete 20 conversation practice sessions',
    icon: '💬',
    requirement: 20,
    category: 'speaking',
    earned: false,
  },
  {
    id: 'voice-champion',
    name: 'Voice Champion',
    description: 'Complete 15 voice recording activities',
    icon: '🎤',
    requirement: 15,
    category: 'speaking',
    earned: false,
  },
  {
    id: 'writer-extraordinaire',
    name: 'Writer Extraordinaire',
    description: 'Complete 10 writing activities',
    icon: '✍️',
    requirement: 10,
    category: 'writing',
    earned: false,
  },
];

// ============================================================================
// PATH-SPECIFIC BADGES
// ============================================================================

export const PATH_BADGES: Record<string, PathBadge> = {
  'reproductive-systems': {
    id: 'reproductive-systems-complete',
    name: 'Reproductive Health Expert',
    description: 'Mastered all reproductive system modules',
    icon: '❤️',
    category: 'specialization',
    rarity: 'rare',
    criteria: {
      type: 'completion',
      threshold: 100,
      description: 'Complete all modules in the reproductive systems path',
    },
  },
  'dcs-training': {
    id: 'dcs-training-complete',
    name: 'DCS Master Interpreter',
    description: 'Achieved mastery in Demand Control Schema',
    icon: '🧠',
    category: 'skill',
    rarity: 'epic',
    criteria: {
      type: 'mastery',
      threshold: 95,
      description: 'Score 95%+ on all DCS assessments',
    },
  },
  'ethics-professional-standards': {
    id: 'ethics-complete',
    name: 'Ethics & Standards Champion',
    description: 'Completed all ethics training',
    icon: '🛡️',
    category: 'achievement',
    rarity: 'uncommon',
    criteria: {
      type: 'completion',
      threshold: 100,
      description: 'Complete all ethics modules',
    },
  },
  'medical-terminology': {
    id: 'terminology-master',
    name: 'Terminology Master',
    description: 'Mastered medical terminology across all systems',
    icon: '🩺',
    category: 'skill',
    rarity: 'rare',
    criteria: {
      type: 'mastery',
      threshold: 90,
      description: 'Score 90%+ on all terminology assessments',
    },
  },
  'certification-prep': {
    id: 'certification-complete',
    name: 'Certification Champion',
    description: 'Ready for NBCMI/CCHI certification',
    icon: '🎓',
    category: 'milestone',
    rarity: 'epic',
    criteria: {
      type: 'completion',
      threshold: 100,
      description: 'Complete all certification prep modules with 85%+ average',
    },
  },
  'cultural-competency': {
    id: 'cultural-competency-complete',
    name: 'Cultural Competency Expert',
    description: 'Mastered cultural mediation skills',
    icon: '🌍',
    category: 'skill',
    rarity: 'rare',
    criteria: {
      type: 'mastery',
      threshold: 90,
      description: 'Excel in all cultural competency scenarios',
    },
  },
};

// ============================================================================
// BADGE CHECKING FUNCTIONS
// ============================================================================

export function checkBadgeUnlock(
  badge: Badge,
  progress: {
    totalPoints: number;
    completedActivities: string[];
    streakDays: number;
  }
): boolean {
  if (badge.earned) return false;

  const completedCount = progress.completedActivities.length;

  switch (badge.id) {
    // General milestones
    case 'first-steps':
      return completedCount >= 1;
    case 'dedicated-learner':
      return completedCount >= 10;
    case 'knowledge-seeker':
      return progress.totalPoints >= 100;
    case 'rising-star':
      return progress.totalPoints >= 500;
    case 'elite-interpreter':
      return progress.totalPoints >= 1000;

    // Streak-based
    case 'streak-warrior':
      return progress.streakDays >= 7;
    case 'marathon-learner':
      return progress.streakDays >= 30;
    case 'lifetime-learner':
      return progress.streakDays >= 100;

    // Skill-specific counts
    case 'vocabulary-master':
      return completedCount >= 50;
    case 'conversation-expert':
      return completedCount >= 20;
    case 'voice-champion':
      return completedCount >= 15;
    case 'writer-extraordinaire':
      return completedCount >= 10;

    default:
      return false;
  }
}

export function getBadgesByCategory(category: string): Badge[] {
  return INTERPRETER_BADGES.filter((badge) => badge.category === category);
}

export function getEarnedBadges(badges: Badge[]): Badge[] {
  return badges.filter((badge) => badge.earned);
}

export function getBadgeProgress(badge: Badge, currentValue: number): number {
  return Math.min((currentValue / badge.requirement) * 100, 100);
}
