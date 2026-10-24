/* ==========================================================================
   Inquiry forms — shared by index.html and contact.html (any form with
   [data-inquiry-form]).

   Delivery: Web3Forms (https://web3forms.com) emails each submission to the
   inbox the access key was registered with. The key sits in each form's hidden
   "access_key" field — it is public by design (it can only deliver to that one
   inbox) and the hidden field is also what makes the form work without
   JavaScript, as a normal POST to Web3Forms.

   With JavaScript, this script adds inline validation, sends in the background,
   shows the result on the page, blocks double submission, and limits each
   browser to one message a minute.
   ========================================================================== */
(function () {
  'use strict';

  const COOLDOWN_MS = 60 * 1000;
  const STORAGE_KEY = 'inquiry:lastSentAt';
  const SUBJECT_PREFIX = 'New Portfolio Inquiry - AI Solutions';
  const WHATSAPP = 'https://wa.me/2349078866537';
  const EMAIL = 'ilorimajeed0@gmail.com';

  const lastSentAt = () => { try { return Number(localStorage.getItem(STORAGE_KEY)) || 0; } catch (e) { return 0; } };
  const markSent = () => { try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (e) { /* storage blocked: cooldown just won't persist */ } };

  function messageFor(field) {
    const v = field.validity;
    const label = field.dataset.label || 'This field';
    if (v.valueMissing) return field.tagName === 'SELECT' ? `Please choose ${label.toLowerCase()}.` : `Please enter ${label.toLowerCase()}.`;
    if (v.typeMismatch && field.type === 'email') return 'Please enter a valid email address, like you@company.com.';
    if (v.tooShort) return `${label} needs at least ${field.minLength} characters.`;
    if (v.tooLong) return `${label} can be at most ${field.maxLength} characters.`;
    return field.validationMessage;
  }

  function showFieldError(field, message) {
    const error = document.getElementById(field.id + '-error');
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message || '';
  }

  function validate(form) {
    let firstInvalid = null;
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      if (!field.id || field.closest('.honeypot')) return;
      // Trim so whitespace-only answers count as empty
      if (field.tagName !== 'SELECT' && typeof field.value === 'string') field.value = field.value.trim();
      const ok = field.checkValidity();
      showFieldError(field, ok ? '' : messageFor(field));
      if (!ok && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function renderStatus(status, type, html) {
    const cls = { ok: 'notice notice--ok', err: 'notice notice--err', info: 'notice notice--info' }[type];
    const icon = { ok: '✓', err: '!', info: 'i' }[type];
    status.innerHTML = `<div class="${cls}"><span class="notice__icon" aria-hidden="true">${icon}</span><p>${html}</p></div>`;
  }

  function init(form) {
    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('.btn__label');
    const idleLabel = label.textContent;
    let sending = false;

    form.noValidate = true; // JavaScript takes over validation messages

    // Clear a field's error as soon as it becomes valid
    form.addEventListener('input', (e) => {
      const field = e.target;
      if (field.getAttribute('aria-invalid') === 'true' && field.checkValidity()) showFieldError(field, '');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return;
      status.innerHTML = '';

      if (!validate(form)) return;

      const data = Object.fromEntries(new FormData(form));

      // Honeypot: hidden from people, so a ticked box means a bot. Pretend success.
      if (data.botcheck) {
        form.reset();
        renderStatus(status, 'ok', '<strong>Thank you!</strong> Your inquiry has been sent.');
        return;
      }
      delete data.botcheck;

      const wait = lastSentAt() + COOLDOWN_MS - Date.now();
      if (wait > 0) {
        renderStatus(status, 'info', `<strong>Your previous message was sent.</strong> To prevent duplicates, please wait ${Math.ceil(wait / 1000)} seconds before sending another.`);
        status.focus();
        return;
      }

      data.subject = data.subject ? `${SUBJECT_PREFIX}: ${data.subject}` : SUBJECT_PREFIX;
      data.from_name = 'Ilori Majeed Website';

      sending = true;
      button.disabled = true;
      button.classList.add('is-loading');
      label.textContent = 'Sending…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        let result = {};
        try { result = await res.json(); } catch (err) { /* non-JSON response, e.g. a bot-check page */ }
        if (!res.ok || !result.success) throw new Error(result.message || `Request failed (HTTP ${res.status})`);

        markSent();
        form.reset();
        form.querySelectorAll('[aria-invalid]').forEach((f) => f.setAttribute('aria-invalid', 'false'));
        renderStatus(status, 'ok', '<strong>Thank you!</strong> Your inquiry has been sent. I’ll reply within 24 hours.');
      } catch (err) {
        console.error('Inquiry not sent:', err);
        renderStatus(status, 'err', `<strong>Your message couldn’t be sent.</strong> Please try again, or message me on <a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer">WhatsApp</a> or by <a href="mailto:${EMAIL}">email</a>.`);
      } finally {
        sending = false;
        button.disabled = false;
        button.classList.remove('is-loading');
        label.textContent = idleLabel;
        status.focus();
      }
    });
  }

  document.querySelectorAll('form[data-inquiry-form]').forEach(init);
})();
