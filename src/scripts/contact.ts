// Contact form submission, ported from the original jQuery + PHP send-mail.php
// flow. Static hosts (Vercel/Netlify/GitHub Pages/etc.) can't run PHP, so this
// posts to Web3Forms (https://web3forms.com) instead — a free service that
// emails form submissions straight to your inbox with no backend of your own.
//
// Setup: sign up at https://web3forms.com, grab your access key, and replace
// the "access_key" hidden input value in contact.astro.

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// Flashes the little popup toast (bottom-right corner, see .site-alert in
// main.css) — green-ish for success, red for an error, then hides itself
// after 6 seconds.
function showAlert(alertBox: HTMLDivElement, isError: boolean) {
  alertBox.classList.toggle('error', isError);
  alertBox.classList.remove('animated');
  // Reading offsetWidth here forces the browser to apply the class change
  // above before we add "animated" back below. Without this line, removing
  // and immediately re-adding the same class in the same tick wouldn't
  // restart its CSS animation — the browser would just see no net change.
  void alertBox.offsetWidth;
  alertBox.classList.add('animated');
  alertBox.style.display = 'block';
  window.setTimeout(() => {
    alertBox.style.display = 'none';
  }, 6000);
}

// Basic client-side validation, just to avoid an obviously-broken submit
// (an empty name, an email with no "@", etc) before bothering the network.
// Web3Forms does its own validation too — this is just a faster first pass.
function isValid(data: { name: string; email: string; message: string }) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    data.name.trim() !== '' &&
    emailPattern.test(data.email.trim()) &&
    data.message.trim() !== ''
  );
}

function initContactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  const alertBox = document.querySelector<HTMLDivElement>('.site-alert');
  // form.dataset.bound guards against attaching a second submit listener
  // if this function somehow ran twice on the same form element.
  if (!form || !alertBox || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  // "submit" fires when the form is submitted (Enter key, or clicking the
  // submit button). event.preventDefault() stops the browser's normal
  // behaviour (reloading the page to whatever the form's "action" URL is)
  // so we can send the data ourselves with fetch() below instead.
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>('.submit');
    // FormData reads every named input's current value out of the form,
    // the same way a normal browser form submission would.
    const formData = new FormData(form);

    // Honeypot: a hidden field real visitors never see or fill in, but
    // spam bots that blindly fill every field often do. If it has a
    // value, silently pretend the submission succeeded instead of
    // actually sending it anywhere.
    const honeypot = String(formData.get('url') ?? '');
    if (honeypot !== '') {
      form.reset();
      showAlert(alertBox, false);
      return;
    }

    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const message = String(formData.get('message') ?? '');

    if (!isValid({ name, email, message })) {
      showAlert(alertBox, true);
      return;
    }

    submitBtn?.classList.add('active', 'loading'); // shows a loading state on the button

    try {
      // fetch() sends the actual network request. `await` pauses this
      // function right here until the response comes back, without
      // freezing the rest of the page — that's what lets the "loading"
      // button state stay visible and interactive while we wait.
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        form.reset(); // clears every input back to empty
        showAlert(alertBox, false);
      } else {
        showAlert(alertBox, true);
      }
    } catch {
      // A network failure (offline, DNS error, etc) lands here rather than
      // in the `if (result.success)` check above.
      showAlert(alertBox, true);
    } finally {
      // `finally` runs whether the try succeeded or failed — always turn
      // off the loading state once we're done, either way.
      submitBtn?.classList.remove('active', 'loading');
    }
  });
}

// astro:page-load fires on the first load and every subsequent client-side
// navigation to this page — the form element is a fresh node each time
// (it isn't transition:persist'd), so it needs a fresh binding each visit.
document.addEventListener('astro:page-load', initContactForm);
