document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'Bharati' && password === '12012025') {
        alert('Login successful!');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials.');
    }
});
