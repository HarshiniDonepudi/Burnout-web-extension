// ---------- Global Variables and Constants ----------
let sessionStart = null;
const MAX_SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
let tabSwitchCount = 0;

// Variables for tracking active tab time
let currentActiveTabId = null;
let currentActiveCategory = null; // "work", "leisure", or null
let activeStartTime = 0; // Timestamp when the current tab became active

const defaultWorkDomains = ['outlook.com', 'office.com', 'slack.com', 'github.com','linkedin.com','gmail.com'];
const defaultLeisureDomains = ['youtube.com', 'netflix.com', 'reddit.com', 'twitter.com','instagram.com'];
const stressKeywords = ['burnout', 'stress', 'overworked', 'exhausted'];

// Google Sheets endpoint – replace with your deployed Google Apps Script URL.
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbyCAVKwUljLUcveY7gQZZsy7nRZdAA8UMn8f97fp7ZM4Pu4weJhYud0D8V2gbZPVr0S/exec";


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

// Retrieve browsing metrics from storage and send them.
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

// ---------- Active Tab & Time Tracking ----------
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
      sendDataToGoogleSheets({
        event: 'session',
        data: { duration: sessionDuration } 
      });
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

// ---------- Calendar Data Fetching ----------
// Fetch events from ALL calendars for the current day.
function getGoogleCalendarEvents(callback) {
  chrome.identity.getAuthToken({ interactive: true }, function(token) {
    if (chrome.runtime.lastError) {
      console.error("Calendar auth error:", chrome.runtime.lastError);
      if (callback) callback(null);
      return;
    }
    
    // Calculate start and end of the current day.
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();
    
    // First, fetch the list of calendars for the account.
    fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    .then(response => response.json())
    .then(calendarList => {
      if (!calendarList.items || calendarList.items.length === 0) {
        console.log("No calendars found.");
        if (callback) callback(null);
        return;
      }
      
      // For each calendar, fetch events for the current day.
      let promises = calendarList.items.map(calendar => {
        const calendarId = encodeURIComponent(calendar.id);
        const eventsUrl = "https://www.googleapis.com/calendar/v3/calendars/" + calendarId + "/events" +
          "?timeMin=" + encodeURIComponent(timeMin) +
          "&timeMax=" + encodeURIComponent(timeMax) +
          "&singleEvents=true" +
          "&orderBy=startTime";
        return fetch(eventsUrl, {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
        .then(response => response.json())
        .then(data => {
          return { calendar: calendar, events: data.items || [] };
        })
        .catch(err => {
          console.error("Error fetching events for calendar", calendar.id, err);
          return { calendar: calendar, events: [] };
        });
      });
      
      Promise.all(promises).then(results => {
        let allEvents = [];
        let eventsDetail = [];
        let totalEventTime = 0;
        let totalFreeTime = 0;
        
        // Collect events from all calendars.
        results.forEach(result => {
          result.events.forEach(evt => {
            // Only process events with valid start/end.
            if (evt.start && (evt.start.dateTime || evt.start.date)) {
              let startObj = new Date(evt.start.dateTime || evt.start.date);
              let endObj = new Date(evt.end.dateTime || evt.end.date);
              let duration = (endObj - startObj) / (1000 * 60); // in minutes
              totalEventTime += duration;
              
              let summary = evt.summary || "No Title";
              let description = evt.description || "No Description";
              let location = evt.location || "No Location";
              
              // Include the calendar summary for clarity.
              let detail = "[" + result.calendar.summary + "] " + summary + 
                           " (Start: " + startObj.toISOString() +
                           ", End: " + endObj.toISOString() +
                           ", Duration: " + duration.toFixed(2) + " mins" +
                           ", Desc: " + description +
                           ", Loc: " + location + ")";
              eventsDetail.push(detail);
              allEvents.push({ start: startObj, end: endObj });
            }
          });
        });
        
        // Sort all events by start time.
        allEvents.sort((a, b) => a.start - b.start);
        for (let i = 1; i < allEvents.length; i++) {
          let gap = (allEvents[i].start - allEvents[i - 1].end) / (1000 * 60);
          if (gap > 0) {
            totalFreeTime += gap;
          }
        }
        
        let calendarData = {
          totalEventTime: totalEventTime.toFixed(2),
          totalFreeTime: totalFreeTime.toFixed(2),
          eventsDetail: eventsDetail.join(" | ")
        };
        
        console.log("Aggregated calendar data:", calendarData);
        // Send the aggregated calendar data to Google Sheets.
        sendDataToGoogleSheets({ event: 'calendarData', data: calendarData });
        if (callback) callback(calendarData);
      });
    })
    .catch(err => {
      console.error("Error fetching calendar list:", err);
      if (callback) callback(null);
    });
  });
}

// Create an alarm to fetch calendar data every minute.
chrome.alarms.create("calendarSync", { periodInMinutes: 180});

// Listen for the alarm and fetch calendar data.
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "calendarSync") {
    getGoogleCalendarEvents();
  }
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
    sendResponse({ status: 'received' });
  }
});
