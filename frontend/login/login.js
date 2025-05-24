document.addEventListener('DOMContentLoaded', () => {
  const loginSubmit = document.getElementById('loginSubmit');
  const registerSubmit = document.getElementById('registerSubmit');

  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');

  const registerName = document.getElementById('registerName');
  const registerEmail = document.getElementById('registerEmail');
  const registerPassword = document.getElementById('registerPassword');
  const registerError = document.getElementById('registerError');

  // Clear errors helper
  function clearErrors() {
    loginError.textContent = '';
    registerError.textContent = '';
  }

  // Redirect to URL shortener page
  function redirectToShortener() {
    window.location.href = '/main/urlshortener.html'; // Change this path if needed
  }

  // LOGIN
  loginSubmit.addEventListener('click', async () => {
    clearErrors();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (!email || !password) {
      loginError.textContent = 'Please enter email and password.';
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        loginError.textContent = data.message || 'Login failed. Check credentials.';
        return;
      }

      // Save token or user info as needed (e.g., localStorage)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      redirectToShortener();
    } catch (error) {
      loginError.textContent = 'Network error. Please try again.';
      console.error('Login error:', error);
    }
  });

  // REGISTER
  registerSubmit.addEventListener('click', async () => {
    clearErrors();
    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value.trim();

    if (!name || !email || !password) {
      registerError.textContent = 'Please fill in all fields.';
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        registerError.textContent = data.message || 'Registration failed. Try again.';
        return;
      }

      // Optionally auto-login user or redirect after registration
      redirectToShortener();
    } catch (error) {
      registerError.textContent = 'Network error. Please try again.';
      console.error('Register error:', error);
    }
  });
});