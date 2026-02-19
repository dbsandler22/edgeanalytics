document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const success = document.getElementById('signupSuccess');
  const error = document.getElementById('signupError');
  const retryBtn = document.getElementById('retryBtn');
  const note = document.querySelector('.signup-note');
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz8FZcSGqlTvAcec5DXNbzwnv5t0ViqSWEldNwj8-BTGfydA4euciHIC9bt0EgW6vSkYg/exec';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const data = new FormData(form);
    const entry = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone') || 'not specified',
      athletes: data.get('athletes') || 'not specified',
      sport: data.get('sport') || 'not specified',
    };

    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(entry),
    })
    .then(() => {
      form.style.display = 'none';
      note.style.display = 'none';
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })
    .catch(() => {
      form.style.display = 'none';
      note.style.display = 'none';
      error.classList.add('show');
      error.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Share functionality
  const pageUrl = window.location.href;
  const shareMessage = 'Check out Edge Athletics — a new youth sports analytics platform that helps trainers earn more. Get early access:';

  document.getElementById('shareCopy').addEventListener('click', () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      const copied = document.getElementById('shareCopied');
      copied.classList.add('show');
      setTimeout(() => copied.classList.remove('show'), 2000);
    });
  });

  const emailSubject = encodeURIComponent('Check out Edge Athletics');
  const emailBody = encodeURIComponent(shareMessage + ' ' + pageUrl);
  document.getElementById('shareEmail').href = 'mailto:?subject=' + emailSubject + '&body=' + emailBody;

  const textBody = encodeURIComponent(shareMessage + ' ' + pageUrl);
  document.getElementById('shareText').href = 'sms:?&body=' + textBody;

  retryBtn.addEventListener('click', () => {
    error.classList.remove('show');
    form.style.display = 'flex';
    note.style.display = 'block';
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = false;
    btn.textContent = 'Keep Me Posted';
  });
});
