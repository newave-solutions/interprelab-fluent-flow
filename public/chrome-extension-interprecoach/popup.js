document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const startSessionBtn = document.getElementById('start-session-btn');
    const endSessionBtn = document.getElementById('end-session-btn');
    const searchInput = document.getElementById('search-input');
    const transcriptionPanel = document.getElementById('transcription-panel');
    const terminologyPanel = document.getElementById('terminology-panel');
    const qaTipsPanel = document.getElementById('qa-tips-panel');
    const dictionaryPanel = document.getElementById('dictionary-panel');
    const scratchpad = document.getElementById('scratchpad');
    const themeToggle = document.getElementById('theme-toggle');

    // State
    let sessionActive = false;
    let sessionStartTime = null;

    // Initialize medical terminology detector if available
    let terminologyDetector = null;
    if (typeof MedicalTerminologyDetector !== 'undefined') {
        terminologyDetector = new MedicalTerminologyDetector();
    }

    // === Session Management ===
    const startSession = () => {
        console.log('Starting session...');
        sessionActive = true;
        sessionStartTime = Date.now();

        startSessionBtn.classList.add('hidden');
        endSessionBtn.classList.remove('hidden');

        // Start audio bars animation
        document.querySelectorAll('.bar').forEach(bar => {
            bar.style.animationPlayState = 'running';
        });

        // Tell background script to start capturing audio
        chrome.runtime.sendMessage({ type: 'START_CAPTURE' }, (response) => {
            if (response && response.success) {
                console.log('Audio capture started');
                addTranscriptLine('System', 'Session started. Listening...', 'system');
            }
        });
    };

    const endSession = () => {
        console.log('Ending session...');
        sessionActive = false;

        startSessionBtn.classList.remove('hidden');
        endSessionBtn.classList.add('hidden');

        // Stop audio bars animation
        document.querySelectorAll('.bar').forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });

        // Tell background script to stop capturing
        chrome.runtime.sendMessage({ type: 'STOP_CAPTURE' }, (response) => {
            if (response && response.success) {
                console.log('Audio capture stopped');
                addTranscriptLine('System', 'Session ended.', 'system');
            }
        });

        // Calculate session duration
        if (sessionStartTime) {
            const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            console.log(`Session duration: ${minutes}m ${seconds}s`);
        }
    };

    // === Transcription Functions ===
    const addTranscriptLine = (speaker, text, type = 'normal') => {
        const line = document.createElement('div');
        line.className = 'transcript-line';

        const speakerSpan = document.createElement('span');
        speakerSpan.className = `speaker ${type === 'system' ? 'system' : speaker.toLowerCase()}`;
        speakerSpan.textContent = speaker + ':';

        const textSpan = document.createElement('span');
        textSpan.className = 'text';
        textSpan.textContent = text;

        line.appendChild(speakerSpan);
        line.appendChild(textSpan);

        // Remove empty state if exists
        const emptyState = transcriptionPanel.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        transcriptionPanel.appendChild(line);
        transcriptionPanel.scrollTop = transcriptionPanel.scrollHeight;
    };

    // === Terminology Functions ===
    const displayMedicalTerm = (term) => {
        // Remove empty state if exists
        const emptyState = terminologyPanel.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }

        const card = document.createElement('div');
        card.className = 'term-card';

        const header = document.createElement('div');
        header.className = 'term-header';

        const title = document.createElement('h4');
        title.textContent = term.english || term.term || term;

        const infoBtn = document.createElement('button');
        infoBtn.className = 'info-btn';
        infoBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12" stroke="white" stroke-width="2"></line>
                <line x1="12" y1="8" x2="12.01" y2="8" stroke="white" stroke-width="2"></line>
            </svg>
        `;

        header.appendChild(title);
        header.appendChild(infoBtn);

        const definition = document.createElement('p');
        definition.className = 'term-definition';
        definition.textContent = term.definition || term.spanish || 'Medical term detected';

        card.appendChild(header);
        card.appendChild(definition);

        terminologyPanel.insertBefore(card, terminologyPanel.firstChild);
    };

    // === Search Functionality ===
    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (!query) return;

        console.log(`Searching for: "${query}"`);

        if (terminologyDetector && terminologyDetector.medicalDictionary) {
            const lowerQuery = query.toLowerCase();
            const termData = terminologyDetector.medicalDictionary[lowerQuery];

            if (termData) {
                displayMedicalTerm({
                    english: query.charAt(0).toUpperCase() + query.slice(1),
                    ...termData
                });
                searchInput.value = '';
            } else {
                // Show not found message
                console.log('Term not found in dictionary');
                displayMedicalTerm({
                    english: query,
                    definition: 'Term not found in dictionary. Add it to medical-terminology.js'
                });
                searchInput.value = '';
            }
        } else {
            // No dictionary available, just display the search term
            displayMedicalTerm({
                english: query,
                definition: 'Medical terminology dictionary not loaded'
            });
            searchInput.value = '';
        }
    };

    // === Theme Toggle ===
    const toggleTheme = () => {
        // Future: implement light/dark theme toggle
        console.log('Theme toggle clicked');
    };

    // === Event Listeners ===
    startSessionBtn.addEventListener('click', startSession);
    endSessionBtn.addEventListener('click', endSession);
    themeToggle.addEventListener('click', toggleTheme);

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Minimize button handlers
    document.querySelectorAll('.minimize-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const panel = e.target.closest('.panel');
            const content = panel.querySelector('.panel-content');
            content.classList.toggle('hidden');

            // Rotate the arrow
            const svg = btn.querySelector('svg polyline');
            if (content.classList.contains('hidden')) {
                svg.setAttribute('points', '6 9 12 15 18 9');
            } else {
                svg.setAttribute('points', '18 15 12 9 6 15');
            }
        });
    });

    // Save scratchpad notes
    scratchpad.addEventListener('input', () => {
        // Auto-save to chrome.storage
        chrome.storage.local.set({ scratchpad: scratchpad.value });
    });

    // Load saved scratchpad notes
    chrome.storage.local.get(['scratchpad'], (result) => {
        if (result.scratchpad) {
            scratchpad.value = result.scratchpad;
        }
    });

    // === Listen for messages from background ===
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'TRANSCRIPT_UPDATE') {
            addTranscriptLine(message.speaker, message.text);
        } else if (message.type === 'MEDICAL_TERM_DETECTED') {
            displayMedicalTerm(message.term);
        } else if (message.type === 'QA_TIP') {
            // Add QA tip to panel
            const tip = document.createElement('div');
            tip.className = 'qa-tip';
            tip.innerHTML = `
                <span class="tip-label">Reminder:</span>
                <span class="tip-text">${message.text}</span>
            `;
            qaTipsPanel.appendChild(tip);
        }
        sendResponse({ success: true });
    });

    // === Initialization ===
    console.log('InterpreCoach UI initialized (Dark Theme)');

    // Stop audio bars animation initially
    document.querySelectorAll('.bar').forEach(bar => {
        bar.style.animationPlayState = 'paused';
    });

    // Add some sample data for demonstration
    setTimeout(() => {
        // Sample transcript is already in HTML
        // Sample terminology is already in HTML
        // Sample QA tip is already in HTML
        // Sample dictionary entries are already in HTML
    }, 100);
});
