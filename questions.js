// Returns an array of sequential questions for Morning and Evening.
function getSequentialQuestions(mode) {
  if (mode === "morning") {
    return [
      { id: 'sleep_quality', text: "How well did you sleep last night? (Scale 1-5)", type: "scale" },
      { id: 'hours_sleep', text: "How many hours of sleep did you get?", type: "number" },
      { id: 'morning_energy', text: "What's your energy level this morning? (Scale 1-5)", type: "scale" },
      { id: 'morning_mood', text: "How are you feeling? (Scale 1-5)", type: "scale" }
    ];
  } else { // evening
    return [
      { id: 'satisfaction', text: "How satisfied are you with today's work? (Scale 1-10)", type: "scale" },
      { id: 'leisure_minutes', text: "Did you have enough 'me' time today? (Scale 1-5)", type: "scale" },
      { id: 'overall_balance', text: "How would you rate your work-life balance today? (Scale 1-5)", type: "scale" },
      { id: 'evening_mood', text: "How are you feeling? (Scale 1-5)", type: "scale" }
    ];
  }
}

// Returns an array of random questions for Afternoon.
function getRandomQuestions() {
  return [
    { id: 'afternoon_mood', text: "How are you feeling? (Scale 1-5)", type: "scale" },
    { id: 'breaks_taken', text: "How many breaks have you taken today? (Number)", type: "number" },
    { id: 'last_break_duration', text: "How long was your last break (in minutes)? (Number)", type: "number" },
    { id: 'productivity', text: "How productive do you feel today? (Scale 1-5)", type: "scale" }
  ];
}

/*
  The check-in state is stored under "checkinState" in localStorage.
  Structure:
  {
    mode: "morning"/"afternoon"/"evening",
    complete: true/false,
    currentIndex: number,         // For sequential modes
    responses: {},                // Collected responses
    lastCompleted: timestamp,     // When check-in was last completed (for afternoon and sequential)
    randomInterval: number        // (For afternoon) random interval in ms
  }
*/

// Function to update the daily check-in counter.
// The daily counter is stored under "dailyCheckin" in localStorage:
// { counter: number, lastDate: "YYYY-MM-DD" }
function updateDailyCounter() {
  const todayStr = new Date().toISOString().slice(0, 10);
  let dailyData = JSON.parse(localStorage.getItem("dailyCheckin")) || { counter: 0, lastDate: "" };
  
  // If the last check-in date is not today, increment counter.
  if (dailyData.lastDate !== todayStr) {
    dailyData.counter += 1;
    dailyData.lastDate = todayStr;
    localStorage.setItem("dailyCheckin", JSON.stringify(dailyData));
  }
  
  // Update the UI in the counter box.
  const counterBox = document.getElementById("counter-box");
  const counterText = document.getElementById("daily-counter-text");
  if (dailyData.counter >= 7) {
    counterText.innerHTML = "7/7 Completed - <a href='insights.html'>View Insights</a>";
  } else {
    counterText.textContent = dailyData.counter + "/7 days completed";
  }
}

// Update counter on page load.
updateDailyCounter();

document.addEventListener("DOMContentLoaded", function () {
  // Signal that the check-in page is active.
  chrome.runtime.sendMessage({ type: 'checkinActive', active: true });
  window.addEventListener("unload", function () {
    chrome.runtime.sendMessage({ type: 'checkinActive', active: false });
  });
  
  const currentHour = new Date().getHours();
  let mode;
  if (currentHour >= 5 && currentHour < 12) {
    mode = "morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    mode = "afternoon";
  } else {
    mode = "evening";
  }
  
  // Retrieve stored check-in state.
  let state = JSON.parse(localStorage.getItem("checkinState"));
  const now = Date.now();
  // For afternoon: if check-in is complete and within the random interval, show quote.
  if (mode === "afternoon" && state && state.mode === "afternoon" && state.complete && state.lastCompleted && state.randomInterval) {
    if (now - state.lastCompleted < state.randomInterval) {
      document.getElementById("question-container").classList.add("hidden");
      document.getElementById("quote-container").classList.remove("hidden");
      return;
    } else {
      // Reset state for a new random question.
      state = { mode: "afternoon", complete: false };
      localStorage.setItem("checkinState", JSON.stringify(state));
    }
  }
  
  // For sequential modes (morning/evening), if state exists and complete is true, show quote.
  if ((mode === "morning" || mode === "evening") && state && state.mode === mode && state.complete) {
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("quote-container").classList.remove("hidden");
    return;
  }
  
  // If no state or state mode doesn't match, reset state.
  if (!state || state.mode !== mode) {
    state = { mode: mode, complete: false, currentIndex: 0, responses: {} };
    localStorage.setItem("checkinState", JSON.stringify(state));
  }
  
  if (mode === "afternoon") {
    // RANDOM MODE for afternoon.
    const questions = getRandomQuestions();
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];
    
    const questionTextElem = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const submitButton = document.getElementById("submit-button");
    const quoteContainer = document.getElementById("quote-container");
    quoteContainer.classList.add("hidden");
    
    questionTextElem.textContent = selectedQuestion.text;
    optionsContainer.innerHTML = "";
    
    if (selectedQuestion.type === "scale") {
      // Create likert buttons for options 1-5.
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.className = "likert-btn";
        btn.textContent = i;
        btn.onclick = function () {
          state.complete = true;
          state.responses[selectedQuestion.id] = i;
          state.lastCompleted = Date.now();
          // Generate a random interval between 15 and 45 minutes.
          const minInterval = 15 * 60 * 1000;
          const maxInterval = 45 * 60 * 1000;
          state.randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
          localStorage.setItem("checkinState", JSON.stringify(state));
          chrome.runtime.sendMessage({ type: 'periodicResponse', responses: state.responses });
          document.getElementById("question-container").classList.add("hidden");
          document.getElementById("quote-container").classList.remove("hidden");
          updateDailyCounter();
          alert("Response submitted successfully!");
        };
        optionsContainer.appendChild(btn);
      }
      submitButton.style.display = "none";
    } else if (selectedQuestion.type === "number") {
      optionsContainer.innerHTML = `<input type="number" id="${selectedQuestion.id}" min="0" required>`;
      submitButton.style.display = "block";
      submitButton.onclick = function () {
        const value = document.getElementById(selectedQuestion.id).value;
        if (!value) {
          alert("Please enter a value.");
          return;
        }
        state.complete = true;
        state.responses[selectedQuestion.id] = value;
        state.lastCompleted = Date.now();
        const minInterval = 15 * 60 * 1000;
        const maxInterval = 45 * 60 * 1000;
        state.randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
        localStorage.setItem("checkinState", JSON.stringify(state));
        chrome.runtime.sendMessage({ type: 'periodicResponse', responses: state.responses });
        document.getElementById("question-container").classList.add("hidden");
        document.getElementById("quote-container").classList.remove("hidden");
        updateDailyCounter();
        alert("Response submitted successfully!");
      };
    }
  } else {
    // SEQUENTIAL MODE for morning and evening.
    const questions = getSequentialQuestions(mode);
    let currentQuestionIndex = state.currentIndex;
    let responses = state.responses;
    
    const questionTextElem = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const submitButton = document.getElementById("submit-button");
    const quoteContainer = document.getElementById("quote-container");
    
    quoteContainer.classList.add("hidden");
    
    function loadQuestion() {
      if (currentQuestionIndex >= questions.length) {
        state.complete = true;
        state.lastCompleted = Date.now();
        localStorage.setItem("checkinState", JSON.stringify(state));
        document.getElementById("question-container").classList.add("hidden");
        quoteContainer.classList.remove("hidden");
        chrome.runtime.sendMessage({ type: 'periodicResponse', responses: responses });
        updateDailyCounter();
        return;
      }
      const q = questions[currentQuestionIndex];
      questionTextElem.textContent = q.text;
      optionsContainer.innerHTML = "";
      submitButton.style.display = "none";
      
      if (q.type === "scale") {
        // Create likert buttons: morning: 1-5; evening: 1-10.
        const maxVal = (mode === "evening") ? 10 : 5;
        for (let i = 1; i <= maxVal; i++) {
          const btn = document.createElement("button");
          btn.className = "likert-btn";
          btn.textContent = i;
          btn.onclick = function () {
            responses[q.id] = i;
            currentQuestionIndex++;
            state.currentIndex = currentQuestionIndex;
            state.responses = responses;
            localStorage.setItem("checkinState", JSON.stringify(state));
            loadQuestion();
          };
          optionsContainer.appendChild(btn);
        }
      } else if (q.type === "number") {
        const inputElem = document.createElement("input");
        inputElem.type = "number";
        inputElem.id = q.id;
        inputElem.name = q.id;
        inputElem.required = true;
        inputElem.min = 0;
        optionsContainer.appendChild(inputElem);
        inputElem.addEventListener("input", function () {
          submitButton.style.display = inputElem.value ? "block" : "none";
        });
      }
    }
    
    submitButton.addEventListener("click", function () {
      const q = questions[currentQuestionIndex];
      const value = document.getElementById(q.id).value;
      if (!value) {
        alert("Please answer the question before proceeding.");
        return;
      }
      responses[q.id] = value;
      currentQuestionIndex++;
      state.currentIndex = currentQuestionIndex;
      state.responses = responses;
      localStorage.setItem("checkinState", JSON.stringify(state));
      loadQuestion();
    });
    
    loadQuestion();
  }
});
