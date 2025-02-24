document.getElementById('setupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const industry = document.getElementById('industry').value;
  const jobRole = document.getElementById('jobRole').value;
  const workArrangement = document.getElementById('workArrangement').value;
  const burnoutExperience = document.getElementById('burnout_experience') ? document.getElementById('burnout_experience').value : "";
  const burnoutTrigger = document.getElementById('burnout_trigger') ? document.getElementById('burnout_trigger').value : "";
  const workChallenge = document.getElementById('work_challenge') ? document.getElementById('work_challenge').value : "";
  
  const setupData = {
    userName: name,
    industry: industry,
    jobRole: jobRole,
    workArrangement: workArrangement,
    burnoutExperience: burnoutExperience,
    burnoutTrigger: burnoutTrigger,
    workChallenge: workChallenge,
    setupComplete: true
  };
  

  chrome.storage.local.set(setupData, () => {

    chrome.runtime.sendMessage({ type: 'setupResponse', responses: setupData }, (response) => {
      if (response && response.status === 'success') {
   
      } else {
      }
      
      // Trigger OAuth flow for calendar data on the setup screen.
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
          alert("Calendar access failed: " + chrome.runtime.lastError.message);
        } else {
          console.log("Calendar access granted, token:", token);
        }
        window.close();
      });
      
    });
  });
});
