// ====================
// Quote & Counter Setup
// ====================

// List of quotes to display at random.
const quotes = [
  "“Happiness depends upon ourselves.” – Aristotle",
  "“The only true wisdom is in knowing you know nothing.” – Socrates",
  "“He who has overcome his fears will truly be free.” – Aristotle",
  "“Difficulties strengthen the mind, as labor does the body.” – Seneca",
  "“You have power over your mind—not outside events. Realize this, and you will find strength.” – Marcus Aurelius",
  "“No great thing is created suddenly.” – Epictetus",
  "“The things that we love tell us what we are.” – Thomas Aquinas",
  "“Wonder is the desire for knowledge.” – Thomas Aquinas",
  "“Patience is the companion of wisdom.” – Saint Augustine",
  "“The greater danger for most of us lies not in setting our aim too high and falling short, but in setting our aim too low and achieving our mark.” – Michelangelo",
  "“Act as if what you do makes a difference. It does.” – William James",
  "“We are what we repeatedly do. Excellence, then, is not an act, but a habit.” – Aristotle",
  "“Liberty consists in doing what one desires.” – John Stuart Mill",
  "“I think, therefore I am.” – René Descartes",
  "“The happiness of your life depends upon the quality of your thoughts.” – Marcus Aurelius",
  "“We do not describe the world we see, we see the world we can describe.” – Immanuel Kant",
  "“Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.” – Buddha",
  "“Life must be understood backwards. But it must be lived forward.” – Søren Kierkegaard",
  "“Freedom is nothing but a chance to be better.” – Albert Camus",
  "“The struggle itself towards the heights is enough to fill a man's heart.” – Albert Camus",
  "“He who has a why to live can bear almost any how.” – Friedrich Nietzsche",
  "“That which does not kill us makes us stronger.” – Friedrich Nietzsche",
  "“To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.” – Ralph Waldo Emerson",
  "“We must cultivate our own garden.” – Voltaire",
  "“It is not length of life, but depth of life.” – Ralph Waldo Emerson",
  "“We are what we think. All that we are arises with our thoughts. With our thoughts, we make the world.” – Buddha",
  "“Not life, but good life, is to be chiefly valued.” – Socrates",
  "“Everything you can imagine is real.” – Pablo Picasso",
  "“A man who dares to waste one hour of time has not discovered the value of life.” – Charles Darwin",
  "“The energy of the mind is the essence of life.” – Aristotle",
  "“Happiness is not something ready-made. It comes from your own actions.” – Dalai Lama",
  "“It always seems impossible until it’s done.” – Nelson Mandela",
  "“Nature does not hurry, yet everything is accomplished.” – Laozi",
  "“When I let go of what I am, I become what I might be.” – Laozi",
  "“A journey of a thousand miles begins with a single step.” – Laozi",
  "“Respond intelligently even to unintelligent treatment.” – Laozi",
  "“Health is the greatest possession. Contentment is the greatest treasure. Confidence is the greatest friend.” – Laozi",
  "“When the soul is at peace, the universe is at peace.” – Zhuangzi",
  "“Pain is inevitable, but suffering is optional.” – Buddha",
  "“Peace comes from within. Do not seek it without.” – Buddha",
  "“The whole moon and the entire sky are reflected in one dewdrop on the grass.” – Dogen",
  "“To think in terms of either pessimism or optimism oversimplifies the truth. The problem is to see reality as it is.” – Thich Nhat Hanh",
  "“Smile, breathe, and go slowly.” – Thich Nhat Hanh",
  "“Letting go gives us freedom, and freedom is the only condition for happiness.” – Thich Nhat Hanh",
  "“Be kind whenever possible. It is always possible.” – Dalai Lama",
  "“The more you are motivated by love, the more fearless and free your actions will be.” – Dalai Lama",
  "“If you think you are too small to make a difference, try sleeping with a mosquito.” – Dalai Lama",
  "“Be steadfast in yoga, O Arjuna. Perform your duty and abandon all attachment to success or failure.” – Bhagavad Gita",
  "“Calmness, gentleness, silence, self-restraint, and purity: these are the disciplines of the mind.” – Bhagavad Gita",
  "“Take risks in your life. If you win, you can lead. If you lose, you can guide.” – Swami Vivekananda",
  "“The firewood turns into ash, and the fire dies down. But the truth of the self remains forever.” – Upanishads",
  "“A mind that is fast is sick. A mind that is slow is sound. A mind that is still is divine.” – Upanishads",
  "“When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.” – Bhagavad Gita",
  "“It does not matter how slowly you go as long as you do not stop.” – Confucius",
  "“The man who moves a mountain begins by carrying away small stones.” – Confucius",
  "“He who conquers himself is the mightiest warrior.” – Confucius",
  "“The superior man is modest in his speech but exceeds in his actions.” – Confucius",
  "“Opportunities multiply as they are seized.” – Sun Tzu",
  "“Victory comes from finding opportunities in problems.” – Sun Tzu",
  "“The best fighter is never angry.” – Laozi",
  "“Kindness in words creates confidence. Kindness in thinking creates profoundness. Kindness in giving creates love.” – Laozi",
  "“A wise man adapts himself to circumstances, as water shapes itself to the vessel that contains it.” – Japanese Proverb",
  "“When the student is ready, the teacher will appear.” – Zen Proverb",
  "“Flow with whatever may happen, and let your mind be free: Stay centered by accepting whatever you are doing.” – Zhuangzi",
  "“No man is your enemy, no man is your friend. Every man is your teacher.” – Zen Proverb",
  "“Fall down seven times, get up eight.” – Japanese Proverb"
];

// Function to display a random quote in the quote container.
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  document.getElementById("quote-text").textContent = randomQuote;
}

// ====================
// Check-in Code (morning/afternoon/evening)
// ====================

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
      { id: 'satisfaction', text: "How satisfied are you with today's work? (Scale 1-5)", type: "scale" },
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
  The check-in state is stored in localStorage under "checkinState" with structure:
  {
    mode: "morning"/"afternoon"/"evening",
    complete: true/false,
    currentIndex: number,         // Only for sequential modes
    responses: {},                // Collected responses
    lastCompleted: timestamp,     // When check-in was last completed (for the current mode)
    randomInterval: number        // (For afternoon mode) random interval in ms
  }
  
  The daily completion data is stored under "dailyCheckin":
  {
    lastDate: "YYYY-MM-DD",
    sections: {
      morning: true/false,
      afternoon: true/false,
      evening: true/false
    },
    counter: number
  }
*/

// Update daily completion for a section.
function updateDailySection(section) {
  const todayStr = new Date().toISOString().slice(0, 10);
  let dailyData = JSON.parse(localStorage.getItem("dailyCheckin")) || { lastDate: todayStr, sections: { morning: false, afternoon: false, evening: false }, counter: 0 };
  
  if (dailyData.lastDate !== todayStr) {
    dailyData = { lastDate: todayStr, sections: { morning: false, afternoon: false, evening: false }, counter: 0 };
  }
  
  dailyData.sections[section] = true;
  localStorage.setItem("dailyCheckin", JSON.stringify(dailyData));
  
  if (dailyData.sections.morning && dailyData.sections.afternoon && dailyData.sections.evening) {
    dailyData.counter++;
    localStorage.setItem("dailyCheckin", JSON.stringify(dailyData));
  }
  updateDailyCounterUI(dailyData);
}

// Update the daily counter UI.
function updateDailyCounterUI(dailyData) {
  const counterText = document.getElementById("daily-counter-text");
  if (dailyData.counter >= 7) {
    counterText.innerHTML = dailyData.counter + "/7 Completed - <a href='insights.html'>View Insights</a>";
  } else {
    counterText.textContent = dailyData.counter + "/7 days completed";
  }
}

// Call this function on page load.
function updateDailyCounter() {
  let dailyData = JSON.parse(localStorage.getItem("dailyCheckin")) || { lastDate: new Date().toISOString().slice(0, 10), sections: { morning: false, afternoon: false, evening: false }, counter: 0 };
  updateDailyCounterUI(dailyData);
}
updateDailyCounter();

document.addEventListener("DOMContentLoaded", function () {
  // Signal check-in is active.
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
  
  // For afternoon: if complete and within random interval, show quote.
  if (mode === "afternoon" && state && state.mode === "afternoon" && state.complete && state.lastCompleted && state.randomInterval) {
    if (now - state.lastCompleted < state.randomInterval) {
      document.getElementById("question-container").classList.add("hidden");
      document.getElementById("quote-container").classList.remove("hidden");
      displayRandomQuote();
      return;
    } else {
      state = { mode: "afternoon", complete: false };
      localStorage.setItem("checkinState", JSON.stringify(state));
    }
  }
  
  // For sequential modes, if complete, show quote.
  if ((mode === "morning" || mode === "evening") && state && state.mode === mode && state.complete) {
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("quote-container").classList.remove("hidden");
    displayRandomQuote();
    return;
  }
  
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
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.className = "likert-btn";
        btn.textContent = i;
        btn.onclick = function () {
          state.complete = true;
          state.responses[selectedQuestion.id] = i;
          state.lastCompleted = Date.now();
          const minInterval = 15 * 60 * 1000;
          const maxInterval = 45 * 60 * 1000;
          state.randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
          localStorage.setItem("checkinState", JSON.stringify(state));
          chrome.runtime.sendMessage({ type: 'periodicResponse', responses: state.responses });
          document.getElementById("question-container").classList.add("hidden");
          document.getElementById("quote-container").classList.remove("hidden");
          displayRandomQuote();
          updateDailySection("afternoon");
          alert("Response submitted successfully!");
        };
        optionsContainer.appendChild(btn);
      }
      submitButton.style.display = "none";
    } else if (selectedQuestion.type === "number") {
      optionsContainer.innerHTML = `<style>
    input[type="number"]::placeholder {
      color: #3FA5AD;
      opacity: 1;
      font-family: "Nunito Sans", sans-serif;
    }
  </style>
  <div class="input-wrapper" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
    <input type="number" id="${selectedQuestion.id}" min="0" required placeholder="Type here..." style="background: transparent; border: none; border-bottom: 2px solid #fff; width: 200px; font-size: 20px; color: #3FA5AD; text-align: center; outline: none;" />
  </div>



`;
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
        displayRandomQuote();
        updateDailySection("afternoon");
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
        displayRandomQuote();
        chrome.runtime.sendMessage({ type: 'periodicResponse', responses: responses });
        updateDailySection(mode);
        return;
      }
      const q = questions[currentQuestionIndex];
      questionTextElem.textContent = q.text;
      optionsContainer.innerHTML = "";
      submitButton.style.display = "none";
      
      if (q.type === "scale") {
        const maxVal = (mode === "evening") ? 5 : 5;
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