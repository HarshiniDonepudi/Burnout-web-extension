/************************************************
 * questions.js
 ***********************************************/

// =====================
// 1) Quotes
// =====================
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
  const randomIndex = Math.floor(Math.random() * quotes.length);
  document.getElementById("quote-text").textContent = quotes[randomIndex];
}
// =====================
// 2) Question Sets
// =====================

// Morning: 4 sequential
function getMorningQuestions() {
  return [
    { id: 'sleep_quality',   text: "How well did you sleep last night? (1-5)", type: "scale" },
    { id: 'hours_sleep',     text: "How many hours did you sleep?",            type: "number" },
    { id: 'morning_energy',  text: "Morning energy level (1-5)?",              type: "scale" },
    { id: 'morning_mood',    text: "Your mood this morning (1-5)?",            type: "scale" }
  ];
}

// Afternoon random question pool
function getAfternoonPool() {
  return [
    { id: 'afternoon_mood',    text: "How are you feeling this afternoon? (1-5)", type: "scale" },
    { id: 'breaks_taken',      text: "How many breaks have you taken?",           type: "number" },
    { id: 'last_break_minutes',text: "How long was your last break (mins)?",      type: "number" },
    { id: 'productivity',      text: "How productive do you feel? (1-5)",         type: "scale" },
    { id: 'stress_level',      text: "Current stress level (1-5)?",               type: "scale" }
  ];
}

// Evening: 4 sequential
function getEveningQuestions() {
  return [
    { id: 'satisfaction',    text: "How satisfied are you with today's work? (1-5)", type: "scale" },
    { id: 'leisure_minutes', text: "Did you have enough 'me' time? (1-5)",           type: "scale" },
    { id: 'overall_balance', text: "Work-life balance rating today? (1-5)",          type: "scale" },
    { id: 'evening_mood',    text: "Your mood this evening (1-5)?",                  type: "scale" }
  ];
}

/*
  We have 9 total daily questions:
    4 morning + 1 random (afternoon) + 4 evening
  Each answered question increments the daily bar by ~11.1% if there's exactly 9 total for the day.

  localStorage => "dailyCheckin":
  {
    lastDate: "YYYY-MM-DD",
    dayIndex: 0,                 // how many full days completed out of 7
    questionsAnsweredToday: 0,   // 0..9
    todayCompleted: false
  }

  We store "checkinState" for the current section:
  {
    mode: "morning"/"afternoon"/"evening",
    complete: bool,
    currentIndex: number,
    responses: {},
    randomInterval: number,  // for afternoon
    lastCompleted: timestamp // for afternoon
  }
*/

// =====================
// 3) Daily Data & Progress Logic
// =====================
function loadDailyData() {
  let data = JSON.parse(localStorage.getItem("dailyCheckin"));
  if (!data) {
    data = {
      lastDate: new Date().toISOString().slice(0, 10),
      dayIndex: 0,
      questionsAnsweredToday: 0,
      todayCompleted: false
    };
  }
  const todayStr = new Date().toISOString().slice(0, 10);
  if (data.lastDate !== todayStr) {
    data.lastDate = todayStr;
    data.questionsAnsweredToday = 0;
    data.todayCompleted = false;
  }
  localStorage.setItem("dailyCheckin", JSON.stringify(data));
  return data;
}

function updateProgressUI() {
  let dailyData = loadDailyData();
  if (dailyData.todayCompleted) {
    document.getElementById("progress-bar").style.width = "100%";
  } else {
    // e.g. if 9 total daily questions
    const fraction = dailyData.questionsAnsweredToday / 9;
    const percent = fraction * 100;
    document.getElementById("progress-bar").style.width = `${Math.min(percent, 100)}%`;
  }
  document.getElementById("daily-counter-text").textContent =
    `${dailyData.dayIndex}/7 Days Complete`;
}

function incrementQuestionsAnswered() {
  let data = loadDailyData();
  if (!data.todayCompleted) {
    data.questionsAnsweredToday++;
    if (data.questionsAnsweredToday >= 9 && !data.todayCompleted) {
      // day is fully done
      data.todayCompleted = true;
      data.dayIndex = Math.min(data.dayIndex + 1, 7);
    }
    localStorage.setItem("dailyCheckin", JSON.stringify(data));
  }
  updateProgressUI();
}

// =====================
// 4) Main Check-In Logic
// =====================
document.addEventListener("DOMContentLoaded", function() {
  updateProgressUI();

  // Decide time-based mode
  const hour = new Date().getHours();
  let mode;
  if (hour >= 5 && hour < 12) {
    mode = "morning";    // for demonstration
  } else if (hour >= 16 && hour < 18) {
    mode = "afternoon";  // random question
  } else {
    mode = "evening";    // for demonstration
  }

  let state = JSON.parse(localStorage.getItem("checkinState"));
  const now = Date.now();

  // If no existing state or different mode, create fresh
  if (!state || state.mode !== mode) {
    state = {
      mode,
      complete: false,
      currentIndex: 0,
      responses: {},
      randomInterval: 0,
      lastCompleted: 0
    };
    localStorage.setItem("checkinState", JSON.stringify(state));
  }

  const questionContainer = document.getElementById("question-container");
  const quoteContainer = document.getElementById("quote-container");
  const questionTextElem = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const submitButton = document.getElementById("submit-button");

  // If user already completed this mode => show quote
  if (state.complete) {
    questionContainer.classList.add("hidden");
    quoteContainer.classList.remove("hidden");
    displayRandomQuote();
    return;
  }

  if (mode === "afternoon") {
    // Check cooldown
    if (state.complete && state.lastCompleted && state.randomInterval) {
      if (now - state.lastCompleted < state.randomInterval) {
        // still in cooldown => show quote only
        questionContainer.classList.add("hidden");
        quoteContainer.classList.remove("hidden");
        displayRandomQuote();
        return;
      } else {
        // cooldown ended => allow new question
        state = {
          mode: "afternoon",
          complete: false,
          currentIndex: 0,
          responses: {}
        };
        localStorage.setItem("checkinState", JSON.stringify(state));
      }
    }

    // Now show a random question
    quoteContainer.classList.add("hidden");
    const pool = getAfternoonPool();
    const randIndex = Math.floor(Math.random() * pool.length);
    const question = pool[randIndex];

    questionTextElem.textContent = question.text;
    optionsContainer.innerHTML = "";
    submitButton.style.display = "none";

    // If scale
    if (question.type === "scale") {
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.className = "likert-btn";
        btn.textContent = i;
        btn.onclick = function() {
          // store response
          state.complete = true;
          state.responses[question.id] = i;
          state.lastCompleted = Date.now();
          // random interval 15–45 min
          const minMS = 1 * 60 * 1000;
          const maxMS = 3 * 60 * 1000;
          state.randomInterval = Math.floor(Math.random() * (maxMS - minMS + 1)) + minMS;
          localStorage.setItem("checkinState", JSON.stringify(state));

          // increment bar
          incrementQuestionsAnswered();

          // send to background
          chrome.runtime.sendMessage({
            type: "periodicResponse",
            responses: state.responses
          });

          questionContainer.classList.add("hidden");
          quoteContainer.classList.remove("hidden");
          displayRandomQuote();
        };
        optionsContainer.appendChild(btn);
      }
    }
    // If number
    else if (question.type === "number") {
      const inputElem = document.createElement("input");
      inputElem.type = "number";
      inputElem.placeholder = "Type here...";
      // styling
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
        state.complete = true;
        state.responses[question.id] = inputElem.value;
        state.lastCompleted = Date.now();
        const minMS = 1 * 60 * 1000;
        const maxMS = 3 * 60 * 1000;
        state.randomInterval = Math.floor(Math.random() * (maxMS - minMS + 1)) + minMS;
        localStorage.setItem("checkinState", JSON.stringify(state));

        incrementQuestionsAnswered();

        chrome.runtime.sendMessage({
          type: "periodicResponse",
          responses: state.responses
        });

        questionContainer.classList.add("hidden");
        quoteContainer.classList.remove("hidden");
        displayRandomQuote();
      };
    }
  }
  else {
    // morning/evening blocks, or anything else => just show quote for demonstration
    questionContainer.classList.add("hidden");
    quoteContainer.classList.remove("hidden");
    displayRandomQuote();
  }
});