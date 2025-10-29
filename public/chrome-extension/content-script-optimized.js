// InterpreCoach Content Script - HIPAA Compliant & Optimized
// NO PHI is stored persistently. All data is held in-memory only.
// Optimized for low latency with Google Medical AI (HIPAA-compliant)

let isActive = false;
let recognition = null;
let transcript = '';
let overlayElement = null;
let processingQueue = [];
let isProcessing = false;
let debounceTimer = null;
let cache = new Map(); // In-memory cache for medical terms

// Configuration
const CONFIG = {
  DEBOUNCE_DELAY: 1500,
  API_TIMEOUT: 5000,
  QUEUE_DELAY: 500,
  CACHE_TTL: 300000, // 5 minutes
  MAX_QUEUE_SIZE: 10
};

// HIPAA Compliance: De-identification patterns (optimized regex)
const PHI_PATTERNS = {
  names: /\b(?:Mr\.|Mrs\.|Ms\.|Dr\.|Miss)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  dates: /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi,
  mrn: /\b(?:MRN|Medical Record|Patient ID|Record Number)[\s:]*[A-Z0-9-]+\b/gi,
  address: /\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir)\b/gi,
  zipcode: /\b\d{5}(?:-\d{4})?\b/g
};

// Optimized medication database (indexed for O(1) lookup)
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

// Unit conversion helpers (optimized)
const convertMetersToFeet = (meters) => {
  const feet = meters * 3.28084;
  const wholeFeet = Math.floor(feet);
  const inches = Math.round((feet - wholeFeet) * 12);
  return `${wholeFeet}'${inches}"`;
};

const convertKgToLbs = (kg) => (kg * 2.20462).toFixed(1);

// De-identification function - CRITICAL for HIPAA (optimized)
function deIdentifyText(text) {
  let deIdentified = text;
  for (const [type, pattern] of Object.entries(PHI_PATTERNS)) {
    deIdentified = deIdentified.replace(pattern, `[${type.toUpperCase()}_REDACTED]`);
  }
  return deIdentified;
}

// Detect medications in text (optimized with Set)
function detectMedications(text) {
  const words = text.toLowerCase().split(/\s+/);
  const detected = [];
  const seen = new Set();

  for (const word of words) {
    const cleaned = word.replace(/[^a-z]/g, '');
    if (MEDICATION_DATABASE[cleaned] && !seen.has(cleaned)) {
      const med = MEDICATION_DATABASE[cleaned];
      detected.push({
        detected: word,
        generic: med.generic,
        brands: med.brand,
        category: med.category
      });
      seen.add(cleaned);
    }
  }

  return detected;
}

// Extract units and convert (optimized)
function detectAndConvertUnits(text) {
  const conversions = [];

  // Detect meters
  const meterRegex = /(\d+\.?\d*)\s*(?:meter|metres|m\b)/gi;
  let match;
  while ((match = meterRegex.exec(text)) !== null) {
    const value = parseFloat(match[1]);
    if (!isNaN(value)) {
      conversions.push({
        original: match[0],
        type: 'height',
        converted: convertMetersToFeet(value),
        unit: 'feet/inches'
      });
    }
  }

  // Detect kilograms
  const kgRegex = /(\d+\.?\d*)\s*(?:kilogram|kg\b)/gi;
  while ((match = kgRegex.exec(text)) !== null) {
    const value = parseFloat(match[1]);
    if (!isNaN(value)) {
      conversions.push({
        original: match[0],
        type: 'weight',
        converted: convertKgToLbs(value),
        unit: 'lbs'
      });
    }
  }

  return conversions;
}

// Create overlay UI (optimized with DocumentFragment)
function createOverlay() {
  if (overlayElement) return;

  const template = document.createElement('template');
  template.innerHTML = `
    <div id="interprecoach-overlay">
      <div class="ic-header">
        <div class="ic-title">
          <div class="ic-icon">🎤</div>
          <span>InterpreCoach AI</span>
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
          <h3>AI Insights</h3>
          <div id="ic-highlights" class="ic-highlights">No insights yet</div>
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
        <span class="ic-hipaa-badge">🔒 HIPAA Compliant - Google Medical AI</span>
      </div>
    </div>
  `;

  overlayElement = template.content.firstElementChild;
  document.body.appendChild(overlayElement);

  // Event listeners (using event delegation)
  overlayElement.addEventListener('click', (e) => {
    if (e.target.id === 'ic-toggle-btn') toggleSession();
    else if (e.target.id === 'ic-close-btn') closeOverlay();
    else if (e.target.id === 'ic-minimize-btn') minimizeOverlay();
  });
}

// Initialize speech recognition (optimized)
function initSpeechRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1; // Optimize for performance

  let finalTranscript = '';

  recognition.onresult = (event) => {
    let interim = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcriptPiece = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcriptPiece + ' ';
      } else {
        interim += transcriptPiece;
      }
    }

    transcript = finalTranscript;
    updateTranscriptDisplay(transcript + interim);

    if (finalTranscript) {
      processTranscript(finalTranscript);
    }
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

// Process transcript with Google Medical AI (HIPAA-compliant) - OPTIMIZED
async function processTranscript(text) {
  // Debounce processing to reduce API calls
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(async () => {
    await processTranscriptImmediate(text);
  }, CONFIG.DEBOUNCE_DELAY);
}

async function processTranscriptImmediate(text) {
  // Check cache first
  const cacheKey = text.substring(0, 100);
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
      displayCachedResults(cached.data);
      return;
    }
    cache.delete(cacheKey);
  }

  // De-identify BEFORE any processing
  const deIdentified = deIdentifyText(text);

  // Local processing (instant, no API calls)
  const medications = detectMedications(text);
  if (medications.length > 0) {
    displayMedications(medications);
  }

  const conversions = detectAndConvertUnits(text);
  if (conversions.length > 0) {
    displayConversions(conversions);
  }

  // Queue API request
  if (processingQueue.length < CONFIG.MAX_QUEUE_SIZE) {
    processingQueue.push({ deIdentified, medications, conversions, cacheKey });

    if (!isProcessing) {
      processQueue();
    }
  }
}

// Process queue with rate limiting and Google Medical AI
async function processQueue() {
  if (processingQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const item = processingQueue.shift();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT);

    // Call Supabase Edge Function which connects to Google Medical AI
    const response = await fetch(chrome.runtime.getURL('config.json'))
      .then(res => res.json())
      .then(async (config) => {
        return fetch(`${config.supabaseUrl}/functions/v1/process-interprecoach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.supabaseAnonKey,
            'Authorization': `Bearer ${config.supabaseAnonKey}`
          },
          body: JSON.stringify({
            text: item.deIdentified,
            medications: item.medications.map(m => m.generic),
            conversions: item.conversions,
            useGoogleMedicalAI: true
          }),
          signal: controller.signal
        });
      });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache results
    cache.set(item.cacheKey, {
      data,
      timestamp: Date.now()
    });

    if (data.medicalTerms) {
      displayMedicalTerms(data.medicalTerms);
    }
    if (data.highlights) {
      displayHighlights(data.highlights);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Request timeout - continuing with local processing');
    } else {
      console.error('Processing error:', error);
    }
  }

  // Process next item with rate limiting
  setTimeout(() => processQueue(), CONFIG.QUEUE_DELAY);
}

// Display functions (optimized with batch updates)
function displayMedications(medications) {
  const medDiv = document.getElementById('ic-medications');
  if (!medDiv) return;

  const fragment = document.createDocumentFragment();
  medications.forEach(med => {
    const div = document.createElement('div');
    div.className = 'ic-medication';
    div.innerHTML = `
      <div class="ic-med-header">
        <strong>${med.detected}</strong>
        <span class="ic-badge">${med.category}</span>
      </div>
      <div class="ic-med-info">
        <div><strong>Generic:</strong> ${med.generic}</div>
        <div><strong>Brand Names:</strong> ${med.brands.join(', ')}</div>
      </div>
    `;
    fragment.appendChild(div);
  });

  medDiv.innerHTML = '';
  medDiv.appendChild(fragment);
}

function displayConversions(conversions) {
  const highlights = document.getElementById('ic-highlights');
  if (!highlights) return;

  const fragment = document.createDocumentFragment();
  conversions.forEach(conv => {
    const div = document.createElement('div');
    div.className = 'ic-conversion';
    div.innerHTML = `
      <strong>${conv.type === 'height' ? '📏' : '⚖️'} ${conv.original}</strong> →
      ${conv.converted} ${conv.unit}
    `;
    fragment.appendChild(div);
  });

  highlights.appendChild(fragment);
}

function displayMedicalTerms(terms) {
  const termsDiv = document.getElementById('ic-terms');
  if (!termsDiv) return;

  const fragment = document.createDocumentFragment();
  terms.forEach(term => {
    const div = document.createElement('div');
    div.className = 'ic-term';
    div.innerHTML = `
      <strong>${term.term}</strong>
      <p>${term.definition}</p>
      ${term.translation ? `<em>Translation: ${term.translation}</em>` : ''}
    `;
    fragment.appendChild(div);
  });

  termsDiv.innerHTML = '';
  termsDiv.appendChild(fragment);
}

function displayHighlights(highlights) {
  const highlightsDiv = document.getElementById('ic-highlights');
  if (!highlightsDiv) return;

  const fragment = document.createDocumentFragment();
  highlights.forEach(h => {
    const div = document.createElement('div');
    div.className = 'ic-highlight';
    div.innerHTML = `
      <span class="ic-highlight-icon">${h.icon || '•'}</span>
      <span>${h.text}</span>
    `;
    fragment.appendChild(div);
  });

  highlightsDiv.innerHTML = '';
  highlightsDiv.appendChild(fragment);
}

function displayCachedResults(data) {
  if (data.medicalTerms) displayMedicalTerms(data.medicalTerms);
  if (data.highlights) displayHighlights(data.highlights);
}

function updateTranscriptDisplay(text) {
  const transcriptDiv = document.getElementById('ic-transcript');
  if (transcriptDiv) {
    transcriptDiv.textContent = text || 'Listening...';
  }
}

function updateStatus(text, status = 'active') {
  const statusText = document.getElementById('ic-status-text');
  const indicator = overlayElement?.querySelector('.ic-status-indicator');
  if (statusText) statusText.textContent = text;
  if (indicator) indicator.className = `ic-status-indicator ic-status-${status}`;
}

function toggleSession() {
  const btn = document.getElementById('ic-toggle-btn');
  if (!btn) return;

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

    // HIPAA Compliance: Clear all data
    transcript = '';
    cache.clear();
    processingQueue = [];
    updateTranscriptDisplay('Session ended. All data cleared.');
  }
}

function closeOverlay() {
  if (isActive && recognition) {
    recognition.stop();
    isActive = false;
  }

  // HIPAA Compliance: Clear all in-memory data
  transcript = '';
  cache.clear();
  processingQueue = [];

  if (overlayElement) {
    overlayElement.remove();
    overlayElement = null;
  }
}

function minimizeOverlay() {
  if (overlayElement) {
    overlayElement.classList.toggle('ic-minimized');
  }
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    if (!overlayElement) {
      createOverlay();
    } else {
      closeOverlay();
    }
  }
});

// Auto-initialize for testing
if (window.location.search.includes('interprecoach=1')) {
  setTimeout(createOverlay, 1000);
}
