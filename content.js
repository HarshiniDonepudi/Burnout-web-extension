let lastActiveTime = Date.now();

// Track user activity (mouse movement, scrolling, or keypress)
document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keydown", resetIdleTimer);
document.addEventListener("scroll", resetIdleTimer);

function resetIdleTimer() {
    lastActiveTime = Date.now();
}

// Check inactivity every minute
setInterval(() => {
    let currentTime = Date.now();
    let idleTime = (currentTime - lastActiveTime) / 1000; // Convert to seconds

    if (idleTime > 300) { // 5 minutes of inactivity
        chrome.storage.local.get(["userUUID"], result => {
            let userUUID = result.userUUID || "unknown";

            let inactivityData = {
                timestamp: new Date().toISOString(),
                userUUID: userUUID,
                category: "inactivity",
                timeSpent: idleTime,
                tabSwitchCount: null,
                openTabsCount: null,
                question: null,
                response: null
            };

            // Send inactivity data to Google Sheets
            chrome.runtime.sendMessage({ action: "sendData", data: inactivityData });
        });
    }
}, 60000); // Check every 60 seconds
