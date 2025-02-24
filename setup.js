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
    
    chrome.storage.local.set(setupData, () => {
      chrome.runtime.sendMessage({ type: 'setupResponse', responses: setupData }, (response) => {
        if (response && response.status === 'success') {
          alert('Setup Complete! Your data has been saved.');
        } else {
          alert('Setup Complete! But there was an error saving your data to the sheet.');
        }
        window.close();
      });
    });
  });
  