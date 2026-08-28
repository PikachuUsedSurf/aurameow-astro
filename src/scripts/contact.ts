// Contact form submission, ported from the original jQuery + PHP send-mail.php
// flow. Static hosts (Vercel/Netlify/GitHub Pages/etc.) can't run PHP, so this
// posts to Web3Forms (https://web3forms.com) instead — a free service that
// emails form submissions straight to your inbox with no backend of your own.
//
// Setup: sign up at https://web3forms.com, grab your access key, and replace
// the "access_key" hidden input value in contact.astro.

const form = document.getElementById('contact-form') as HTMLFormElement | null;
const alertBox = document.querySelector<HTMLDivElement>('.site-alert');
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

function showAlert(isError: boolean) {
  if (!alertBox) return;
  alertBox.classList.toggle('error', isError);
  alertBox.classList.remove('animated');
  // restart the CSS animation
  void alertBox.offsetWidth;
  alertBox.classList.add('animated');
  alertBox.style.display = 'block';
  window.setTimeout(() => {
    if (alertBox) alertBox.style.display = 'none';
  }, 6000);
}

function isValid(data: { name: string; email: string; message: string }) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (
    data.name.trim() !== '' &&
    emailPattern.test(data.email.trim()) &&
    data.message.trim() !== ''
  );
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector<HTMLButtonElement>('.submit');
    const formData = new FormData(form);

    // honeypot: original anti-spam field — if it's filled, silently "succeed"
    const honeypot = String(formData.get('url') ?? '');
    if (honeypot !== '') {
      form.reset();
      showAlert(false);
      return;
    }

    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const message = String(formData.get('message') ?? '');

    if (!isValid({ name, email, message })) {
      showAlert(true);
      return;
    }

    submitBtn?.classList.add('active', 'loading');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        form.reset();
        showAlert(false);
      } else {
        showAlert(true);
      }
    } catch {
      showAlert(true);
    } finally {
      submitBtn?.classList.remove('active', 'loading');
    }
  });
}
