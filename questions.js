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
  