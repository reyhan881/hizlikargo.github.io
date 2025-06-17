// index.js dosyasının tamamı
/*
    ÖNEMLİ NOT: Bu dosyadan 'mockDatabase' objesi kaldırılmıştır.
    Artık kargo verileri, tüm sayfaların ortak kullandığı ve auth.js tarafından başlatılan
    localStorage'daki 'kargoDatabase' anahtarından okunmaktadır.
*/
document.addEventListener('DOMContentLoaded', () => {

    const trackingForm = document.getElementById('tracking-form');
    if (!trackingForm) return;

    const trackingNumberInput = document.getElementById('tracking-number');
    const resultsSection = document.getElementById('results-section');
    const resultTitle = document.getElementById('result-title');
    const trackingResultContainer = document.getElementById('tracking-result');
    const loader = document.getElementById('loader');

    // URL'den takip numarası parametresini kontrol et ve otomatik sorgula
    const urlParams = new URLSearchParams(window.location.search);
    const prefillTrackingId = urlParams.get('trackingId');

    if (prefillTrackingId) {
        trackingNumberInput.value = prefillTrackingId;
        performTracking(prefillTrackingId); // Otomatik olarak sorgula
    }

    trackingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const trackingNumber = trackingNumberInput.value.trim().toUpperCase();
        if (!trackingNumber) return;

        performTracking(trackingNumber);
    });

    function performTracking(trackingNumber) {
        resultsSection.classList.remove('hidden');
        trackingResultContainer.innerHTML = ''; // Önceki sonuçları temizle
        loader.classList.remove('hidden'); // Loader'ı göster

        // localStorage'dan kargo verilerini çek
        const kargoDatabase = JSON.parse(localStorage.getItem('kargoDatabase')) || {};
        const data = kargoDatabase[trackingNumber];

        setTimeout(() => { // Yükleme animasyonu için gecikme
            loader.classList.add('hidden'); // Loader'ı gizle
            if (data) {
                displayTrackingResult(trackingNumber, data);
            } else {
                displayError(trackingNumber);
            }
        }, 1000); // 1 saniye sonra sonuçları göster
    }

    function displayTrackingResult(trackingNumber, data) {
        resultTitle.textContent = `Kargo Takip Sonucu: ${trackingNumber}`;

        // 1. Özet Bilgileri Oluştur
        const summaryHTML = `
            <div class="tracking-summary">
                <div class="summary-item">
                    <strong>Durum:</strong>
                    <span class="status-badge status-${data.status.toLowerCase().replace(/ /g, '-')}">${data.status}</span>
                </div>
                <div class="summary-item">
                    <strong>Tahmini Teslimat:</strong>
                    <span>${data.estimated_delivery}</span>
                </div>
                <div class="summary-item">
                    <strong>Gönderici:</strong>
                    <span>${data.from}</span>
                </div>
                <div class="summary-item">
                    <strong>Alıcı:</strong>
                    <span>${data.to}</span>
                </div>
                <div class="summary-item">
                    <strong>Ağırlık:</strong>
                    <span>${data.weight}</span>
                </div>
                <div class="summary-item">
                    <strong>Ödenen Fiyat:</strong>
                    <span>${data.finalPrice ? data.finalPrice + ' TL' : 'Belirtilmemiş'}</span>
                </div>
            </div>
        `;

        // 2. Zaman Çizelgesini (Timeline) Oluştur
        let timelineHTML = '<div class="timeline">';
        // Güncellemeleri tersten sırala (en yeni en üstte)
        data.updates.slice().reverse().forEach(update => {
            const isDelivered = update.icon.includes('box-check'); // 'Teslim Edildi' ikonu varsa teslim edildi kabul et
            timelineHTML += `
                <div class="timeline-item ${isDelivered ? 'delivered' : ''}">
                    <div class="timeline-content">
                        <h3><i class="${update.icon}"></i> ${update.location}</h3>
                        <div class="time">${update.timestamp}</div>
                        <p>${update.description}</p>
                    </div>
                </div>
            `;
        });
        timelineHTML += '</div>';

        // 3. Oluşturulan HTML'leri ekrana bas
        trackingResultContainer.innerHTML = summaryHTML + timelineHTML;
    }

    function displayError(trackingNumber) {
        resultTitle.textContent = `Sonuç Bulunamadı`;
        trackingResultContainer.innerHTML = `<p style="text-align: center;"><strong>${trackingNumber}</strong> numaralı kargo için herhangi bir kayıt bulunamadı. Lütfen numarayı kontrol edip tekrar deneyin.</p>`;
    }
});