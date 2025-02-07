const SHEETS_WEBHOOK_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Replace with your actual Google Apps Script URL

// Function to initialize the extension when Chrome starts or when installed
function initializeExtension() {
    chrome.storage.local.get(["userUUID"], result => {
        if (!result.userUUID) {
            let newUUID = crypto.randomUUID();
            chrome.storage.local.set({ userUUID: newUUID });
        }
    });

    // Inject the burnout modal script into all open tabs when Chrome starts
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            if (tab.url.startsWith("http")) {
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["content.js"]
                });
            }
        });
    });
}

// Trigger when Chrome starts
chrome.runtime.onStartup.addListener(() => {
    console.log("Burnout Tracker initialized on Chrome startup.");
    initializeExtension();
});

// Trigger when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Burnout Tracker installed or updated.");
    initializeExtension();
});
