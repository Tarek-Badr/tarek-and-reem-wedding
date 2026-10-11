(function () {
  'use strict';

  var form = document.getElementById('rsvpForm');
  if (!form) return;
  var arabic = document.documentElement.lang === 'ar';
  var text = arabic ? {
    name: 'يرجى كتابة اسمك.',
    sending: 'جارٍ الإرسال…',
    send: 'إرسال الرد',
    failed: 'تعذر إرسال ردك. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.',
    timeout: 'تعذر التأكد من إرسال ردك في الوقت الحالي. قد يكون ردك وصلنا بالفعل؛ يرجى التواصل معنا للتأكد قبل المحاولة مرة أخرى.',
    accepted: function (name) { return 'شكرًا يا ' + name + '! وصلنا تأكيد حضورك، ومتحمسون لمشاركتك فرحتنا.'; },
    declined: function (name) { return 'شكرًا يا ' + name + ' على ردك. سنفتقد وجودك، ونتمنى أن نراك قريبًا.'; }
  } : {
    name: 'Please enter your name.',
    sending: 'Sending…',
    send: 'Send RSVP',
    failed: 'We could not send your RSVP. Please check your connection and try again.',
    timeout: 'We could not confirm whether your RSVP was sent. Your reply may have reached us; please email us to check before trying again.',
    accepted: function (name) { return 'Thank you, ' + name + '! We\'ve got your reply and can\'t wait to celebrate with you.'; },
    declined: function (name) { return 'Thank you, ' + name + ' — we\'ll miss you, but we appreciate you letting us know.'; }
  };
  var nameEl = document.getElementById('rName');
  var guests = document.getElementById('rGuests');
  var guestField = document.getElementById('guestField');
  var button = document.getElementById('rsvpSubmitBtn');
  var errorEl = document.getElementById('rsvpError');
  var thanks = document.getElementById('rsvpThanks');
  var submitting = false;

  function attendance() {
    var selected = form.querySelector('input[name="attending"]:checked');
    return selected ? selected.value : '';
  }
  function updateGuests() {
    var declined = attendance() === 'Regretfully declines';
    guestField.hidden = declined;
    guests.disabled = declined;
    guests.required = !declined;
  }
  // Retain the native form if enhanced submission is unsupported.
  if (!window.fetch || !window.FormData) return;
  form.querySelectorAll('input[name="attending"]').forEach(function (radio) {
    radio.addEventListener('change', updateGuests);
  });
  updateGuests();
  nameEl.addEventListener('input', function () {
    nameEl.setCustomValidity(nameEl.value.trim() ? '' : text.name);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (submitting) return;
    errorEl.textContent = '';
    var name = nameEl.value.trim();
    nameEl.setCustomValidity(name ? '' : text.name);
    updateGuests();
    if (!form.reportValidity()) return;

    var attending = attendance();
    var body = new FormData(form);
    body.set('name', name);
    body.set('email', String(body.get('email') || '').trim());
    body.set('guests', attending === 'Regretfully declines' ? '0' : guests.value);
    submitting = true;
    button.disabled = true;
    button.textContent = text.sending;
    form.setAttribute('aria-busy', 'true');
    var controller = window.AbortController ? new AbortController() : null;
    var timedOut = false;
    var timeout;

    try {
      var request = {method:'POST', headers:{'Accept':'application/json'}, body:body};
      if (controller) request.signal = controller.signal;
      // Race the request so the UI can recover even if AbortController is unavailable.
      var response = await Promise.race([
        fetch(form.action, request),
        new Promise(function (resolve, reject) {
          timeout = window.setTimeout(function () {
            timedOut = true;
            if (controller) controller.abort();
            reject(new Error('RSVP request timed out'));
          }, 20000);
        })
      ]);
      if (!response.ok) throw new Error('Formspree returned status ' + response.status);

      thanks.textContent = attending === 'Joyfully accepts' ? text.accepted(name) : text.declined(name);
      form.hidden = true;
      thanks.hidden = false;
      thanks.focus({preventScroll:true});
      thanks.scrollIntoView({behavior:'auto', block:'center'});
    } catch (error) {
      console.error('RSVP submission failed:', error);
      errorEl.textContent = timedOut ? text.timeout : text.failed;
    } finally {
      window.clearTimeout(timeout);
      submitting = false;
      form.removeAttribute('aria-busy');
      button.disabled = false;
      button.textContent = text.send;
    }
  });
})();
