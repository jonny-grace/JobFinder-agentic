// extension/background.js

console.log("Resume Agent Background Service Started");

// Optional: Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Resume Agent Installed successfully.");
});
