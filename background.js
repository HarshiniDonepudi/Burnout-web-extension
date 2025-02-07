const SHEETS_WEBHOOK_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Replace with your actual web app URL

// Function to send data to Google Sheets
function sendDataToGoogleSheets(data) {
    fetch(SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => console.log("Data sent:", result))
    .catch(error => console.error("Error sending data:", error));
}

// Generate Unique User ID if not already set
chrome.storage.local.get(["userUUID"], result => {
    if (!result.userUUID) {
        let newUUID = crypto.randomUUID();
        chrome.storage.local.set({ userUUID: newUUID });
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        chrome.storage.local.get(["userUUID"], userResult => {
            let userUUID = userResult.userUUID;
            let sessionData = {
                timestamp: new Date().toISOString(),
                userUUID: userUUID,
                category: "work", // Replace with actual category detection if needed
                timeSpent: Math.floor(Math.random() * 300), // Placeholder for demo
                tabSwitchCount: Math.floor(Math.random() * 10),
                openTabsCount: Math.floor(Math.random() * 15),
                question: null,
                response: null
            };

            sendDataToGoogleSheets(sessionData);
        });
    }
});

// Handle messages from content.js (inactivity tracking)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sendData") {
        sendDataToGoogleSheets(request.data);
    }
});

// Burnout Question Response Handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "submitResponse") {
        chrome.storage.local.get(["userUUID"], result => {
            let responseData = {
                timestamp: new Date().toISOString(),
                userUUID: result.userUUID,
                category: null,
                timeSpent: null,
                tabSwitchCount: null,
                openTabsCount: null,
                question: request.question,
                response: request.response
            };

            sendDataToGoogleSheets(responseData);
        });
    }
});
