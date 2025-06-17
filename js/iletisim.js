document.addEventListener('DOMContentLoaded', () => {

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Formun sayfayı yenilemesini engelle

            // Form verilerini al
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Hata mesajları için boş bir dizi oluştur
            let errors = [];

            // Doğrulama (Validation)
            if (name === '') {
                errors.push('Ad soyad alanı boş bırakılamaz.');
            }
            if (email === '') {
                errors.push('E-posta alanı boş bırakılamaz.');
            } else if (!isValidEmail(email)) {
                // E-posta formatını basit bir regex ile kontrol et
                errors.push('Lütfen geçerli bir e-posta adresi girin.');
            }
            if (subject === '') {
                errors.push('Konu alanı boş bırakılamaz.');
            }
            if (message === '') {
                errors.push('Mesaj alanı boş bırakılamaz.');
            }

            // Hata varsa göster
            if (errors.length > 0) {
                formStatus.innerHTML = errors.join('<br>');
                formStatus.className = 'form-status-error';
            } else {
                // Hata yoksa, başarı mesajı göster ve formu gizle
                // (Backend olmadığı için burada sadece simülasyon yapıyoruz)
                console.log('Form verileri (backend olmadığından konsola yazılıyor):', { name, email, subject, message });
                
                formStatus.innerHTML = 'Mesajınız için teşekkür ederiz! En kısa sürede size geri dönüş yapacağız.';
                formStatus.className = 'form-status-success';
                
                // Formu temizle veya gizle
                contactForm.reset();
                // contactForm.style.display = 'none'; // İsterseniz formu tamamen gizleyebilirsiniz
            }
        });
    }

    function isValidEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

});