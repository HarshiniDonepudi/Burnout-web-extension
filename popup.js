function updateStats() {
    chrome.storage.local.get(
      ['userId', 'workTime', 'leisureTime', 'stressSearchCount', 'tabSwitchCount', 'openTabsCount', 'tabSwitchRate'],
      (data) => {
        const workMinutes = data.workTime ? (data.workTime / 60000).toFixed(2) : "0.00";
        const leisureMinutes = data.leisureTime ? (data.leisureTime / 60000).toFixed(2) : "0.00";
        document.getElementById('stats').innerHTML = `
          <p><strong>User ID:</strong> ${data.userId || 'N/A'}</p>
          <p><strong>Work Time:</strong> ${workMinutes} minutes</p>
          <p><strong>Leisure Time:</strong> ${leisureMinutes} minutes</p>
          <p><strong>Stress-Related Searches:</strong> ${data.stressSearchCount || 0}</p>
          <p><strong>Tab Switches (current count):</strong> ${data.tabSwitchCount || 0}</p>
          <p><strong>Tab Switch Rate (per minute):</strong> ${data.tabSwitchRate || 0}</p>
          <p><strong>Current Open Tabs:</strong> ${data.openTabsCount || 0}</p>
        `;
      }
    );
  }
  updateStats();
  