document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value.trim(); // Yeni: Ad alanı
    const lastName = document.getElementById('lastName').value.trim();   // Yeni: Soyad alanı
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const referralCodeInput = document.getElementById('referral').value.trim();
    const messageDiv = document.getElementById('form-message');

    // Alanların boş olup olmadığını kontrol et
    if (firstName === '' || lastName === '' || email === '' || password === '') {
        messageDiv.textContent = 'Lütfen tüm zorunlu alanları doldurun.';
        messageDiv.className = 'error';
        return;
    }

    if (password.length < 6) {
        messageDiv.textContent = 'Şifre en az 6 karakter olmalıdır.';
        messageDiv.className = 'error';
        return;
    }

    const users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
    const userExists = users.find(user => user.email === email);

    if (userExists) {
        messageDiv.textContent = 'Bu e-posta adresi zaten kayıtlı.';
        messageDiv.className = 'error';
        return;
    }

    // Yeni kullanıcı için detaylı profil oluştur
    const newUser = {
        email: email,
        password: password, // UYARI: Güvenli değil, sadece simülasyon.
        firstName: firstName, // Yeni eklendi
        lastName: lastName,   // Yeni eklendi
        signupDate: new Date().toISOString(),
        referralCode: `HIZLI-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
        referredBy: null,
        cargoPoints: 0,
        loyaltyPoints: 0,
        shipmentCount: 0,
        nextShipmentDiscount: 0
    };

    // Referans kodu kontrolü
    if (referralCodeInput) {
        const referringUserIndex = users.findIndex(user => user.referralCode === referralCodeInput);
        if (referringUserIndex !== -1) {
            // Referans olan kullanıcıya puan ekle
            users[referringUserIndex].cargoPoints += 20;
            // Yeni kullanıcıya başlangıç puanı ver
            newUser.cargoPoints = 20;
            newUser.referredBy = users[referringUserIndex].email;
            console.log(`${users[referringUserIndex].email} adlı kullanıcıya referans puanı eklendi.`);
            messageDiv.textContent = 'Başarıyla kaydoldunuz! Referans kodunuz için 20 puan kazandınız.';
            messageDiv.className = 'success';
        } else {
            messageDiv.textContent = 'Geçersiz referans kodu. Kod olmadan kayıt yapılıyor.';
            messageDiv.className = 'error';
            // Hatalı koda rağmen kayda devam edilebilir.
        }
    }

    // Yeni kullanıcıyı listeye ekle
    users.push(newUser);
    localStorage.setItem('kargoUsers', JSON.stringify(users));

    // Eğer referans kodu hatası yoksa veya referans kodu girilmediyse genel başarı mesajı göster
    if (messageDiv.textContent.includes('Geçersiz referans kodu') === false) {
        messageDiv.textContent = 'Başarıyla kaydoldunuz! Giriş sayfasına yönlendiriliyorsunuz...';
        messageDiv.className = 'success';
    }


    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});