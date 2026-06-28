const form = document.getElementById('quoteForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.className = 'form-status';
  status.textContent = 'Sending...';

  const fd = new FormData(form);
  const services = fd.getAll('services');
  const payload = {
    fullName:        fd.get('fullName')?.trim(),
    propertyAddress: fd.get('propertyAddress')?.trim(),
    phone:           fd.get('phone')?.trim(),
    email:           fd.get('email')?.trim(),
    services,
    message:         fd.get('message')?.trim(),
    submittedAt:     new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
  };

  try {
    const res = await fetch('/api/schedule-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Server error');

    form.reset();
    status.className = 'form-status success';
    status.textContent = 'Thank you \u2014 we will contact you shortly!';
  } catch (err) {
    // Fallback if the email backend isn't reachable: open the user's mail app
    const subject = encodeURIComponent('Schedule Request: ' + (payload.fullName || ''));
    const body = encodeURIComponent(
      'Full Name: ' + payload.fullName + '\n' +
      'Property Address: ' + payload.propertyAddress + '\n' +
      'Phone: ' + payload.phone + '\n' +
      'Email: ' + payload.email + '\n' +
      'Services: ' + (services.join(', ') || 'None selected') + '\n' +
      'Message: ' + (payload.message || '') + '\n' +
      'Submitted: ' + payload.submittedAt
    );
    window.location.href = 'mailto:hello@mortonlawns.com?subject=' + subject + '&body=' + body;
    form.reset();
    status.className = 'form-status success';
    status.textContent = 'Thank you \u2014 we will contact you shortly!';
  }
});
