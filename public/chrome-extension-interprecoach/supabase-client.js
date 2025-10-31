const { createClient } = supabase;

class SupabaseService {
  constructor() {
    this.client = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    this.currentSessionId = null;
  }

  async createSession() {
    try {
      const { data, error } = await this.client
        .from('interpreter_sessions')
        .insert({
          session_start: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) throw error;

      this.currentSessionId = data.id;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async endSession(encounterType = null, specialty = null) {
    if (!this.currentSessionId) return;

    try {
      const { error } = await this.client
        .from('interpreter_sessions')
        .update({
          session_end: new Date().toISOString(),
          encounter_type: encounterType,
          specialty: specialty
        })
        .eq('id', this.currentSessionId);

      if (error) throw error;

      const sessionId = this.currentSessionId;
      this.currentSessionId = null;
      return sessionId;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  async saveTranscript(text, speaker = null) {
    if (!this.currentSessionId) return;

    try {
      const { data, error } = await this.client
        .from('session_transcripts')
        .insert({
          session_id: this.currentSessionId,
          text: text,
          speaker: speaker,
          timestamp: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving transcript:', error);
      throw error;
    }
  }

  async saveMedicalTerm(termData) {
    if (!this.currentSessionId) return;

    try {
      const { data, error } = await this.client
        .from('medical_terms')
        .insert({
          session_id: this.currentSessionId,
          term_english: termData.english,
          term_spanish: termData.spanish,
          phonetic: termData.phonetic,
          definition: termData.definition,
          image_url: termData.imageUrl || null,
          detected_at: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving medical term:', error);
      throw error;
    }
  }

  async saveHighlight(category, content) {
    if (!this.currentSessionId) return;

    try {
      const { data, error } = await this.client
        .from('session_highlights')
        .insert({
          session_id: this.currentSessionId,
          category: category,
          content: content,
          timestamp: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving highlight:', error);
      throw error;
    }
  }

  async saveNote(noteText) {
    if (!this.currentSessionId) return;

    try {
      const { data: existingNote } = await this.client
        .from('interpreter_notes')
        .select('id')
        .eq('session_id', this.currentSessionId)
        .maybeSingle();

      if (existingNote) {
        const { data, error } = await this.client
          .from('interpreter_notes')
          .update({
            note_text: noteText,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingNote.id)
          .select()
          .maybeSingle();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await this.client
          .from('interpreter_notes')
          .insert({
            session_id: this.currentSessionId,
            note_text: noteText
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  async getSessionData(sessionId) {
    try {
      const [session, transcripts, terms, highlights, notes] = await Promise.all([
        this.client
          .from('interpreter_sessions')
          .select('*')
          .eq('id', sessionId)
          .maybeSingle(),
        this.client
          .from('session_transcripts')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true }),
        this.client
          .from('medical_terms')
          .select('*')
          .eq('session_id', sessionId)
          .order('detected_at', { ascending: true }),
        this.client
          .from('session_highlights')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true }),
        this.client
          .from('interpreter_notes')
          .select('*')
          .eq('session_id', sessionId)
          .maybeSingle()
      ]);

      return {
        session: session.data,
        transcripts: transcripts.data || [],
        terms: terms.data || [],
        highlights: highlights.data || [],
        notes: notes.data
      };
    } catch (error) {
      console.error('Error fetching session data:', error);
      throw error;
    }
  }
}
