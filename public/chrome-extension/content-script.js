// InterpreCoach Content Script - HIPAA Compliant Medical Interpretation Assistant
// PHI/PII stored temporarily in memory during session, destroyed on end
// No persistence, no logging, no external transmission

console.log('InterpreCoach: Content script loaded');

let isSessionActive = false;
let recognition = null;
let captionObserver = null;

// Session tracking for post-session feedback
let sessionData = {
  startTime: null,
  endTime: null,
  interactions: [],
  terminologyUsed: [],
  clarificationRequests: 0,
  paceIssues: 0,
  omissions: 0,
  strengths: [],
  improvements: [],
  feedback: null
};

// HIPAA Compliance: De-identification patterns
const PHI_PATTERNS = {
  names: /\b(Mr\.|Mrs\.|Ms\.|Dr\.|Miss)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)*\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  dates: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi,
  mrn: /\b(MRN|Medical Record|Patient ID|Record Number)[\s:]*[A-Z0-9-]+\b/gi,
  address: /\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi,
  zipcode: /\b\d{5}(?:-\d{4})?\b/g
};

// Medical terminology database
const MEDICAL_TERMS_DB = {
  'hypertension': { definition: 'High blood pressure', translation: 'Presión arterial alta', category: 'cardiovascular', pronunciation: 'ee-per-ten-see-OHN' },
  'diabetes': { definition: 'Metabolic disorder with high blood sugar', translation: 'Diabetes', category: 'endocrine', pronunciation: 'dee-ah-BEH-tes' },
  'myocardial infarction': { definition: 'Heart attack', translation: 'Infarto de miocardio', category: 'cardiovascular', pronunciation: 'in-FAR-toh deh mee-oh-CAR-dee-oh' },
  'pneumonia': { definition: 'Lung infection', translation: 'Neumonía', category: 'respiratory', pronunciation: 'neh-oo-moh-NEE-ah' },
  'fracture': { definition: 'Broken bone', translation: 'Fractura', category: 'orthopedic', pronunciation: 'frac-TOO-rah' },
  'abdominal': { definition: 'Relating to the abdomen', translation: 'Abdominal', category: 'anatomy', pronunciation: 'ab-doh-mee-NAHL' },
  'acute': { definition: 'Sudden onset, severe', translation: 'Agudo', category: 'general', pronunciation: 'ah-GOO-doh' },
  'chronic': { definition: 'Long-lasting', translation: 'Crónico', category: 'general', pronunciation: 'CROH-nee-coh' },
  'inflammation': { definition: 'Swelling and redness', translation: 'Inflamación', category: 'general', pronunciation: 'in-flah-mah-see-OHN' }
};

// Medication database
const MEDICATION_DATABASE = {
  'aspirin': { generic: 'aspirin', brand: 'Bayer', category: 'cardiovascular', spanish: 'aspirina', pronunciation: 'as-pee-REE-nah' },
  'ibuprofen': { generic: 'ibuprofen', brand: 'Advil', category: 'pain', spanish: 'ibuprofeno', pronunciation: 'ee-boo-proh-FEH-noh' },
  'lisinopril': { generic: 'lisinopril', brand: 'Prinivil', category: 'cardiovascular', spanish: 'lisinopril', pronunciation: 'lee-see-noh-PREEL' },
  'metformin': { generic: 'metformin', brand: 'Glucophage', category: 'diabetes', spanish: 'metformina', pronunciation: 'met-for-MEE-nah' },
  'keppra': { generic: 'levetiracetam', brand: 'Keppra', category: 'neurological', spanish: 'levetiracetam', pronunciation: 'leh-veh-teer-ah-SEH-tahm' },
  'levetiracetam': { generic: 'levetiracetam', brand: 'Keppra', category: 'neurological', spanish: 'levetiracetam', pronunciation: 'leh-veh-teer-ah-SEH-tahm' }
};

// Key insights tracking
let keyInsights = {
  chiefComplaint: null,
  medications: new Set(),
  allergies: new Set(),
  vitalSigns: {},
  diagnoses: new Set(),
  phi: new Set(),
  pii: new Set(),
  nextSteps: []
};

// De-identification function
function deIdentifyText(text) {
  let deIdentified = text;
  Object.entries(PHI_PATTERNS).forEach(([type, pattern]) => {
    deIdentified = deIdentified.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
  });
  return deIdentified;
}

// Detect medications
function detectMedications(text) {
  const words = text.toLowerCase().split(/\s+/);
  const detected = [];
  
  words.forEach(word => {
    const cleaned = word.replace(/[^a-z]/g, '');
    if (MEDICATION_DATABASE[cleaned]) {
      detected.push(MEDICATION_DATABASE[cleaned]);
    }
  });
  
  return detected;
}

// Unit conversions
function detectAndConvertUnits(text) {
  const conversions = [];
  
  const meterMatch = text.match(/(\d+\.?\d*)\s*(meter|metres|m\b)/gi);
  if (meterMatch) {
    meterMatch.forEach(match => {
      const value = parseFloat(match);
      if (!isNaN(value)) {
        const feet = Math.floor(value * 3.28084);
        const inches = Math.round(((value * 3.28084) - feet) * 12);
        conversions.push({
          original: match,
          type: 'height',
          converted: `${feet}'${inches}"`,
          unit: 'feet/inches'
        });
      }
    });
  }
  
  const kgMatch = text.match(/(\d+\.?\d*)\s*(kilogram|kg\b)/gi);
  if (kgMatch) {
    kgMatch.forEach(match => {
      const value = parseFloat(match);
      if (!isNaN(value)) {
        conversions.push({
          original: match,
          type: 'weight',
          converted: (value * 2.20462).toFixed(1),
          unit: 'lbs'
        });
      }
    });
  }
  
  return conversions;
}

// Create overlay UI
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'interprecoach-overlay';
  overlay.className = 'interprecoach-minimized';
  
  overlay.innerHTML = `
    <div class="interprecoach-header">
      <div class="interprecoach-title">
        <span class="interprecoach-icon">🎯</span>
        InterpreCoach
        <span class="interprecoach-status" id="coach-status">Ready</span>
      </div>
      <div class="interprecoach-controls">
        <button id="coach-minimize" class="interprecoach-btn-icon" title="Minimize">−</button>
        <button id="coach-close" class="interprecoach-btn-icon" title="Close">×</button>
      </div>
    </div>
    
    <div class="interprecoach-content">
      <div class="interprecoach-tabs">
        <button class="interprecoach-tab active" data-tab="transcript">Transcript</button>
        <button class="interprecoach-tab" data-tab="insights">Key Insights</button>
        <button class="interprecoach-tab" data-tab="terms">Medical Terms</button>
      </div>

      <div class="interprecoach-tab-content active" id="tab-transcript">
        <div class="interprecoach-transcript" id="coach-transcript">
          <p class="interprecoach-placeholder">Transcript will appear here...</p>
        </div>
      </div>

      <div class="interprecoach-tab-content" id="tab-insights">
        <div class="interprecoach-insights" id="coach-insights">
          <div class="insight-section">
            <h4>🎯 Chief Complaint</h4>
            <p id="insight-complaint">Not yet identified</p>
          </div>
          <div class="insight-section">
            <h4>💊 Medications</h4>
            <ul id="insight-medications"></ul>
          </div>
          <div class="insight-section">
            <h4>📊 Vital Signs</h4>
            <div id="insight-vitals"></div>
          </div>
          <div class="insight-section">
            <h4>🔍 Diagnoses</h4>
            <ul id="insight-diagnoses"></ul>
          </div>
          <div class="insight-section">
            <h4>📋 Next Steps</h4>
            <ul id="insight-nextsteps"></ul>
          </div>
        </div>
      </div>

      <div class="interprecoach-tab-content" id="tab-terms">
        <div class="interprecoach-terms" id="coach-terms">
          <p class="interprecoach-placeholder">Medical terms will appear as detected...</p>
        </div>
      </div>
      
      <div class="interprecoach-footer">
        <button id="coach-toggle" class="interprecoach-btn-primary">Start Session</button>
        <button id="coach-feedback" class="interprecoach-btn-secondary" style="display:none;">View Feedback</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  attachEventListeners();
}

function attachEventListeners() {
  document.getElementById('coach-toggle').addEventListener('click', toggleSession);
  document.getElementById('coach-close').addEventListener('click', closeOverlay);
  document.getElementById('coach-minimize').addEventListener('click', minimizeOverlay);
  document.getElementById('coach-feedback').addEventListener('click', showFeedback);
  
  document.querySelectorAll('.interprecoach-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  document.querySelectorAll('.interprecoach-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName);
  });
  
  document.querySelectorAll('.interprecoach-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });
}

// Initialize speech recognition
function initSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    updateStatus('Speech recognition not supported', 'error');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
        
        sessionData.interactions.push({
          timestamp: new Date().toISOString(),
          text: transcript,
          type: 'transcription'
        });
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      processTranscript(finalTranscript);
      updateKeyInsights(finalTranscript);
    }
    
    updateTranscriptDisplay(finalTranscript || interimTranscript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    updateStatus('Recognition error: ' + event.error, 'error');
  };

  recognition.onend = () => {
    if (isSessionActive) {
      recognition.start();
    }
  };
}

// Capture Google Meet/Zoom captions
function initCaptionCapture() {
  const captionSelectors = [
    '[jsname="tgaKEf"]', // Google Meet
    '.caption-line', // Zoom
    '[class*="caption"]'
  ];

  const observer = new MutationObserver((mutations) => {
    if (!isSessionActive) return;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          captionSelectors.forEach(selector => {
            const captionEl = node.matches?.(selector) ? node : node.querySelector?.(selector);
            if (captionEl) {
              const text = captionEl.textContent.trim();
              if (text) {
                processTranscript(text);
                updateKeyInsights(text);
                updateTranscriptDisplay(text);
                
                sessionData.interactions.push({
                  timestamp: new Date().toISOString(),
                  text: text,
                  type: 'caption'
                });
              }
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return observer;
}

// Process transcript
async function processTranscript(text) {
  const deIdentified = deIdentifyText(text);
  const medications = detectMedications(text);
  const conversions = detectAndConvertUnits(text);
  
  try {
    const response = await fetch('https://opmafykbhjinqebgflnl.supabase.co/functions/v1/process-interprecoach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: deIdentified,
        medications: medications.map(m => m.generic),
        conversions: conversions
      })
    });
    
    const data = await response.json();
    
    if (data.medicalTerms) {
      data.medicalTerms.forEach(term => displayMedicalTerm(term));
    }
  } catch (error) {
    console.error('Processing error:', error);
  }
}

function displayMedicalTerm(term) {
  const termsDiv = document.getElementById('coach-terms');
  const placeholder = termsDiv.querySelector('.interprecoach-placeholder');
  if (placeholder) placeholder.remove();
  
  const termCard = document.createElement('div');
  termCard.className = 'term-card';
  termCard.innerHTML = `
    <div class="term-header">🏥 ${term.term}</div>
    <div class="term-body">
      <p><strong>Definition:</strong> ${term.definition}</p>
      <p><strong>Spanish:</strong> ${term.translation || 'N/A'}</p>
      ${term.pronunciation ? `<p><strong>Pronunciation:</strong> ${term.pronunciation}</p>` : ''}
      <p><strong>Category:</strong> ${term.category}</p>
    </div>
  `;
  
  termsDiv.insertBefore(termCard, termsDiv.firstChild);
}

function updateTranscriptDisplay(text) {
  const transcriptDiv = document.getElementById('coach-transcript');
  if (!transcriptDiv) return;
  
  const placeholder = transcriptDiv.querySelector('.interprecoach-placeholder');
  if (placeholder) placeholder.remove();
  
  let highlightedText = text;
  
  // Highlight medical terms
  Object.keys(MEDICAL_TERMS_DB).forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(text)) {
      highlightedText = highlightedText.replace(regex, `<span class="medical-term" data-term="${term}">$&</span>`);
    }
  });
  
  // Highlight medications
  Object.keys(MEDICATION_DATABASE).forEach(med => {
    const regex = new RegExp(`\\b${med}\\b`, 'gi');
    if (regex.test(text)) {
      highlightedText = highlightedText.replace(regex, `<span class="medication-term" data-med="${med}">$&</span>`);
    }
  });
  
  const p = document.createElement('p');
  p.innerHTML = highlightedText;
  p.classList.add('transcript-line');
  transcriptDiv.appendChild(p);
  transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
  
  // Add click handlers
  p.querySelectorAll('.medical-term, .medication-term').forEach(span => {
    span.style.cursor = 'pointer';
    span.addEventListener('click', () => {
      const term = span.dataset.term || span.dataset.med;
      showTermPopup(term, span.dataset.med ? 'medication' : 'medical');
    });
  });
}

function showTermPopup(term, type) {
  const info = type === 'medication' ? MEDICATION_DATABASE[term.toLowerCase()] : MEDICAL_TERMS_DB[term.toLowerCase()];
  if (!info) return;
  
  displayMedicalTerm(type === 'medication' ? 
    { term, definition: `Generic: ${info.generic}, Brand: ${info.brand}`, translation: info.spanish, pronunciation: info.pronunciation, category: info.category } :
    { term, definition: info.definition, translation: info.translation, pronunciation: info.pronunciation, category: info.category }
  );
  
  switchTab('terms');
}

function updateKeyInsights(text) {
  const lowerText = text.toLowerCase();
  
  // Chief complaint
  if (lowerText.includes('chief complaint') || lowerText.includes('reason for visit')) {
    const match = text.match(/(?:chief complaint|reason for visit)[:\s]+([^.!?]+)/i);
    if (match) {
      keyInsights.chiefComplaint = match[1].trim();
      keyInsights.phi.add(match[1].trim());
    }
  }
  
  // Medications
  Object.keys(MEDICATION_DATABASE).forEach(med => {
    if (lowerText.includes(med)) {
      keyInsights.medications.add(med);
    }
  });
  
  // Vital signs
  const bpMatch = text.match(/(\d{2,3})\/(\d{2,3})/);
  if (bpMatch) keyInsights.vitalSigns.bloodPressure = bpMatch[0];
  
  const hrMatch = text.match(/(\d{2,3})\s*(bpm|beats)/i);
  if (hrMatch) keyInsights.vitalSigns.heartRate = hrMatch[1];
  
  const tempMatch = text.match(/(\d{2,3}(?:\.\d)?)\s*(?:degrees|°)/i);
  if (tempMatch) keyInsights.vitalSigns.temperature = tempMatch[1];
  
  // Diagnoses
  Object.keys(MEDICAL_TERMS_DB).forEach(term => {
    if (lowerText.includes(term)) {
      keyInsights.diagnoses.add(term);
      keyInsights.phi.add(term);
    }
  });
  
  // Next steps
  if (lowerText.includes('follow up') || lowerText.includes('follow-up')) {
    const match = text.match(/follow[- ]?up[:\s]+([^.!?]+)/i);
    if (match) keyInsights.nextSteps.push(match[1].trim());
  }
  
  // PII
  const nameMatch = text.match(/(?:my name is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  if (nameMatch) keyInsights.pii.add(nameMatch[1]);
  
  updateInsightsDisplay();
}

function updateInsightsDisplay() {
  document.getElementById('insight-complaint').textContent = keyInsights.chiefComplaint || 'Not yet identified';
  
  const medsList = document.getElementById('insight-medications');
  medsList.innerHTML = keyInsights.medications.size === 0 ? '<li class="empty">None detected</li>' : 
    Array.from(keyInsights.medications).map(med => `<li>${med}</li>`).join('');
  
  const vitalsDiv = document.getElementById('insight-vitals');
  if (Object.keys(keyInsights.vitalSigns).length === 0) {
    vitalsDiv.innerHTML = '<p class="empty">None recorded</p>';
  } else {
    vitalsDiv.innerHTML = '';
    if (keyInsights.vitalSigns.bloodPressure) vitalsDiv.innerHTML += `<p>🫀 BP: ${keyInsights.vitalSigns.bloodPressure}</p>`;
    if (keyInsights.vitalSigns.heartRate) vitalsDiv.innerHTML += `<p>💓 HR: ${keyInsights.vitalSigns.heartRate} bpm</p>`;
    if (keyInsights.vitalSigns.temperature) vitalsDiv.innerHTML += `<p>🌡️ Temp: ${keyInsights.vitalSigns.temperature}°</p>`;
  }
  
  const diagList = document.getElementById('insight-diagnoses');
  diagList.innerHTML = keyInsights.diagnoses.size === 0 ? '<li class="empty">None identified</li>' :
    Array.from(keyInsights.diagnoses).map(diag => `<li>${diag}</li>`).join('');
  
  const stepsList = document.getElementById('insight-nextsteps');
  stepsList.innerHTML = keyInsights.nextSteps.length === 0 ? '<li class="empty">None specified</li>' :
    keyInsights.nextSteps.map(step => `<li>${step}</li>`).join('');
}

function updateStatus(text, status = 'active') {
  const statusEl = document.getElementById('coach-status');
  if (statusEl) {
    statusEl.textContent = text;
    statusEl.className = `interprecoach-status interprecoach-status-${status}`;
  }
}

function toggleSession() {
  isSessionActive = !isSessionActive;
  const btn = document.getElementById('coach-toggle');
  const feedbackBtn = document.getElementById('coach-feedback');
  
  if (isSessionActive) {
    btn.textContent = 'End Session';
    btn.classList.add('active');
    feedbackBtn.style.display = 'none';
    updateStatus('Active', 'active');
    
    // Initialize session
    sessionData = {
      startTime: new Date().toISOString(),
      endTime: null,
      interactions: [],
      terminologyUsed: [],
      clarificationRequests: 0,
      paceIssues: 0,
      omissions: 0,
      strengths: [],
      improvements: [],
      feedback: null
    };
    
    keyInsights = {
      chiefComplaint: null,
      medications: new Set(),
      allergies: new Set(),
      vitalSigns: {},
      diagnoses: new Set(),
      phi: new Set(),
      pii: new Set(),
      nextSteps: []
    };
    
    if (!recognition) initSpeechRecognition();
    recognition.start();
    
    if (!captionObserver) captionObserver = initCaptionCapture();
    
  } else {
    btn.textContent = 'Start Session';
    btn.classList.remove('active');
    updateStatus('Processing...', 'inactive');
    
    if (recognition) recognition.stop();
    if (captionObserver) {
      captionObserver.disconnect();
      captionObserver = null;
    }
    
    sessionData.endTime = new Date().toISOString();
    
    generateSessionFeedback().then(() => {
      updateStatus('Session Ended', 'inactive');
      feedbackBtn.style.display = 'inline-block';
      setTimeout(() => destroySessionData(), 1000);
    });
  }
}

async function generateSessionFeedback() {
  try {
    analyzeSessionPerformance();
    
    const response = await fetch('https://opmafykbhjinqebgflnl.supabase.co/functions/v1/generate-interpreter-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionData: {
          duration: (new Date(sessionData.endTime) - new Date(sessionData.startTime)) / 1000,
          interactionCount: sessionData.interactions.length,
          terminologyCount: sessionData.terminologyUsed.length,
          clarifications: sessionData.clarificationRequests,
          paceIssues: sessionData.paceIssues,
          omissions: sessionData.omissions
        }
      })
    });
    
    const data = await response.json();
    sessionData.feedback = data.feedback;
    
  } catch (error) {
    console.error('Error generating feedback:', error);
    sessionData.feedback = 'Feedback generation unavailable. Please check connection.';
  }
}

function analyzeSessionPerformance() {
  sessionData.terminologyUsed = Array.from(new Set([
    ...Array.from(keyInsights.medications),
    ...Array.from(keyInsights.diagnoses)
  ]));
  
  sessionData.interactions.forEach(interaction => {
    const text = interaction.text.toLowerCase();
    
    if (text.includes('can you repeat') || text.includes('could you clarify') || text.includes('please repeat')) {
      sessionData.clarificationRequests++;
    }
    
    if (text.length > 300 && !text.includes('.')) {
      sessionData.paceIssues++;
    }
  });
  
  if (sessionData.terminologyUsed.length > 5) {
    sessionData.strengths.push('Strong medical terminology recognition');
  }
  if (sessionData.clarificationRequests > 0) {
    sessionData.strengths.push('Proactive clarification requests');
  }
  
  if (sessionData.paceIssues > 2) {
    sessionData.improvements.push('Consider slowing pace for complex information');
  }
  if (sessionData.terminologyUsed.length < 3) {
    sessionData.improvements.push('Practice medical terminology recognition');
  }
}

function showFeedback() {
  if (!sessionData.feedback) return;
  
  const modal = document.createElement('div');
  modal.className = 'interprecoach-modal';
  modal.innerHTML = `
    <div class="interprecoach-modal-content">
      <div class="interprecoach-modal-header">
        <h2>🎯 Professional Performance Feedback</h2>
        <button class="interprecoach-modal-close">&times;</button>
      </div>
      <div class="interprecoach-modal-body">
        ${sessionData.feedback}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.interprecoach-modal-close').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function destroySessionData() {
  console.log('InterpreCoach: Destroying PHI/PII data...');
  
  keyInsights.phi.clear();
  keyInsights.pii.clear();
  keyInsights.chiefComplaint = null;
  keyInsights.medications.clear();
  keyInsights.allergies.clear();
  keyInsights.vitalSigns = {};
  keyInsights.diagnoses.clear();
  keyInsights.nextSteps = [];
  
  sessionData.interactions = [];
  
  console.log('InterpreCoach: PHI/PII data destroyed');
}

function closeOverlay() {
  const overlay = document.getElementById('interprecoach-overlay');
  if (overlay) {
    if (isSessionActive) {
      const confirm = window.confirm('Session is active. Closing will destroy all PHI/PII data. Continue?');
      if (!confirm) return;
      
      if (recognition) recognition.stop();
      if (captionObserver) captionObserver.disconnect();
      isSessionActive = false;
      destroySessionData();
    }
    overlay.remove();
  }
}

function minimizeOverlay() {
  document.getElementById('interprecoach-overlay').classList.toggle('interprecoach-minimized');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    const existing = document.getElementById('interprecoach-overlay');
    if (!existing) {
      createOverlay();
    } else {
      closeOverlay();
    }
  }
});

if (window.location.search.includes('interprecoach=1')) {
  setTimeout(createOverlay, 1000);
}
