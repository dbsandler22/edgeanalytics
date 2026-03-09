document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const success = document.getElementById('signupSuccess');
  const error = document.getElementById('signupError');
  const retryBtn = document.getElementById('retryBtn');
  const note = document.querySelector('.signup-note');
  const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyyTcsbwKpr-uUIkfBL4e_la_YMNp3lCMRMHFYAwXD4RKop6B1tBTfHc25KbNso91eu7w/exec';

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
      instagram: data.get('instagram') || 'not specified',
      athletes: data.get('athletes') || 'not specified',
      sport: data.get('sport') || 'not specified',
    };

    const showSuccess = () => {
      form.style.display = 'none';
      if (note) note.style.display = 'none';
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const showError = () => {
      form.style.display = 'none';
      if (note) note.style.display = 'none';
      error.classList.add('show');
      error.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(entry),
    })
    .then(showSuccess)
    .catch(showError);
  });

  // Share functionality
  const pageUrl = window.location.origin + window.location.pathname;
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

// Modal: See How Edge Works
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('edgeModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const seeHowBtn = document.getElementById('seeHowBtn');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const slides = document.querySelectorAll('.edge-modal-slide');
  const dots = document.querySelectorAll('.edge-modal-dot');
  const counter = document.getElementById('modalCurrentSlide');

  if (!modal || !seeHowBtn) return;

  let current = 0;
  const total = slides.length;

  function showSlide(index) {
    current = (index + total) % total;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = current + 1;
  }

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    showSlide(0);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  seeHowBtn.addEventListener('click', openModal);
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  modalPrev.addEventListener('click', () => showSlide(current - 1));
  modalNext.addEventListener('click', () => showSlide(current + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showSlide(current - 1);
    if (e.key === 'ArrowRight') showSlide(current + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  modal.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) showSlide(diff > 0 ? current + 1 : current - 1);
  }, { passive: true });
});

// Challenge image lightbox
document.addEventListener('DOMContentLoaded', () => {
  const thumbs = document.querySelectorAll('.challenge-thumb');
  const lightbox = document.getElementById('challengeLightbox');
  if (!lightbox || !thumbs.length) return;

  const lightboxImg = lightbox.querySelector('.challenge-lightbox-img');
  const lightboxCaption = lightbox.querySelector('.challenge-lightbox-caption');
  const lightboxClose = lightbox.querySelector('.challenge-lightbox-close');
  const lightboxOverlay = lightbox.querySelector('.challenge-lightbox-overlay');
  const lightboxPrev = lightbox.querySelector('.challenge-lightbox-prev');
  const lightboxNext = lightbox.querySelector('.challenge-lightbox-next');

  const images = Array.from(thumbs).map(t => ({
    src: t.dataset.src,
    label: t.dataset.label,
  }));
  let current = 0;

  function showImage(index) {
    current = (index + images.length) % images.length;
    lightboxImg.src = images[current].src;
    lightboxImg.alt = images[current].label;
    lightboxCaption.textContent = images[current].label;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => openLightbox(i)));
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showImage(current - 1));
  lightboxNext.addEventListener('click', () => showImage(current + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImage(current - 1);
    if (e.key === 'ArrowRight') showImage(current + 1);
  });
});
