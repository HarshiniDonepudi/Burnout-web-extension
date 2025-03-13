// ====================
// Quote & Counter Setup
// ====================

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

function displayRandomQuote() {
  const idx = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote-text").textContent = quotes[idx];
}

// ====================
// 2) Question Sets
// ====================

// Morning: 4 sequential questions
function getMorningQuestions() {
  return [
    { id: 'sleep_quality',   text: "How well did you sleep last night? (1-5)", type: "scale" },
    { id: 'hours_sleep',     text: "How many hours did you sleep?",            type: "number" },
    { id: 'morning_energy',  text: "Morning energy level (1-5)?",              type: "scale" },
    { id: 'morning_mood',    text: "Your mood this morning (1-5)?",            type: "scale" }
  ];
}

// Afternoon: random question from a pool
function getAfternoonQuestions() {
  return [
    { id: 'afternoon_mood',    text: "How are you feeling this afternoon? (1-5)", type: "scale" },
    { id: 'breaks_taken',      text: "How many breaks have you taken?",           type: "number" },
    { id: 'last_break_minutes',text: "How long was your last break (mins)?",      type: "number" },
    { id: 'productivity',      text: "How productive do you feel? (1-5)",         type: "scale" },
    { id: 'stress_level',      text: "Current stress level (1-5)?",               type: "scale" }
  ];
}

// Evening: 4 sequential questions
function getEveningQuestions() {
  return [
    { id: 'satisfaction',    text: "How satisfied are you with today's work? (1-5)", type: "scale" },
    { id: 'leisure_minutes', text: "Did you have enough 'me' time? (1-5)",           type: "scale" },
    { id: 'overall_balance', text: "Work-life balance rating today? (1-5)",          type: "scale" },
    { id: 'evening_mood',    text: "Your mood this evening (1-5)?",                  type: "scale" }
  ];
}

// Unified function: for sequential questions we use morning/evening sets; afternoon uses its random pool.
function getSequentialQuestions(mode) {
  if (mode === "morning") return getMorningQuestions();
  else if (mode === "afternoon") return getAfternoonQuestions(); // you might show a random one or allow a sequential flow
  else return getEveningQuestions();
}

// ====================
// 3) Daily Data & Progress Tracking
// ====================
/* 
  dailyCheckin structure stored in localStorage:
  {
    lastDate: "YYYY-MM-DD",
    sections: { morning: false, afternoon: false, evening: false },
    counter: 0,              // Full days complete out of 7
    questionsAnswered: 0     // Total questions answered today (capped for progress bar)
  }
*/

const MAX_QUESTIONS_FOR_BAR = 12; // Adjust as needed

function loadDailyData() {
  let data = JSON.parse(localStorage.getItem("dailyCheckin")) || {
    lastDate: new Date().toISOString().slice(0,10),
    sections: { morning: false, afternoon: false, evening: false },
    counter: 0,
    questionsAnswered: 0
  };
  const todayStr = new Date().toISOString().slice(0,10);
  if (data.lastDate !== todayStr) {
    // It's a new day: reset questionsAnswered and sections (counter persists)
    data = {
      lastDate: todayStr,
      sections: { morning: false, afternoon: false, evening: false },
      counter: data.counter,
      questionsAnswered: 0
    };
    localStorage.setItem("dailyCheckin", JSON.stringify(data));
  }
  return data;
}

function updateProgressUI() {
  let data = loadDailyData();
  const fraction = Math.min(data.questionsAnswered, MAX_QUESTIONS_FOR_BAR) / MAX_QUESTIONS_FOR_BAR;
  const percent = fraction * 100;
  document.getElementById("daily-counter-text").textContent = `${data.counter}/7 Days Complete`;
  document.getElementById("progress-bar").style.width = percent + "%";
  
  // Unlock the insights button if full-day counter reaches 7
  const insightsBtn = document.getElementById("insights-btn");
  if (data.counter >= 7) {
    insightsBtn.disabled = false;
    insightsBtn.classList.remove("disabled");
    // Set background to #2D5957 and text color to white (using important to override CSS if needed)
    insightsBtn.style.setProperty("background-color", "#3FA5AD", "important");
    insightsBtn.style.setProperty("color", "white", "important");
    insightsBtn.textContent = "Insights";
    console.log("DEBUG: Insights button unlocked.");
  } else {
    insightsBtn.disabled = true;
    insightsBtn.classList.add("disabled");
    // Reset to default styling (adjust as needed)
    insightsBtn.style.removeProperty("background-color");
    insightsBtn.style.removeProperty("color");
    insightsBtn.textContent = "Insights";
  }
}

function saveDailyData(d) {
  localStorage.setItem("dailyCheckin", JSON.stringify(d));
  updateProgressUI();
}

function incrementQuestionsAnswered() {
  let data = loadDailyData();
  data.questionsAnswered++;
  saveDailyData(data);
}

function markSectionDone(section) {
  let data = loadDailyData();
  data.sections[section] = true;
  if (data.sections.morning && data.sections.afternoon && data.sections.evening) {
    if (data.counter < 7) data.counter++;
  }
  saveDailyData(data);
}

// Initialize progress UI on load.
updateProgressUI();

// ====================
// 4) Main Check-In Logic (Sequential for All Modes)
// ====================
document.addEventListener("DOMContentLoaded", function () {
  // (Optional) Notify background if used in a Chrome extension.
  if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage({ type: 'checkinActive', active: true });
    window.addEventListener("unload", function(){
      chrome.runtime.sendMessage({ type: 'checkinActive', active: false });
    });
  }

  const hour = new Date().getHours();
  let mode;
  if (hour >= 5 && hour < 12) {
    mode = "morning";
  } else if (hour >= 12 && hour < 17) {
    mode = "afternoon";
  } else {
    mode = "evening";
  }
  console.log("Current mode:", mode);
  // const now = new Date();
  // const hours = now.getHours();
  // const minutes = now.getMinutes();
  // let mode;
  
  // if (hours === 20 && minutes >= 00 && minutes < 28) {
  //   mode = "morning";
  // } else if (hours === 20 && minutes >= 28 && minutes < 29) {
  //   mode = "afternoon";
  // } else {
  //   mode = "evening";
  // }
  
  console.log("Current mode:", mode);
  // Load or initialize checkinState (stored as "checkinState" in localStorage).
  // Structure:
  // { mode: "morning"/"afternoon"/"evening", complete: bool, currentIndex: number, responses: {} }
  let state = JSON.parse(localStorage.getItem("checkinState"));
  if (!state || state.mode !== mode) {
    state = { mode: mode, complete: false, currentIndex: 0, responses: {} };
    localStorage.setItem("checkinState", JSON.stringify(state));
  }

  // If the current section is already complete, show a random quote.
  if (state.complete) {
    document.getElementById("question-container").classList.add("hidden");
    document.getElementById("quote-container").classList.remove("hidden");
    displayRandomQuote();
    return;
  }

  // For all modes, use sequential logic.
  const questions = getSequentialQuestions(mode);
  let currentIndex = state.currentIndex || 0;
  let responses = state.responses;

  const questionTextElem = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const submitButton = document.getElementById("submit-button");
  const quoteContainer = document.getElementById("quote-container");

  // Hide the quote container initially.
  quoteContainer.classList.add("hidden");

  function loadQuestion() {
    if (currentIndex >= questions.length) {
      // Section complete.
      state.complete = true;
      localStorage.setItem("checkinState", JSON.stringify(state));

      // Send the collected responses for this mode to the background script.
      if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          type: "periodicResponse",
          responses: state.responses,
          mode: mode
        });
      }
      
      document.getElementById("question-container").classList.add("hidden");
      quoteContainer.classList.remove("hidden");
      displayRandomQuote();
      markSectionDone(mode);
      return;
    }
    const q = questions[currentIndex];
    questionTextElem.textContent = q.text;
    optionsContainer.innerHTML = "";
    submitButton.style.display = "none";

    if (q.type === "scale") {
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.className = "likert-btn";
        btn.textContent = i;
        btn.onclick = function() {
          responses[q.id] = i;
          // Increment progress for every answered question.
          incrementQuestionsAnswered();
          currentIndex++;
          state.currentIndex = currentIndex;
          state.responses = responses;
          localStorage.setItem("checkinState", JSON.stringify(state));
          loadQuestion();
        };
        optionsContainer.appendChild(btn);
      }
    } else if (q.type === "number") {
      const inputElem = document.createElement("input");
      inputElem.type = "number";
      inputElem.placeholder = "Type here...";
      inputElem.style.background = "transparent";
      inputElem.style.border = "none";
      inputElem.style.borderBottom = "2px solid #fff";
      inputElem.style.width = "200px";
      inputElem.style.fontSize = "20px";
      inputElem.style.color = "#3FA5AD";
      inputElem.style.textAlign = "center";
      inputElem.style.outline = "none";
      optionsContainer.appendChild(inputElem);

      inputElem.addEventListener("input", function() {
        submitButton.style.display = inputElem.value ? "block" : "none";
      });

      submitButton.onclick = function() {
        if (!inputElem.value) {
          alert("Please enter a value.");
          return;
        }
        responses[q.id] = inputElem.value;
        incrementQuestionsAnswered();
        currentIndex++;
        state.currentIndex = currentIndex;
        state.responses = responses;
        localStorage.setItem("checkinState", JSON.stringify(state));
        loadQuestion();
      };
    }
  }

  loadQuestion();
});
 