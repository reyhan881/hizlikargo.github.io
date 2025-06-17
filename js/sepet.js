document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    const totalItemsSpan = document.getElementById('total-items');
    const grandTotalSpan = document.getElementById('grand-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const paymentSuccessMessage = document.getElementById('payment-success-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let kargoDatabase = JSON.parse(localStorage.getItem('kargoDatabase')) || {};
    let users = JSON.parse(localStorage.getItem('kargoUsers')) || [];
    const loggedInUserSession = JSON.parse(localStorage.getItem('loggedInUser'));
    let currentUser = null;

    if (loggedInUserSession) {
        currentUser = users.find(user => user.email === loggedInUserSession.email);
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalItems = 0;
        let grandTotal = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartSummary.style.display = 'none';
            paymentSuccessMessage.style.display = 'none';
            updateCartCount();
            return;
        }

        emptyCartMessage.style.display = 'none';
        cartSummary.style.display = 'block';

        cart.forEach(item => {
            const cartItemCard = document.createElement('div');
            cartItemCard.className = 'cart-item-card';
            cartItemCard.dataset.itemId = item.id;

            cartItemCard.innerHTML = `
                <div class="cart-item-details">
                    <h3>Kargo (${item.weight} kg)</h3>
                    <p><strong>Gönderici:</strong> ${item.sender.name}, ${item.sender.city}/${item.sender.district}</p>
                    <p><strong>Alıcı:</strong> ${item.receiver.name}, ${item.receiver.city}/${item.receiver.district}</p>
                    <p><strong>Fiyat:</strong> ${parseFloat(item.calculatedPrice).toFixed(2)} TL</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-btn" data-item-id="${item.id}">Kargoyu Sil</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemCard);

            totalItems++;
            grandTotal += parseFloat(item.calculatedPrice);
        });

        totalItemsSpan.textContent = totalItems;
        grandTotalSpan.textContent = grandTotal.toFixed(2) + ' TL';
        updateCartCount();
    }

    function removeItemFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    function generateTrackingId() {
        let newId;
        do {
            newId = Math.random().toString(36).substr(2, 8).toUpperCase();
        } while (kargoDatabase[newId]); // Benzersiz olana kadar yeni ID oluştur
        return newId;
    }

    function checkoutCart() {
        if (cart.length === 0) {
            alert('Sepetiniz boş. Lütfen önce kargo ekleyin.');
            return;
        }

        if (!currentUser) {
            alert('Gönderi oluşturmak için lütfen giriş yapınız.');
            window.location.href = 'login.html'; // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
            return;
        }

        let successfulShipments = 0;
        let newTrackingNumbers = [];

        cart.forEach(item => {
            const newTrackingId = generateTrackingId();
            newTrackingNumbers.push(newTrackingId);

            kargoDatabase[newTrackingId] = {
                trackingId: newTrackingId,
                status: "Kargo Kabul Edildi",
                estimated_delivery: "Henüz Belirlenmedi", // Gerçek bir sistemde bu dinamik hesaplanır
                sender: item.sender,
                receiver: item.receiver,
                weight: item.weight + " kg",
                finalPrice: item.calculatedPrice,
                userId: currentUser.email, // Kargoyu oluşturan kullanıcıyı işaretle
                updates: [
                    { location: "Kargo Kabul Merkezi", description: "Kargo kabul edildi.", timestamp: new Date().toLocaleString('tr-TR'), icon: "fa-solid fa-box-archive" }
                ]
            };

            // Kullanıcı verilerini güncelle
            if (currentUser) {
                currentUser.shipmentCount = (currentUser.shipmentCount || 0) + 1;
                currentUser.loyaltyPoints = (currentUser.loyaltyPoints || 0) + 50; // Her gönderi için puan ekle

                // Eğer ilk kargo kampanyası kullanıldıysa işaretle
                if (item.campaignApplied && currentUser.shipmentCount === 1) {
                    currentUser.firstShipmentCampaignUsed = true;
                }
                // Bir sonraki gönderi indirimi varsa sıfırla (eğer kullanıldıysa)
                currentUser.nextShipmentDiscount = 0; // Her zaman sıfırla, yeni kampanya kazanılırsa tekrar set edilir
            }
            successfulShipments++;
        });

        localStorage.setItem('kargoDatabase', JSON.stringify(kargoDatabase));
        localStorage.setItem('kargoUsers', JSON.stringify(users)); // Kullanıcı verilerini güncelle

        // Sepeti temizle
        localStorage.removeItem('cart');
        cart = []; // Bellekteki sepeti de temizle
        

        // Başarı mesajını göster
        paymentSuccessMessage.style.display = 'block';
        cartItemsContainer.innerHTML = ''; // Sepet içeriğini boşalt
        cartSummary.style.display = 'none'; // Özeti gizle
        emptyCartMessage.style.display = 'none'; // Boş sepet mesajını gizle

        // İsteğe bağlı: Oluşturulan takip numaralarını mesajda göster
        const trackingNumbersHtml = newTrackingNumbers.map(tn => `<strong>${tn}</strong>`).join(', ');
        paymentSuccessMessage.querySelector('p').innerHTML = `<i class="fa-solid fa-circle-check"></i> Ödeme başarılı! Kargolarınız oluşturuldu. Takip numaraları: ${trackingNumbersHtml}. Hesabım sayfanızdan takip edebilirsiniz.`;

        updateCartCount(); // Sepet sayacını güncelle
    }

    // Event Listeners
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const itemId = parseInt(e.target.dataset.itemId);
            removeItemFromCart(itemId);
        }
    });

    checkoutBtn.addEventListener('click', checkoutCart);

    // Initial render
    renderCart();

    // Sepet sayısını güncelleyen global fonksiyon (auth.js'ten çağrılacak)
    window.updateCartCount = function() {
        const cartCount = JSON.parse(localStorage.getItem('cart'))?.length || 0;
        const cartItemCountSpan = document.getElementById('cart-item-count');
        if (cartItemCountSpan) {
            cartItemCountSpan.textContent = cartCount;
            if (cartCount > 0) {
                cartItemCountSpan.style.display = 'inline-block';
            } else {
                cartItemCountSpan.style.display = 'none';
            }
        }
    };
    updateCartCount(); // Sayfa yüklendiğinde sepet sayacını güncelle
});