const form = document.querySelector('[data-subscribe]');

form?.addEventListener('submit', async event => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button');
  const body = new URLSearchParams(new FormData(form));

  status.textContent = 'Subscribing…';
  button.disabled = true;
  try {
    const response = await fetch(form.action, { method: 'POST', body });
    const result = await response.json();
    status.textContent = result.message;
    if (response.ok) form.reset();
  } catch {
    status.textContent = 'The subscription could not be saved. Please try again.';
  } finally {
    button.disabled = false;
  }
});
