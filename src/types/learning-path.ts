/**
 * Learning Path Framework Types for Medical Interpreter Training
 * Adapted from v0-learning-hub-design for InterpreStudy integration
 */

// ============================================================================
// CORE LEARNING PATH STRUCTURES
// ============================================================================

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'core-skills' | 'specialization' | 'certification-prep' | 'continuing-education';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours: number;
  prerequisites: string[]; // Array of path IDs
  modules: LearningModule[];
  badge?: PathBadge;
  isActive: boolean;
  orderIndex: number;
}

export interface LearningModule {
  id: string;
  pathId: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  points: number;
  activities: Activity[];
  orderIndex: number;
  isLocked: boolean;
}

// ============================================================================
// ACTIVITY TYPES
// ============================================================================

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  points: number;
  data: ActivityData;
}

export type ActivityType =
  | 'reading'
  | 'vocabulary'
  | 'expandable'
  | 'video'
  | 'image-vocab'
  | 'quiz'
  | 'speaking'
  | 'writing'
  | 'open-text'
  | 'voice-recording'
  | 'flashcard'
  | 'scenario'
  | 'conversation'
  | 'body-mapper'
  | 'terminology-drill';

export type ActivityData =
  | ReadingData
  | VocabularyData
  | ExpandableData
  | VideoData
  | ImageVocabData
  | QuizData
  | SpeakingData
  | WritingData
  | OpenTextData
  | VoiceRecordingData
  | FlashcardData
  | ScenarioData
  | ConversationData
  | BodyMapperData
  | TerminologyDrillData;

// Activity-specific data structures
export interface ReadingData {
  content: string;
  estimatedTime: number;
}

export interface VocabularyData {
  items: Array<{
    term: string;
    definition: string;
    example?: string;
    audioUrl?: string;
  }>;
}

export interface ExpandableData {
  cards: Array<{
    title: string;
    summary: string;
    content: string;
  }>;
}

export interface VideoData {
  videoUrl: string;
  duration: number;
  transcript?: string;
}

export interface ImageVocabData {
  items: Array<{
    id: string;
    imageUrl: string;
    correctLabel: string;
    options: string[];
  }>;
}

export interface QuizData {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }>;
}

export interface SpeakingData {
  prompt: string;
  minDuration: number;
  targetLanguages?: string[];
}

export interface WritingData {
  prompt: string;
  minWords: number;
  placeholder?: string;
}

export interface OpenTextData {
  prompt: string;
  placeholder: string;
  minWords: number;
}

export interface VoiceRecordingData {
  prompt: string;
  minDuration: number;
}

export interface FlashcardData {
  cards: Array<{
    front: string;
    back: string;
    example?: string;
  }>;
}

export interface ScenarioData {
  scenario: string;
  roles: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

export interface ConversationData {
  scenario: string;
  responseWindow: number; // seconds
  turns: number;
}

export interface BodyMapperData {
  system: string;
  terms: string[];
}

export interface TerminologyDrillData {
  specialty: string;
  terms: Array<{
    english: string;
    spanish: string;
    context: string;
  }>;
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

export interface UserProgress {
  totalPoints: number;
  level: number;
  badges: Badge[];
  completedActivities: string[];
  streakDays: number;
  lastActivityDate?: string;
}

export interface PathProgress {
  userId: string;
  pathId: string;
  moduleProgress: ModuleProgress[];
  overallProgress: number; // 0-100
  xpEarned: number;
  badgesEarned: string[];
  startedAt: string;
  lastActivityAt: string;
  completedAt?: string;
  certificateIssued?: boolean;
}

export interface ModuleProgress {
  moduleId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'mastered';
  progress: number; // 0-100
  timeSpent: number; // in minutes
  activitiesCompleted: string[];
  lastAccessedAt: string;
}

// ============================================================================
// BADGES & ACHIEVEMENTS
// ============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: BadgeCategory;
  earned: boolean;
  earnedAt?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export type BadgeCategory =
  | 'skill'
  | 'achievement'
  | 'milestone'
  | 'specialization'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'general';

export interface PathBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'completion' | 'score' | 'speed' | 'mastery' | 'streak';
  threshold: number;
  description: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateLevel(points: number): number {
  return Math.floor(points / 50) + 1;
}

export function getPointsForNextLevel(currentPoints: number): number {
  const currentLevel = calculateLevel(currentPoints);
  return currentLevel * 50;
}

export function getProgressForNextLevel(currentPoints: number): number {
  const currentLevel = calculateLevel(currentPoints);
  const pointsForCurrentLevel = (currentLevel - 1) * 50;
  const pointsForNextLevel = currentLevel * 50;
  const pointsInCurrentLevel = currentPoints - pointsForCurrentLevel;
  const pointsNeededForLevel = pointsForNextLevel - pointsForCurrentLevel;
  return (pointsInCurrentLevel / pointsNeededForLevel) * 100;
}
