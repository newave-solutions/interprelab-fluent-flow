// InterpreCoach Background Service Worker

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
});

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('InterpreCoach extension installed');
});

// HIPAA Compliance: No data persistence
// This background script does not store any PHI or conversation data
