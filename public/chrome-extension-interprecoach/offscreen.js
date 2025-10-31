// Offscreen document for audio capture
// This runs in a hidden document to access getUserMedia API

let mediaRecorder = null;
let audioStream = null;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.target !== 'offscreen-doc') {
    return;
  }

  if (message.type === 'start-capture') {
    console.log('Offscreen: Starting audio capture for tab', message.tabId);

    try {
      // Get the audio stream from the tab
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'tab',
            chromeMediaSourceId: message.tabId.toString()
          }
        }
      });

      // Create a MediaRecorder to capture the audio
      mediaRecorder = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm'
      });

      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);

          // Send audio chunk to background for processing
          chrome.runtime.sendMessage({
            type: 'AUDIO_CHUNK',
            data: event.data
          });
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Offscreen: Recording stopped');

        // Create a blob from all chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

        // Send final audio to background
        chrome.runtime.sendMessage({
          type: 'AUDIO_COMPLETE',
          blob: audioBlob
        });
      };

      // Start recording in chunks (every 1 second)
      mediaRecorder.start(1000);
      console.log('Offscreen: MediaRecorder started');

    } catch (error) {
      console.error('Offscreen: Error starting capture:', error);
      chrome.runtime.sendMessage({
        type: 'CAPTURE_ERROR',
        error: error.message
      });
    }
  } else if (message.type === 'stop-capture') {
    console.log('Offscreen: Stopping audio capture');

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }

    mediaRecorder = null;
  }
});

console.log('Offscreen document loaded and ready');
