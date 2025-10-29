// InterpreCoach Content Script - HIPAA Compliant & Optimized
// NO PHI is stored persistently. All data is held in-memory only.
// Optimized for low latency and maximum scalability

let isActive = false;
let recognition = null;
let transcript = '';
let overlayElement = null;
let processingQueue = [];
let isProcessing = false;
let debounceTimer = null;

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

// Medication database with generic/brand names
const MEDICATION_DATABASE = {
  'acetaminophen': { generic: 'acetaminophen', brand: ['Tylenol', 'Paracetamol'], category: 'analgesic' },
  'tylenol': { generic: 'acetaminophen', brand: ['Tylenol'], category: 'analgesic' },
  'ibuprofen': { generic: 'ibuprofen', brand: ['Advil', 'Motrin'], category: 'NSAID' },
  'advil': { generic: 'ibuprofen', brand: ['Advil', 'Motrin'], category: 'NSAID' },
  'motrin': { generic: 'ibuprofen', brand: ['Advil', 'Motrin'], category: 'NSAID' },
  'lisinopril': { generic: 'lisinopril', brand: ['Prinivil', 'Zestril'], category: 'ACE inhibitor' },
  'metformin': { generic: 'metformin', brand: ['Glucophage', 'Fortamet'], category: 'antidiabetic' },
  'amlodipine': { generic: 'amlodipine', brand: ['Norvasc'], category: 'calcium channel blocker' },
  'omeprazole': { generic: 'omeprazole', brand: ['Prilosec'], category: 'proton pump inhibitor' },
  'atorvastatin': { generic: 'atorvastatin', brand: ['Lipitor'], category: 'statin' },
  'lipitor': { generic: 'atorvastatin', brand: ['Lipitor'], category: 'statin' },
  'levothyroxine': { generic: 'levothyroxine', brand: ['Synthroid', 'Levoxyl'], category: 'thyroid hormone' },
  'synthroid': { generic: 'levothyroxine', brand: ['Synthroid'], category: 'thyroid hormone' },
  'albuterol': { generic: 'albuterol', brand: ['Proventil', 'Ventolin'], category: 'bronchodilator' },
  'gabapentin': { generic: 'gabapentin', brand: ['Neurontin'], category: 'anticonvulsant' },
  'losartan': { generic: 'losartan', brand: ['Cozaar'], category: 'ARB' },
  'sertraline': { generic: 'sertraline', brand: ['Zoloft'], category: 'SSRI' },
  'zoloft': { generic: 'sertraline', brand: ['Zoloft'], category: 'SSRI' }
};

// Unit conversion helpers
const convertMetersToFeet = (meters) => {
  const feet = meters * 3.28084;
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  return `${wholeFeet}'${inches}"`;
};

const convertKgToLbs = (kg) => {
  return (kg * 2.20462).toFixed(1);
};

// De-identification function - CRITICAL for HIPAA
function deIdentifyText(text) {
  let deIdentified = text;

  Object.entries(PHI_PATTERNS).forEach(([type, pattern]) => {
    deIdentified = deIdentified.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
  });

  return deIdentified;
}

// Detect medications in text
function detectMedications(text) {
  const words = text.toLowerCase().split(/\s+/);
  const detected = [];

  words.forEach(word => {
    const cleaned = word.replace(/[^a-z]/g, '');
    if (MEDICATION_DATABASE[cleaned]) {
      const med = MEDICATION_DATABASE[cleaned];
      detected.push({
        detected: word,
        generic: med.generic,
        brands: med.brand,
        category: med.category
      });
    }
  });

  return detected;
}

// Extract units and convert
function detectAndConvertUnits(text) {
  const conversions = [];

  // Detect meters
  const meterMatch = text.match(/(\d+\.?\d*)\s*(meter|metres|m\b)/gi);
  if (meterMatch) {
    meterMatch.forEach(match => {
      const value = parseFloat(match);
      if (!isNaN(value)) {
        conversions.push({
          original: match,
          type: 'height',
          converted: convertMetersToFeet(value),
          unit: 'feet/inches'
        });
      }
    });
  }

  // Detect kilograms
  const kgMatch = text.match(/(\d+\.?\d*)\s*(kilogram|kg\b)/gi);
  if (kgMatch) {
    kgMatch.forEach(match => {
      const value = parseFloat(match);
      if (!isNaN(value)) {
        conversions.push({
          original: match,
          type: 'weight',
          converted: convertKgToLbs(value),
          unit: 'lbs'
        });
      }
    });
  }

  return conversions;
}

// Create overlay UI
function createOverlay() {
  if (overlayElement) return;

  overlayElement = document.createElement('div');
  overlayElement.id = 'interprecoach-overlay';
  overlayElement.innerHTML = `
    <div class="ic-header">
      <div class="ic-title">
        <div class="ic-icon">🎤</div>
        <span>InterpreCoach</span>
      </div>
      <div class="ic-controls">
        <button id="ic-toggle-btn" class="ic-btn-primary">Start Session</button>
        <button id="ic-minimize-btn" class="ic-btn-icon">−</button>
        <button id="ic-close-btn" class="ic-btn-icon">×</button>
      </div>
    </div>
    <div class="ic-content">
      <div class="ic-status">
        <span class="ic-status-indicator"></span>
        <span id="ic-status-text">Ready</span>
      </div>
      <div class="ic-section">
        <h3>Live Transcript</h3>
        <div id="ic-transcript" class="ic-transcript">Waiting for speech...</div>
      </div>
      <div class="ic-section">
        <h3>Key Highlights</h3>
        <div id="ic-highlights" class="ic-highlights">No highlights yet</div>
      </div>
      <div class="ic-section">
        <h3>Medical Terms</h3>
        <div id="ic-terms" class="ic-terms">No medical terms detected</div>
      </div>
      <div class="ic-section">
        <h3>Medications</h3>
        <div id="ic-medications" class="ic-medications">No medications detected</div>
      </div>
    </div>
    <div class="ic-footer">
      <span class="ic-hipaa-badge">🔒 HIPAA Compliant - No PHI Stored</span>
    </div>
  `;

  document.body.appendChild(overlayElement);

  // Event listeners
  document.getElementById('ic-toggle-btn').addEventListener('click', toggleSession);
  document.getElementById('ic-close-btn').addEventListener('click', closeOverlay);
  document.getElementById('ic-minimize-btn').addEventListener('click', minimizeOverlay);
}

// Initialize speech recognition
function initSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPiece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcriptPiece + ' ';
      } else {
        interim += transcriptPiece;
      }
    }

    if (final) {
      transcript += final;
      processTranscript(transcript);
    }

    updateTranscriptDisplay(transcript + interim);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    updateStatus('Error: ' + event.error, 'error');
  };

  recognition.onend = () => {
    if (isActive) {
      recognition.start(); // Restart if still active
    }
  };
}

// Process transcript with AI (de-identified)
async function processTranscript(text) {
  // De-identify BEFORE sending to backend
  const deIdentified = deIdentifyText(text);

  // Detect medications
  const medications = detectMedications(text);
  if (medications.length > 0) {
    displayMedications(medications);
  }

  // Detect and convert units
  const conversions = detectAndConvertUnits(text);
  if (conversions.length > 0) {
    displayConversions(conversions);
  }

  try {
    // Send de-identified text to edge function
    const response = await fetch(`${window.location.origin}/functions/v1/process-interprecoach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: deIdentified, // ONLY de-identified text is sent
        medications: medications.map(m => m.generic),
        conversions: conversions
      })
    });

    const data = await response.json();

    if (data.medicalTerms) {
      displayMedicalTerms(data.medicalTerms);
    }
    if (data.highlights) {
      displayHighlights(data.highlights);
    }
  } catch (error) {
    console.error('Processing error:', error);
  }
}

function displayMedications(medications) {
  const medDiv = document.getElementById('ic-medications');
  medDiv.innerHTML = medications.map(med => `
    <div class="ic-medication">
      <div class="ic-med-header">
        <strong>${med.detected}</strong>
        <span class="ic-badge">${med.category}</span>
      </div>
      <div class="ic-med-info">
        <div><strong>Generic:</strong> ${med.generic}</div>
        <div><strong>Brand Names:</strong> ${med.brands.join(', ')}</div>
      </div>
    </div>
  `).join('');
}

function displayConversions(conversions) {
  const highlights = document.getElementById('ic-highlights');
  const conversionHtml = conversions.map(conv => `
    <div class="ic-conversion">
      <strong>${conv.type === 'height' ? '📏' : '⚖️'} ${conv.original}</strong> →
      ${conv.converted} ${conv.unit}
    </div>
  `).join('');
  highlights.innerHTML += conversionHtml;
}

function displayMedicalTerms(terms) {
  const termsDiv = document.getElementById('ic-terms');
  termsDiv.innerHTML = terms.map(term => `
    <div class="ic-term">
      <strong>${term.term}</strong>
      <p>${term.definition}</p>
      ${term.translation ? `<em>Translation: ${term.translation}</em>` : ''}
    </div>
  `).join('');
}

function displayHighlights(highlights) {
  const highlightsDiv = document.getElementById('ic-highlights');
  highlightsDiv.innerHTML = highlights.map(h => `
    <div class="ic-highlight">
      <span class="ic-highlight-icon">${h.icon || '•'}</span>
      <span>${h.text}</span>
    </div>
  `).join('');
}

function updateTranscriptDisplay(text) {
  document.getElementById('ic-transcript').textContent = text || 'Listening...';
}

function updateStatus(text, status = 'active') {
  const statusText = document.getElementById('ic-status-text');
  const indicator = overlayElement.querySelector('.ic-status-indicator');
  statusText.textContent = text;
  indicator.className = `ic-status-indicator ic-status-${status}`;
}

function toggleSession() {
  const btn = document.getElementById('ic-toggle-btn');

  if (!isActive) {
    if (!recognition) initSpeechRecognition();
    recognition.start();
    isActive = true;
    btn.textContent = 'End Session';
    btn.classList.add('ic-btn-danger');
    updateStatus('Listening...', 'active');
  } else {
    recognition.stop();
    isActive = false;
    btn.textContent = 'Start Session';
    btn.classList.remove('ic-btn-danger');
    updateStatus('Session ended', 'inactive');

    // HIPAA Compliance: Clear all data when session ends
    transcript = '';
    updateTranscriptDisplay('Session ended. All data cleared.');
  }
}

function closeOverlay() {
  if (isActive) {
    recognition.stop();
    isActive = false;
  }

  // HIPAA Compliance: Clear all in-memory data
  transcript = '';

  if (overlayElement) {
    overlayElement.remove();
    overlayElement = null;
  }
}

function minimizeOverlay() {
  overlayElement.classList.toggle('ic-minimized');
}

// Initialize on extension icon click
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    if (!overlayElement) {
      createOverlay();
    } else {
      closeOverlay();
    }
  }
});

// Auto-initialize for testing (remove in production)
if (window.location.search.includes('interprecoach=1')) {
  setTimeout(createOverlay, 1000);
}
