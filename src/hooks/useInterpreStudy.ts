import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LearningPathService,
  LessonService,
  LessonProgressService,
  FlashcardService,
  QuizService,
  StudyStreakService,
  AIContentService
} from '../integrations/supabase/interprestudy-services';

export const useInterpreStudy = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const clearError = () => setError(null);

  // Learning Paths
  const getLearningPaths = async (category?: string, isPublic = false) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await LearningPathService.getLearningPaths(user.id, category, isPublic);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch learning paths';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createLearningPath = async (pathData: {
    title: string;
    description?: string;
    category: string;
    difficulty_level: string;
    language_pair: string;
    estimated_duration_minutes?: number;
  }) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await LearningPathService.createLearningPath({
        ...pathData,
        user_id: user.id
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create learning path';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Lessons
  const getLessons = async (learningPathId: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await LessonService.getLessons(learningPathId, user?.id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch lessons';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateLessonProgress = async (
    lessonId: string,
    learningPathId: string,
    progress: {
      status?: 'not_started' | 'in_progress' | 'completed' | 'skipped';
      progressPercentage?: number;
      timeSpentSeconds?: number;
      score?: number;
      notes?: string;
    }
  ) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await LessonProgressService.updateLessonProgress(
        user.id,
        lessonId,
        learningPathId,
        progress
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update lesson progress';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Flashcards
  const getFlashcardsForReview = async (limit = 20) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await FlashcardService.getFlashcardsForReview(user.id, limit);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flashcards';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reviewFlashcard = async (
    flashcardId: string,
    quality: number,
    reviewDurationSeconds?: number
  ) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await FlashcardService.reviewFlashcard(
        user.id,
        flashcardId,
        quality,
        reviewDurationSeconds
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to review flashcard';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createFlashcards = async (flashcards: any[]) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const flashcardsWithUser = flashcards.map(card => ({
        ...card,
        user_id: user.id
      }));

      const result = await FlashcardService.createFlashcards(flashcardsWithUser);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flashcards';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Quizzes
  const submitQuizAttempt = async (
    quizId: string,
    answers: any[],
    timeSpentSeconds: number
  ) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await QuizService.submitQuizAttempt(
        user.id,
        quizId,
        answers,
        timeSpentSeconds
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Study Streak
  const getStudyStreak = async () => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const result = await StudyStreakService.getStudyStreak(user.id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch study streak';
      return { data: null, error: errorMessage };
    }
  };

  // AI Content Generation
  const generateContent = async (
    contentType: 'learning_path' | 'lesson' | 'flashcards' | 'quiz' | 'explanation',
    prompt: string,
    parameters: any = {}
  ) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    setLoading(true);
    setError(null);

    try {
      const result = await AIContentService.generateContent(
        user.id,
        contentType,
        prompt,
        parameters
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getAIRequests = async (limit = 10) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      const result = await AIContentService.getAIRequests(user.id, limit);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch AI requests';
      return { data: null, error: errorMessage };
    }
  };

  return {
    loading,
    error,
    clearError,

    // Learning Paths
    getLearningPaths,
    createLearningPath,

    // Lessons
    getLessons,
    updateLessonProgress,

    // Flashcards
    getFlashcardsForReview,
    reviewFlashcard,
    createFlashcards,

    // Quizzes
    submitQuizAttempt,

    // Study Streak
    getStudyStreak,

    // AI Content
    generateContent,
    getAIRequests,
  };
};

// Specialized hooks for specific features

export const useFlashcardReview = () => {
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [reviewQueue, setReviewQueue] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    reviewed: 0,
    correct: 0,
    incorrect: 0
  });

  const { getFlashcardsForReview, reviewFlashcard } = useInterpreStudy();

  const loadReviewQueue = async (limit = 20) => {
    const { data, error } = await getFlashcardsForReview(limit);
    if (data && !error) {
      setReviewQueue(data);
      setCurrentCard(data[0] || null);
      setReviewStats(prev => ({ ...prev, total: data.length }));
    }
    return { data, error };
  };

  const submitReview = async (quality: number, reviewDuration?: number) => {
    if (!currentCard) return { data: null, error: 'No card to review' };

    const { data, error } = await reviewFlashcard(
      currentCard.flashcard_id,
      quality,
      reviewDuration
    );

    if (!error) {
      // Update stats
      setReviewStats(prev => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        correct: quality >= 3 ? prev.correct + 1 : prev.correct,
        incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect
      }));

      // Move to next card
      const nextIndex = reviewQueue.findIndex(card => card.flashcard_id === currentCard.flashcard_id) + 1;
      setCurrentCard(reviewQueue[nextIndex] || null);
    }

    return { data, error };
  };

  const skipCard = () => {
    const nextIndex = reviewQueue.findIndex(card => card.flashcard_id === currentCard?.flashcard_id) + 1;
    setCurrentCard(reviewQueue[nextIndex] || null);
  };

  return {
    currentCard,
    reviewQueue,
    reviewStats,
    loadReviewQueue,
    submitReview,
    skipCard,
    hasMoreCards: currentCard !== null
  };
};

export const useStudySession = () => {
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    timeSpent: 0,
    lessonsCompleted: 0,
    flashcardsReviewed: 0,
    quizzesTaken: 0
  });

  const startSession = () => {
    setSessionActive(true);
    setSessionStartTime(new Date());
    setSessionStats({
      timeSpent: 0,
      lessonsCompleted: 0,
      flashcardsReviewed: 0,
      quizzesTaken: 0
    });
  };

  const endSession = () => {
    setSessionActive(false);
    const endTime = new Date();
    if (sessionStartTime) {
      const timeSpent = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000);
      setSessionStats(prev => ({ ...prev, timeSpent }));
    }
    setSessionStartTime(null);
  };

  const updateSessionStats = (type: 'lesson' | 'flashcard' | 'quiz') => {
    setSessionStats(prev => ({
      ...prev,
      lessonsCompleted: type === 'lesson' ? prev.lessonsCompleted + 1 : prev.lessonsCompleted,
      flashcardsReviewed: type === 'flashcard' ? prev.flashcardsReviewed + 1 : prev.flashcardsReviewed,
      quizzesTaken: type === 'quiz' ? prev.quizzesTaken + 1 : prev.quizzesTaken
    }));
  };

  return {
    sessionActive,
    sessionStats,
    startSession,
    endSession,
    updateSessionStats
  };
};
