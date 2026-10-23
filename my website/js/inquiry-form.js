/* ============================================================
   Inquiry form delivery — shared by index.html and contact.html
   ------------------------------------------------------------
   This is a static site with no server, so submissions go to
   Web3Forms (https://web3forms.com), which emails them to the
   inbox the access key was registered with.

   The access key is public by design: it can only deliver to
   that one registered inbox, so it is safe in page code and
   needs no .env file or server.
   ============================================================ */
(function () {
  // Paste the key Web3Forms emails you here.
  const WEB3FORMS_ACCESS_KEY = '48f303ed-22f2-40ca-b0c9-d0bd8497182f';

  const ENDPOINT = 'https://api.web3forms.com/submit';
  const COOLDOWN_MS = 60 * 1000;           // one message per minute per browser
  const STORAGE_KEY = 'inquiry:lastSentAt';

  function lastSentAt() {
    try { return Number(localStorage.getItem(STORAGE_KEY)) || 0; } catch (e) { return 0; }
  }

  function markSent() {
    try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (e) { /* storage blocked — cooldown just won't persist */ }
  }

  function inquiryError(code, message) {
    const err = new Error(message);
    err.code = code;
    return err;
  }

  /**
   * Sends a form's fields as an inquiry email.
   * Resolves on delivery; rejects with err.code = 'throttled' | 'not_configured' | 'send_failed'.
   */
  async function sendInquiry(form) {
    const data = Object.fromEntries(new FormData(form));

    // Honeypot: the checkbox is hidden from people, so a ticked one means a bot.
    // Pretend it worked so the bot learns nothing.
    if (data.botcheck) return { ok: true, skipped: true };
    delete data.botcheck;

    const wait = lastSentAt() + COOLDOWN_MS - Date.now();
    if (wait > 0) {
      throw inquiryError('throttled', `Please wait ${Math.ceil(wait / 1000)} seconds before sending another message.`);
    }

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.startsWith('YOUR_')) {
      throw inquiryError('not_configured', 'Form delivery is not configured: add the Web3Forms access key in js/inquiry-form.js.');
    }

    const payload = Object.assign({}, data, {
      access_key: WEB3FORMS_ACCESS_KEY,
      from_name: 'Ilori Majeed Website',
      subject: data.subject ? `New Portfolio Inquiry - AI Solutions: ${data.subject}` : 'New Portfolio Inquiry - AI Solutions',
    });

    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      throw inquiryError('send_failed', 'Network error — check your connection.');
    }

    let result = {};
    try { result = await res.json(); } catch (e) { /* non-JSON error page */ }

    if (!res.ok || !result.success) {
      throw inquiryError('send_failed', result.message || `Request failed (${res.status}).`);
    }

    markSent();
    return { ok: true };
  }

  window.sendInquiry = sendInquiry;
})();
