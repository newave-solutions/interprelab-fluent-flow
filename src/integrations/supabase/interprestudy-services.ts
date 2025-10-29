import { supabase } from './client';
import type { Database } from '../../../integrations/supabase/types';

// Type definitions for InterpreStudy
type LearningPath = Database['public']['Tables']['learning_paths']['Row'];
type LearningPathInsert = Database['public']['Tables']['learning_paths']['Insert'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type LessonInsert = Database['public']['Tables']['lessons']['Insert'];
type LessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
type Flashcard = Database['public']['Tables']['flashcards']['Row'];
type FlashcardInsert = Database['public']['Tables']['flashcards']['Insert'];
type FlashcardReview = Database['public']['Tables']['flashcard_reviews']['Row'];
type Quiz = Database['public']['Tables']['quizzes']['Row'];
type QuizAttempt = Database['public']['Tables']['quiz_attempts']['Row'];
type StudyStreak = Database['public']['Tables']['study_streaks']['Row'];

export class LearningPathService {
  static async getLearningPaths(userId: string, category?: string, isPublic = false) {
    let query = supabase
      .from('learning_paths')
      .select('*')
      .order('created_at', { ascending: false });

    if (isPublic) {
      query = query.eq('is_public', true);
    } else {
      query = query.eq('user_id', userId);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async getLearningPath(pathId: string, userId?: string) {
    const { data, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        lessons (
          id,
          title,
          lesson_type,
          order_index,
          estimated_duration_minutes,
          difficulty_level
        )
      `)
      .eq('id', pathId)
      .single();

    return { data, error };
  }

  static async createLearningPath(learningPath: LearningPathInsert) {
    const { data, error } = await supabase
      .from('learning_paths')
      .insert(learningPath)
      .select()
      .single();

    return { data, error };
  }

  static async updateLearningPath(pathId: string, updates: Partial<LearningPathInsert>) {
    const { data, error } = await supabase
      .from('learning_paths')
      .update(updates)
      .eq('id', pathId)
      .select()
      .single();

    return { data, error };
  }

  static async deleteLearningPath(pathId: string) {
    const { error } = await supabase
      .from('learning_paths')
      .delete()
      .eq('id', pathId);

    return { error };
  }

  static async getPathProgress(pathId: string, userId: string) {
    const { data, error } = await supabase
      .rpc('calculate_learning_path_progress', {
        path_uuid: pathId,
        user_uuid: userId
      });

    return { data, error };
  }
}

export class LessonService {
  static async getLessons(learningPathId: string, userId?: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        lesson_progress (
          status,
          progress_percentage,
          score,
          completed_at
        )
      `)
      .eq('learning_path_id', learningPathId)
      .order('order_index', { ascending: true });

    return { data, error };
  }

  static async getLesson(lessonId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    return { data, error };
  }

  static async createLesson(lesson: LessonInsert) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    return { data, error };
  }

  static async updateLesson(lessonId: string, updates: Partial<LessonInsert>) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();

    return { data, error };
  }

  static async deleteLesson(lessonId: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    return { error };
  }
}

export class LessonProgressService {
  static async getLessonProgress(userId: string, lessonId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    return { data, error };
  }

  static async updateLessonProgress(
    userId: string,
    lessonId: string,
    learningPathId: string,
    progress: {
      status?: 'not_started' | 'in_progress' | 'completed' | 'skipped';
      progressPercentage?: number;
      timeSpentSeconds?: number;
      score?: number;
      notes?: string;
    }
  ) {
    const updates: any = {
      user_id: userId,
      lesson_id: lessonId,
      learning_path_id: learningPathId,
      last_accessed_at: new Date().toISOString(),
      ...progress
    };

    if (progress.status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert(updates)
      .select()
      .single();

    // Update study streak if lesson completed
    if (progress.status === 'completed') {
      await supabase.rpc('update_study_streak', { user_uuid: userId });
    }

    return { data, error };
  }

  static async getUserProgress(userId: string, learningPathId?: string) {
    let query = supabase
      .from('lesson_progress')
      .select(`
        *,
        lessons (
          title,
          learning_path_id,
          learning_paths (
            title,
            category
          )
        )
      `)
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (learningPathId) {
      query = query.eq('learning_path_id', learningPathId);
    }

    const { data, error } = await query;
    return { data, error };
  }
}

export class FlashcardService {
  static async getFlashcards(userId: string, category?: string, isPublic = false) {
    let query = supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: false });

    if (isPublic) {
      query = query.eq('is_public', true);
    } else {
      query = query.eq('user_id', userId);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async getFlashcardsForReview(userId: string, limit = 20) {
    const { data, error } = await supabase
      .rpc('get_flashcards_for_review', {
        user_uuid: userId,
        limit_count: limit
      });

    return { data, error };
  }

  static async createFlashcard(flashcard: FlashcardInsert) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcard)
      .select()
      .single();

    return { data, error };
  }

  static async createFlashcards(flashcards: FlashcardInsert[]) {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcards)
      .select();

    return { data, error };
  }

  static async updateFlashcard(flashcardId: string, updates: Partial<FlashcardInsert>) {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', flashcardId)
      .select()
      .single();

    return { data, error };
  }

  static async deleteFlashcard(flashcardId: string) {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId);

    return { error };
  }

  static async reviewFlashcard(
    userId: string,
    flashcardId: string,
    quality: number, // 0-5 rating for spaced repetition
    reviewDurationSeconds?: number
  ) {
    // Get the last review to calculate new interval
    const { data: lastReview } = await supabase
      .from('flashcard_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('flashcard_id', flashcardId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Calculate new values using SM-2 algorithm
    const { easinessFactor, interval, repetitions } = calculateSpacedRepetition(
      quality,
      lastReview?.easiness_factor || 2.5,
      lastReview?.interval_days || 1,
      lastReview?.repetitions || 0
    );

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    const { data, error } = await supabase
      .from('flashcard_reviews')
      .insert({
        user_id: userId,
        flashcard_id: flashcardId,
        quality,
        easiness_factor: easinessFactor,
        interval_days: interval,
        repetitions,
        next_review_date: nextReviewDate.toISOString().split('T')[0],
        review_duration_seconds: reviewDurationSeconds
      })
      .select()
      .single();

    return { data, error };
  }
}

export class QuizService {
  static async getQuizzes(userId: string, lessonId?: string, learningPathId?: string) {
    let query = supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }

    if (learningPathId) {
      query = query.eq('learning_path_id', learningPathId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  static async getQuiz(quizId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    return { data, error };
  }

  static async createQuiz(quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(quiz)
      .select()
      .single();

    return { data, error };
  }

  static async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: any[],
    timeSpentSeconds: number
  ) {
    // Get quiz details to calculate score
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return { data: null, error: quizError || new Error('Quiz not found') };
    }

    // Get attempt number
    const { data: previousAttempts } = await supabase
      .from('quiz_attempts')
      .select('attempt_number')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('attempt_number', { ascending: false })
      .limit(1);

    const attemptNumber = (previousAttempts?.[0]?.attempt_number || 0) + 1;

    // Calculate score and feedback
    const { score, percentage, feedback, passed } = calculateQuizScore(
      quiz.questions as any[],
      answers,
      quiz.passing_score || 70
    );

    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        attempt_number: attemptNumber,
        answers,
        score,
        percentage,
        time_taken_seconds: timeSpentSeconds,
        passed,
        feedback,
        started_at: new Date(Date.now() - timeSpentSeconds * 1000).toISOString(),
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    return { data, error };
  }

  static async getQuizAttempts(userId: string, quizId: string) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .order('attempt_number', { ascending: false });

    return { data, error };
  }
}

export class StudyStreakService {
  static async getStudyStreak(userId: string) {
    const { data, error } = await supabase
      .from('study_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data, error };
  }

  static async updateStudyStreak(userId: string) {
    const { data, error } = await supabase
      .rpc('update_study_streak', { user_uuid: userId });

    return { data, error };
  }
}

export class AIContentService {
  static async generateContent(
    userId: string,
    contentType: 'learning_path' | 'lesson' | 'flashcards' | 'quiz' | 'explanation',
    prompt: string,
    parameters: any = {}
  ) {
    const { data, error } = await supabase.functions.invoke('generate-study-content', {
      body: {
        userId,
        contentType,
        prompt,
        parameters
      }
    });

    return { data, error };
  }

  static async getAIRequests(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('ai_content_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }

  static async getAIRequest(requestId: string) {
    const { data, error } = await supabase
      .from('ai_content_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    return { data, error };
  }
}

// Helper functions

function calculateSpacedRepetition(
  quality: number,
  easinessFactor: number,
  interval: number,
  repetitions: number
) {
  let newEasinessFactor = easinessFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easinessFactor);
    }
    newRepetitions = repetitions + 1;
  } else {
    // Incorrect response
    newRepetitions = 0;
    newInterval = 1;
  }

  // Update easiness factor
  newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEasinessFactor < 1.3) {
    newEasinessFactor = 1.3;
  }

  return {
    easinessFactor: Math.round(newEasinessFactor * 100) / 100,
    interval: newInterval,
    repetitions: newRepetitions
  };
}

function calculateQuizScore(questions: any[], answers: any[], passingScore: number) {
  let correctAnswers = 0;
  const feedback: any[] = [];

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correct_answer;

    if (isCorrect) {
      correctAnswers++;
    }

    feedback.push({
      questionIndex: index,
      question: question.question,
      userAnswer,
      correctAnswer: question.correct_answer,
      isCorrect,
      explanation: question.explanation || '',
      points: isCorrect ? (question.points || 1) : 0
    });
  });

  const totalQuestions = questions.length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const score = correctAnswers;
  const passed = percentage >= passingScore;

  return {
    score,
    percentage: Math.round(percentage * 100) / 100,
    feedback,
    passed
  };
}
