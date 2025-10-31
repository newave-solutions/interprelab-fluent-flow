const OFFSCREEN_DOCUMENT_PATH = '/offscreen.html';
let creating; // A promise that resolves when the offscreen document is created

async function hasOffscreenDocument(path) {
  if ('getContexts' in chrome.runtime) {
    try {
      const contexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [chrome.runtime.getURL(path)]
      });
      return contexts.length > 0;
    } catch (error) {
      console.error('Error checking offscreen document:', error);
      return false;
    }
  }
  return false;
}

async function setupOffscreenDocument(path) {
  if (await hasOffscreenDocument(path)) {
    console.log('Offscreen document already exists.');
  } else {
    if (creating) {
      await creating;
    } else {
      creating = chrome.offscreen.createDocument({
        url: path,
        reasons: ['USER_MEDIA'],
        justification: 'Real-time audio processing for transcription.',
      });
      await creating;
      creating = null;
    }
  }
}

// --- Main Extension Logic ---

// Extension initialization
chrome.runtime.onInstalled.addListener(() => {
  console.log('InterpreCoach extension installed');
});

// Note: With default_popup in manifest, clicking the icon opens popup.html automatically
// No need for chrome.action.onClicked listener

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  if (message.type === 'START_CAPTURE') {
    console.log('Background: Received START_CAPTURE');
    await setupOffscreenDocument(OFFSCREEN_DOCUMENT_PATH);

    // Get the active tab to capture
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send a message to the offscreen document to start capture
    chrome.runtime.sendMessage({
      type: 'start-capture',
      target: 'offscreen-doc',
      tabId: tab.id,
    });
    sendResponse({ success: true });
  } else if (message.type === 'STOP_CAPTURE') {
    console.log('Background: Received STOP_CAPTURE');
    // Send a message to the offscreen document to stop
    chrome.runtime.sendMessage({
      type: 'stop-capture',
      target: 'offscreen-doc'
    });
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async responses
});
