# InterpreCoach Installation Guide

## Prerequisites
- Google Chrome or Microsoft Edge (latest version)
- Microphone access for audio capture
- Internet connection for Supabase database

## Installation Steps

### Step 1: Download the Extension
Ensure you have all the extension files in the `extension` directory.

### Step 2: Load Extension in Chrome

1. Open Google Chrome or Microsoft Edge
2. Navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`

3. Enable **Developer Mode**:
   - Look for a toggle switch in the top-right corner
   - Turn it ON

4. Click **"Load unpacked"** button:
   - This button appears after enabling Developer mode
   - Usually located in the top-left area

5. Select the Extension Directory:
   - Navigate to and select the `extension` folder
   - Click "Select Folder" or "Open"

6. Verify Installation:
   - The InterpreCoach extension should now appear in your extensions list
   - You should see the extension icon in your browser toolbar
   - If you don't see the icon, click the puzzle piece icon and pin InterpreCoach

### Step 3: Grant Permissions

When you first use the extension:
1. Click the InterpreCoach icon in your toolbar
2. Click "Start Session"
3. Allow microphone access when prompted
4. The browser will remember this permission for future use

## First Time Usage

1. **Click the Extension Icon**: Opens the InterpreCoach popup window
2. **Start a Session**: Click the "Start Session" button
3. **Grant Microphone Permission**: Allow access when prompted
4. **Begin Speaking**: Transcription starts automatically

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the `extension` directory
- Check that `manifest.json` exists
- Reload the extension from `chrome://extensions/`

### Microphone Not Working
- Check browser permissions: Settings > Privacy and Security > Site Settings > Microphone
- Ensure your microphone is working in other applications
- Try reloading the extension
- Check browser console for errors (F12)

### Transcription Not Appearing
- Web Speech API requires an internet connection
- Some browsers may not support all features
- Check if your language is supported
- Look for errors in the browser console (F12)

### Database Connection Issues
- Verify internet connection
- Check that Supabase credentials in `config.js` are correct
- Open browser console (F12) to see detailed error messages

## Uninstalling

1. Go to `chrome://extensions/`
2. Find InterpreCoach
3. Click "Remove"
4. Confirm the removal

**Note**: Removing the extension does NOT delete session data from the database. Data remains in Supabase for record-keeping.

## Security Notes

- The extension follows HIPAA compliance guidelines
- Audio is NEVER stored permanently
- All data transmitted over secure HTTPS
- Session data is encrypted at rest in Supabase
- Temporary data is automatically cleaned up

## Support

For issues or questions:
1. Check the browser console (F12) for error messages
2. Review the README.md for detailed documentation
3. Contact your system administrator

## Browser Compatibility

### Fully Supported
- Google Chrome (v90+)
- Microsoft Edge (v90+)
- Chromium-based browsers

### Limited Support
- Firefox (requires manifest v2 version)
- Safari (requires WebKit adaptations)
- Opera (Chromium-based, should work)

## Development Mode Notes

When running in development mode:
- You may see warnings about manifest version
- Extension updates require manual reload
- To reload: Go to `chrome://extensions/` and click the reload icon

## Production Deployment

For production use:
1. Package the extension as a .crx file
2. Publish to Chrome Web Store (recommended)
3. Or distribute the .crx file to users
4. Users can install from the store or load the .crx file

## Next Steps

After installation:
1. Review the README.md for feature documentation
2. Practice with a test session
3. Familiarize yourself with all four panels
4. Explore the medical terminology database
5. Test the notes auto-save feature
