const toggle = document.getElementById('monitorToggle');

// Initialize toggle state from storage
chrome.storage.local.get(["monitoringEnabled"], (result) => {
  toggle.checked = !!result.monitoringEnabled;
});

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ monitoringEnabled: toggle.checked });
});
