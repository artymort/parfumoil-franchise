const header = document.querySelector('.site-header');
const nav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const video = document.querySelector('.hero-video');
const videoControl = document.querySelector('.video-control');
const videoControlLabel = document.querySelector('.video-control-label');
const dialog = document.querySelector('.lead-dialog');

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuToggle.addEventListener('click', () => {
  const opened = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!opened));
  menuToggle.setAttribute('aria-label', opened ? 'Открыть меню' : 'Закрыть меню');
  header.classList.toggle('menu-open', !opened);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}));

document.querySelectorAll('[data-open-lead]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
document.querySelector('[data-close-lead]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  video.pause();
  videoControl.hidden = true;
}
videoControl.addEventListener('click', () => {
  if (video.paused) {
    video.play().then(() => {
      videoControl.setAttribute('aria-pressed', 'false');
      videoControl.setAttribute('aria-label', 'Остановить видео');
      videoControlLabel.textContent = 'Пауза';
    }).catch(() => {});
  } else {
    video.pause();
    videoControl.setAttribute('aria-pressed', 'true');
    videoControl.setAttribute('aria-label', 'Включить видео');
    videoControlLabel.textContent = 'Включить';
  }
});

const galleryImage = document.querySelector('#gallery-main-image');
const galleryCaption = document.querySelector('#gallery-caption');
document.querySelectorAll('.gallery-thumb').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.gallery-thumb').forEach(other => {
    other.classList.toggle('is-active', other === button);
    other.setAttribute('aria-pressed', String(other === button));
  });
  galleryImage.src = button.dataset.image;
  galleryImage.alt = button.dataset.alt;
  galleryCaption.textContent = button.dataset.caption;
}));

document.querySelectorAll('.lead-form').forEach(form => {
  form.addEventListener('input', event => {
    if (event.target.matches('input,select')) event.target.removeAttribute('aria-invalid');
    form.querySelector('.form-status').textContent = '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = Array.from(form.querySelectorAll('input,select'));
    let firstInvalid = null;
    fields.forEach(field => {
      const isPhone = field.name === 'phone';
      const invalid = !field.value.trim() || (isPhone && field.value.replace(/\D/g, '').length < 10);
      field.toggleAttribute('aria-invalid', invalid);
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    const status = form.querySelector('.form-status');
    if (firstInvalid) {
      status.textContent = 'Заполните все поля и проверьте номер телефона.';
      firstInvalid.focus();
      return;
    }
    status.textContent = 'Форма пока не подключена к приему заявок. Данные не отправлены.';
  });
});
