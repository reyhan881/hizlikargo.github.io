document.addEventListener('DOMContentLoaded', () => {
    const calculatorForm = document.getElementById('price-calculator-form');
    const resultDiv = document.getElementById('calculation-result');
    const finalMessageDiv = document.getElementById('final-message');

    // --- Fiyatlandırma Modelimiz (ESKİ HAL KORUNDU) ---
    const cityZones = { 'istanbul': 'marmara', 'ankara': 'ic-anadolu', 'izmir': 'ege', 'bursa': 'marmara', 'antalya': 'akdeniz' };
    const baseFee = 50.00;
    const pricePerKg = 15.00;
    const sameZoneMultiplier = 1.0;
    const differentZoneMultiplier = 1.5;

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Önceki sonuçları temizle (ESKİ HAL KORUNDU)
            resultDiv.style.display = 'none';
            finalMessageDiv.innerHTML = '';
            finalMessageDiv.className = 'info-message';

            // Form verilerini al (ESKİ HAL KORUNDU)
            const senderName = document.getElementById('sender-name').value.trim();
            const senderCity = document.getElementById('sender-city').value;
            const senderDistrict = document.getElementById('sender-district').value.trim();
            const senderAddress = document.getElementById('sender-address').value.trim();
            const receiverName = document.getElementById('receiver-name').value.trim();
            const receiverCity = document.getElementById('receiver-city').value;
            const receiverDistrict = document.getElementById('receiver-district').value.trim();
            const receiverAddress = document.getElementById('receiver-address').value.trim();
            const weight = parseFloat(document.getElementById('weight').value);

            // Zorunlu alan kontrolü (GÜNCELLENDİ - DAHA DETAYLI HATA MESAJI)
            if (!senderName || !senderCity || !senderDistrict || !senderAddress ||
                !receiverName || !receiverCity || !receiverDistrict || !receiverAddress ||
                isNaN(weight) || weight <= 0) {
                
                const errorMessages = [];
                if (!senderName) errorMessages.push("Gönderici adı");
                if (!senderCity) errorMessages.push("Gönderici şehir");
                if (!senderDistrict) errorMessages.push("Gönderici ilçe");
                if (!senderAddress) errorMessages.push("Gönderici adres");
                if (!receiverName) errorMessages.push("Alıcı adı");
                if (!receiverCity) errorMessages.push("Alıcı şehir");
                if (!receiverDistrict) errorMessages.push("Alıcı ilçe");
                if (!receiverAddress) errorMessages.push("Alıcı adres");
                if (isNaN(weight)) errorMessages.push("Geçerli ağırlık");
                
                showFinalMessage(`Lütfen zorunlu alanları doldurun: ${errorMessages.join(', ')}`, 'error');
                return;
            }

            // Fiyat Hesaplama (ESKİ HAL KORUNDU)
            const senderZone = cityZones[senderCity];
            const receiverZone = cityZones[receiverCity];
            let distanceMultiplier = sameZoneMultiplier;

            if (senderZone && receiverZone && senderZone !== receiverZone) {
                distanceMultiplier = differentZoneMultiplier;
            } else if (!senderZone || !receiverZone) {
                distanceMultiplier = differentZoneMultiplier;
            }

            let calculatedPrice = baseFee + (weight * pricePerKg * distanceMultiplier);


            document.addEventListener('DOMContentLoaded', function() {
    const calculatorForm = document.getElementById('price-calculator-form');
    const resultDiv = document.getElementById('calculation-result');
    const finalMessageDiv = document.getElementById('final-message');

    // Fiyatlandırma parametreleri
    const basePrice = 50.00; // Temel ücret
    const pricePerKg = 15.00; // Kg başına ücret
    const zoneMultipliers = {
        'marmara': { 'marmara': 1.0, 'ege': 1.3, 'akdeniz': 1.5, 'ic-anadolu': 1.4 },
        'ege': { 'marmara': 1.3, 'ege': 1.0, 'akdeniz': 1.2, 'ic-anadolu': 1.4 },
        'akdeniz': { 'marmara': 1.5, 'ege': 1.2, 'akdeniz': 1.0, 'ic-anadolu': 1.3 },
        'ic-anadolu': { 'marmara': 1.4, 'ege': 1.4, 'akdeniz': 1.3, 'ic-anadolu': 1.0 }
    };

    // Şehir-bölge eşleştirmesi
    const cityZones = {
        'istanbul': 'marmara',
        'ankara': 'ic-anadolu',
        'izmir': 'ege',
        'bursa': 'marmara',
        'antalya': 'akdeniz'
    };

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Sonuçları temizle
            resultDiv.style.display = 'none';
            finalMessageDiv.innerHTML = '';
            finalMessageDiv.className = 'info-message';

            // Form verilerini al
            const senderCity = document.getElementById('sender-city').value;
            const receiverCity = document.getElementById('receiver-city').value;
            const weight = parseFloat(document.getElementById('weight').value) || 0;

            // Hesaplamayı yap
            try {
                // 1. Bölgeleri belirle
                const senderZone = cityZones[senderCity.toLowerCase()] || 'ic-anadolu';
                const receiverZone = cityZones[receiverCity.toLowerCase()] || 'ic-anadolu';
                
                // 2. Çarpanı belirle
                const zoneMultiplier = zoneMultipliers[senderZone][receiverZone] || 1.5;
                
                // 3. Fiyatı hesapla
                const calculatedPrice = basePrice + (weight * pricePerKg * zoneMultiplier);
                
                // 4. Sonuçları göster
                showCalculationResult(senderCity, receiverCity, weight, calculatedPrice, zoneMultiplier);
                
            } catch (error) {
                console.error("Fiyat hesaplanırken hata:", error);
                showFinalMessage("Fiyat hesaplanırken bir hata oluştu. Lütfen tekrar deneyin.", "error");
            }
        });
    }

    function showCalculationResult(senderCity, receiverCity, weight, price, multiplier) {
        resultDiv.innerHTML = `
            <div class="price-breakdown">
                <h3>Fiyat Detayları</h3>
                <p><strong>Gönderici Şehir:</strong> ${senderCity}</p>
                <p><strong>Alıcı Şehir:</strong> ${receiverCity}</p>
                <p><strong>Ağırlık:</strong> ${weight} kg</p>
                <hr>
                <p><strong>Sabit Ücret:</strong> ${basePrice.toFixed(2)} TL</p>
                <p><strong>Kg Ücreti (${weight}kg x ${pricePerKg} TL):</strong> ${(weight * pricePerKg).toFixed(2)} TL</p>
                <p><strong>Bölge Çarpanı:</strong> x${multiplier.toFixed(1)}</p>
                <hr>
                <p class="total-price"><strong>TOPLAM TUTAR:</strong> ${price.toFixed(2)} TL</p>
            </div>
            <button id="add-to-cart-btn" class="submit-btn">Sepete Ekle</button>
        `;
        resultDiv.style.display = 'block';
        
        // Sepete ekle butonu event listener
        document.getElementById('add-to-cart-btn').addEventListener('click', function() {
            // Sepete ekleme işlemleri buraya gelecek
            showFinalMessage("Kargo sepete eklendi!", "success");
        });
    }

    function showFinalMessage(message, type) {
        finalMessageDiv.innerHTML = message;
        finalMessageDiv.className = `info-message ${type}`;
        finalMessageDiv.style.display = 'block';
    }
});

            // Kullanıcı indirimleri (GÜNCELLENDİ - DAHA GÜVENLİ)
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            let discountApplied = 0;
            let campaignUsedMessage = '';

            if (loggedInUser) {
                try {
                    const users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
                    const currentUser = users.find(user => user.email === loggedInUser.email);

                    if (currentUser) {
                        // İlk kargo indirimi (GÜNCELLENDİ - DAHA GÜVENLİ KONTROL)
                        if ((currentUser.shipmentCount === 0 || !currentUser.shipmentCount) && 
                            !currentUser.firstShipmentCampaignUsed) {
                            const maxFreeAmount = 100;
                            discountApplied = Math.min(maxFreeAmount, calculatedPrice);
                            calculatedPrice = Math.max(0, calculatedPrice - maxFreeAmount);
                            campaignUsedMessage = `<p class="campaign-message">🎉 İlk kargo avantajı! <strong>${discountApplied.toFixed(2)} TL</strong> indirim uygulandı</p>`;
                            currentUser.firstShipmentCampaignUsed = true;
                        } 
                        // Sonraki kargo indirimi (ESKİ HAL KORUNDU)
                        else if (currentUser.nextShipmentDiscount > 0) {
                            discountApplied = currentUser.nextShipmentDiscount;
                            calculatedPrice = Math.max(0, calculatedPrice - discountApplied);
                            campaignUsedMessage = `<p class="campaign-message">✨ Sonraki gönderim indiriminiz: <strong>${discountApplied.toFixed(2)} TL</strong> uygulandı</p>`;
                            currentUser.nextShipmentDiscount = 0;
                        }

                        localStorage.setItem('kargoUsers', JSON.stringify(users));
                    }
                } catch (error) {
                    console.error("İndirim uygulanırken hata:", error);
                }
            }

            // Sonuçları göster (GÜNCELLENDİ - DAHA DETAYLI)
            resultDiv.innerHTML = `
                <div class="price-summary">
                    <h3>Fiyat Detayları</h3>
                    <p><strong>Tabana Ücret:</strong> ${baseFee.toFixed(2)} TL</p>
                    <p><strong>Kg Ücreti (${weight}kg x ${pricePerKg} TL):</strong> ${(weight * pricePerKg).toFixed(2)} TL</p>
                    <p><strong>Bölge Çarpanı:</strong> x${distanceMultiplier}</p>
                    <div class="total-price">
                        <strong>TOPLAM:</strong> ${calculatedPrice.toFixed(2)} TL
                    </div>
                </div>
                ${campaignUsedMessage}
                <button id="add-to-cart-btn" class="submit-btn">Sepete Ekle</button>
                <button id="create-shipment-btn" class="submit-btn secondary">Kargo Oluştur</button>
            `;
            resultDiv.style.display = 'block';

            // Sepete Ekle butonu (GÜNCELLENDİ - KARGO DATABASE'E DE KAYDET)
            document.getElementById('add-to-cart-btn').addEventListener('click', () => {
                const cartItem = {
                    id: Date.now(),
                    sender: { name: senderName, city: senderCity, district: senderDistrict, address: senderAddress },
                    receiver: { name: receiverName, city: receiverCity, district: receiverDistrict, address: receiverAddress },
                    weight: weight.toFixed(1),
                    calculatedPrice: calculatedPrice.toFixed(2),
                    campaignApplied: discountApplied > 0
                };
                
                // Sepete ekle (ESKİ HAL KORUNDU)
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push(cartItem);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Kargo veritabanına ekle (YENİ EKLENDİ)
                addToShipmentDatabase(senderName, senderCity, senderDistrict, senderAddress,
                                    receiverName, receiverCity, receiverDistrict, receiverAddress,
                                    weight, calculatedPrice, loggedInUser);
                
                showFinalMessage('Kargo sepete eklendi! <a href="sepet.html" style="color:white;text-decoration:underline">Sepete Git</a>', 'success');
                updateCartCount();
            });

            // Direkt Kargo Oluştur butonu (YENİ EKLENDİ)
            document.getElementById('create-shipment-btn').addEventListener('click', () => {
                const trackingNumber = addToShipmentDatabase(senderName, senderCity, senderDistrict, senderAddress,
                                                          receiverName, receiverCity, receiverDistrict, receiverAddress,
                                                          weight, calculatedPrice, loggedInUser);
                
                showFinalMessage(`Kargo oluşturuldu! Takip numaranız: <strong>${trackingNumber}</strong>`, 'success');
                resultDiv.style.display = 'none';
                calculatorForm.reset();
            });
        });
    }

    // Kargo veritabanına ekleme fonksiyonu (YENİ EKLENDİ)
    function addToShipmentDatabase(senderName, senderCity, senderDistrict, senderAddress,
                                 receiverName, receiverCity, receiverDistrict, receiverAddress,
                                 weight, price, user) {
        const kargoDatabase = JSON.parse(localStorage.getItem('kargoDatabase')) || {};
        const trackingNumber = 'HK' + Date.now().toString().slice(-8);
        
        kargoDatabase[trackingNumber] = {
            userEmail: user?.email || null,
            sender: { name: senderName, city: senderCity, district: senderDistrict, address: senderAddress },
            receiver: { name: receiverName, city: receiverCity, district: receiverDistrict, address: receiverAddress },
            weight: weight,
            status: "Hazırlanıyor",
            finalPrice: price,
            createdDate: new Date().toISOString(),
            estimated_delivery: calculateDeliveryDate(),
            updates: [
                {
                    location: "Kargo Oluşturuldu",
                    description: "Kargo kaydı başarıyla oluşturuldu.",
                    timestamp: new Date().toLocaleString('tr-TR'),
                    icon: "fa-solid fa-box"
                }
            ]
        };
        
        localStorage.setItem('kargoDatabase', JSON.stringify(kargoDatabase));
        
        // Kullanıcının kargo sayısını güncelle
        if (user?.email) {
            const users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
            const userIndex = users.findIndex(u => u.email === user.email);
            if (userIndex !== -1) {
                users[userIndex].shipmentCount = (users[userIndex].shipmentCount || 0) + 1;
                localStorage.setItem('kargoUsers', JSON.stringify(users));
            }
        }
        
        return trackingNumber;
    }

    // Teslimat tarihi hesaplama (YENİ EKLENDİ)
    function calculateDeliveryDate() {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + (Math.random() * 2 + 2)); // 2-4 gün arası
        return deliveryDate.toLocaleDateString('tr-TR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Hata/mesaj gösterme fonksiyonu (GÜNCELLENDİ)
    function showFinalMessage(message, type) {
        finalMessageDiv.innerHTML = message;
        finalMessageDiv.className = `info-message ${type}`;
        finalMessageDiv.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                finalMessageDiv.style.opacity = '0';
                setTimeout(() => {
                    finalMessageDiv.style.display = 'none';
                    finalMessageDiv.style.opacity = '1';
                }, 500);
            }, 3000);
        }
    }

    // Sepet sayacını güncelle (ESKİ HAL KORUNDU)
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItemCountSpan = document.getElementById('cart-item-count');
        if (cartItemCountSpan) {
            cartItemCountSpan.textContent = cart.length;
        }
    }

    // Sayfa yüklendiğinde sepet sayacını güncelle
    updateCartCount();
});