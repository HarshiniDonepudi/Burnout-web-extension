document.getElementById('setupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const industry = document.getElementById('industry').value;
  const jobRole = document.getElementById('jobRole').value;
  const workArrangement = document.getElementById('workArrangement').value;
  
  const setupData = {
    userName: name,
    industry: industry,
    jobRole: jobRole,
    workArrangement: workArrangement,
    setupComplete: true
  };
  
  // Show a loading message
  const submitButton = document.querySelector('button[type="submit"]');
  submitButton.textContent = "Saving...";
  
  chrome.storage.local.set(setupData, () => {
    // Send setup data to background script
    chrome.runtime.sendMessage({ type: 'setupResponse', responses: setupData }, (response) => {
      console.log('Setup data saved response:', response);
      
      // Try directly calling getAuthToken from here
      console.log('Attempting direct calendar authentication...');
      submitButton.textContent = "Authenticating...";
      
      // Direct auth approach
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
          console.error("Calendar auth error:", chrome.runtime.lastError);
          submitButton.textContent = "Auth Error - Please Try Again";
          alert("Calendar authentication failed: " + chrome.runtime.lastError.message);
        } else {
          console.log("Calendar auth token obtained:", token ? "Yes" : "No");
          submitButton.textContent = "Success! Closing...";
          setTimeout(() => window.close(), 1000);
        }
      });
    });
  });
});

