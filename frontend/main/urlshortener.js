document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shorten-form');
  const input = document.getElementById('original-url');
  const output = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first.');
      window.location.href = '/login/login.html'; 
      return;
    }

    try {
      const response = await fetch('/api/url/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ originalUrl: input.value }),
      });

      if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/login/login.html';
        return;
      }

      const data = await response.json();
      if (response.ok) {
        output.textContent = data.shortUrl;
      } else {
        alert(data.message || 'Failed to shorten URL.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
});