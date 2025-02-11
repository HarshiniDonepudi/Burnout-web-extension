

// ---------- Global Variables and Constants ----------
let sessionStart = null;
const MAX_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
let tabSwitchCount = 0;

// Global flag indicating if a check-in (questions.html) is active.
let checkinActive = false;

// Variables for tracking active tab time
let currentActiveTabId = null;
let currentActiveCategory = null; // "work", "leisure", or null
let activeStartTime = 0; // Timestamp when the current tab became active

const defaultWorkDomains = ['outlook.com', 'office.com', 'slack.com', 'github.com','linkedin.com','gmail.com'];
const defaultLeisureDomains = ['youtube.com', 'netflix.com', 'reddit.com', 'twitter.com','instagram.com'];
const stressKeywords = ['burnout', 'stress', 'overworked', 'exhausted'];

// Google Sheets endpoint – replace with your deployed Google Apps Script URL.
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzOBG79BY9kNoM2_o24cFvrnCylioKfJw5q_rwwTYq1rYlcsatBmbrICqNAdUZ90J-GIA/exec";

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

// Every minute, update the tab switch rate and reset tabSwitchCount.
setInterval(() => {
  chrome.storage.local.set({ tabSwitchRate: tabSwitchCount });
  console.log("Tab Switch Rate (per minute):", tabSwitchCount);
  syncMetrics();
  tabSwitchCount = 0;
}, 60 * 1000);

// ---------- Helper Functions ----------

// Immediately retrieve the latest metrics and send them.
function syncMetrics() {
  chrome.storage.local.get(
    ['workTime', 'leisureTime', 'stressSearchCount', 'tabSwitchCount', 'openTabsCount', 'tabSwitchRate'],
    (data) => {
      sendDataToGoogleSheets({ event: 'immediateSync', data: data });
    }
  );
}

// Function to send data immediately to Google Sheets.
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

// Updates the time spent on the current active category.
function updateActiveCategoryTime() {
  if (currentActiveCategory && activeStartTime) {
    const elapsed = Date.now() - activeStartTime; // elapsed time in ms
    chrome.storage.local.get([currentActiveCategory + "Time"], (result) => {
      let currentTime = result[currentActiveCategory + "Time"] || 0;
      currentTime += elapsed;
      let update = {};
      update[currentActiveCategory + "Time"] = currentTime;
      chrome.storage.local.set(update, () => {
        console.log("Updated " + currentActiveCategory + "Time by", elapsed, "ms");
        syncMetrics();
      });
    });
  }
  activeStartTime = Date.now();
}

// ---------- Listeners for Active Tab and Time Tracking ----------

// When a tab is activated, update the previous tab’s time and start tracking the new one.
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateActiveCategoryTime();
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
      currentActiveCategory = category;
      activeStartTime = Date.now();
      syncMetrics();
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
    syncMetrics();
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
    }, syncMetrics);
  });
});

// Detect stress-related searches and immediately sync.
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = details.url.toLowerCase();
    if (stressKeywords.some(keyword => url.includes(keyword))) {
      chrome.storage.local.get(['stressSearchCount'], (result) => {
        let count = result.stressSearchCount || 0;
        count++;
        chrome.storage.local.set({ stressSearchCount: count }, syncMetrics);
      });
    }
  },
  { urls: ["<all_urls>"] },
  []
);

// ---------- New Tab Creation: Show Check-In Every 4th New Tab & Block Others When Active ----------
chrome.tabs.onCreated.addListener((tab) => {
  const checkinUrl = chrome.runtime.getURL("questions.html");
  if (checkinActive) {
    // If a check-in is active, block any new tab that isn’t the check-in page.
    if (!tab.url || tab.url.indexOf(checkinUrl) === -1) {
      chrome.tabs.remove(tab.id);
    }
    return; // Do not proceed with normal new-tab counting.
  }
  // Normal new-tab counting: every 4th new tab shows the check-in page.
  chrome.storage.local.get("newTabCount", (data) => {
    let count = data.newTabCount || 0;
    count++;
    if (count % 4 === 0) {
      chrome.tabs.create({ url: checkinUrl });
    }
    chrome.storage.local.set({ newTabCount: count });
  });
});

// ---------- Listen for Messages from Setup or Check-In Pages ----------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'periodicResponse') {
    sendDataToGoogleSheets({ event: 'periodicResponse', responses: message.responses });
    sendResponse({ status: 'success' });
  } else if (message.type === 'setupResponse') {
    sendDataToGoogleSheets({ event: 'setupResponse', responses: message.responses });
    sendResponse({ status: 'success' });
  } else if (message.type === 'checkinActive') {
    // Set the global check-in flag based on the message.
    checkinActive = message.active;
    sendResponse({ status: 'received' });
  }
});
