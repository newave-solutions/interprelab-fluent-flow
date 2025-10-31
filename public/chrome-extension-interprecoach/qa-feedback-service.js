class QAFeedbackService {
  constructor() {
    this.supabase = new SupabaseService();
    this.vertexAIEndpoint = null;
  }

  async checkPremiumStatus(interpreterEmail) {
    try {
      const { data, error } = await this.supabase.client
        .from('interpreter_profiles')
        .select('subscription_tier')
        .eq('email', interpreterEmail)
        .maybeSingle();

      if (error) throw error;

      return data && (data.subscription_tier === 'premium' || data.subscription_tier === 'enterprise');
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  }

  async getOrCreateInterpreterProfile(email, fullName, interpreterId = null) {
    try {
      let { data: profile, error } = await this.supabase.client
        .from('interpreter_profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!profile) {
        const { data: newProfile, error: insertError } = await this.supabase.client
          .from('interpreter_profiles')
          .insert({
            email,
            full_name: fullName,
            interpreter_id: interpreterId
          })
          .select()
          .maybeSingle();

        if (insertError) throw insertError;
        profile = newProfile;
      }

      return profile;
    } catch (error) {
      console.error('Error getting/creating interpreter profile:', error);
      throw error;
    }
  }

  async generateQAFeedback(sessionId, interpreterId) {
    try {
      const sessionData = await this.supabase.getSessionData(sessionId);

      const feedback = await this.analyzeSessionWithAI(sessionData);

      const { data, error } = await this.supabase.client
        .from('qa_feedback_sessions')
        .insert({
          session_id: sessionId,
          interpreter_id: interpreterId,
          overall_score: feedback.overallScore,
          feedback_data: feedback
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      await this.savePerformanceMetrics(interpreterId, sessionId, feedback);
      await this.generateCoachingPlans(interpreterId, data.id, feedback);
      await this.generateInterpreLabRecommendations(interpreterId, data.id, feedback);
      await this.updateInterpreterStats(interpreterId);

      return data;
    } catch (error) {
      console.error('Error generating QA feedback:', error);
      throw error;
    }
  }

  async analyzeSessionWithAI(sessionData) {
    const fullTranscript = sessionData.transcripts
      .map(t => t.text)
      .join(' ');

    const medicalTermsUsed = sessionData.terms.map(t => t.term_english);
    const highlights = sessionData.highlights;

    const feedback = {
      overallScore: 0,
      strengths: [],
      improvements: [],
      categories: {},
      encouragement: '',
      standardsReferences: []
    };

    const standards = await this.getStandardsReferences();

    feedback.strengths = await this.analyzeStrengths(sessionData, standards);
    feedback.improvements = await this.analyzeImprovements(sessionData, standards);
    feedback.categories = await this.analyzeCategoryPerformance(sessionData);
    feedback.overallScore = this.calculateOverallScore(feedback.categories);
    feedback.encouragement = this.generateEncouragement(feedback);

    return feedback;
  }

  async analyzeStrengths(sessionData, standards) {
    const strengths = [];

    if (sessionData.transcripts.length > 5) {
      strengths.push({
        title: 'Professional Communication Flow',
        description: 'You maintained consistent communication throughout the session, demonstrating engagement and attentiveness to both parties.',
        standardReference: standards.find(s => s.category === 'Professionalism')
      });
    }

    if (sessionData.terms.length > 3) {
      strengths.push({
        title: 'Medical Terminology Recognition',
        description: 'You effectively identified and processed multiple medical terms during the interpretation, showing strong domain knowledge.',
        standardReference: standards.find(s => s.category === 'Accuracy')
      });
    }

    const instructionHighlights = sessionData.highlights.filter(h => h.category === 'instruction');
    if (instructionHighlights.length > 0) {
      strengths.push({
        title: 'Attention to Critical Instructions',
        description: 'You demonstrated awareness of important medical instructions and treatment plans, essential for patient safety.',
        standardReference: standards.find(s => s.category === 'Completeness')
      });
    }

    if (sessionData.notes && sessionData.notes.note_text) {
      strengths.push({
        title: 'Comprehensive Documentation',
        description: 'You took detailed notes during the session, showing professional diligence and commitment to accuracy.',
        standardReference: standards.find(s => s.category === 'Professionalism')
      });
    }

    return strengths;
  }

  async analyzeImprovements(sessionData, standards) {
    const improvements = [];

    const complexTerms = ['Keppra', 'levetiracetam', 'myocardial', 'cerebrovascular'];
    const sessionText = sessionData.transcripts.map(t => t.text.toLowerCase()).join(' ');

    const hasComplexTerms = complexTerms.some(term =>
      sessionText.includes(term.toLowerCase())
    );

    if (hasComplexTerms || sessionData.terms.length > 5) {
      improvements.push({
        title: 'Terminology Precision',
        description: 'Some medication names or complex medical terms required clarification. Building a stronger medical vocabulary will increase interpretation confidence.',
        coachingSteps: [
          'Create a personal glossary of common medication names with pronunciation guides',
          'Practice with InterpreBot\'s targeted pronunciation drills',
          'Review 10 new medical terms daily using flashcards',
          'Record yourself saying challenging terms and compare to native speakers'
        ],
        standardReference: standards.find(s => s.category === 'Accuracy')
      });
    }

    if (sessionData.transcripts.length > 20) {
      improvements.push({
        title: 'Accuracy and Completeness',
        description: 'In longer sessions, ensure every phrase is interpreted verbatim. Paraphrasing can lead to information loss.',
        coachingSteps: [
          'Practice consecutive interpreting drills with InterpreBot',
          'Develop note-taking skills for complex information retention',
          'Focus on interpreting complete sentences before moving to the next',
          'Request speakers to pause after 2-3 sentences for accuracy'
        ],
        standardReference: standards.find(s => s.category === 'Completeness')
      });
    }

    const symptomHighlights = sessionData.highlights.filter(h => h.category === 'symptom');
    const medicationHighlights = sessionData.highlights.filter(h => h.category === 'medication');

    if (symptomHighlights.length > 2 && medicationHighlights.length > 2) {
      improvements.push({
        title: 'Managing Complex Medical Discussions',
        description: 'When multiple symptoms and medications are discussed, use clarification strategies to prevent confusion.',
        coachingSteps: [
          'Practice summarization techniques for complex medical scenarios',
          'Learn to identify and flag potential confusion points proactively',
          'Develop cultural awareness of medication administration practices',
          'Use InterpreBot\'s mock pharmacy scenarios for practice'
        ],
        standardReference: standards.find(s => s.standard_code === 'Standard 1')
      });
    }

    return improvements;
  }

  async analyzeCategoryPerformance(sessionData) {
    const categories = {
      terminology: 0,
      accuracy: 0,
      professionalism: 0,
      clarity: 0,
      ethics: 0,
      cultural_competence: 0,
      managing_flow: 0
    };

    categories.terminology = Math.min(100, (sessionData.terms.length / 5) * 100);

    categories.accuracy = sessionData.transcripts.length > 10 ? 85 : 75;

    categories.professionalism = sessionData.notes ? 90 : 80;

    categories.clarity = 85;

    categories.ethics = 95;

    categories.cultural_competence = 80;

    categories.managing_flow = sessionData.highlights.length > 5 ? 88 : 82;

    return categories;
  }

  calculateOverallScore(categories) {
    const scores = Object.values(categories);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(average);
  }

  generateEncouragement(feedback) {
    const score = feedback.overallScore;

    let encouragement = '';

    if (score >= 90) {
      encouragement = 'Your overall performance demonstrates exceptional interpreting skills. You consistently display professionalism, accuracy, and strong medical terminology knowledge. Continue this excellent work and consider mentoring other interpreters. Your dedication to the profession is evident, and you serve as a model for best practices in medical interpretation.';
    } else if (score >= 80) {
      encouragement = 'Your performance shows a solid grasp of medical interpreting fundamentals. You demonstrate professional attitude, good communication flow management, and initiative in seeking clarification. By focusing on the identified improvement areas, particularly terminology precision and ensuring completeness, you will enhance your skills significantly. Keep practicing, and you\'ll continue to grow as a skilled medical interpreter.';
    } else if (score >= 70) {
      encouragement = 'You\'re making good progress in your interpreting journey. Your willingness to learn and adapt is clear. Focus on building your medical vocabulary and practicing consecutive interpreting techniques. The areas identified for improvement are common challenges that all interpreters face. With dedicated practice using InterpreLab modules and real-world experience, you\'ll see substantial improvement. Your potential is great!';
    } else {
      encouragement = 'Every interpreter starts somewhere, and recognizing areas for growth is the first step to improvement. Use the coaching plans provided to build your skills systematically. InterpreLab offers targeted modules that address your specific needs. Practice regularly, seek feedback, and don\'t hesitate to ask for clarification during sessions. With commitment and the right resources, you can develop into a confident, skilled medical interpreter.';
    }

    return encouragement;
  }

  async getStandardsReferences() {
    try {
      const { data, error } = await this.supabase.client
        .from('standards_references')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching standards references:', error);
      return [];
    }
  }

  async savePerformanceMetrics(interpreterId, sessionId, feedback) {
    try {
      const metricsToInsert = Object.entries(feedback.categories).map(([category, score]) => {
        const categoryImprovement = feedback.improvements.find(imp =>
          imp.title.toLowerCase().includes(category.replace('_', ' '))
        );

        const categoryStrength = feedback.strengths.find(str =>
          str.title.toLowerCase().includes(category.replace('_', ' '))
        );

        return {
          interpreter_id: interpreterId,
          session_id: sessionId,
          category,
          score,
          strengths: categoryStrength ? [categoryStrength.title] : [],
          improvements: categoryImprovement ? [categoryImprovement.title] : []
        };
      });

      const { error } = await this.supabase.client
        .from('performance_metrics')
        .insert(metricsToInsert);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving performance metrics:', error);
      throw error;
    }
  }

  async generateCoachingPlans(interpreterId, feedbackSessionId, feedback) {
    try {
      const coachingPlans = feedback.improvements.map(improvement => ({
        interpreter_id: interpreterId,
        feedback_session_id: feedbackSessionId,
        area: improvement.title,
        coaching_steps: improvement.coachingSteps || [],
        resources: ['InterpreLab Modules', 'InterpreBot Practice', 'Medical Terminology Glossary']
      }));

      const { error } = await this.supabase.client
        .from('coaching_plans')
        .insert(coachingPlans);

      if (error) throw error;
    } catch (error) {
      console.error('Error generating coaching plans:', error);
      throw error;
    }
  }

  async generateInterpreLabRecommendations(interpreterId, feedbackSessionId, feedback) {
    try {
      const recommendations = [];

      feedback.improvements.forEach((improvement, index) => {
        let recommendedLab = '';
        let priority = 'medium';

        if (improvement.title.toLowerCase().includes('terminology')) {
          recommendedLab = 'Medical Terminology Mastery';
          priority = 'high';
        } else if (improvement.title.toLowerCase().includes('accuracy')) {
          recommendedLab = 'Consecutive Interpreting Fundamentals';
          priority = 'high';
        } else if (improvement.title.toLowerCase().includes('managing')) {
          recommendedLab = 'Managing Complex Medical Scenarios';
          priority = 'medium';
        } else if (improvement.title.toLowerCase().includes('ethics')) {
          recommendedLab = 'Ethics and Standards of Practice';
          priority = 'low';
        } else {
          recommendedLab = 'Advanced Interpretation Techniques';
          priority = 'medium';
        }

        recommendations.push({
          interpreter_id: interpreterId,
          feedback_session_id: feedbackSessionId,
          area_of_opportunity: improvement.title,
          recommended_lab: recommendedLab,
          priority
        });
      });

      if (recommendations.length > 0) {
        const { error } = await this.supabase.client
          .from('interprelab_recommendations')
          .insert(recommendations);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error generating InterpreLab recommendations:', error);
      throw error;
    }
  }

  async updateInterpreterStats(interpreterId) {
    try {
      const { data: profile } = await this.supabase.client
        .from('interpreter_profiles')
        .select('total_sessions')
        .eq('id', interpreterId)
        .maybeSingle();

      const { data: metrics } = await this.supabase.client
        .from('performance_metrics')
        .select('score')
        .eq('interpreter_id', interpreterId);

      const avgScore = metrics && metrics.length > 0
        ? Math.round(metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length)
        : 0;

      const { error } = await this.supabase.client
        .from('interpreter_profiles')
        .update({
          total_sessions: (profile?.total_sessions || 0) + 1,
          overall_performance_score: avgScore
        })
        .eq('id', interpreterId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating interpreter stats:', error);
      throw error;
    }
  }

  async getFeedbackForSession(sessionId) {
    try {
      const { data, error } = await this.supabase.client
        .from('qa_feedback_sessions')
        .select(`
          *,
          interpreter_profiles (full_name, email, overall_performance_score, total_sessions),
          interpreter_sessions (session_start, session_end)
        `)
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  }

  async getInterpreLabRecommendations(feedbackSessionId) {
    try {
      const { data, error } = await this.supabase.client
        .from('interprelab_recommendations')
        .select('*')
        .eq('feedback_session_id', feedbackSessionId)
        .order('priority', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }
}
