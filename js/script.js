document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.slide-dot')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeSlide = 0;
  let slideTimer;

  document.getElementById('year').textContent = new Date().getFullYear();

  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const showSlide = (index) => {
    activeSlide = index;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      if (i === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };

  const startSlideshow = () => {
    if (reduceMotion || slides.length < 2) return;
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide((activeSlide + 1) % slides.length), 6000);
  };

  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    startSlideshow();
  }));
  startSlideshow();

  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    const status = document.getElementById('enquiry-status');
    const submitButton = enquiryForm.querySelector('button[type="submit"]');
    const requiredFields = [
      { field: document.getElementById('enquiry-name'), emptyMessage: 'Please enter your name.' },
      { field: document.getElementById('enquiry-email'), emptyMessage: 'Please enter your email address.' },
      { field: document.getElementById('enquiry-message'), emptyMessage: 'Please tell us about the work required.' }
    ];

    const setError = (field, message = '') => {
      const error = document.getElementById(`${field.id}-error`);
      field.setAttribute('aria-invalid', String(Boolean(message)));
      error.textContent = message;
    };

    const validateField = ({ field, emptyMessage }) => {
      const value = field.value.trim();
      if (!value) {
        setError(field, emptyMessage);
        return false;
      }
      if (field.type === 'email' && field.validity.typeMismatch) {
        setError(field, 'Please enter a valid email address.');
        return false;
      }
      setError(field);
      return true;
    };

    requiredFields.forEach((item) => {
      item.field.addEventListener('input', () => {
        validateField(item);
        status.textContent = '';
        status.classList.remove('is-error');
      });
    });

    enquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.textContent = '';
      status.classList.remove('is-error');
      const isValid = requiredFields.map(validateField).every(Boolean);
      if (!isValid) {
        requiredFields.find(({ field }) => field.getAttribute('aria-invalid') === 'true').field.focus();
        return;
      }
      if (document.getElementById('enquiry-website').value) return;

      submitButton.disabled = true;
      try {
        const response = await fetch(enquiryForm.action, {
          method: 'POST',
          body: new FormData(enquiryForm),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Form submission failed');

        enquiryForm.reset();
        requiredFields.forEach(({ field }) => setError(field));
        status.textContent = 'Thank you. Your enquiry has been sent successfully and we’ll get back to you as soon as possible.';
      } catch (error) {
        status.classList.add('is-error');
        status.textContent = 'Sorry, there was a problem sending your enquiry. Please try again or contact us directly.';
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});
