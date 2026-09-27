/**
 * ALL MARKETING - CUSTOMER FRONTEND LOGIC
 */

let allProducts = [];
let selectedCategory = 'All';
let currentOrderProduct = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Initial fetch
    await loadProducts();

    // Event Listeners for Filters
    setupCategoryTabs();
    setupSearchInput();
    setupForms();
});

// Fetch products from database
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
            <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary);"></i>
            <p style="margin-top: 1rem; color: var(--text-muted); font-weight: 600;">Loading Marketing Services...</p>
        </div>
    `;

    try {
        allProducts = await MarketingDB.getProducts();
        renderProducts();
    } catch (err) {
        console.error('Error loading products:', err);
        showToast('Failed to load services. Please refresh.', 'error');
    }
}

// Render products grid based on category and search
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noMsg = document.getElementById('no-products-msg');
    const searchVal = document.getElementById('search-input').value.toLowerCase().trim();

    const filtered = allProducts.filter(item => {
        const matchesCategory = (selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase());
        const matchesSearch = item.title.toLowerCase().includes(searchVal) || 
                              item.description.toLowerCase().includes(searchVal) ||
                              (item.category && item.category.toLowerCase().includes(searchVal));
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.style.display = 'none';
        noMsg.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noMsg.style.display = 'none';

    grid.innerHTML = filtered.map(item => {
        const features = Array.isArray(item.features) ? item.features : [];
        const featuresListHTML = features.slice(0, 4).map(f => `
            <li><i class="fa-solid fa-circle-check"></i> ${escapeHTML(f)}</li>
        `).join('');

        const originalPriceHTML = item.original_price && item.original_price > item.price ? `
            <span class="price-original">Rs. ${Number(item.original_price).toLocaleString()}</span>
        ` : '';

        const badgeHTML = item.badge ? `<span class="product-badge">${escapeHTML(item.badge)}</span>` : '';

        return `
            <div class="product-card">
                <div class="product-image-wrap">
                    <img src="${escapeHTML(item.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80')}" alt="${escapeHTML(item.title)}">
                    ${badgeHTML}
                    <span class="product-category-tag">${escapeHTML(item.category)}</span>
                </div>
                <div class="product-body">
                    <h3 class="product-title">${escapeHTML(item.title)}</h3>
                    <p class="product-desc">${escapeHTML(item.description)}</p>
                    
                    <ul class="product-features">
                        ${featuresListHTML}
                        ${features.length > 4 ? `<li style="color: var(--text-muted); font-size: 0.8rem;">+ ${features.length - 4} more features included</li>` : ''}
                    </ul>

                    <div class="product-footer">
                        <div class="product-price">
                            ${originalPriceHTML}
                            <span class="price-current">Rs. ${Number(item.price).toLocaleString()}</span>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-secondary btn-sm" onclick="openDetailModal('${item.id}')">
                                <i class="fa-solid fa-eye"></i> Details
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="openOrderModal('${item.id}')">
                                <i class="fa-solid fa-cart-plus"></i> Order Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup Category Tabs
function setupCategoryTabs() {
    const tabsContainer = document.getElementById('categories-tabs');
    if (!tabsContainer) return;

    tabsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cat-tab')) {
            document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            selectedCategory = e.target.getAttribute('data-category');
            renderProducts();
        }
    });
}

// Setup Search Input
function setupSearchInput() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        renderProducts();
    });
}

// Open Order Modal for a service
function openOrderModal(productId) {
    const item = allProducts.find(p => p.id == productId);
    if (!item) return;

    currentOrderProduct = item;
    document.getElementById('modal-package-title').innerText = item.title;
    document.getElementById('modal-package-price').innerText = `Rs. ${Number(item.price).toLocaleString()}`;
    
    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
    document.getElementById('modal-order-form').reset();
    currentOrderProduct = null;
}

// Open Detail Modal
function openDetailModal(productId) {
    const item = allProducts.find(p => p.id == productId);
    if (!item) return;

    document.getElementById('detail-title').innerText = item.title;
    
    const features = Array.isArray(item.features) ? item.features : [];
    const featuresHTML = features.map(f => `
        <li style="padding: 8px 0; border-bottom: 1px dashed var(--border); display: flex; align-items: center; gap: 10px;">
            <i class="fa-solid fa-circle-check" style="color: #10b981;"></i> ${escapeHTML(f)}
        </li>
    `).join('');

    document.getElementById('detail-body').innerHTML = `
        <img src="${escapeHTML(item.image_url)}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;" alt="${escapeHTML(item.title)}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <span class="product-category-tag" style="position: static;">${escapeHTML(item.category)}</span>
            <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">Rs. ${Number(item.price).toLocaleString()}</span>
        </div>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">${escapeHTML(item.description)}</p>
        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">Package Includes:</h4>
        <ul style="list-style: none; margin-bottom: 2rem;">
            ${featuresHTML}
        </ul>
        <button class="btn btn-primary" style="width: 100%;" onclick="closeDetailModal(); openOrderModal('${item.id}');">
            <i class="fa-solid fa-cart-shopping"></i> Order This Package Now
        </button>
    `;

    document.getElementById('detail-modal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

// Setup Form Submission Handlers
function setupForms() {
    // Modal Order Form
    const orderForm = document.getElementById('modal-order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = orderForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

            const inquiryData = {
                customer_name: document.getElementById('modal-cust-name').value,
                customer_phone: document.getElementById('modal-cust-phone').value,
                customer_email: document.getElementById('modal-cust-email').value,
                service_title: currentOrderProduct ? currentOrderProduct.title : 'General Order',
                message: document.getElementById('modal-cust-message').value
            };

            try {
                await MarketingDB.submitInquiry(inquiryData);
                closeOrderModal();
                showToast('Order Submitted Successfully! We will contact you on WhatsApp/Phone.', 'success');
            } catch (err) {
                console.error(err);
                showToast('Failed to submit order. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Confirm & Submit Order';
            }
        });
    }

    // Main Page Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

            const inquiryData = {
                customer_name: document.getElementById('contact-name').value,
                customer_phone: document.getElementById('contact-phone').value,
                customer_email: document.getElementById('contact-email').value,
                service_title: document.getElementById('contact-service').value || 'Custom Inquiry',
                message: document.getElementById('contact-message').value
            };

            try {
                await MarketingDB.submitInquiry(inquiryData);
                contactForm.reset();
                showToast('Inquiry Received! Our team will contact you shortly.', 'success');
            } catch (err) {
                console.error(err);
                showToast('Submission error. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Inquiry Now';
            }
        });
    }
}

// Toast Notifications Helper
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-triangle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Helper: Escape HTML
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
