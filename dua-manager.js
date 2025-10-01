document.addEventListener('DOMContentLoaded', function() {
  const duaList = document.getElementById('duaList');
  const newDuaInput = document.getElementById('newDuaInput');
  const addDuaButton = document.getElementById('addDuaButton');

  // Function to load and display duas from storage
  function loadDuas() {
    chrome.storage.sync.get(['phrases'], function(result) {
      const phrases = result.phrases || [];
      duaList.innerHTML = ''; // Clear the current list

      phrases.forEach((dua, index) => {
        const li = document.createElement('li');
        li.textContent = dua;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', function() {
          removeDua(index);
        });

        li.appendChild(removeBtn);
        duaList.appendChild(li);
      });
    });
  }

  // Function to add a new dua
  function addDua() {
    const newDua = newDuaInput.value.trim();
    if (newDua === '') return;

    chrome.storage.sync.get(['phrases'], function(result) {
      const phrases = result.phrases || [];
      phrases.push(newDua);
      chrome.storage.sync.set({ phrases: phrases }, function() {
        newDuaInput.value = ''; // Clear input field
        loadDuas(); // Refresh the list
      });
    });
  }

  // Function to remove a dua at a specific index
  function removeDua(index) {
    chrome.storage.sync.get(['phrases'], function(result) {
      let phrases = result.phrases || [];
      phrases.splice(index, 1); // Remove the item at the index
      chrome.storage.sync.set({ phrases: phrases }, function() {
        loadDuas(); // Refresh the list
      });
    });
  }

  // Event Listeners
  addDuaButton.addEventListener('click', addDua);
  newDuaInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addDua();
    }
  });

  // Initial load of duas when the page is opened
  loadDuas();
});
