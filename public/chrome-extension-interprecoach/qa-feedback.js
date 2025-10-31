class QAFeedbackUI {
  constructor() {
    this.qaService = new QAFeedbackService();
    this.sessionId = null;
    this.interpreterId = null;
    this.feedbackData = null;

    this.elements = {
      loadingState: document.getElementById('loadingState'),
      premiumRequired: document.getElementById('premiumRequired'),
      feedbackContent: document.getElementById('feedbackContent'),
      feedbackFooter: document.getElementById('feedbackFooter'),

      sessionDate: document.getElementById('sessionDate'),
      sessionDuration: document.getElementById('sessionDuration'),
      overallScore: document.getElementById('overallScore'),

      performanceCircle: document.getElementById('performanceCircle'),
      circleScore: document.getElementById('circleScore'),
      performanceSummary: document.getElementById('performanceSummary'),
      totalSessions: document.getElementById('totalSessions'),
      avgScore: document.getElementById('avgScore'),
      improvement: document.getElementById('improvement'),

      strengthsList: document.getElementById('strengthsList'),
      improvementsList: document.getElementById('improvementsList'),
      categoriesGrid: document.getElementById('categoriesGrid'),
      recommendationsList: document.getElementById('recommendationsList'),
      encouragementText: document.getElementById('encouragementText'),

      upgradeBtn: document.getElementById('upgradeBtn'),
      closeBtn: document.getElementById('closeBtn'),
      viewLabsBtn: document.getElementById('viewLabsBtn'),
      downloadBtn: document.getElementById('downloadBtn')
    };

    this.initializeEventListeners();
    this.loadFeedback();
  }

  initializeEventListeners() {
    this.elements.upgradeBtn.addEventListener('click', () => this.handleUpgrade());
    this.elements.closeBtn.addEventListener('click', () => window.close());
    this.elements.viewLabsBtn.addEventListener('click', () => this.openInterpreLab());
    this.elements.downloadBtn.addEventListener('click', () => this.downloadReport());
  }

  async loadFeedback() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      this.sessionId = urlParams.get('sessionId');
      const interpreterEmail = urlParams.get('email') || 'demo@interprecoach.com';

      if (!this.sessionId) {
        this.showError('No session ID provided');
        return;
      }

      const interpreterProfile = await this.qaService.getOrCreateInterpreterProfile(
        interpreterEmail,
        'Demo Interpreter',
        'DEMO-001'
      );

      this.interpreterId = interpreterProfile.id;

      const isPremium = await this.qaService.checkPremiumStatus(interpreterEmail);

      if (!isPremium) {
        this.showPremiumRequired();
        return;
      }

      let feedback = await this.qaService.getFeedbackForSession(this.sessionId);

      if (!feedback) {
        feedback = await this.qaService.generateQAFeedback(this.sessionId, this.interpreterId);
        feedback = await this.qaService.getFeedbackForSession(this.sessionId);
      }

      this.feedbackData = feedback;
      this.displayFeedback();
    } catch (error) {
      console.error('Error loading feedback:', error);
      this.showError('Failed to load feedback. Please try again.');
    }
  }

  showPremiumRequired() {
    this.elements.loadingState.classList.add('hidden');
    this.elements.premiumRequired.classList.remove('hidden');
  }

  displayFeedback() {
    this.elements.loadingState.classList.add('hidden');
    this.elements.feedbackContent.classList.remove('hidden');
    this.elements.feedbackFooter.classList.remove('hidden');

    this.displaySessionInfo();
    this.displayOverallPerformance();
    this.displayStrengths();
    this.displayImprovements();
    this.displayCategoryBreakdown();
    this.displayRecommendations();
    this.displayEncouragement();
  }

  displaySessionInfo() {
    const sessionStart = new Date(this.feedbackData.interpreter_sessions.session_start);
    const sessionEnd = this.feedbackData.interpreter_sessions.session_end
      ? new Date(this.feedbackData.interpreter_sessions.session_end)
      : new Date();

    this.elements.sessionDate.textContent = sessionStart.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const durationMs = sessionEnd - sessionStart;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    this.elements.sessionDuration.textContent = `${minutes}m ${seconds}s`;

    this.elements.overallScore.textContent = `${this.feedbackData.overall_score}%`;
  }

  displayOverallPerformance() {
    const score = this.feedbackData.overall_score;
    this.elements.circleScore.textContent = score;

    const circumference = 565.48;
    const offset = circumference - (score / 100) * circumference;
    this.elements.performanceCircle.style.strokeDashoffset = offset;

    let summary = '';
    if (score >= 90) {
      summary = 'Exceptional performance! You demonstrate mastery of medical interpreting standards.';
    } else if (score >= 80) {
      summary = 'Strong performance overall. Continue refining your skills in the identified areas.';
    } else if (score >= 70) {
      summary = 'Good foundation with room for improvement. Focus on the coaching recommendations.';
    } else {
      summary = 'Building your skills. Follow the coaching plan for structured improvement.';
    }
    this.elements.performanceSummary.textContent = summary;

    const profile = this.feedbackData.interpreter_profiles;
    this.elements.totalSessions.textContent = profile.total_sessions || 0;
    this.elements.avgScore.textContent = `${Math.round(profile.overall_performance_score || 0)}%`;

    const improvement = score - (profile.overall_performance_score || score);
    this.elements.improvement.textContent = improvement >= 0
      ? `+${improvement}%`
      : `${improvement}%`;
    this.elements.improvement.style.color = improvement >= 0
      ? 'var(--color-success)'
      : 'var(--color-danger)';
  }

  displayStrengths() {
    const strengths = this.feedbackData.feedback_data.strengths || [];

    this.elements.strengthsList.innerHTML = strengths.map(strength => `
      <div class="strength-item">
        <svg class="strength-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <div class="strength-content">
          <h3>${strength.title}</h3>
          <p>${strength.description}</p>
          ${strength.standardReference ? `
            <div class="standard-ref">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              ${strength.standardReference.organization} - ${strength.standardReference.standard_code}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  displayImprovements() {
    const improvements = this.feedbackData.feedback_data.improvements || [];

    this.elements.improvementsList.innerHTML = improvements.map(improvement => `
      <div class="improvement-item">
        <div class="improvement-header">
          <svg class="improvement-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div class="improvement-title">
            <h3>${improvement.title}</h3>
            <p>${improvement.description}</p>
          </div>
        </div>
        ${improvement.coachingSteps && improvement.coachingSteps.length > 0 ? `
          <div class="coaching-plan">
            <h4>Coaching Plan:</h4>
            <ul>
              ${improvement.coachingSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        ${improvement.standardReference ? `
          <div class="standard-ref" style="margin-top: 12px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            ${improvement.standardReference.organization} - ${improvement.standardReference.standard_code}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  displayCategoryBreakdown() {
    const categories = this.feedbackData.feedback_data.categories || {};

    this.elements.categoriesGrid.innerHTML = Object.entries(categories).map(([category, score]) => `
      <div class="category-card">
        <div class="category-header">
          <span class="category-name">${category.replace('_', ' ')}</span>
          <span class="category-score">${Math.round(score)}%</span>
        </div>
        <div class="category-bar">
          <div class="category-progress" style="width: ${score}%"></div>
        </div>
        <span class="category-label">${this.getCategoryLabel(score)}</span>
      </div>
    `).join('');
  }

  getCategoryLabel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  }

  async displayRecommendations() {
    const recommendations = await this.qaService.getInterpreLabRecommendations(this.feedbackData.id);

    if (recommendations.length === 0) {
      this.elements.recommendationsList.innerHTML = '<p>No specific recommendations at this time. Keep up the great work!</p>';
      return;
    }

    this.elements.recommendationsList.innerHTML = recommendations.map(rec => `
      <div class="recommendation-card priority-${rec.priority}">
        <div class="recommendation-header">
          <div class="recommendation-info">
            <h3>${rec.recommended_lab}</h3>
            <p class="recommendation-area">Focus Area: ${rec.area_of_opportunity}</p>
          </div>
          <span class="priority-badge ${rec.priority}">${rec.priority}</span>
        </div>
        <p class="recommendation-description">
          ${this.getLabDescription(rec.recommended_lab)}
        </p>
        <div class="recommendation-actions">
          <button class="btn btn-primary btn-small" onclick="window.qaFeedbackUI.openLabModule('${rec.recommended_lab}')">
            Start Lab
          </button>
          ${rec.completed ? `
            <span style="color: var(--color-success); font-size: 13px; font-weight: 600;">
              ✓ Completed
            </span>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  getLabDescription(labName) {
    const descriptions = {
      'Medical Terminology Mastery': 'Master essential medical vocabulary with interactive pronunciation guides, flashcards, and real-world scenarios.',
      'Consecutive Interpreting Fundamentals': 'Develop note-taking skills and memory techniques for accurate consecutive interpretation.',
      'Managing Complex Medical Scenarios': 'Learn strategies for handling confusing situations, multiple speakers, and complex medical discussions.',
      'Ethics and Standards of Practice': 'Deep dive into NBCMI, CCHI, IMIA, and NCHIC standards with real-world ethical dilemmas.',
      'Advanced Interpretation Techniques': 'Refine your skills with advanced techniques for simultaneous interpretation, sight translation, and more.'
    };

    return descriptions[labName] || 'Specialized training module designed to address your specific development needs.';
  }

  displayEncouragement() {
    const encouragement = this.feedbackData.feedback_data.encouragement || '';
    this.elements.encouragementText.textContent = encouragement;
  }

  handleUpgrade() {
    alert('Upgrade to Premium feature coming soon!\n\nContact your administrator for premium access.');
  }

  openInterpreLab() {
    window.open('https://interprelab.com', '_blank');
  }

  openLabModule(labName) {
    window.open(`https://interprelab.com/labs/${encodeURIComponent(labName)}`, '_blank');
  }

  downloadReport() {
    const report = this.generateTextReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QA-Feedback-${this.sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  generateTextReport() {
    const feedback = this.feedbackData.feedback_data;
    const profile = this.feedbackData.interpreter_profiles;

    let report = `
===========================================
InterpreCoach QA Feedback Report
===========================================

Interpreter: ${profile.full_name}
Session Date: ${new Date(this.feedbackData.feedback_generated_at).toLocaleDateString()}
Overall Score: ${this.feedbackData.overall_score}%
Total Sessions: ${profile.total_sessions}

===========================================
STRENGTHS
===========================================

${feedback.strengths.map((s, i) => `
${i + 1}. ${s.title}
   ${s.description}
   ${s.standardReference ? `[${s.standardReference.organization} - ${s.standardReference.standard_code}]` : ''}
`).join('\n')}

===========================================
AREAS FOR IMPROVEMENT WITH COACHING PLAN
===========================================

${feedback.improvements.map((imp, i) => `
${i + 1}. ${imp.title}
   ${imp.description}

   Coaching Plan:
${imp.coachingSteps ? imp.coachingSteps.map(step => `   - ${step}`).join('\n') : '   No specific steps provided'}

   ${imp.standardReference ? `[${imp.standardReference.organization} - ${imp.standardReference.standard_code}]` : ''}
`).join('\n')}

===========================================
PERFORMANCE BY CATEGORY
===========================================

${Object.entries(feedback.categories).map(([cat, score]) =>
  `${cat.replace('_', ' ').toUpperCase()}: ${Math.round(score)}%`
).join('\n')}

===========================================
POSITIVE REINFORCEMENT & ENCOURAGEMENT
===========================================

${feedback.encouragement}

===========================================
Generated by InterpreCoach QA Feedback System
Standards-Based Analysis (NBCMI, CCHI, IMIA, NCHIC)
===========================================
`;

    return report;
  }

  showError(message) {
    this.elements.loadingState.classList.add('hidden');
    alert(message);
  }
}

window.qaFeedbackUI = new QAFeedbackUI();
