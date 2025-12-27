# InterpreCoach Chrome Extension - Integration Guide

**Status:** Future Microservice - Currently Simulated  
**Purpose:** Real-time AI assistance browser extension for interpreters  
**Last Updated:** December 26, 2025

---

## Overview

InterpreCoach will be a **standalone Chrome Extension microservice** providing real-time AI-powered assistance during live interpretation sessions. It is currently simulated in the codebase via `ExtensionUI.tsx` but will be developed as an independent service with its own repository and infrastructure.

---

## Key Features (from Simulation)

### Multi-Agent Architecture

The extension uses a multi-agent system for processing:

1. **Speech-to-Text Agent** - Converts audio to text with PII removal
2. **Medical Terminology Agent** - Detects and translates medical terms
3. **Cultural Context Agent** - Provides cultural adaptation recommendations
4. **Ethics & QA Agent** - Monitors interpretation accuracy and completeness
5. **Live Assistance LLM** - Suggests real-time translations
6. **Session Analytics Agent** - Tracks performance metrics

### UI Components (from Prototype)

- **Drag & Drop Interface** - Movable/resizable overlay window
- **Minimize to Dock** - Compact mode when not in active use
- **Context Windows** - Grid display of agent outputs
- **Real-time Updates** - Live processing indicators
- **Data Flow Visualization** - Pipeline showing: Audio → STT → PII Remove → LLM → UI

---

## Technical Architecture

### Chrome Extension Structure

```
interprecoach-extension/
├── manifest.json              # Extension manifest v3
├── background/
│   ├── service-worker.js     # Background processing
│   └── websocket-manager.js  # WebSocket connection to backend
├── content/
│   ├── content-script.js     # Injected into target pages
│   └── ui-overlay.jsx        # React overlay UI
├── popup/
│   ├── popup.html            # Extension popup
│   └── popup.jsx             # Popup UI (settings, etc.)
└── lib/
    ├── audio-capture.js      # Audio stream handling
    └── api-client.js         # Backend API communication
```

### Backend Microservice

```
interprecoach-backend/
├── services/
│   ├── stt-service/          # Speech-to-text processing
│   ├── medical-term-service/ # Medical terminology lookup
│   ├── cultural-context/     # Cultural adaptation logic
│   ├── llm-service/          # Gemini API integration
│   └── analytics-service/    # Session tracking
├── api/
│   └── websocket-server.js   # Real-time WebSocket server
└── docker/
    └── Dockerfile            # Container configuration
```

---

## Integration Steps (When Ready)

### Phase 1: Backend Setup

1. Create separate repository: `interprelab-coach-backend`
2. Set up microservice with WebSocket support
3. Implement agent services (STT, medical terms, LLM, etc.)
4. Deploy to Google Cloud Run or Firebase Functions

### Phase 2: Chrome Extension Development

1. Create repository: `interprelab-coach-extension`
2. Implement Chrome Extension manifest v3
3. Build React-based overlay UI
4. Add audio capture from browser tabs
5. Implement WebSocket client for backend communication

### Phase 3: Integration with Main App

1. Add ChromeExtensionIntegration page in main app
2. Provide download link to Chrome Web Store
3. Add authentication flow (Supabase tokens)
4. Display extension installation instructions

### Phase 4: Testing & Deployment

1. Manual testing on target platforms (Zoom, Teams, etc.)
2. Submit to Chrome Web Store
3. Beta testing with real interpreters
4. Public launch

---

## API Endpoints Needed

### WebSocket Connection

```javascript
// Extension connects to backend
const ws = new WebSocket('wss://interprecoach-backend.run.app/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'auth',
  token: supabaseToken
}));
```

### Real-time Audio Stream

```javascript
// Stream audio from browser
ws.send(JSON.stringify({
  type: 'audio_chunk',
  data: audioData, // Base64 encoded
  language: 'en',
  targetLanguage: 'es'
}));
```

### Agent Responses

```javascript
// Backend sends agent outputs
{
  type: 'agent_response',
  agent: 'medical_terminology',
  content: 'Detected: chest pain → dolor torácico',
  confidence: 96,
  timestamp: '2025-12-26T23:00:00Z'
}
```

---

## Data Flow

```
┌──────────────┐  Audio Stream   ┌───────────────────┐
│   Browser    │ ──────────────► │  Extension        │
│   (Zoom/etc) │                 │  Content Script   │
└──────────────┘                 └───────────────────┘
                                         │
                                         │ WebSocket
                                         ▼
                                 ┌───────────────────┐
                                 │  Backend          │
                                 │  Microservice     │
                                 └───────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
            │ STT Service  │    │ Medical Term │    │ LLM Service  │
            │              │    │   Service    │    │  (Gemini)    │
            └──────────────┘    └──────────────┘    └──────────────┘
                    │                    │                    │
                    └────────────────────┼────────────────────┘
                                         │
                                         │ WebSocket Response
                                         ▼
                                 ┌───────────────────┐
                                 │  Extension UI     │
                                 │  (Context Windows)│
                                 └───────────────────┘
```

---

## Chrome Extension Permissions Required

```json
{
  "manifest_version": 3,
  "permissions": [
    "activeTab",
    "tabCapture",      // For audio capture
    "storage",         // For settings/cache
    "notifications"    // For alerts
  ],
  "host_permissions": [
    "https://*.zoom.us/*",
    "https://*.teams.microsoft.com/*",
    // Other video conferencing platforms
  ]
}
```

---

## Security Considerations

1. **PII Removal:** All audio must be de-identified before sending to backend
2. **Encryption:** Use TLS for WebSocket connections
3. **Authentication:** Supabase JWT tokens for user authentication
4. **Data Retention:** Session data should be ephemeral (not stored long-term)
5. **HIPAA Compliance:** Medical terminology data must be handled securely

---

## UI/UX Requirements

### Overlay Window

- **Draggable:** User can move around screen
- **Resizable:** User can adjust size
- **Minimize:** Collapses to small icon
- **Opacity Control:** Adjustable transparency

### Context Windows Display

- **Grid Layout:** 2-column grid of agent outputs
- **Color Coding:**
  - Translation: Primary blue
  - Medical: Green
  - Cultural: Yellow
  - Analysis: Gray
- **Confidence Scores:** Show AI confidence percentage
- **Timestamps:** Show when each insight was generated

### Controls

- **Start/Stop Processing:** Toggle audio capture
- **Language Selector:** EN → ES, ES → EN, etc.
- **Settings:** Volume, opacity, window position
- **Mute:** Stop audio feedback

---

## Development Timeline Estimate

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Backend Microservice** | 4-6 weeks | WebSocket server, agent services, API |
| **Chrome Extension** | 3-4 weeks | UI, audio capture, WebSocket client |
| **Integration Testing** | 2 weeks | E2E testing, bug fixes |
| **Chrome Web Store** | 1-2 weeks | Review, approval, launch |
| **Total** | **10-14 weeks** | Fully functional extension |

---

## Dependencies

### Main App Integration

- `src/pages/InterpreCoach.tsx` - Marketing page with download link
- `src/components/InterpreCoachShowcase.tsx` - Feature showcase
- Authentication via Supabase Context

### External Services

- Google Gemini API for LLM
- Speech-to-Text service (Google Cloud Speech-to-Text or Deepgram)
- Supabase for user authentication and session logging

---

## Next Steps

1. **Decision Point:** Confirm microservice architecture approach
2. **Repository Setup:** Create separate repos for backend and extension
3. **Team Assignment:** Assign developers to backend vs extension work
4. **API Contract:** Define WebSocket message formats
5. **UI/UX Design:** Finalize extension overlay design

---

## Simulation Code Location

The current simulation can be found in:

- **File:** `src/components/ExtensionUI.tsx` (534 lines)
- **Purpose:** Visual prototype showing UI/UX concepts
- **Note:** To be replaced by actual Chrome Extension

**This file will be deleted** once extension development begins, as the real implementation will live in a separate repository.

---

**For questions or to start development, contact the project lead.**
