document.addEventListener('DOMContentLoaded', function() {
  
  // Function to update popup display with data from storage
  function updatePopupInfo() {
    chrome.storage.sync.get(['phrases', 'currentPhraseIndex'], function(data) {
      const phrases = data.phrases || [];
      const currentIndex = data.currentPhraseIndex || 0;
      
      document.getElementById('phraseCount').textContent = phrases.length;
      document.getElementById('currentPosition').textContent = phrases.length > 0 ? currentIndex + 1 : 0;
    });
  }

  // Initial update when popup opens
  updatePopupInfo();
  
  // Show Next Dua button
  document.getElementById('testButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "showPhrase"}, function(response) {
      if (chrome.runtime.lastError) {
        // Handle error, e.g., background script might be inactive
        console.error(chrome.runtime.lastError.message);
        return;
      }
      if (response && response.success) {
        console.log("Dua notification sent");
        // Update current position after action
        updatePopupInfo();
      }
    });
  });
  
  // Reset button
  document.getElementById('resetButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "resetPhrases"}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }
      if (response && response.success) {
        document.getElementById('currentPosition').textContent = '1';
        console.log("Reset to first dua");
      }
    });
  });
  
  // Manage Duas button
  document.getElementById('manageButton').addEventListener('click', function() {
    chrome.tabs.create({ url: 'dua-manager.html' });
  });
});
