class HighlightsExtractor {
  constructor() {
    this.symptomKeywords = [
      'pain', 'ache', 'hurt', 'sore', 'discomfort', 'burning', 'tingling', 'numb',
      'fever', 'chills', 'sweating', 'cough', 'wheeze', 'shortness of breath',
      'chest pain', 'headache', 'dizziness', 'nausea', 'vomiting', 'diarrhea',
      'constipation', 'fatigue', 'weakness', 'swelling', 'rash', 'itching',
      'bleeding', 'bruising', 'confusion', 'memory loss', 'vision problems',
      'hearing loss', 'difficulty swallowing', 'difficulty breathing'
    ];

    this.medicationKeywords = [
      'take', 'taking', 'prescribed', 'medication', 'medicine', 'pill', 'tablet',
      'capsule', 'injection', 'inhaler', 'drops', 'cream', 'ointment', 'patch',
      'dose', 'dosage', 'mg', 'milligrams', 'ml', 'daily', 'twice', 'three times',
      'antibiotic', 'painkiller', 'insulin', 'aspirin', 'ibuprofen'
    ];

    this.instructionKeywords = [
      'should', 'must', 'need to', 'have to', 'remember to', 'make sure',
      'avoid', "don't", 'discontinue', 'stop taking', 'increase', 'decrease',
      'with food', 'without food', 'before meals', 'after meals', 'at bedtime',
      'in the morning', 'follow up', 'come back', 'return', 'call if',
      'watch for', 'monitor'
    ];

    this.eventKeywords = [
      'started', 'began', 'happened', 'occurred', 'fell', 'accident', 'injury',
      'surgery', 'hospitalized', 'admitted', 'discharged', 'diagnosed',
      'yesterday', 'last week', 'last month', 'ago', 'since', 'when',
      'emergency', 'urgent', 'sudden'
    ];

    this.specialtyKeywords = {
      'cardiology': ['heart', 'cardiac', 'cardiovascular', 'chest pain', 'palpitations'],
      'pulmonology': ['lung', 'respiratory', 'breathing', 'asthma', 'copd'],
      'gastroenterology': ['stomach', 'digestive', 'intestinal', 'bowel', 'gi'],
      'neurology': ['brain', 'neurological', 'seizure', 'stroke', 'headache'],
      'orthopedics': ['bone', 'joint', 'fracture', 'sprain', 'musculoskeletal'],
      'endocrinology': ['diabetes', 'thyroid', 'hormone', 'insulin'],
      'dermatology': ['skin', 'rash', 'dermatological'],
      'nephrology': ['kidney', 'renal', 'dialysis'],
      'oncology': ['cancer', 'tumor', 'chemotherapy', 'radiation']
    };

    this.encounterTypes = {
      'emergency': ['emergency', 'urgent', 'acute', 'severe', 'critical'],
      'follow-up': ['follow up', 'follow-up', 'check up', 'checkup', 'return visit'],
      'consultation': ['consult', 'consultation', 'second opinion', 'referral'],
      'routine': ['routine', 'annual', 'physical', 'wellness', 'preventive']
    };
  }

  extractHighlights(text) {
    const lowerText = text.toLowerCase();
    const highlights = [];

    if (this.containsKeywords(lowerText, this.symptomKeywords)) {
      highlights.push({
        category: 'symptom',
        content: text
      });
    }

    if (this.containsKeywords(lowerText, this.medicationKeywords)) {
      highlights.push({
        category: 'medication',
        content: text
      });
    }

    if (this.containsKeywords(lowerText, this.instructionKeywords)) {
      highlights.push({
        category: 'instruction',
        content: text
      });
    }

    if (this.containsKeywords(lowerText, this.eventKeywords)) {
      highlights.push({
        category: 'event',
        content: text
      });
    }

    return highlights;
  }

  containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  detectSpecialty(fullTranscript) {
    const lowerTranscript = fullTranscript.toLowerCase();

    for (const [specialty, keywords] of Object.entries(this.specialtyKeywords)) {
      if (this.containsKeywords(lowerTranscript, keywords)) {
        return specialty.charAt(0).toUpperCase() + specialty.slice(1);
      }
    }

    return null;
  }

  detectEncounterType(fullTranscript) {
    const lowerTranscript = fullTranscript.toLowerCase();

    for (const [type, keywords] of Object.entries(this.encounterTypes)) {
      if (this.containsKeywords(lowerTranscript, keywords)) {
        return type.charAt(0).toUpperCase() + type.slice(1);
      }
    }

    return null;
  }

  extractMedicationInstructions(text) {
    const lowerText = text.toLowerCase();
    const instructions = [];

    const patterns = [
      /(\d+)\s*(mg|milligrams|ml|milliliters)/gi,
      /(once|twice|three times|four times)\s*(a day|daily|per day)/gi,
      /(with|without|before|after)\s*(food|meals)/gi,
      /(morning|evening|bedtime|night)/gi
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          instructions.push(match);
        });
      }
    });

    return instructions;
  }

  analyzeUrgency(text) {
    const urgentKeywords = [
      'emergency', 'urgent', 'severe', 'critical', 'immediately', 'right away',
      'can\'t breathe', 'chest pain', 'unconscious', 'bleeding heavily',
      'severe pain', 'allergic reaction'
    ];

    const lowerText = text.toLowerCase();
    const hasUrgentKeyword = urgentKeywords.some(keyword => lowerText.includes(keyword));

    return hasUrgentKeyword ? 'high' : 'normal';
  }
}
