import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestSchema = z.object({
      action: z.enum(['generate-quiz', 'chat', 'get-insight', 'completion']),
      topic: z.string().max(200).optional(),
      specialty: z.string().max(100).optional(),
      messages: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1).max(5000)
      })).max(50).optional(),
      term: z.string().max(200).optional(),
    });

    const rawData = await req.json();
    const validationResult = requestSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationResult.error.errors }), 
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, topic, specialty, messages, term } = validationResult.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";
    let useJson = false;

    switch (action) {
      case 'generate-quiz':
        systemPrompt = `You are an expert medical terminology instructor specializing in ${specialty || 'general medical'} terminology for medical interpreters.`;
        userPrompt = `Generate a unique multiple-choice clinical case question about ${topic || 'the male reproductive system'} (pathology, anatomy, or diagnostic). 
        Return strictly valid JSON with this schema:
        {
          "question": "string (clinical scenario question)",
          "options": ["string", "string", "string", "string"],
          "correctIndex": integer (0-3),
          "explanation": "string (brief explanation of why correct answer is right)"
        }`;
        useJson = true;
        break;

      case 'chat':
        systemPrompt = `You are a friendly, concise medical tutor for students learning ${specialty || 'reproductive systems'} terminology for medical interpretation. 
        Keep answers educational, clear, and supportive. Focus on building interpreter confidence and competence.
        Answer in 2-3 sentences max. Keep it simple and encouraging.`;
        // For chat, we'll use the messages array
        break;

      case 'get-insight':
        systemPrompt = `You are an expert in medical etymology and terminology for medical interpreters.`;
        userPrompt = `Provide a brief insight about the medical term "${term || 'anatomy'}". Include:
        1. Etymology (origin of the term)
        2. A helpful mnemonic or memory trick
        3. Common related terms
        Keep it concise and educational (max 100 words).`;
        break;

      case 'completion':
        // Generic completion, relies on provided messages
        break;
    }

    const apiMessages = action === 'chat' && messages 
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : (action === 'completion') && messages
      ? messages
      : [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ];

    console.log(`Processing ${action} request for topic: ${topic || specialty || term || 'general'}`);

    const requestBody: Record<string, unknown> = {
      model: "google/gemini-2.5-flash",
      messages: apiMessages,
    };

    if (useJson) {
      requestBody.response_format = { type: "json_object" };
    }

    if (action === 'chat') {
      requestBody.stream = true;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    // For streaming chat responses
    if (action === 'chat') {
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // For non-streaming responses (quiz, insight, completion)
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // For JSON responses, parse and return
    if (useJson) {
      try {
        const parsed = JSON.parse(content);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch {
        console.error("Failed to parse JSON response:", content);
        return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("interactive-module-ai error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
