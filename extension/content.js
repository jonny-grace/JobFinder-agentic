chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "FILL_FORM") {
    const resume = request.resume;
    console.log("🤖 Auto-Filling with:", resume);

    // Simple Heuristic Filling
    fillInput("name", resume.contact.fullName);
    fillInput("first_name", resume.contact.fullName.split(" ")[0]);
    fillInput(
      "last_name",
      resume.contact.fullName.split(" ").slice(1).join(" ")
    );
    fillInput("email", resume.contact.email);
    fillInput("phone", resume.contact.phone);
    fillInput("linkedin", resume.contact.linkedin);
    fillInput("website", resume.contact.portfolio);

    alert("Auto-Fill Complete! Check fields.");
  }
});

function fillInput(keyword, value) {
  if (!value) return;

  // Find inputs by Name, ID, or Label
  const inputs = document.querySelectorAll("input, textarea");

  inputs.forEach((input) => {
    const name = (input.name || input.id || "").toLowerCase();
    if (name.includes(keyword)) {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true })); // Trigger React/Angular changes
      input.style.border = "2px solid green"; // Visual feedback
    }
  });
}
