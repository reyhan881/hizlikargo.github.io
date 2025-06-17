document.addEventListener('DOMContentLoaded', () => {
    console.log("Kampanyalar sayfası yüklendi.");

    const campaignData = [
        {
            id: 'ilk-kargo-bizden',
            title: 'İlk Kargon Bizden!',
            description: 'Hızlı Kargo ailesine yeni katılan tüm müşterilerimize özel bir hoş geldin hediyesi! İlk gönderiniz tamamen ücretsiz!',
            details: [
                'Sadece yeni üyelere özeldir.',
                'İlk kargo gönderim ücreti belli bir limite kadar Hızlı Kargo tarafından karşılanır.',
                'Kampanyadan yararlanmak için kaydolmanız ve ilk gönderinizi oluşturmanız yeterlidir.'
            ],
            image: 'https://via.placeholder.com/600x300?text=İlk+Kargo+Bizden+Kampanyası', // Örnek görsel URL'si
            buttonText: 'Hemen Kaydol ve Yararlan',
            buttonLink: '../html/signup.html'
        },
        {
            id: 'arkadasini-getir',
            title: 'Arkadaşını Getir, İkiniz de Kazanın!',
            description: 'Siteye davet ettiğin her arkadaş için hem sen hem arkadaşın 20 TL değerinde kargo puanı kazanırsınız.',
            details: [
                'Bu puanlar kargo gönderimlerinde indirim olarak kullanılır.',
                'Davet ettiğin arkadaşın Hızlı Kargo üzerinden ilk başarılı gönderimini tamamlaması gerekir.'
            ],
            image: 'https://via.placeholder.com/600x300?text=Arkadaşını+Getir+Kampanyası', // Örnek görsel URL'si
            buttonText: 'Davet Et ve Kazan',
            buttonLink: '../html/iletisim.html' // Ya da özel bir davet sayfası linki
        },
        {
            id: 'hizli-teslimat-garantisi',
            title: 'Hızlı Teslimat Garantisi – 24 Saatte Kapında!',
            description: 'Büyük şehirlerde 24 saat içinde teslimat garantisi verilen kargolar için özel bir kampanya.',
            details: [
                'Belirli büyük şehirler ve bölgeler için geçerlidir.',
                'Teslimat gecikirse, bir sonraki kargonuz %50 indirimli olarak gönderilir.',
                'Kampanya koşulları ve geçerli şehirler için Hizmetlerimiz veya SSS bölümünü kontrol edin.'
            ],
            image: 'https://via.placeholder.com/600x300?text=24+Saatte+Teslimat+Garantisi', // Örnek görsel URL'si
            buttonText: 'Detayları İncele',
            buttonLink: '../html/hizmetlerimiz.html' // Ya da özel bir garanti sayfası linki
        },
        {
            id: 'sadakat-puani-sistemi',
            title: 'Sadakat Puanı Sistemi',
            description: 'Hızlı Kargo ile her yapılan gönderimden puan kazanılır. Ne kadar çok gönderirsen, o kadar çok kazanırsın!',
            details: [
                'Her gönderim için belirli oranlarda puan kazanırsın.',
                'Belirli puan seviyelerine ulaşınca ücretsiz kargo, ek indirimler ya da özel hediyeler kazanırsın.',
                'Puan durumunu kullanıcı panelinden takip edebilirsin.'
            ],
            image: 'https://via.placeholder.com/600x300?text=Sadakat+Puanı+Sistemi', // Örnek görsel URL'si
            buttonText: 'Daha Fazla Bilgi',
            buttonLink: '../html/sss.html' // Ya da özel bir sadakat programı sayfası linki
        }
    ];

    const campaignsContainer = document.getElementById('campaigns-container');

    if (campaignsContainer) {
        campaignData.forEach(campaign => {
            const campaignItem = document.createElement('div');
            campaignItem.className = 'campaign-item';
            campaignItem.id = campaign.id;

            let detailsHtml = '';
            if (campaign.details && campaign.details.length > 0) {
                detailsHtml += '<ul>';
                campaign.details.forEach(detail => {
                    detailsHtml += <li><i class="fa-solid fa-check-circle"></i> ${detail}</li>;
                });
                detailsHtml += '</ul>';
            }

            campaignItem.innerHTML = `
                <img src="${campaign.image}" alt="${campaign.title}" class="campaign-image">
                <div class="campaign-content">
                    <h2>${campaign.title}</h2>
                    <p>${campaign.description}</p>
                    ${detailsHtml}
                    <a href="${campaign.buttonLink}" class="btn-campaign">${campaign.buttonText}</a>
                </div>
            `;
            campaignsContainer.appendChild(campaignItem);
        });

        // Eğer JSON'da hiç kampanya yoksa bu mesajı gösterebiliriz.
        // Şu an kampanyalar olduğu için bu bloğa girmeyecektir.
        if (campaignData.length === 0) {
            const noCampaignsDiv = document.createElement('div');
            noCampaignsDiv.className = 'no-campaign-placeholder';
            noCampaignsDiv.innerHTML = '<p>Şu anda aktif bir kampanyamız bulunmamaktadır. Yakında daha fazla kampanya için bizi takip etmeye devam edin!</p>';
            campaignsContainer.appendChild(noCampaignsDiv);
        }
    }
});