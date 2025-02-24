<<<<<<< HEAD
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
  
  if (mode === "afternoon") {
    // Random mode: display one random question.
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
      // Create buttons for options 1 to 5.
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.className = "likert-btn";
        btn.textContent = i;
        btn.onclick = function () {
          const response = {};
          response[selectedQuestion.id] = i;
          chrome.runtime.sendMessage({ type: 'periodicResponse', responses: response }, function (resp) {
            if (resp && resp.status === 'success') {
              alert("Response submitted successfully!");
            } else {
              alert("Error submitting response.");
            }
          });
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
        const response = {};
        response[selectedQuestion.id] = value;
        chrome.runtime.sendMessage({ type: 'periodicResponse', responses: response }, function (resp) {
          if (resp && resp.status === 'success') {
            alert("Response submitted successfully!");
          } else {
            alert("Error submitting response.");
          }
        });
      };
    }
    
  } else {
    // Sequential mode (morning and evening).
    // Retrieve saved state from localStorage.
    let state = JSON.parse(localStorage.getItem("sequentialState"));
    if (!state || state.mode !== mode) {
      state = { currentIndex: 0, responses: {}, mode: mode, complete: false };
    }
    // If state is complete, show quote.
    if (state.complete) {
      document.getElementById("question-container").classList.add("hidden");
      document.getElementById("quote-container").classList.remove("hidden");
      return;
    }
    
    let currentQuestionIndex = state.currentIndex;
    let responses = state.responses;
    const questions = getSequentialQuestions(mode);
    
    const questionTextElem = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const submitButton = document.getElementById("submit-button");
    const quoteContainer = document.getElementById("quote-container");
    
    // Hide quote container initially.
    quoteContainer.classList.add("hidden");
    
    function loadQuestion() {
      if (currentQuestionIndex >= questions.length) {
        // All questions answered: mark as complete.
        state.complete = true;
        localStorage.setItem("sequentialState", JSON.stringify(state));
        document.getElementById("question-container").classList.add("hidden");
        quoteContainer.classList.remove("hidden");
        chrome.runtime.sendMessage({ type: 'periodicResponse', responses: responses });
        return;
      }
      const q = questions[currentQuestionIndex];
      questionTextElem.textContent = q.text;
      optionsContainer.innerHTML = "";
      submitButton.style.display = "none";
      
      const inputElem = document.createElement("input");
      inputElem.type = "number";
      inputElem.id = q.id;
      inputElem.name = q.id;
      inputElem.required = true;
      if (q.type === "scale") {
        // For morning, scale is 1-5; for evening, scale is 1-10.
        inputElem.min = 1;
        inputElem.max = (mode === "evening") ? 10 : 5;
      } else {
        inputElem.min = 0;
      }
      optionsContainer.appendChild(inputElem);
      
      inputElem.addEventListener("input", function () {
        submitButton.style.display = inputElem.value ? "block" : "none";
      });
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
      localStorage.setItem("sequentialState", JSON.stringify(state));
      loadQuestion();
    });
    
    loadQuestion();
  }
});
=======
// Function to determine which questions to display based on the current hour.
function getPeriodicQuestions() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return [
        { id: 'sleep', question: "How well did you sleep?", type: "scale" },
        { id: 'morning_energy', question: "What's your energy level this morning?", type: "scale" },
        { id: 'morning_mood', question: "How are you feeling today?", type: "scale" }
      ];
    } else if (hour >= 12 && hour < 17) {
      return [
        { id: 'stress', question: "How would you rate your stress levels?", type: "scale" },
        { id: 'productivity', question: "How productive do you feel?", type: "scale" },
        { id: 'breaks', question: "Are you taking enough breaks today?", type: "choice", options: ["Yes", "Sometimes", "Rarely", "No"] }
      ];
    } else {
      return [
        { id: 'satisfaction', question: "Do you feel satisfied with today's work?", type: "choice", options: ["Yes", "Somewhat", "Not much", "No"] },
        { id: 'stress_carryover', question: "Are you carrying work stress into the evening?", type: "choice", options: ["No", "A little", "A lot", "Completely overwhelmed"] },
        { id: 'evening_mood', question: "How are you feeling now?", type: "scale" }
      ];
    }
  }
  
  const questions = getPeriodicQuestions();
  const container = document.getElementById('questionsContainer');
  
  questions.forEach(q => {
    const div = document.createElement('div');
    div.className = 'question';
    const label = document.createElement('label');
    label.textContent = q.question;
    label.htmlFor = q.id;
    div.appendChild(label);
    
    if (q.type === 'scale') {
      const input = document.createElement('input');
      input.type = 'number';
      input.id = q.id;
      input.name = q.id;
      input.min = 1;
      input.max = 10;
      input.required = true;
      div.appendChild(input);
    } else if (q.type === 'choice') {
      const select = document.createElement('select');
      select.id = q.id;
      select.name = q.id;
      q.options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      });
      div.appendChild(select);
    }
    container.appendChild(div);
  });
  
  document.getElementById('questionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const responses = {};
    questions.forEach(q => {
      responses[q.id] = document.getElementById(q.id).value;
    });
    chrome.runtime.sendMessage({ type: 'periodicResponse', responses: responses }, (response) => {
      if (response && response.status === 'success') {
        alert('Responses submitted successfully!');
        window.close();
      } else {
        alert('Error submitting responses.');
      }
    });
  });
  
>>>>>>> parent of 60718da (Final)
