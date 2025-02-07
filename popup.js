document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["lastQuestionAsked", "userUUID"], result => {
        let question = result.lastQuestionAsked || "How are you feeling today?";
        document.getElementById("question-text").textContent = question;

        document.getElementById("submit-response").addEventListener("click", () => {
            let response = document.getElementById("user-response").value;
            if (response.trim()) {
                chrome.runtime.sendMessage({
                    action: "submitResponse",
                    question: question,
                    response: response
                });
                alert("Response saved & sent to Google Sheets!");
            }
        });
    });
});
