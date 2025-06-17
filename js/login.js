document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('form-message');

    const users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
    
    // Kullanıcıyı ve şifreyi kontrol et
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
        // Kullanıcıyı "giriş yapmış" olarak işaretle
        localStorage.setItem('loggedInUser', JSON.stringify({ email: foundUser.email }));
        
        messageDiv.textContent = 'Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...';
        messageDiv.className = 'success';
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    } else {
        messageDiv.textContent = 'E-posta veya şifre hatalı.';
        messageDiv.className = 'error';
    }
});