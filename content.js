const SHEETS_WEBHOOK_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // Replace with your actual Google Apps Script URL

// Function to inject styles dynamically
function injectStyles() {
    let style = document.createElement("style");
    style.innerHTML = `
        /* Full-screen burnout modal */
        .burnout-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        /* Glassmorphism modal content */
        .modal-content {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            width: 400px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.6s ease-in-out;
        }

        /* Header */
        .modal-content h1 {
            font-size: 24px;
            font-weight: 600;
            color: #2F3E46;
            margin-bottom: 10px;
        }

        .modal-content p {
            font-size: 16px;
            margin-bottom: 15px;
            color: #586F7C;
        }

        /* Input Field */
        .modal-content input {
            width: 90%;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid rgba(60, 60, 60, 0.2);
            background-color: rgba(255, 255, 255, 0.6);
            font-size: 16px;
            color: #3D4F4E;
            outline: none;
            transition: border 0.3s, background 0.3s;
        }

        .modal-content input::placeholder {
            color: rgba(80, 80, 80, 0.5);
        }

        .modal-content input:focus {
            border: 1px solid #4A90E2;
            background-color: rgba(255, 255, 255, 0.9);
        }

        /* Submit Button */
        .modal-content button {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            background: linear-gradient(135deg, #4A90E2, #1D70B8);
            color: white;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        }

        .modal-content button:hover {
            background: linear-gradient(135deg, #1D70B8, #4A90E2);
        }

        /* Smooth Fade-in Animation */
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Function to create the full-page modal
function createBurnoutModal() {
    let modal = document.createElement("div");
    modal.innerHTML = `
        <div id="burnoutModal" class="burnout-modal">
            <div class="modal-content">
                <h1>Burnout Check-in</h1>
                <p>How are you feeling today?</p>
                <input type="text" id="burnout-response" placeholder="Enter your response">
                <button id="submitBurnoutResponse">Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("submitBurnoutResponse").addEventListener("click", () => {
        let response = document.getElementById("burnout-response").value.trim();
        if (response) {
            chrome.storage.local.get(["userUUID"], result => {
                let responseData = {
                    timestamp: new Date().toISOString(),
                    userUUID: result.userUUID || "unknown",
                    category: null,
                    timeSpent: null,
                    tabSwitchCount: null,
                    openTabsCount: null,
                    question: "How are you feeling today?",
                    response: response
                };

                // Send response to Google Sheets
                fetch(SHEETS_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(responseData)
                })
                .then(() => {
                    document.getElementById("burnoutModal").remove(); // Close modal after submission
                })
                .catch(error => console.error("Error sending data:", error));
            });
        }
    });
}

// Inject styles and show the burnout modal when a new tab is opened
if (!sessionStorage.getItem("burnoutPromptShown")) {
    sessionStorage.setItem("burnoutPromptShown", "true");
    injectStyles();
    createBurnoutModal();
}
