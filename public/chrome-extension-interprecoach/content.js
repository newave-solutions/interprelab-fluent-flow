console.log('InterpreCoach content script loaded');

// Mark that the extension is injected
window.interpreCoachInjected = true;

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  chrome.runtime.sendMessage({ type: 'SECURE_DELETE' }, (response) => {
    if (response && response.success) {
      console.log('Temporary data securely deleted on page unload');
    }
  });
});

// Initialize MutationObserver only when DOM is ready
function initializeMutationObserver() {
  if (!document.body) {
    console.log('Document body not ready, waiting...');
    return;
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const textContent = node.textContent;
          if (textContent && textContent.length > 0) {
            // TODO: Process text content for medical terms
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('MutationObserver initialized');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMutationObserver);
} else {
  // DOM is already ready
  initializeMutationObserver();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CAPTURE_AUDIO') {
    sendResponse({ status: 'ready' });
  } else if (request.type === 'TOGGLE_VISIBILITY') {
    // TODO: Toggle extension UI visibility
    console.log('Toggle visibility requested');
    sendResponse({ success: true });
  }
  return true; // Keep the message channel open for async responses
});
