# InterpreCoach Browser Extension

A HIPAA-compliant interpreter auto-copilot for medical interpretation with real-time transcription, medical terminology translation, and session highlights.

## Features

### 1. Real-Time Transcription
- Live audio capture and speech-to-text conversion
- Automatic speaker detection
- Timestamped transcript segments
- Scrollable transcript history

### 2. Medical Terminology Translation
- Automatic detection of medical terms
- Spanish translation with phonetic pronunciation
- Detailed definitions
- Context-appropriate images (when available)
- 50+ pre-loaded medical terms

### 3. Key Highlights
- Automatic extraction of:
  - Symptoms
  - Medications and dosage instructions
  - Medical events
  - Treatment instructions
  - Follow-up requirements
- Color-coded by category
- Timestamped for reference

### 4. Interpreter Notes
- Dedicated text area for manual notes
- Auto-save functionality
- Persistent storage with session

### 5. AI Chat Interface
- Manual query input at the bottom
- Process custom questions
- Search functionality (coming soon)

## HIPAA Compliance

### Security Measures
- **No Audio Storage**: Audio is processed in real-time and immediately discarded
- **Encrypted Transit**: All data transmitted over secure HTTPS connections
- **Automatic Cleanup**: Temporary data is purged periodically and on session end
- **Secure Database**: All PHI stored in encrypted Supabase database
- **Session Isolation**: Each session is independent with unique identifiers
- **Access Control**: Row-level security policies on all database tables

### Data Retention
- Audio: 0 seconds (never stored)
- Transcripts: Stored securely in database, can be deleted per session
- Notes: Persistent but can be manually deleted
- Session data: Auto-expires after 30 days (configurable)

## Installation

### For Development
1. Clone or download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked"
5. Select the `extension` directory
6. The extension icon will appear in your toolbar

### For Production
1. Package the extension as a .crx file or publish to Chrome Web Store
2. Users can install from the store or load the .crx file

## Usage

### Starting a Session
1. Click the InterpreCoach icon in your toolbar
2. Click "Start Session" button
3. Allow microphone access when prompted
4. Speak naturally - transcription begins automatically

### During a Session
- **Transcription**: View live transcription in top-left panel
- **Medical Terms**: Detected terms appear in top-right panel with translations
- **Highlights**: Important information auto-categorized in bottom-left panel
- **Notes**: Type manual notes in bottom-right panel
- **Chat**: Use the input at the bottom for manual queries

### Ending a Session
1. Click "End Session" button
2. All data is automatically saved to the database
3. Temporary audio data is securely disposed

## Technical Architecture

### Components
- `manifest.json` - Extension configuration
- `popup.html` - Main UI structure
- `styles.css` - Beautiful, production-ready styling
- `popup.js` - Main application logic
- `config.js` - Configuration and constants
- `supabase-client.js` - Database integration
- `audio-processor.js` - Audio capture and transcription
- `medical-terminology.js` - Medical term detection and translation
- `highlights-extractor.js` - Conversation analysis and highlighting
- `background.js` - Background service worker for HIPAA compliance
- `content.js` - Content script for page integration

### Database Schema
- `interpreter_sessions` - Session metadata
- `session_transcripts` - Transcription segments
- `medical_terms` - Detected medical terminology
- `session_highlights` - Extracted highlights
- `interpreter_notes` - Interpreter notes

### Browser API Usage
- Web Speech API for transcription
- MediaRecorder API for audio capture
- Chrome Storage API for temporary data
- Supabase for persistent storage

## Configuration

Edit `config.js` to customize:
- Audio chunk duration
- Maximum transcript items
- HIPAA compliance settings
- Supabase connection (already configured)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Requires manifest v2 version
- Safari: Requires different approach (WebKit)

## Future Enhancements

- Multiple language support
- Advanced AI-powered suggestions
- Export session reports
- Integration with EHR systems
- Voice commands
- Custom medical dictionary
- Offline mode
- Mobile support

## Support

For issues, questions, or feature requests, contact the development team.

## License

Proprietary - All rights reserved
