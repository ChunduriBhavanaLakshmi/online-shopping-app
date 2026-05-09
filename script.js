const inventory = [
    { id: 1, name: "Beautiful Red Frock", price: 899, cat: "Women", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", stars: 5 },
    { id: 2, name: "Minimalist Leather Bag", price: 1200, cat: "Fashion", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", stars: 4 },
    { id: 3, name: "Atelier Noise Buds", price: 1599, cat: "Tech", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", stars: 5 },
    { id: 4, name: "Ivory Ceramic Vase", price: 499, cat: "Home", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600", stars: 4 },
    { id: 5, name: "Glow Revive Serum", price: 750, cat: "Beauty", img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600", stars: 5 },
    { id: 6, name: "Ultra-Thin Keypad", price: 2100, cat: "Tech", img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600", stars: 3 },
    { id: 7, name: "Linen Lounge Set", price: 1100, cat: "Men", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600", stars: 4 },
    { id: 8, name: "Onyx Coffee Press", price: 850, cat: "Home", img: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600", stars: 5 }
];

let cart = [], wishlist = [], pdpItem = null;

// --- INITIALIZE APP ---
function enterApp() {
    document.getElementById('view-auth').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    renderGrid(inventory);
}

// --- RENDERING ENGINE ---
function renderGrid(data) {
    const grid = document.getElementById('plp-grid');
    if (!grid) return;
    grid.innerHTML = data.map(p => `
        <div class="card" onclick="openPDP(${p.id})">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
        </div>`).join('');
}

// --- NAVIGATION ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.remove('hidden');
    
    if (viewId === 'cart') renderCart();
    if (viewId === 'wishlist') renderWishlist();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- PDP ZOOM ---
function zoomIn(e) {
    const img = document.querySelector('#pdp-img');
    const x = (e.offsetX / e.target.offsetWidth) * 100;
    const y = (e.offsetY / e.target.offsetHeight) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = "scale(2)";
}
function zoomOut() { document.querySelector('#pdp-img').style.transform = "scale(1)"; }

// --- SEARCH & FILTERS ---
function filterBy(cat, el) {
    // Update active UI state
    document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
    if(el) el.classList.add('active');
    
    // Logic: If 'All', show everything, otherwise filter by category
    const filtered = (cat === 'All') ? inventory : inventory.filter(p => p.cat === cat);
    renderGrid(filtered);
    showView('home');
}

function executeSearch() {
    const query = document.getElementById('global-search').value.toLowerCase();
    const filtered = inventory.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.cat.toLowerCase().includes(query)
    );
    renderGrid(filtered);
    showView('home');
}

// --- PRODUCT ACTIONS ---
function openPDP(id) {
    pdpItem = inventory.find(p => p.id === id);
    document.getElementById('pdp-img').src = pdpItem.img;
    document.getElementById('pdp-name').innerText = pdpItem.name;
    document.getElementById('pdp-price').innerText = "₹" + pdpItem.price;
    
    let stars = "";
    for(let i=1; i<=5; i++) {
        stars += `<i class="fa-solid fa-star ${i <= pdpItem.stars ? 'gold' : ''}"></i>`;
    }
    document.getElementById('pdp-stars').innerHTML = stars;
    showView('pdp');
}

function addToBag() {
    if(!pdpItem) return;
    cart.push(pdpItem);
    updateUI();
    alert("Added to Bag");
}

function addToWish() { 
    if(!wishlist.find(i => i.id === pdpItem.id)) {
        wishlist.push(pdpItem);
        updateUI();
        alert("Added to Wishlist");
    } else {
        alert("Already in Wishlist");
    }
}

function updateUI() {
    document.getElementById('c-badge').innerText = cart.length;
    document.getElementById('w-badge').innerText = wishlist.length;
}

// --- CART & WISHLIST RENDER ---
function renderCart() {
    const list = document.getElementById('cart-items-list');
    const subTotalElem = document.getElementById('sub-amt');
    const totalElem = document.getElementById('total-amt');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    
    if (cart.length === 0) {
        list.innerHTML = `<div style="padding:50px; text-align:center; color:#888;">Your bag is empty.</div>`;
    } else {
        list.innerHTML = cart.map((item, index) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:20px 0; border-bottom:1px solid #eee;">
                <div>
                    <h4 style="font-family: 'Playfair Display';">${item.name}</h4>
                    <p style="font-size:12px; color:#888; cursor:pointer;" onclick="removeFromCart(${index})">Remove</p>
                </div>
                <b>₹${item.price}</b>
            </div>`).join('');
    }
    
    if(subTotalElem) subTotalElem.innerText = "₹" + total;
    if(totalElem) totalElem.innerText = "₹" + total;
}

function renderWishlist() {
    const grid = document.getElementById('wish-grid');
    if (!grid) return;
    if (wishlist.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding:50px; color:#888;">Your wishlist is empty.</p>`;
        return;
    }
    grid.innerHTML = wishlist.map(p => `
        <div class="card" onclick="openPDP(${p.id})">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
        </div>`).join('');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateUI();
    renderCart();
}

// --- CHECKOUT LOGIC ---
function executePayment() {
    if (cart.length === 0) return alert("Select items first.");
    const btn = document.getElementById('main-pay-btn');
    btn.disabled = true;
    btn.innerText = "Authorizing Transaction...";
    
    setTimeout(() => {
        showView('success');
        cart = [];
        updateUI();
        btn.disabled = false;
        btn.innerText = "Place Order";
    }, 2500);
}

function setPayment(element, method) {
    document.querySelectorAll('.method-box').forEach(box => box.classList.remove('active'));
    element.classList.add('active');
    const btn = document.getElementById('main-pay-btn');
    btn.innerText = (method === 'COD') ? 'Confirm Order' : `Pay via ${method}`;
}

// --- MISC ---
function startVoiceSearch() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.onstart = () => document.querySelector('.mic-icon').style.color = "red";
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('global-search').value = transcript;
            executeSearch();
            document.querySelector('.mic-icon').style.color = "var(--gold)";
        };
        recognition.start();
    } else {
        alert("Voice search not supported.");
    }
}

// Helper Functions
function rateApp() { prompt("Rate OnlineShopping (1-5 stars):", "5"); }
function shareSite() { alert("Shop link copied to clipboard!"); }
function changeLanguage() { alert("Language set to English (Global)"); }
