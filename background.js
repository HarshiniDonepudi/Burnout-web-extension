// ---------- Global Variables and Constants ----------
let sessionStart = null;
const MAX_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
let tabSwitchCount = 0;

// Variables for tracking active tab time
let currentActiveTabId = null;
let currentActiveCategory = null; // "work", "leisure", or null
let activeStartTime = 0; // Timestamp when the current tab became active

const defaultWorkDomains = ['outlook.com', 'office.com', 'slack.com', 'github.com', 'linkedin.com', 'gmail.com'];
const defaultLeisureDomains = ['youtube.com', 'netflix.com', 'reddit.com', 'twitter.com', 'instagram.com'];
const stressKeywords = ['burnout', 'stress', 'overworked', 'exhausted'];

// Google Sheets endpoints – replace with your deployed web app URLs.
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwtsaEKPo-PV1f4lRWDM9Coc3-4F685qGZM6sTyXvK_GkyK5Mhc9d5vu9VAwXiyGBeh-A/exec";
const GOOGLE_SHEETS_CALENDAR_URL = "https://script.google.com/macros/s/YOUR_CALENDAR_SCRIPT_ID/exec";

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

// Create an alarm to sync calendar data every minute.
chrome.alarms.create("calendarSync", { periodInMinutes: 1 });

// ---------- Helper Functions ----------

// Retrieve browsing metrics from storage and send them.
function syncMetrics() {
  chrome.storage.local.get(
    ['workTime', 'leisureTime', 'stressSearchCount', 'tabSwitchCount', 'openTabsCount', 'tabSwitchRate'],
    (data) => {
      sendDataToGoogleSheets({ event: 'immediateSync', data: data });
    }
  );
}

// Send browsing data to the primary Google Sheet.
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
      .then(text => console.log("Browsing data sent:", text))
      .catch(error => console.error("Error sending browsing data:", error));
  });
}

// Send calendar data to the separate Google Sheet (same spreadsheet, different tab).
function sendCalendarDataToGoogleSheets(data) {
  chrome.storage.local.get("userId", (result) => {
    if (!result.userId) {
      result.userId = crypto.randomUUID();
      chrome.storage.local.set({ userId: result.userId });
    }
    data.userId = result.userId;
    data.timestamp = new Date().toISOString();
    fetch(GOOGLE_SHEETS_CALENDAR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => response.text())
      .then(text => console.log("Calendar data sent:", text))
      .catch(error => console.error("Error sending calendar data:", error));
  });
}

// ---------- Google Calendar Integration ----------
function getGoogleCalendarEvents(callback) {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error("Calendar auth error:", chrome.runtime.lastError);
      if (callback) callback(null);
      return;
    }
    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.items && Array.isArray(data.items)) {
          console.log("Calendar events fetched:", data.items.length);
          // Send the calendar API response to the calendar sheet.
          sendCalendarDataToGoogleSheets({ event: 'calendarData', data: data });
        }
        if (callback) callback(data);
      })
      .catch(err => {
        console.error("Error fetching calendar events:", err);
        if (callback) callback(null);
      });
  });
}

// ---------- Alarm Listener ----------
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "calendarSync") {
    getGoogleCalendarEvents();
  }
});

// ---------- Active Tab & Time Tracking ----------
function updateActiveCategoryTime() {
  if (currentActiveCategory && activeStartTime) {
    const elapsed = Date.now() - activeStartTime;
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

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  if (tabId === currentActiveTabId) {
    updateActiveCategoryTime();
    currentActiveCategory = null;
    activeStartTime = 0;
    currentActiveTabId = null;
    syncMetrics();
  }
});

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

chrome.tabs.onActivated.addListener(() => {
  tabSwitchCount++;
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    chrome.storage.local.set({
      tabSwitchCount: tabSwitchCount,
      openTabsCount: tabs.length
    }, syncMetrics);
  });
});

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

// ---------- Message Listener ----------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'periodicResponse') {
    sendDataToGoogleSheets({ event: 'periodicResponse', responses: message.responses });
    sendResponse({ status: 'success' });
  } else if (message.type === 'setupResponse') {
    sendDataToGoogleSheets({ event: 'setupResponse', responses: message.responses });
    sendResponse({ status: 'success' });
  }
});
