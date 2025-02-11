// ---------- Global Variables and Constants ----------
let sessionStart = null;
const MAX_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
let tabSwitchCount = 0;

// Variables for tracking active tab time
let currentActiveTabId = null;
let currentActiveCategory = null; // "work", "leisure", or null
let activeStartTime = 0; // Timestamp when the current tab became active

const defaultWorkDomains = ['workmail.com', 'office.com', 'slack.com', 'github.com'];
const defaultLeisureDomains = ['youtube.com', 'netflix.com', 'reddit.com', 'twitter.com'];
const stressKeywords = ['burnout', 'stress', 'overworked', 'exhausted'];

// Google Sheets endpoint (replace with your actual web app URL)
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwtsaEKPo-PV1f4lRWDM9Coc3-4F685qGZM6sTyXvK_GkyK5Mhc9d5vu9VAwXiyGBeh-A/exec";

// ---------- Initialization ----------
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['userId', 'setupComplete'], (result) => {
    if (!result.userId) {
      const newUserId = crypto.randomUUID();
      chrome.storage.local.set({ userId: newUserId });
    }
    if (!result.setupComplete) {
      chrome.tabs.create({ url: chrome.runtime.getURL('setup.html') });
    }
  });
});

// Create an alarm for syncing data every 15 minutes.
chrome.alarms.create('syncData', { periodInMinutes: 15 });

// Every minute, update tabSwitchRate and reset tabSwitchCount.
setInterval(() => {
  chrome.storage.local.set({ tabSwitchRate: tabSwitchCount });
  console.log("Tab Switch Rate (per minute):", tabSwitchCount);
  tabSwitchCount = 0;
}, 60 * 1000);

// ---------- Helper Function: Send Data to Google Sheets ----------
function sendDataToGoogleSheets(data) {
  chrome.storage.local.get("userId", (result) => {
    if (!result.userId) {
      result.userId = crypto.randomUUID();
      chrome.storage.local.set({ userId: result.userId });
    }
    data.userId = result.userId;
    data.timestamp = new Date().toISOString();
    fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.text())
      .then(text => console.log("Data sent:", text))
      .catch(error => console.error("Error sending data:", error));
  });
}

// ---------- Function to Update Active Category Time ----------
function updateActiveCategoryTime() {
  if (currentActiveCategory && activeStartTime) {
    const elapsed = Date.now() - activeStartTime; // Time in ms
    chrome.storage.local.get([currentActiveCategory + "Time"], (result) => {
      let currentTime = result[currentActiveCategory + "Time"] || 0;
      currentTime += elapsed;
      const update = {};
      update[currentActiveCategory + "Time"] = currentTime;
      chrome.storage.local.set(update, () => {
        console.log("Updated " + currentActiveCategory + "Time by", elapsed, "ms");
      });
    });
  }
  activeStartTime = Date.now();
}

// ---------- Listeners for Active Tab and Time Tracking ----------

// When a tab is activated, update the time spent on the previous tab and start tracking the new one.
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateActiveCategoryTime(); // Update time for previous active tab
  currentActiveTabId = activeInfo.tabId;
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) return;
    let url = tab.url ? tab.url.toLowerCase() : "";
    chrome.storage.local.get(['workDomains', 'leisureDomains'], (data) => {
      const workDomains = data.workDomains || defaultWorkDomains;
      const leisureDomains = data.leisureDomains || defaultLeisureDomains;
      let category = null;
      workDomains.forEach(domain => {
        if (url.includes(domain.toLowerCase())) category = 'work';
      });
      leisureDomains.forEach(domain => {
        if (url.includes(domain.toLowerCase())) category = 'leisure';
      });
      currentActiveCategory = category; // May be null if no match
      activeStartTime = Date.now(); // Reset start time for new tab
    });
  });
});

// When a tab is closed, update the time if that tab was active.
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === currentActiveTabId) {
    updateActiveCategoryTime();
    currentActiveCategory = null;
    activeStartTime = 0;
    currentActiveTabId = null;
  }
});

// ---------- Idle State Handling ----------
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === 'active') {
    activeStartTime = Date.now();
    sessionStart = sessionStart || Date.now();
  } else if (newState === 'idle' || newState === 'locked') {
    updateActiveCategoryTime();
    if (sessionStart) {
      const sessionDuration = Date.now() - sessionStart;
      if (sessionDuration >= MAX_SESSION_DURATION) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'assets/icons/icon48.png',
          title: 'Take a Break!',
          message: 'You have been active for over 2 hours without a break.'
        });
      }
      sendDataToGoogleSheets({ event: 'session', duration: sessionDuration });
      sessionStart = null;
    }
  }
});

// ---------- Other Event Listeners ----------

// Increment tab switch count on tab activation.
chrome.tabs.onActivated.addListener(() => {
  tabSwitchCount++;
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    chrome.storage.local.set({
      tabSwitchCount: tabSwitchCount,
      openTabsCount: tabs.length
    });
  });
});

// Detect stress-related searches.
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url.toLowerCase();
    if (stressKeywords.some(keyword => url.includes(keyword))) {
      chrome.storage.local.get(['stressSearchCount'], (result) => {
        let count = result.stressSearchCount || 0;
        count++;
        chrome.storage.local.set({ stressSearchCount: count });
      });
    }
  },
  { urls: ["<all_urls>"] },
  []
);

// Sync data to Google Sheets every 15 minutes.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncData') {
    chrome.storage.local.get(
      ['workTime', 'leisureTime', 'stressSearchCount', 'tabSwitchCount', 'openTabsCount', 'tabSwitchRate'],
      (data) => {
        sendDataToGoogleSheets({ event: 'periodicSync', data: data });
      }
    );
  }
});

// Open check-in questions (questions.html) every time a new tab is created if 15 minutes have passed.
chrome.tabs.onCreated.addListener(() => {
  chrome.storage.local.get("lastQuestionsShown", (data) => {
    const lastTime = data.lastQuestionsShown || 0;
    const now = Date.now();
    if (now - lastTime >= 15 * 60 * 1000) { // 15-minute interval
      chrome.storage.local.set({ lastQuestionsShown: now }, () => {
        chrome.tabs.create({ url: chrome.runtime.getURL("questions.html") });
      });
    }
  });
});

// Listen for messages (from setup or periodic check-in pages).
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'periodicResponse') {
    sendDataToGoogleSheets({ event: 'periodicResponse', responses: message.responses });
    sendResponse({ status: 'success' });
  } else if (message.type === 'setupResponse') {
    sendDataToGoogleSheets({ event: 'setupResponse', responses: message.responses });
    sendResponse({ status: 'success' });
  }
});
