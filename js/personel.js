document.addEventListener('DOMContentLoaded', function() {
    // --- GİRİŞ KONTROLÜ ---
    const loggedInStaff = JSON.parse(localStorage.getItem('loggedInStaff'));
    if (!loggedInStaff) {
        window.location.href = 'personel-login.html';
        return;
    }
    document.getElementById('staff-welcome').textContent = `Hoş Geldin, ${loggedInStaff.username}`;
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('loggedInStaff');
        window.location.href = 'personel-login.html';
    });

    // --- ELEMENTLER ---
    const cargoListDiv = document.getElementById('cargo-list');
    const modal = document.getElementById('update-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const updateForm = document.getElementById('update-status-form');
    const addCargoForm = document.getElementById('add-cargo-form');
    const toggleAddFormBtn = document.getElementById('toggle-add-form-btn');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    let kargoDatabase = JSON.parse(localStorage.getItem('kargoDatabase')) || {};

    // --- FONKSİYONLAR ---
    function loadAndDisplayCargos() {
        kargoDatabase = JSON.parse(localStorage.getItem('kargoDatabase')) || {};
        
        // Tablo başlıkları
        cargoListDiv.innerHTML = `
            <div class="table-header">
                <div class="table-cell">Takip No</div>
                <div class="table-cell">Durum</div>
                <div class="table-cell">Gönderici</div>
                <div class="table-cell">Alıcı</div>
                <div class="table-cell">Çıkış</div>
                <div class="table-cell">Hedef</div>
                <div class="table-cell">Ağırlık</div>
                <div class="table-cell">İşlemler</div>
            </div>
        `;

        // Kargoları listele
        for (const trackingId in kargoDatabase) {
            const cargo = kargoDatabase[trackingId];
            const lastUpdate = cargo.updates?.[cargo.updates.length - 1] || { description: 'Bilinmiyor' };
            
            const row = document.createElement('div');
            row.className = 'table-row';
            if (cargo.status === 'Teslim Edildi') {
                row.classList.add('delivered');
            }
            
            row.innerHTML = `
                <div class="table-cell" data-label="Takip No">${trackingId}</div>
                <div class="table-cell" data-label="Durum">${lastUpdate.description}</div>
                <div class="table-cell" data-label="Gönderici">${cargo.sender?.name || cargo.senderName || 'Bilinmiyor'}</div>
                <div class="table-cell" data-label="Alıcı">${cargo.receiver?.name || cargo.receiverName || 'Bilinmiyor'}</div>
                <div class="table-cell" data-label="Çıkış">${cargo.from || cargo.sender?.city || 'Bilinmiyor'}</div>
                <div class="table-cell" data-label="Hedef">${cargo.to || cargo.receiver?.city || 'Bilinmiyor'}</div>
                <div class="table-cell" data-label="Ağırlık">${cargo.weight || cargo.details?.weight || '0'} kg</div>
                <div class="table-cell" data-label="İşlemler">
                    <button class="action-btn view-btn" data-tracking-id="${trackingId}">Görüntüle</button>
                    <button class="action-btn update-btn" data-tracking-id="${trackingId}">Güncelle</button>
                    <button class="action-btn delete-btn" data-tracking-id="${trackingId}">Sil</button> </div>
            `;
            cargoListDiv.appendChild(row);
        }

        // Buton event listener'ları - Buraya silme butonu listener'ı eklenecek
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                displayCargoDetailsInModal(e.target.dataset.trackingId);
            });
        });

        document.querySelectorAll('.update-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                openUpdateModal(e.target.dataset.trackingId);
            });
        });

        // SİL BUTONU İÇİN EVENT LISTENER EKLENDİ
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackingIdToDelete = e.target.dataset.trackingId;
                if (confirm(`"${trackingIdToDelete}" takip numaralı kargoyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
                    deleteCargo(trackingIdToDelete);
                }
            });
        });
    }

    function deleteCargo(trackingId) {
        if (kargoDatabase[trackingId]) {
            delete kargoDatabase[trackingId]; // Kargoyu database'den sil
            localStorage.setItem('kargoDatabase', JSON.stringify(kargoDatabase)); // LocalStorage'ı güncelle
            alert(`Kargo "${trackingId}" başarıyla silindi.`);
            loadAndDisplayCargos(); // Kargoları yeniden yükle ve listeyi güncelle
        } else {
            alert('Silinecek kargo bulunamadı!');
        }
    }

    function displayCargoDetailsInModal(trackingId) {
        const cargo = kargoDatabase[trackingId];
        if (!cargo) {
            modalBody.innerHTML = '<p>Kargo bulunamadı.</p>';
            modalTitle.textContent = 'Hata';
            modal.classList.remove('hidden');
            return;
        }

        modalTitle.textContent = `Kargo Detayları: ${trackingId}`;
        
        let html = `
            <div class="cargo-details-grid">
                <div><strong>Gönderici:</strong></div>
                <div>${cargo.sender?.name || cargo.senderName || 'Bilinmiyor'}</div>
                
                <div><strong>Alıcı:</strong></div>
                <div>${cargo.receiver?.name || cargo.receiverName || 'Bilinmiyor'}</div>
                
                <div><strong>Çıkış:</strong></div>
                <div>${cargo.from || cargo.sender?.city || 'Bilinmiyor'}</div>
                
                <div><strong>Hedef:</strong></div>
                <div>${cargo.to || cargo.receiver?.city || 'Bilinmiyor'}</div>
                
                <div><strong>Ağırlık:</strong></div>
                <div>${cargo.weight || cargo.details?.weight || '0'} kg</div>
                
                <div><strong>Tahmini Teslimat:</strong></div>
                <div>${cargo.estimated_delivery || cargo.dates?.estimatedDelivery || 'Belirlenmedi'}</div>
            </div>
            
            <h4>Durum Geçmişi</h4>
            <div class="timeline">
        `;

        (cargo.updates || []).slice().reverse().forEach(update => {
            html += `
                <div class="status-item">
                    <i class="${update.icon || 'fa-solid fa-circle-info'}"></i>
                    <div>
                        <strong>${update.location || 'Bilinmeyen Konum'}</strong>
                        <p>${update.description || 'Bilinmeyen Durum'}</p>
                        <small>${update.timestamp || 'Tarih belirtilmemiş'}</small>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        modalBody.innerHTML = html;
        updateForm.classList.add('hidden');
        modal.classList.remove('hidden');
    }

    function openUpdateModal(trackingId) {
        const cargo = kargoDatabase[trackingId];
        if (!cargo) return;

        modalTitle.textContent = `Kargo Güncelle: ${trackingId}`;
        document.getElementById('update-tracking-id').value = trackingId;
        
        // Mevcut durumları göster
        let statusHtml = '<h4>Mevcut Durumlar:</h4><div class="timeline">';
        (cargo.updates || []).forEach(update => {
            statusHtml += `
                <div class="status-item">
                    <i class="${update.icon || 'fa-solid fa-circle-info'}"></i>
                    <div>
                        <strong>${update.location || 'Bilinmeyen Konum'}</strong>
                        <p>${update.description || 'Bilinmeyen Durum'}</p>
                        <small>${update.timestamp || 'Tarih belirtilmemiş'}</small>
                    </div>
                </div>
            `;
        });
        statusHtml += '</div>';
        
        modalBody.innerHTML = statusHtml;
        updateForm.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    // --- EVENT LISTENERS ---
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());

    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const trackingId = document.getElementById('update-tracking-id').value;
        const cargo = kargoDatabase[trackingId];
        
        if (!cargo) {
            alert('Kargo bulunamadı!');
            return;
        }

        const newUpdate = {
            location: document.getElementById('new-status-location').value || 'Bilinmeyen Konum',
            description: document.getElementById('new-status-description').value || 'Durum güncellendi',
            timestamp: new Date().toLocaleString('tr-TR'),
            icon: document.getElementById('new-status-icon').value || 'fa-solid fa-circle-info'
        };

        // Kargo güncellemelerini başlat (eğer yoksa)
        if (!cargo.updates) cargo.updates = [];
        cargo.updates.push(newUpdate);
        
        // Durumu güncelle
        cargo.status = newUpdate.description;
        if (newUpdate.icon.includes('box-check')) {
            cargo.status = 'Teslim Edildi';
        }

        localStorage.setItem('kargoDatabase', JSON.stringify(kargoDatabase));
        loadAndDisplayCargos();
        closeModal();
    });

    toggleAddFormBtn.addEventListener('click', () => {
        addCargoForm.classList.toggle('hidden');
    });

    addCargoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newId = document.getElementById('new-tracking-id').value.trim().toUpperCase();
        
        if (kargoDatabase[newId]) {
            alert('Bu takip numarası zaten mevcut!');
            return;
        }

        kargoDatabase[newId] = {
            status: 'Hazırlanıyor',
            senderName: document.getElementById('new-sender-name').value.trim(),
            receiverName: document.getElementById('new-receiver-name').value.trim(),
            from: document.getElementById('new-from').value,
            to: document.getElementById('new-to').value,
            weight: document.getElementById('new-weight').value || '0',
            estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
            updates: [{
                location: 'Kargo Kabul Merkezi',
                description: 'Kargo kabul edildi.',
                timestamp: new Date().toLocaleString('tr-TR'),
                icon: 'fa-solid fa-box-archive'
            }]
        };

        localStorage.setItem('kargoDatabase', JSON.stringify(kargoDatabase));
        loadAndDisplayCargos();
        addCargoForm.reset();
        addCargoForm.classList.add('hidden');
    });

    function closeModal() {
        modal.classList.add('hidden');
        updateForm.reset();
        updateForm.classList.add('hidden');
    }

    // Sayfa yüklendiğinde kargoları göster
    loadAndDisplayCargos();
});