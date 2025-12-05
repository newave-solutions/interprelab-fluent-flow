import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionData } = await req.json();
    
    console.log('Generating interpreter feedback for session:', sessionData);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.log('LOVABLE_API_KEY not set, returning basic feedback');
      return new Response(
        JSON.stringify({ feedback: generateBasicFeedback(sessionData) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a professional medical interpreter coach providing constructive feedback based on NCIHC, CHIA, IMIA, and NBCMI standards. 

Analyze the session data and provide feedback in HTML format with the following structure:

<div class="feedback-section">
  <h3>💪 Strengths</h3>
  <ul>
    <li>List specific strengths observed</li>
  </ul>
</div>

<div class="feedback-section">
  <h3>🎯 Areas for Improvement</h3>
  <div class="improvement-item">
    <h4>Issue: [Specific issue]</h4>
    <p><strong>Standard:</strong> [Relevant NCIHC/CHIA standard]</p>
    <div class="coaching-plan">
      <strong>Coaching Plan:</strong>
      <ol>
        <li>Step 1: [Specific action]</li>
        <li>Step 2: [Specific action]</li>
        <li>Step 3: [Specific practice exercise]</li>
      </ol>
    </div>
  </div>
</div>

<div class="feedback-section encouragement">
  <h3>🌟 Encouragement</h3>
  <p>Provide positive reinforcement and motivation for continued growth.</p>
</div>

Focus on:
- Professional tone and accuracy
- Medical terminology precision
- Pacing and completeness
- Cultural competency
- Ethical adherence
- Specific, actionable coaching steps`;

    const userPrompt = `Session Analysis:
- Duration: ${Math.round(sessionData.duration / 60)} minutes
- Interactions: ${sessionData.interactionCount}
- Medical terminology used: ${sessionData.terminologyCount}
- Clarification requests: ${sessionData.clarifications}
- Potential pacing issues: ${sessionData.paceIssues}
- Potential omissions: ${sessionData.omissions}

Provide professional coaching feedback following the format specified.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      console.error('AI API error:', response.status);
      return new Response(
        JSON.stringify({ feedback: generateBasicFeedback(sessionData) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const feedback = data.choices?.[0]?.message?.content || generateBasicFeedback(sessionData);

    return new Response(
      JSON.stringify({ feedback }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating feedback:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateBasicFeedback(sessionData: any): string {
  const duration = Math.round(sessionData.duration / 60);
  
  let feedback = '<div class="feedback-section"><h3>💪 Strengths</h3><ul>';
  
  if (sessionData.clarifications > 0) {
    feedback += '<li>Demonstrated professionalism by requesting clarifications when needed</li>';
  }
  
  if (sessionData.terminologyCount > 5) {
    feedback += '<li>Good exposure to medical terminology during the session</li>';
  }
  
  if (duration > 5) {
    feedback += '<li>Maintained focus throughout an extended session</li>';
  }
  
  feedback += '</ul></div>';
  
  feedback += '<div class="feedback-section"><h3>🎯 Areas for Improvement</h3>';
  
  if (sessionData.paceIssues > 2) {
    feedback += `
      <div class="improvement-item">
        <h4>Pacing</h4>
        <p><strong>Standard:</strong> NCIHC Standard 2 - Appropriate pace, tone, and volume</p>
        <div class="coaching-plan">
          <strong>Coaching Plan:</strong>
          <ol>
            <li>Practice pausing between phrases</li>
            <li>Use breathing exercises to control pace</li>
            <li>Record and review your interpretations for pace consistency</li>
          </ol>
        </div>
      </div>
    `;
  }
  
  if (sessionData.terminologyCount < 3) {
    feedback += `
      <div class="improvement-item">
        <h4>Medical Terminology</h4>
        <p><strong>Standard:</strong> Professional competency and accuracy</p>
        <div class="coaching-plan">
          <strong>Coaching Plan:</strong>
          <ol>
            <li>Review common medical terms and their Spanish equivalents</li>
            <li>Create flashcards for frequently used terminology</li>
            <li>Practice pronunciation with InterpreStudy's terminology tools</li>
          </ol>
        </div>
      </div>
    `;
  }
  
  feedback += '</div>';
  
  feedback += `
    <div class="feedback-section encouragement">
      <h3>🌟 Encouragement</h3>
      <p>You completed a ${duration}-minute session with ${sessionData.interactionCount} interactions. This shows dedication to your professional development. Continue practicing with InterpreCoach and InterpreStudy to refine your skills. Remember, every session is an opportunity to grow as a medical interpreter. Your commitment to excellence will serve patients and providers well.</p>
    </div>
  `;
  
  return feedback;
}
