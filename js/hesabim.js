document.addEventListener('DOMContentLoaded', function() {
    // Kullanıcı oturum kontrolü
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        window.location.href = '../html/login.html';
        return;
    }

    // Kullanıcı bilgilerini yükle
    const users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
    const currentUser = users.find(user => user.email === loggedInUser.email);
    
    if (!currentUser) {
        localStorage.removeItem('loggedInUser');
        window.location.href = '../html/login.html';
        return;
    }

    // Kullanıcı bilgilerini göster (ESKİ HAL KORUNDU)
    document.getElementById('welcome-message').textContent = `Hoş Geldiniz, ${currentUser.firstName || currentUser.email.split('@')[0]}`;
    document.getElementById('cargo-points').textContent = `${currentUser.cargoPoints} TL`;
    document.getElementById('loyalty-points').textContent = currentUser.loyaltyPoints;
    document.getElementById('referral-code').textContent = currentUser.referralCode;

    // Kargo geçmişini yükle (GÜNCELLENMİŞ HAL)
    loadUserShipments(currentUser.email);
});

// Kargo geçmişi yükleme fonksiyonu (YENİ VE GÜNCELLENMİŞ)
function loadUserShipments(userEmail) {
    try {
        const kargoDatabase = JSON.parse(localStorage.getItem('kargoDatabase')) || {};
        const shipmentsContainer = document.getElementById('my-shipments-list');
        
        if (!shipmentsContainer) return;

        // Kullanıcının kargolarını filtrele ve tarihe göre sırala
        const userShipments = Object.entries(kargoDatabase)
            .filter(([_, shipment]) => shipment.userEmail === userEmail)
            .sort((a, b) => new Date(b[1].createdDate) - new Date(a[1].createdDate));

        if (userShipments.length === 0) {
            shipmentsContainer.innerHTML = '<p class="no-shipments">Henüz kargo oluşturmadınız.</p>';
            return;
        }

        shipmentsContainer.innerHTML = userShipments.map(([trackingNumber, shipment]) => {
            // Kargo durumuna göre renk sınıfı belirle
            const statusClass = shipment.status ? shipment.status.toLowerCase().replace(' ', '-') : 'hazırlanıyor';
            
            return `
                <div class="shipment-item">
                    <div class="shipment-header">
                        <span class="tracking-number">${trackingNumber}</span>
                        <span class="status ${statusClass}">
                            ${shipment.status || 'Hazırlanıyor'}
                        </span>
                    </div>
                    <div class="shipment-details">
                        <p><i class="fas fa-user"></i> <strong>Alıcı:</strong> ${shipment.receiver?.name || 'Bilinmiyor'}</p>
                        <p><i class="fas fa-map-marker-alt"></i> <strong>Şehir:</strong> ${shipment.receiver?.city || 'Bilinmiyor'}</p>
                        ${shipment.weight ? `<p><i class="fas fa-weight-hanging"></i> <strong>Ağırlık:</strong> ${shipment.weight} kg</p>` : ''}
                        ${shipment.finalPrice ? `<p><i class="fas fa-lira-sign"></i> <strong>Ücret:</strong> ${shipment.finalPrice.toFixed(2)} TL</p>` : ''}
                        ${shipment.estimated_delivery ? `<p><i class="fas fa-calendar-day"></i> <strong>Teslimat:</strong> ${shipment.estimated_delivery}</p>` : ''}
                    </div>
                    <div class="shipment-actions">
                        <a href="kargo-detay.html?tracking=${trackingNumber}" class="details-btn">
                            <i class="fas fa-info-circle"></i> Detaylar
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Kargolar yüklenirken hata oluştu:', error);
        document.getElementById('my-shipments-list').innerHTML = 
            '<p class="error-message">Kargo bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>';
    }
}