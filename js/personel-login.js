document.getElementById('personel-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('form-message');

    // Simülasyon için hard-coded personel bilgileri (GÜNCELLENMİŞ)
    const staffCredentials = {
        username: 'personel', // Yeni kullanıcı adı
        password: 'personel2025' // Yeni şifre
    };

    if (username === staffCredentials.username && password === staffCredentials.password) {
        // Personeli "giriş yapmış" olarak işaretle
        localStorage.setItem('loggedInStaff', JSON.stringify({ username: username, role: 'admin' }));
        
        messageDiv.textContent = 'Giriş başarılı! Panele yönlendiriliyorsunuz...';
        messageDiv.className = 'success';
        
        setTimeout(() => {
            window.location.href = 'personel.html';
        }, 1500);
    } else {
        messageDiv.textContent = 'Kullanıcı adı veya şifre hatalı.';
        messageDiv.className = 'error';
    }
});