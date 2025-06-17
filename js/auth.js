// Veritabanı başlatma fonksiyonu
function initializeDatabase() {
    if (!localStorage.getItem('kargoDatabase')) {
        const initialData = {
            "ABC12345": {
                sender: { name: "Ayşe Yılmaz", city: "Kocaeli", district: "İzmit", address: "Gül Sk. No: 5 D: 1" },
                receiver: { name: "Ali Can", city: "İstanbul", district: "Şişli", address: "Dereboyu Cd. No: 20 D: 7" },
                weight: "2.5 kg",
                status: "Teslim Edildi",
                estimated_delivery: "09 Haziran 2025",
                finalPrice: 87.50,
                updates: [
                    { location: "Kocaeli Transfer Merkezi", description: "Kargo kabul edildi.", timestamp: "08.06.2025 14:30", icon: "fa-solid fa-box-archive" },
                    { location: "İstanbul Lojistik Üssü", description: "Kargo transfer merkezine ulaştı.", timestamp: "09.06.2025 04:15", icon: "fa-solid fa-warehouse" },
                    { location: "Kağıthane Dağıtım Merkezi", description: "Dağıtıma çıkarıldı.", timestamp: "09.06.2025 09:15", icon: "fa-solid fa-truck" },
                    { location: "Alıcı Adresi", description: "Kargo alıcıya teslim edildi.", timestamp: "09.06.2025 11:00", icon: "fa-solid fa-box-check", delivered: true }
                ]
            }
        };
        localStorage.setItem('kargoDatabase', JSON.stringify(initialData));
    }

    if (!localStorage.getItem('kargoUsers')) {
        const initialUsers = [
            {
                email: "test@example.com",
                password: "password123",
                firstName: "Test",
                lastName: "Kullanıcı",
                signupDate: new Date().toISOString(),
                referralCode: "HIZLI-TESTER",
                referredBy: null,
                cargoPoints: 100,
                loyaltyPoints: 500,
                shipmentCount: 2,
                nextShipmentDiscount: 0,
            }
        ];
        localStorage.setItem('kargoUsers', JSON.stringify(initialUsers));
    }
}

// Kullanıcı arayüzünü güncelleme fonksiyonu
function updateAuthUI() {
    const authContainer = document.getElementById('auth-buttons');
    if (!authContainer) return;

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
    const pathPrefix = window.location.pathname.includes('/html/') ? '..' : '.';

    if (loggedInUser) {
        const currentUser = users.find(user => user.email === loggedInUser.email);
        
        if (currentUser) {
            authContainer.innerHTML = `
                <a href="${pathPrefix}/html/hesabim.html" class="auth-btn profile">
                    <i class="fa-solid fa-user"></i>
                    <span>${currentUser.firstName || currentUser.email.split('@')[0]}</span>
                </a>
                <button id="logout-btn" class="auth-btn logout">Çıkış Yap</button>
            `;

            document.getElementById('logout-btn').addEventListener('click', function() {
                localStorage.removeItem('loggedInUser');
                window.location.href = `${pathPrefix}/index.html`;
            });
        } else {
            localStorage.removeItem('loggedInUser');
            showLoginButtons(authContainer, pathPrefix);
        }
    } else {
        showLoginButtons(authContainer, pathPrefix);
    }
}

function showLoginButtons(container, pathPrefix) {
    container.innerHTML = `
        <a href="${pathPrefix}/html/login.html" class="auth-btn login">Giriş Yap</a>
        <a href="${pathPrefix}/html/signup.html" class="auth-btn signup">Kaydol</a>
    `;
}

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
    updateAuthUI();
});