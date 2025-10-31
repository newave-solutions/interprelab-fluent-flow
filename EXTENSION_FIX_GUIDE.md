# InterpreCoach Extension - Error Fix Guide

## Issue Fixed

**Error:** "Cannot access a chrome:// URL" at line 56 in background.js

## What Was Wrong

1. **Missing offscreen.js file** - The extension referenced an offscreen document but the file didn't exist
2. **No URL protection** - Extension tried to inject scripts into protected Chrome URLs (chrome://, chrome-extension://)
3. **Content script matching all URLs** - Including protected Chrome pages

## Changes Made

### 1. Created `offscreen.js`

- Handles audio capture from browser tabs
- Uses MediaRecorder API for audio streaming
- Sends audio chunks to background script for processing
- Properly manages audio stream lifecycle

### 2. Updated `background.js`

- Added URL validation before script injection
- Prevents injection into `chrome://` and `chrome-extension://` URLs
- Added try-catch error handling
- Better error logging

### 3. Updated `manifest.json`

- Changed content_scripts to only match `http://` and `https://` URLs
- Excluded Chrome Web Store pages
- Removed `<all_urls>` pattern that was causing issues

## How to Test

### Step 1: Reload the Extension

1. Go to `chrome://extensions/`
2. Find "InterpreCoach"
3. Click the **Reload** button (circular arrow icon)

### Step 2: Test on a Valid Page

1. **Navigate away from chrome:// pages first** - open a new tab with https://www.google.com
2. Click the InterpreCoach extension icon
3. The extension should inject without errors

### Step 3: Verify Protected Pages

1. Go to `chrome://extensions/` or any chrome:// page
2. Try clicking the extension icon
3. You should see a **notification** saying: "Extension cannot run on this page. Please navigate to a regular website."
4. **This is expected behavior** - extensions can't run on Chrome internal pages
5. No errors should appear in the console

### Step 4: Test Audio Capture (When Ready)

1. Open a video conferencing site (Google Meet, Zoom web)
2. Click the extension icon to open the UI
3. Click "Start Session"
4. Check browser console for audio capture logs

## Where the Extension Works

✅ **Works on:**

- Regular websites (http://, https://)
- Google Meet (meet.google.com)
- Zoom web client
- Any web-based video conferencing
- Medical portals and EMR systems

❌ **Does NOT work on:**

- Chrome internal pages (chrome://)
- Chrome Web Store (chrome.google.com/webstore)
- Extension management page (chrome://extensions/)
- New Tab page (chrome://newtab/)
- PDF viewer (chrome-extension://)

This is a **Chrome security restriction** - no extension can run on these pages.

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Can click extension icon on regular websites
- [ ] Console shows no "Cannot access chrome://" errors
- [ ] Extension UI appears when clicked
- [ ] Protected pages are gracefully handled
- [ ] Audio capture initializes (check console logs)

## Next Steps

### For Basic Testing

The extension should now load without errors. Test it on:

- https://www.google.com
- https://meet.google.com (in a meeting)
- Any regular website

### For Audio Transcription

To actually transcribe audio, you'll need to:

1. Add a transcription API (AssemblyAI, Deepgram, or Google Speech-to-Text)
2. Send audio chunks from offscreen.js to the API
3. Display transcripts in the popup UI

### For Medical Term Detection

The extension has a basic medical dictionary in `medical-terminology.js`. You can:

1. Expand the dictionary with more terms
2. Integrate with a medical terminology API
3. Add AI-powered term extraction using OpenAI

## Common Issues

### Issue: Extension icon is grayed out

**Solution:** You're on a protected Chrome page. Navigate to a regular website.

### Issue: "Cannot access contents of URL" error

**Solution:** The page might be blocking extensions. Try a different website.

### Issue: Audio capture fails

**Solution:**

- Check microphone permissions in Chrome settings
- Ensure you're on a page with audio (like a video call)
- Check browser console for specific error messages

### Issue: Extension doesn't appear after clicking icon

**Solution:**

- Check browser console for errors
- Reload the extension
- Try on a different website

## Development Tips

### View Extension Logs

1. **Background script logs:**

   - Go to `chrome://extensions/`
   - Click "service worker" under InterpreCoach

2. **Content script logs:**

   - Open DevTools on the webpage (F12)
   - Check Console tab

3. **Popup logs:**
   - Right-click extension icon → Inspect popup
   - Check Console tab

### Debug Audio Capture

Add this to offscreen.js to see audio levels:

```javascript
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaStreamSource(audioStream);
source.connect(analyser);

// Log audio levels
setInterval(() => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
  console.log("Audio level:", average);
}, 1000);
```

## Files Modified

- ✅ `public/chrome-extension-interprecoach/offscreen.js` (created)
- ✅ `public/chrome-extension-interprecoach/background.js` (updated)
- ✅ `public/chrome-extension-interprecoach/manifest.json` (updated)

## Ready to Use

The extension is now fixed and ready for testing. Reload it in Chrome and try it on a regular website!
