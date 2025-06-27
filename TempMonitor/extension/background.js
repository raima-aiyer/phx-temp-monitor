const API_URL = "http://localhost:5000/check-temperature";
const POLL_INTERVAL = 15 * 60 * 1000; // 15 minutes
let timerId = null;

async function checkTemperatureAndNotify() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    if (data.notify && data.message) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Phoenix Heat Alert!",
        message: data.message
      });
    }
  } catch (e) {
    // Optionally handle errors
  }
}

function startMonitoring() {
  if (!timerId) {
    checkTemperatureAndNotify(); // Run immediately
    timerId = setInterval(checkTemperatureAndNotify, POLL_INTERVAL);
  }
}

function stopMonitoring() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// Listen for toggle state changes from popup
chrome.storage.local.get(["monitoringEnabled"], (result) => {
  if (result.monitoringEnabled) {
    startMonitoring();
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.monitoringEnabled) {
    if (changes.monitoringEnabled.newValue) {
      startMonitoring();
    } else {
      stopMonitoring();
    }
  }
});
