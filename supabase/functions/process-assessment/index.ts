import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

interface AssessmentQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface AssessmentSubmission {
  userId: string
  assessmentType: string
  languageCode: string
  questions: AssessmentQuestion[]
  answers: number[]
  timeSpent: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const submission: AssessmentSubmission = await req.json()

    if (!submission.userId || !submission.assessmentType || !submission.questions || !submission.answers) {
      return new Response(
        JSON.stringify({ error: 'Missing required assessment data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate score
    let correctAnswers = 0
    const detailedResults = submission.questions.map((question, index) => {
      const userAnswer = submission.answers[index]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctAnswers++

      return {
        questionId: question.id,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        difficulty: question.difficulty
      }
    })

    const totalQuestions = submission.questions.length
    const percentage = (correctAnswers / totalQuestions) * 100
    const score = Math.round(percentage * 100) / 100

    // Determine difficulty level based on performance
    let suggestedLevel: string
    if (percentage >= 90) {
      suggestedLevel = 'expert'
    } else if (percentage >= 75) {
      suggestedLevel = 'advanced'
    } else if (percentage >= 60) {
      suggestedLevel = 'intermediate'
    } else {
      suggestedLevel = 'beginner'
    }

    // Generate feedback
    const feedback = generateFeedback(percentage, submission.assessmentType, detailedResults)

    // Save assessment result
    const { data: assessmentResult, error: saveError } = await supabaseClient
      .from('assessment_results')
      .insert({
        user_id: submission.userId,
        assessment_type: submission.assessmentType,
        language_code: submission.languageCode,
        score,
        max_score: 100,
        percentage,
        time_taken_seconds: submission.timeSpent,
        questions_total: totalQuestions,
        questions_correct: correctAnswers,
        difficulty_level: suggestedLevel,
        results: {
          detailedResults,
          averageDifficulty: calculateAverageDifficulty(submission.questions),
          timePerQuestion: submission.timeSpent / totalQuestions,
          strongAreas: identifyStrongAreas(detailedResults),
          weakAreas: identifyWeakAreas(detailedResults)
        },
        feedback
      })
      .select()
      .single()

    if (saveError) {
      throw saveError
    }

    // Check for achievements
    await checkAndAwardAchievements(supabaseClient, submission.userId, {
      assessmentType: submission.assessmentType,
      score: percentage,
      correctAnswers,
      totalQuestions
    })

    return new Response(
      JSON.stringify({
        success: true,
        result: {
          id: assessmentResult.id,
          score,
          percentage,
          correctAnswers,
          totalQuestions,
          suggestedLevel,
          feedback,
          detailedResults: detailedResults.map(r => ({
            questionId: r.questionId,
            isCorrect: r.isCorrect,
            explanation: r.explanation
          }))
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function generateFeedback(percentage: number, assessmentType: string, results: any[]): string {
  let feedback = ""

  if (percentage >= 90) {
    feedback = `Excellent work! You've demonstrated mastery in ${assessmentType}. `
  } else if (percentage >= 75) {
    feedback = `Great job! You have a strong understanding of ${assessmentType}. `
  } else if (percentage >= 60) {
    feedback = `Good effort! You have a solid foundation in ${assessmentType}, but there's room for improvement. `
  } else {
    feedback = `Keep practicing! ${assessmentType} requires more study to build your confidence. `
  }

  // Add specific recommendations based on wrong answers
  const wrongAnswers = results.filter(r => !r.isCorrect)
  if (wrongAnswers.length > 0) {
    const difficultyCounts = wrongAnswers.reduce((acc, answer) => {
      acc[answer.difficulty] = (acc[answer.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostMissedDifficulty = Object.entries(difficultyCounts).reduce((max, [diff, count]) =>
      count > max.count ? { difficulty: diff, count } : max,
      { difficulty: '', count: 0 }
    )

    if (mostMissedDifficulty.difficulty) {
      feedback += `Focus on ${mostMissedDifficulty.difficulty} level concepts for better results. `
    }
  }

  return feedback
}

function calculateAverageDifficulty(questions: AssessmentQuestion[]): string {
  const difficultyScores = { beginner: 1, intermediate: 2, advanced: 3 }
  const avgScore = questions.reduce((sum, q) => sum + difficultyScores[q.difficulty], 0) / questions.length

  if (avgScore <= 1.3) return 'beginner'
  if (avgScore <= 2.3) return 'intermediate'
  return 'advanced'
}

function identifyStrongAreas(results: any[]): string[] {
  const correctByDifficulty = results.filter(r => r.isCorrect).reduce((acc, r) => {
    acc[r.difficulty] = (acc[r.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(correctByDifficulty)
    .filter(([_, count]) => count >= 2)
    .map(([difficulty, _]) => difficulty)
}

function identifyWeakAreas(results: any[]): string[] {
  const incorrectByDifficulty = results.filter(r => !r.isCorrect).reduce((acc, r) => {
    acc[r.difficulty] = (acc[r.difficulty] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(incorrectByDifficulty)
    .filter(([_, count]) => count >= 2)
    .map(([difficulty, _]) => difficulty)
}

async function checkAndAwardAchievements(supabaseClient: any, userId: string, assessmentData: any) {
  const achievements = []

  // Perfect score achievement
  if (assessmentData.score === 100) {
    achievements.push({
      user_id: userId,
      achievement_type: 'assessment',
      achievement_name: 'Perfect Score',
      description: `Achieved 100% on ${assessmentData.assessmentType} assessment`,
      points_earned: 100
    })
  }

  // First assessment achievement
  const { data: previousAssessments } = await supabaseClient
    .from('assessment_results')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (!previousAssessments || previousAssessments.length === 0) {
    achievements.push({
      user_id: userId,
      achievement_type: 'milestone',
      achievement_name: 'First Assessment',
      description: 'Completed your first assessment',
      points_earned: 50
    })
  }

  // High performer achievement
  if (assessmentData.score >= 90) {
    achievements.push({
      user_id: userId,
      achievement_type: 'performance',
      achievement_name: 'High Performer',
      description: `Scored 90%+ on ${assessmentData.assessmentType} assessment`,
      points_earned: 75
    })
  }

  // Insert achievements
  if (achievements.length > 0) {
    await supabaseClient
      .from('user_achievements')
      .upsert(achievements, { onConflict: 'user_id,achievement_type,achievement_name' })
  }
}
