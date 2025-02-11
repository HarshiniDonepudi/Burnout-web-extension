// Returns an array of check-in questions based on the current hour.
function getPeriodicQuestions() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      // Morning questions
      return [
        { id: 'sleep_quality', question: "How well did you sleep last night? (1-10)", type: "scale" },
        { id: 'hours_sleep', question: "How many hours of sleep did you get?", type: "number" },
        { id: 'morning_energy', question: "What's your energy level this morning? (1-10)", type: "scale" },
        { id: 'morning_mood', question: "How are you feeling this morning? (1-10)", type: "scale" }
      ];
    } else if (hour >= 12 && hour < 17) {
      // Afternoon questions
      return [
        { id: 'stress', question: "How would you rate your stress levels so far? (1-10)", type: "scale" },
        { id: 'hours_worked_so_far', question: "How many hours have you worked so far today?", type: "number" },
        { id: 'breaks_taken', question: "How many breaks have you taken today?", type: "number" },
        { id: 'last_break_duration', question: "How long was your last break (in minutes)?", type: "number" },
        { id: 'productivity', question: "How productive do you feel today? (1-10)", type: "scale" }
      ];
    } else {
      // Evening questions
      return [
        { id: 'satisfaction', question: "How satisfied are you with today's work? (1-10)", type: "scale" },
        { id: 'hours_worked_total', question: "How many hours did you work today?", type: "number" },
        { id: 'continuous_work', question: "What is the longest period you worked continuously without a break (in minutes)?", type: "number" },
        { id: 'leisure_minutes', question: "How many minutes of leisure time did you have today?", type: "number" },
        { id: 'overall_balance', question: "How would you rate your work-life balance today? (1-10)", type: "scale" },
        { id: 'evening_mood', question: "How are you feeling this evening? (1-10)", type: "scale" }
      ];
    }
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Signal that the check-in page is active.
    chrome.runtime.sendMessage({ type: 'checkinActive', active: true });
  
    // Capture the current visible tab as a screenshot.
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function(screenshotUrl) {
      if (screenshotUrl) {
        document.getElementById('background').style.backgroundImage = `url(${screenshotUrl})`;
      }
    });
  
    // Get the available questions and choose one randomly.
    const questions = getPeriodicQuestions();
    const randomIndex = Math.floor(Math.random() * questions.length);
    const selectedQuestion = questions[randomIndex];
  
    // Build the question element.
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'question';
  
    const label = document.createElement('label');
    label.textContent = selectedQuestion.question;
    label.htmlFor = selectedQuestion.id;
    div.appendChild(label);
  
    // Create the appropriate input element.
    if (selectedQuestion.type === 'scale' || selectedQuestion.type === 'number') {
      const input = document.createElement('input');
      input.type = 'number';
      input.id = selectedQuestion.id;
      input.name = selectedQuestion.id;
      if (selectedQuestion.type === 'scale') {
        input.min = 1;
        input.max = 10;
      } else {
        input.min = 0;
      }
      input.required = true;
      div.appendChild(input);
    } else if (selectedQuestion.type === 'choice') {
      const select = document.createElement('select');
      select.id = selectedQuestion.id;
      select.name = selectedQuestion.id;
      selectedQuestion.options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      });
      div.appendChild(select);
    }
    container.appendChild(div);
  
    // Handle form submission.
    document.getElementById('questionForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const response = {};
      response[selectedQuestion.id] = document.getElementById(selectedQuestion.id).value;
      // Mark check-in as inactive before closing.
      chrome.runtime.sendMessage({ type: 'checkinActive', active: false });
      chrome.runtime.sendMessage({ type: 'periodicResponse', responses: response }, function(resp) {
        if (resp && resp.status === 'success') {
        
          window.close(); // Close the check-in page after submission.
        } else {
          
        }
      });
    });
  
    // Also mark check-in as inactive if the page is unloaded.
    window.addEventListener('unload', function() {
      chrome.runtime.sendMessage({ type: 'checkinActive', active: false });
    });
  });
  