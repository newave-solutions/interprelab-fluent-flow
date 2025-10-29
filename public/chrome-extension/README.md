# InterpreCoach Chrome Extension

## Overview
HIPAA-compliant medical interpretation assistant with Google Medical AI integration.

## Features
- ✅ Real-time speech recognition
- ✅ HIPAA-compliant PHI de-identification
- ✅ Medical terminology detection
- ✅ Medication database with generic/brand names
- ✅ Unit conversion (metric ↔ imperial)
- ✅ Google Medical AI integration (optional)
- ✅ Low-latency processing with caching
- ✅ Queue-based API calls for scalability
- ✅ No persistent data storage

## Installation

### Development Mode
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `public/chrome-extension` directory
5. The extension icon should appear in your toolbar

### Configuration
1. Copy `config.json.example` to `config.json`
2. Add your credentials:
   ```json
   {
     "supabaseUrl": "https://your-project.supabase.co",
     "supabaseAnonKey": "your-anon-key",
     "googleCloudProject": "your-project-id",
     "googleMedicalAIEnabled": true
   }
   ```

## Usage

### Basic Usage
1. Click the InterpreCoach extension icon
2. Click "Activate on Current Page"
3. The overlay will appear on the page
4. Click "Start Session" to begin speech recognition
5. Speak naturally - the extension will:
   - Transcribe your speech
   - De-identify any PHI automatically
   - Detect medical terms and medications
   - Convert units (kg→lbs, meters→feet)
   - Provide AI-powered insights

### HIPAA Compliance
- **No PHI Storage**: All data is held in-memory only
- **Automatic De-identification**: PHI patterns are redacted before processing
- **Session Isolation**: Data is cleared when session ends
- **Secure Transmission**: All API calls use HTTPS
- **Google Medical AI**: HIPAA-compliant when properly configured

## Architecture

### Files
- `manifest.json` - Extension configuration
- `background.js` - Service worker for extension lifecycle
- `content-script-optimized.js` - Main logic with optimizations
- `popup.html` - Extension popup UI
- `overlay-styles.css` - Overlay styling
- `config.json` - Configuration (not in version control)

### Optimizations
1. **Debouncing**: Reduces API calls by waiting for speech pauses
2. **Caching**: In-memory cache for repeated queries (5min TTL)
3. **Queue System**: Rate-limited API requests
4. **Batch DOM Updates**: Uses DocumentFragment for performance
5. **Timeout Handling**: 5-second timeout with AbortController
6. **Local Processing**: Medications and units processed locally

### Data Flow
```
Speech Input
    ↓
Speech Recognition API
    ↓
De-identification (Local)
    ↓
Local Processing (Medications, Units)
    ↓
Queue for API Processing
    ↓
Supabase Edge Function
    ↓
Google Medical AI (Optional)
    ↓
Display Results
```

## Google Medical AI Integration

### Setup
1. Enable Vertex AI API in Google Cloud Console
2. Create a service account with Vertex AI permissions
3. Generate API key
4. Add to Supabase environment variables:
   ```
   GOOGLE_CLOUD_API_KEY=your-api-key
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

### HIPAA Compliance
- Use Google Cloud's HIPAA-compliant services
- Sign a Business Associate Agreement (BAA) with Google
- Enable audit logging
- Use Med-PaLM 2 or other medical-specific models
- Ensure data residency requirements are met

### Models
- **Med-PaLM 2**: Medical question answering
- **MedLM**: Clinical documentation
- **Gemini Pro**: General medical insights

## Performance

### Metrics
- **Speech Recognition**: Real-time (< 100ms latency)
- **Local Processing**: < 50ms
- **API Calls**: < 2s (with timeout at 5s)
- **Cache Hit Rate**: ~60-70% for repeated terms
- **Memory Usage**: < 50MB

### Scalability
- Queue system prevents API overload
- Rate limiting: 500ms between requests
- Max queue size: 10 items
- Automatic fallback to local processing

## Security

### PHI Protection
The extension automatically redacts:
- Names (with titles: Dr., Mr., Mrs., etc.)
- Phone numbers
- Email addresses
- Social Security Numbers
- Dates
- Medical Record Numbers
- Addresses
- ZIP codes

### Best Practices
1. Always review transcripts before sharing
2. End sessions when not in use
3. Don't use on public computers
4. Keep extension updated
5. Report any PHI leaks immediately

## Troubleshooting

### Speech Recognition Not Working
- Check microphone permissions
- Ensure HTTPS connection (required for Web Speech API)
- Try refreshing the page
- Check browser console for errors

### API Errors
- Verify Supabase credentials in `config.json`
- Check network connectivity
- Review Supabase function logs
- Ensure Google Cloud credentials are valid

### Performance Issues
- Clear cache (end and restart session)
- Check network speed
- Reduce background tabs
- Update Chrome to latest version

## Development

### Testing
```bash
# Test on a page
https://example.com?interprecoach=1
```

### Debugging
1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Monitor Network tab for API calls
4. Use Performance tab for profiling

### Building for Production
1. Update version in `manifest.json`
2. Remove debug code
3. Minify JavaScript (optional)
4. Test thoroughly
5. Package as ZIP for Chrome Web Store

## Roadmap

### Planned Features
- [ ] Multi-language support
- [ ] Offline mode with local AI
- [ ] Custom medical terminology databases
- [ ] Integration with EHR systems
- [ ] Voice output for translations
- [ ] Session recording (with consent)
- [ ] Analytics dashboard
- [ ] Team collaboration features

## License
Proprietary - InterpreLab

## Support
For issues or questions, contact: support@interprelab.com
