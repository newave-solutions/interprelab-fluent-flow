# InterpreCoach Chrome Extension - HIPAA Compliant

## Overview
InterpreCoach is a HIPAA-compliant medical interpretation assistant Chrome extension that provides real-time terminology support, medication information, and unit conversions without storing any Protected Health Information (PHI).

## Installation
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `public/chrome-extension` folder

## HIPAA Compliance Features
- ✅ **Zero PHI Storage**: No data persisted to disk, localStorage, or remote databases
- ✅ **Automatic De-identification**: All PHI removed before AI processing
- ✅ **In-Memory Only**: Transcripts held temporarily during active sessions
- ✅ **Automatic Clearing**: All data cleared when overlay is closed

## Key Features
1. **Real-time Speech Recognition**: Browser-based speech-to-text
2. **Medication Detection**: Identifies medications with generic/brand names
3. **Unit Conversions**: Automatic meters→feet, kg→lbs conversions
4. **Medical Terminology**: Context-aware medical term definitions
5. **Key Highlights**: AI-powered clinical insights extraction

## Usage
1. Click the extension icon on any webpage
2. Click "Start Session" to begin speech recognition
3. Speak naturally - the extension will:
   - Transcribe in real-time
   - De-identify PHI automatically
   - Detect medications and provide alternatives
   - Convert units for reference
   - Extract medical terminology
4. Click "End Session" to stop and clear all data

## Protected Data Types
The extension automatically redacts:
- Names and titles
- Phone numbers
- Email addresses
- SSN, MRN, Patient IDs
- Dates of birth/service
- Addresses and ZIP codes

## Technical Stack
- Content Script: Real-time processing
- Edge Function: De-identified AI analysis
- Speech Recognition API: Browser native
- No external PHI transmission

## Security Notes
- No conversation history sent to backend
- Only de-identified text processed by AI
- All processing happens client-side first
- Clear data on session end

Version: 1.0.0
Last Updated: 2025-01-27
