document.addEventListener("DOMContentLoaded", async () => {
  const statusDiv = document.getElementById("status");
  const btn = document.getElementById("fillBtn");

  // 1. Get Current Tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url) {
    statusDiv.innerText = "No URL found.";
    return;
  }

  statusDiv.innerText = "Checking database...";

  // 2. Call your Next.js API (We need to create this endpoint next)
  try {
    const response = await fetch(
      "http://localhost:3000/api/extension/check-job",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tab.url }),
      }
    );

    const data = await response.json();

    if (data.found) {
      statusDiv.innerHTML = `✅ Tailored Resume Found!<br>Match: <b>${data.score}%</b>`;
      btn.disabled = false;

      // Store data for content script
      btn.onclick = () => {
        chrome.tabs.sendMessage(tab.id, {
          action: "FILL_FORM",
          resume: data.resume,
        });
      };
    } else {
      statusDiv.innerText = "No tailored resume found for this URL.";
    }
  } catch (e) {
    statusDiv.innerText = "Error connecting to Agent.";
    console.error(e);
  }
});
