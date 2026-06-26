const form = document.getElementById("scheduleForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Sending request...";
  statusEl.className = "form-status";

  const data = new FormData(form);
  const payload = {
    fullName: data.get("fullName")?.trim(),
    propertyAddress: data.get("propertyAddress")?.trim(),
    phone: data.get("phone")?.trim(),
    email: data.get("email")?.trim(),
    services: data.getAll("services"),
    message: data.get("message")?.trim()
  };

  try {
    const response = await fetch("/api/schedule-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Unable to send request.");
    }

    form.reset();
    statusEl.textContent = "Request sent. We will follow up soon.";
    statusEl.className = "form-status success";
  } catch (error) {
    statusEl.textContent = "Could not send automatically. Please text 206-427-6120 or email hello@mortonlawns.com.";
    statusEl.className = "form-status error";
  }
});
