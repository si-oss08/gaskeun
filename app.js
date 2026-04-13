
// ========== BACKGROUND ANIMATIONS ==========
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 15 + 8 + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(particle);
    }
}

function createMovingCars() {
    const container = document.getElementById('animatedBg');
    if (!container) return;
    const cars = ['🚗', '🚕', '🚙', '🛵', '🚐', '🚘'];
    for (let i = 0; i < 10; i++) {
        const car = document.createElement('div');
        car.className = 'moving-car';
        car.textContent = cars[Math.floor(Math.random() * cars.length)];
        car.style.bottom = Math.random() * 100 + '%';
        car.style.fontSize = (Math.random() * 30 + 20) + 'px';
        car.style.animationDuration = Math.random() * 15 + 10 + 's';
        car.style.animationDelay = Math.random() * 8 + 's';
        container.appendChild(car);
    }
}

createParticles();
createMovingCars();

// ========== DATA ==========
let selectedVehicle = "motor";
let selectedDriver = null;
let selectedPayment = "Tunai";
let selectedBank = null;
let cart = [];
let riwayat = JSON.parse(localStorage.getItem('gaskeunRiwayat')) || [];

const pricePerKm = { motor: 2500, mobil: 6000 };

// Data Bank dengan logo
const bankList = [
    { name: "BSI", logo: "🏦", code: "451", account: "7180012345678", owner: "PT Gaskeun Aceh" },
    { name: "BCA", logo: "🔵", code: "014", account: "1234567890", owner: "Gaskeun Transport" },
    { name: "BRI", logo: "🔴", code: "002", account: "0987654321", owner: "Gaskeun Food" },
    { name: "BNI", logo: "🟠", code: "009", account: "5678123456", owner: "Gaskeun Aceh" },
    { name: "Mandiri", logo: "🟡", code: "008", account: "4321098765", owner: "PT Gaskeun" },
    { name: "CIMB Niaga", logo: "🔷", code: "022", account: "9876543210", owner: "Gaskeun Digital" }
];

const menuMakanan = [
    { id: 1, name: "Mie Aceh Spesial", price: 25000, emoji: "🍜", resto: "RM Aceh Sedap" },
    { id: 2, name: "Nasi Gurih + Ayam Tangkap", price: 30000, emoji: "🍛", resto: "Kuliner Banda" },
    { id: 3, name: "Kuah Beulangong", price: 20000, emoji: "🥘", resto: "Mak Uteh" },
    { id: 4, name: "Sate Matang", price: 35000, emoji: "🍢", resto: "Sate Asli" },
    { id: 5, name: "Kopi Aceh + Roti", price: 15000, emoji: "☕", resto: "Kopi Sopi" },
    { id: 6, name: "Timphan (Kue Khas)", price: 12000, emoji: "🍰", resto: "Rumah Kue Aceh" }
];

// ========== HELPER FUNCTIONS ==========
function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="fas fa-bell"></i> ${msg}`;
    document.body.appendChild(notif);
    setTimeout(() => { if(notif && notif.remove) notif.remove(); }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    showNotification("Nomor rekening disalin!");
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function addToRiwayat(order) {
    riwayat.unshift(order);
    if (riwayat.length > 20) riwayat.pop();
    localStorage.setItem('gaskeunRiwayat', JSON.stringify(riwayat));
    renderRiwayat();
}

// ========== CHAT FUNCTIONS ==========
function toggleChat() {
    const chat = document.getElementById('chatContainer');
    chat.classList.toggle('active');
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const messagesDiv = document.getElementById('chatMessages');
    const userMessage = document.createElement('div');
    userMessage.className = 'message user';
    userMessage.innerHTML = `${message}<small>Anda - sekarang</small>`;
    messagesDiv.appendChild(userMessage);
    
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Auto reply dari admin
    setTimeout(() => {
        let reply = "";
        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("harga") || lowerMsg.includes("tarif")) {
            reply = "Untuk tarif transportasi: Motor Rp2.500/km, Mobil Rp6.000/km. Untuk makanan, harga sesuai menu ya! 😊";
        } else if (lowerMsg.includes("promo") || lowerMsg.includes("diskon")) {
            reply = "Halo! Saat ini ada promo GRATIS ONGKIR untuk pemesanan di atas Rp50.000! 🎉";
        } else if (lowerMsg.includes("qris") || lowerMsg.includes("qr")) {
            reply = "Pembayaran QRIS bisa melalui BSI, GoPay, OVO, DANA, ShopeePay. Scan QR Code yang muncul saat checkout ya! 📱";
        } else if (lowerMsg.includes("bank") || lowerMsg.includes("transfer")) {
            reply = "Kami menerima transfer ke BSI, BCA, BRI, BNI, Mandiri, CIMB Niaga. Detail rekening akan muncul saat checkout! 🏦";
        } else if (lowerMsg.includes("driver")) {
            reply = "Driver kami profesional dan sudah terverifikasi. Ada pilihan driver favorit juga lho! 👨‍✈️";
        } else if (lowerMsg.includes("aceh") || lowerMsg.includes("lokasi")) {
            reply = "Gaskeun melayani Banda Aceh, Aceh Besar, dan Sigli. Kami terus berkembang ke kota lain! 🗺️";
        } else {
            reply = "Terima kasih sudah menghubungi Gaskeun! Tim CS kami akan segera merespon. Apakah ada yang bisa dibantu lagi? 😊";
        }
        
        const adminMessage = document.createElement('div');
        adminMessage.className = 'message admin';
        adminMessage.innerHTML = `${reply}<small>Admin - sekarang</small>`;
        messagesDiv.appendChild(adminMessage);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
}

// ========== MODAL PEMBAYARAN ==========
function showPaymentModal(paymentMethod, amount, orderDetail, onSuccess) {
    const modal = document.getElementById('paymentModal');
    const modalBody = document.getElementById('modalBody');
    
    let content = '';
    
    if (paymentMethod === 'QRIS') {
        content = `
            <h3><i class="fas fa-qrcode"></i> Scan QRIS - Bank BSI</h3>
            <p>Total: <strong style="color:#2e7d32; font-size:1.5rem;">Rp${amount.toLocaleString('id-ID')}</strong></p>
            <div class="qris-code">
                <svg width="220" height="220" viewBox="0 0 220 220">
                    <rect width="220" height="220" fill="white"/>
                    <!-- Logo BSI di tengah -->
                    <text x="110" y="115" text-anchor="middle" font-size="14" fill="#2e7d32" font-weight="bold">BSI</text>
                    <!-- QR Pattern -->
                    <rect x="15" y="15" width="45" height="45" fill="black"/>
                    <rect x="20" y="20" width="35" height="35" fill="white"/>
                    <rect x="160" y="15" width="45" height="45" fill="black"/>
                    <rect x="165" y="20" width="35" height="35" fill="white"/>
                    <rect x="15" y="160" width="45" height="45" fill="black"/>
                    <rect x="20" y="165" width="35" height="35" fill="white"/>
                    ${Array(7).fill().map((_,i) => Array(7).fill().map((_,j) => (i+j)%2===0 || i===j || i+j===6 ? `<rect x="${35+i*22}" y="${35+j*22}" width="18" height="18" fill="black"/>` : '').join('')).join('')}
                    <rect x="95" y="95" width="30" height="30" fill="#2e7d32"/>
                    <text x="110" y="115" text-anchor="middle" font-size="10" fill="white">BSI</text>
                </svg>
            </div>
            <div class="bank-info">
                <p><strong>🏦 Bank Syariah Indonesia (BSI)</strong></p>
                <p>QRIS Merchant: <strong>GASKEUN - PT Gaskeun Aceh</strong></p>
                <p>Scan QR Code di atas menggunakan aplikasi mobile banking BSI atau e-wallet</p>
            </div>
            <p><strong>Cara Bayar QRIS BSI:</strong></p>
            <ol style="text-align: left; margin: 1rem;">
                <li>Buka aplikasi <strong>BSI Mobile</strong> atau e-wallet (GoPay, OVO, DANA, ShopeePay)</li>
                <li>Pilih menu <strong>Scan QRIS</strong></li>
                <li>Arahkan kamera ke kode QR di atas</li>
                <li>Konfirmasi pembayaran Rp${amount.toLocaleString('id-ID')}</li>
                <li>Masukkan PIN/verifikasi sidik jari</li>
                <li>Pembayaran selesai!</li>
            </ol>
            <button class="copy-btn" onclick="simulatePaymentSuccess('QRIS BSI', ${amount}, \`${orderDetail}\`)">✅ Saya Sudah Bayar</button>
        `;
    } 
    else if (paymentMethod === 'Transfer Bank') {
        // Tampilkan pilihan bank
        content = `
            <h3><i class="fas fa-university"></i> Transfer Bank</h3>
            <p>Total: <strong style="color:#2e7d32; font-size:1.5rem;">Rp${amount.toLocaleString('id-ID')}</strong></p>
            <div class="bank-list" id="bankListModal">
                ${bankList.map(bank => `
                    <div class="bank-card" data-bank="${bank.name}" data-account="${bank.account}" data-owner="${bank.owner}" data-code="${bank.code}">
                        <div class="bank-logo">${bank.logo}</div>
                        <strong>${bank.name}</strong>
                    </div>
                `).join('')}
            </div>
            <div id="bankDetail" style="margin-top: 1rem;"></div>
        `;
        
        modalBody.innerHTML = content;
        modal.style.display = 'flex';
        
        // Tambahkan event listener untuk pilihan bank
        setTimeout(() => {
            document.querySelectorAll('.bank-card').forEach(card => {
                card.addEventListener('click', function() {
                    document.querySelectorAll('.bank-card').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    const bankName = this.dataset.bank;
                    const account = this.dataset.account;
                    const owner = this.dataset.owner;
                    const bank = bankList.find(b => b.name === bankName);
                    
                    document.getElementById('bankDetail').innerHTML = `
                        <div class="bank-info">
                            <p><strong>🏦 Bank ${bankName}</strong></p>
                            <p>Nomor Rekening: <strong>${account}</strong></p>
                            <p>Atas Nama: <strong>${owner}</strong></p>
                            <p>Kode Bank: <strong>${bank.code}</strong></p>
                            <button class="copy-btn" onclick="copyToClipboard('${account}')">📋 Salin No. Rekening</button>
                            <button class="copy-btn" onclick="simulatePaymentSuccess('Bank ${bankName}', ${amount}, \`${orderDetail}\`)">✅ Saya Sudah Transfer</button>
                        </div>
                    `;
                });
            });
        }, 50);
        return;
    }
    else {
        content = `
            <h3><i class="fas fa-money-bill-wave"></i> Pembayaran Tunai</h3>
            <p>Total: <strong style="color:#2e7d32; font-size:1.5rem;">Rp${amount.toLocaleString('id-ID')}</strong></p>
            <div class="bank-info">
                <p><strong>Cara Bayar Tunai:</strong></p>
                <p>✅ Bayar langsung kepada driver/saat makanan tiba</p>
                <p>✅ Pastikan membawa uang pas</p>
                <p>✅ Driver/kurir akan memberikan struk pembayaran</p>
            </div>
            <button class="copy-btn" onclick="simulatePaymentSuccess('Tunai', ${amount}, \`${orderDetail}\`)">✅ Lanjutkan Pesanan</button>
        `;
    }
    
    if (paymentMethod !== 'Transfer Bank') {
        modalBody.innerHTML = content;
        modal.style.display = 'flex';
    }
    
    window.pendingPaymentSuccess = () => {
        closePaymentModal();
        if (onSuccess) onSuccess();
    };
}

window.simulatePaymentSuccess = function(method, amount, orderDetail) {
    closePaymentModal();
    showNotification(`✅ Pembayaran ${method} berhasil! Rp${amount.toLocaleString('id-ID')} telah dibayar.`);
    if (window.pendingPaymentSuccess) {
        window.pendingPaymentSuccess();
    }
};

// ========== RIWAYAT FUNCTIONS ==========
function hapusSemuaRiwayat() {
    if (confirm("⚠️ Yakin ingin menghapus SEMUA riwayat pesanan?")) {
        riwayat = [];
        localStorage.setItem('gaskeunRiwayat', JSON.stringify(riwayat));
        renderRiwayat();
        showNotification("🗑️ Semua riwayat berhasil dihapus!");
    }
}

function hapusSatuRiwayat(index) {
    if (confirm("Hapus pesanan ini?")) {
        riwayat.splice(index, 1);
        localStorage.setItem('gaskeunRiwayat', JSON.stringify(riwayat));
        renderRiwayat();
        showNotification("✅ Satu riwayat dihapus");
    }
}

function renderRiwayat() {
    const container = document.getElementById('riwayatList');
    if (!container) return;
    if (!riwayat.length) { 
        container.innerHTML = '<div style="text-align:center; padding:2rem;">📭 Belum ada pesanan</div>'; 
        return;
    }
    container.innerHTML = riwayat.map((r, idx) => `
        <div class="riwayat-item">
            <div class="riwayat-info">
                <strong>${r.type === 'transport' ? '🚗 Transportasi' : '🍔 Food Delivery'}</strong><br>
                ${r.detail}<br>
                <small>${r.date} | Total: Rp${r.total.toLocaleString('id-ID')} | Bayar: ${r.payment}</small>
            </div>
            <button class="btn-hapus-item" onclick="hapusSatuRiwayat(${idx})">❌ Hapus</button>
        </div>
    `).join('');
}

// ========== TRANSPORTASI ==========
function updateEstimasi() {
    let jarak = parseFloat(document.getElementById('distance').value) || 0;
    let harga = pricePerKm[selectedVehicle] * jarak;
    document.getElementById('estimasiHarga').innerHTML = `💰 Estimasi: Rp${harga.toLocaleString('id-ID')}`;
    return harga;
}

// Vehicle selection
document.querySelectorAll('[data-vehicle]').forEach(el => {
    el.addEventListener('click', function() {
        selectedVehicle = this.dataset.vehicle;
        document.querySelectorAll('[data-vehicle]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        updateEstimasi();
    });
});

// Payment selection
document.querySelectorAll('[data-payment]').forEach(el => {
    el.addEventListener('click', function() {
        selectedPayment = this.dataset.payment;
        document.querySelectorAll('[data-payment]').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
    });
});

// Driver selection
document.querySelectorAll('.driver-card').forEach(el => {
    el.addEventListener('click', function() {
        selectedDriver = this.dataset.driver;
        document.querySelectorAll('.driver-card').forEach(d => d.classList.remove('selected'));
        this.classList.add('selected');
    });
});

document.getElementById('orderTransportBtn').addEventListener('click', () => {
    let pickup = document.getElementById('pickupLocation').value;
    let dest = document.getElementById('destination').value;
    let jarak = parseFloat(document.getElementById('distance').value);
    let harga = pricePerKm[selectedVehicle] * jarak;
    let driver = selectedDriver || "Driver Otomatis";
    let statusDiv = document.getElementById('statusTransport');
    
    if (!dest) { showNotification("Tujuan tidak boleh kosong"); return; }
    if (isNaN(jarak) || jarak <= 0) { showNotification("Jarak tidak valid"); return; }
    
    let orderDetail = `${selectedVehicle === 'motor' ? '🛵 Motor' : '🚗 Mobil'} dari ${pickup} ke ${dest} | Driver: ${driver}`;
    
    showPaymentModal(selectedPayment, harga, orderDetail, () => {
        statusDiv.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> Mencari driver di ${pickup}...`;
        setTimeout(() => {
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> Driver ${driver} ditemukan! Menuju lokasi Anda.`;
            setTimeout(() => {
                addToRiwayat({
                    type: 'transport',
                    detail: orderDetail,
                    total: harga,
                    payment: selectedPayment,
                    date: new Date().toLocaleString('id-ID')
                });
                showNotification(`✅ Pesanan transportasi berhasil! Estimasi tiba 10 menit. Tarif Rp${harga.toLocaleString('id-ID')}`);
                statusDiv.innerHTML = `✅ Pesanan sukses! Driver akan menjemput di ${pickup}. Terima kasih Gaskeun!`;
            }, 1500);
        }, 2000);
    });
});

// ========== FOOD DELIVERY ==========
function renderMenu() {
    const container = document.getElementById('menuGrid');
    if (!container) return;
    container.innerHTML = menuMakanan.map(item => `
        <div class="menu-item">
            <div class="menu-emoji">${item.emoji}</div>
            <h4>${item.name}</h4>
            <p style="color: gray; font-size: 0.8rem;">${item.resto}</p>
            <div class="menu-price">Rp${item.price.toLocaleString('id-ID')}</div>
            <button class="btn-add" onclick="addToCart(${item.id})">+ Tambah ke Keranjang</button>
        </div>
    `).join('');
}

window.addToCart = (id) => {
    const item = menuMakanan.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++;
    else cart.push({ ...item, qty: 1 });
    renderCart();
    showNotification(`${item.name} ditambahkan ke keranjang`);
};

function renderCart() {
    const cartDiv = document.getElementById('cartItems');
    if (!cartDiv) return;
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Keranjang kosong</p>';
        document.getElementById('cartTotal').innerHTML = 'Total: Rp0';
        return;
    }
    cartDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x${item.qty}</span>
            <span>Rp${(item.price * item.qty).toLocaleString('id-ID')}</span>
            <button onclick="removeFromCart(${item.id})" style="background:#dc3545; color:white; border:none; border-radius:20px; padding:5px 12px; cursor:pointer;">Hapus</button>
        </div>
    `).join('');
    const total = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    document.getElementById('cartTotal').innerHTML = `Total: Rp${total.toLocaleString('id-ID')}`;
}

window.removeFromCart = (id) => {
    cart = cart.filter(c => c.id !== id);
    renderCart();
};

document.getElementById('orderFoodBtn').addEventListener('click', () => {
    let address = document.getElementById('foodAddress').value;
    if (cart.length === 0) { showNotification("Keranjang masih kosong!"); return; }
    if (!address) { showNotification("Masukkan alamat pengiriman"); return; }
    let total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    let detailMakanan = cart.map(i => `${i.name} x${i.qty}`).join(', ');
    let orderDetail = `Pesanan: ${detailMakanan} | Alamat: ${address}`;
    
    let statusDiv = document.getElementById('statusFood');
    
    showPaymentModal(selectedPayment, total, orderDetail, () => {
        statusDiv.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> Mencari mitra kurir di ${address}...`;
        setTimeout(() => {
            statusDiv.innerHTML = `<i class="fas fa-check-circle"></i> Kurir ditugaskan! Pesanan sedang dimasak.`;
            setTimeout(() => {
                addToRiwayat({
                    type: 'food',
                    detail: orderDetail,
                    total: total,
                    payment: selectedPayment,
                    date: new Date().toLocaleString('id-ID')
                });
                showNotification(`🍽️ Pesanan makanan berhasil! Total Rp${total.toLocaleString('id-ID')}. Akan diantar ke ${address}`);
                cart = [];
                renderCart();
                statusDiv.innerHTML = `✅ Pesanan makanan siap! Kurir akan mengantar ke ${address}. Terima kasih Gaskeun!`;
            }, 2000);
        }, 2000);
    });
});

// ========== TAB SYSTEM ==========
window.showTab = function(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active-tab'));
    document.getElementById(`${tab}Tab`).classList.add('active-tab');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (tab === 'transport') document.querySelectorAll('.tab-btn')[0].classList.add('active');
    else if (tab === 'food') document.querySelectorAll('.tab-btn')[1].classList.add('active');
    else if (tab === 'riwayat') {
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
        renderRiwayat();
    }
};

window.hapusSatuRiwayat = hapusSatuRiwayat;
window.closePaymentModal = closePaymentModal;
window.copyToClipboard = copyToClipboard;
window.toggleChat = toggleChat;
window.sendMessage = sendMessage;

// Event listener untuk tombol hapus semua
const hapusBtn = document.getElementById('hapusSemuaRiwayatBtn');
if (hapusBtn) {
    hapusBtn.addEventListener('click', hapusSemuaRiwayat);
}

// ========== INIT ==========
document.getElementById('distance').addEventListener('input', updateEstimasi);
updateEstimasi();
renderMenu();
renderCart();
renderRiwayat();