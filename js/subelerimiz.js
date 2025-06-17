document.addEventListener('DOMContentLoaded', () => {
    console.log("Şubelerimiz sayfası yüklendi.");

    // Eğer şube verilerini JavaScript ile dinamik olarak yüklemek isterseniz,
    // aşağıdaki branchesData dizisini kullanabilir ve HTML'deki statik kartları silebilirsiniz.
    const branchesData = [
        {
            name: "İstanbul Merkez Şube",
            address: "Örnek Mahallesi, Deneme Caddesi No:1, Beşiktaş, İstanbul",
            phone: "(0212) 123 45 67",
            hours: "Pzt-Cuma: 09:00-18:00, Cmt: 09:00-14:00",
            mapLink: "https://maps.app.goo.gl/ornekadres" // Buraya gerçek Google Maps linkini ekleyin
        },
        {
            name: "Ankara Şube",
            address: "Başkent Caddesi, No:25, Çankaya, Ankara",
            phone: "(0312) 987 65 43",
            hours: "Pzt-Cuma: 09:00-18:00, Cmt: 09:00-14:00",
            mapLink: "https://maps.app.goo.gl/ornekadres"
        },
        {
            name: "İzmir Şube",
            address: "Sahil Yolu, Numara: 34, Konak, İzmir",
            phone: "(0232) 567 89 01",
            hours: "Pzt-Cuma: 09:00-18:00, Cmt: 09:00-14:00",
            mapLink: "https://maps.app.goo.gl/ornekadres"
        }
        // Daha fazla şube buraya eklenebilir
    ];

    const branchesListContainer = document.getElementById('branches-list');

    // Eğer dinamik yükleme yapmayacaksanız bu kısmı yorum satırı yapabilirsiniz
    // ve HTML'deki statik şube kartlarını kullanmaya devam edebilirsiniz.
    if (branchesListContainer && branchesData.length > 0) {
        // Mevcut statik içeriği temizle (eğer JavaScript ile yüklenecekse)
        branchesListContainer.innerHTML = ''; 

        branchesData.forEach(branch => {
            const branchCard = document.createElement('div');
            branchCard.className = 'branch-card';
            branchCard.innerHTML = `
                <div class="branch-icon">
                    <i class="fa-solid fa-location-dot"></i>
                </div>
                <h3>${branch.name}</h3>
                <p><strong>Adres:</strong> ${branch.address}</p>
                <p><strong>Telefon:</strong> ${branch.phone}</p>
                <p><strong>Çalışma Saatleri:</strong> ${branch.hours}</p>
                <a href="${branch.mapLink}" target="_blank" class="btn-map"><i class="fa-solid fa-map-marked-alt"></i> Haritada Göster</a>
            `;
            branchesListContainer.appendChild(branchCard);
        });
    }
});