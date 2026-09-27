/**
 * ALL MARKETING - ADMIN PANEL LOGIC
 */

let adminProducts = [];
let adminInquiries = [];

document.addEventListener('DOMContentLoaded', () => {
    // Check if previously logged in session exists
    if (sessionStorage.getItem('all_marketing_admin_auth') === 'true') {
        unlockDashboard();
    }

    setupAuthForm();
    setupProductForm();
});

// Setup Auth Form
function setupAuthForm() {
    const authForm = document.getElementById('auth-form');
    if (!authForm) return;

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('auth-passcode').value;
        if (pass === 'admin123') {
            sessionStorage.setItem('all_marketing_admin_auth', 'true');
            unlockDashboard();
            showToast('Welcome to Admin Portal!', 'success');
        } else {
            showToast('Invalid Passcode! Try admin123', 'error');
        }
    });
}

function unlockDashboard() {
    document.getElementById('admin-auth-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    initAdminData();
}

function lockAdmin() {
    sessionStorage.removeItem('all_marketing_admin_auth');
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('admin-auth-screen').style.display = 'flex';
    document.getElementById('auth-passcode').value = '';
}

// Load initial admin data & status
async function initAdminData() {
    checkConnectionStatus();
    await refreshProductsTable();
    await refreshInquiriesTable();
}

// Check Supabase connection state
async function checkConnectionStatus() {
    const pill = document.getElementById('db-status-pill');
    const status = await MarketingDB.checkConnection();
    
    if (status.online) {
        pill.className = 'db-status-banner db-online';
        pill.innerHTML = `<i class="fa-solid fa-cloud-check"></i> Connected to Supabase`;
    } else {
        pill.className = 'db-status-banner db-offline';
        pill.innerHTML = `<i class="fa-solid fa-hard-drive"></i> Local Storage Mode`;
    }
}

// Switch between Products and Inquiries tabs
function switchAdminTab(tabName) {
    const pSec = document.getElementById('section-products');
    const iSec = document.getElementById('section-inquiries');
    const pBtn = document.getElementById('tab-btn-products');
    const iBtn = document.getElementById('tab-btn-inquiries');

    if (tabName === 'products') {
        pSec.style.display = 'block';
        iSec.style.display = 'none';
        pBtn.className = 'btn btn-primary';
        iBtn.className = 'btn btn-secondary';
    } else {
        pSec.style.display = 'none';
        iSec.style.display = 'block';
        pBtn.className = 'btn btn-secondary';
        iBtn.className = 'btn btn-primary';
    }
}

// Refresh Products Table
async function refreshProductsTable() {
    adminProducts = await MarketingDB.getProducts();
    
    document.getElementById('stat-total-products').innerText = adminProducts.length;

    const tbody = document.getElementById('admin-products-tbody');
    if (adminProducts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No products available. Click "Add New Package" to create one.</td></tr>`;
        return;
    }

    tbody.innerHTML = adminProducts.map(p => `
        <tr>
            <td>
                <img src="${escapeHTML(p.image_url)}" class="table-img" alt="${escapeHTML(p.title)}">
            </td>
            <td>
                <strong style="color: var(--dark); font-size: 0.95rem;">${escapeHTML(p.title)}</strong>
                <p style="font-size: 0.8rem; color: var(--text-muted);">${escapeHTML(p.description.substring(0, 50))}...</p>
            </td>
            <td><span class="product-category-tag" style="position: static;">${escapeHTML(p.category)}</span></td>
            <td>
                <span style="font-weight: 700; color: var(--primary);">Rs. ${Number(p.price).toLocaleString()}</span>
                ${p.original_price ? `<br><small style="text-decoration: line-through; color: var(--text-muted);">Rs. ${Number(p.original_price).toLocaleString()}</small>` : ''}
            </td>
            <td>${p.badge ? `<span class="product-badge" style="position: static;">${escapeHTML(p.badge)}</span>` : '<span style="color: #cbd5e1;">-</span>'}</td>
            <td>
                <div style="display: flex; gap: 6px;">
                    <button class="btn btn-secondary btn-sm" onclick="editProduct('${p.id}')" title="Edit Package">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')" title="Remove Package">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Refresh Customer Inquiries Table
async function refreshInquiriesTable() {
    adminInquiries = await MarketingDB.getInquiries();

    document.getElementById('stat-total-inquiries').innerText = adminInquiries.length;
    const pendingCount = adminInquiries.filter(i => i.status === 'Pending').length;
    document.getElementById('stat-pending-inquiries').innerText = pendingCount;

    const tbody = document.getElementById('admin-inquiries-tbody');
    if (adminInquiries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-muted);">No customer inquiries yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = adminInquiries.map(i => {
        let statusClass = 'status-pending';
        if (i.status === 'Contacted') statusClass = 'status-contacted';
        if (i.status === 'Completed') statusClass = 'status-completed';

        // Clean phone for whatsapp link
        const cleanPhone = i.customer_phone ? i.customer_phone.replace(/[^0-9]/g, '') : '';
        const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : '#';

        return `
            <tr>
                <td>
                    <strong style="color: var(--dark);">${escapeHTML(i.customer_name)}</strong>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(i.created_at).toLocaleDateString()}</div>
                </td>
                <td>
                    <div><i class="fa-solid fa-envelope" style="color: var(--text-muted);"></i> ${escapeHTML(i.customer_email)}</div>
                    <div>
                        <i class="fa-solid fa-phone" style="color: var(--text-muted);"></i> ${escapeHTML(i.customer_phone)}
                        <a href="${waLink}" target="_blank" style="color: #25d366; margin-left: 6px;" title="Chat on WhatsApp">
                            <i class="fa-brands fa-whatsapp"></i>
                        </a>
                    </div>
                </td>
                <td><strong style="color: var(--primary);">${escapeHTML(i.service_title)}</strong></td>
                <td><p style="max-width: 250px; font-size: 0.85rem;">${escapeHTML(i.message || 'No additional notes')}</p></td>
                <td>
                    <select class="form-control btn-sm ${statusClass}" onchange="changeInquiryStatus('${i.id}', this.value)">
                        <option value="Pending" ${i.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Contacted" ${i.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                        <option value="Completed" ${i.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteInquiry('${i.id}')" title="Delete Inquiry">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update inquiry status
async function changeInquiryStatus(id, newStatus) {
    await MarketingDB.updateInquiryStatus(id, newStatus);
    showToast('Inquiry status updated!', 'success');
    refreshInquiriesTable();
}

// Delete inquiry
async function deleteInquiry(id) {
    if (confirm('Are you sure you want to delete this inquiry?')) {
        await MarketingDB.deleteInquiry(id);
        showToast('Inquiry removed!', 'info');
        refreshInquiriesTable();
    }
}

// Product Modal Handlers (ADD / EDIT)
function openAddProductModal() {
    document.getElementById('product-modal-title').innerText = 'Add New Marketing Package';
    document.getElementById('product-form').reset();
    document.getElementById('edit-product-id').value = '';
    document.getElementById('product-modal').classList.add('active');
}

function editProduct(id) {
    const item = adminProducts.find(p => p.id == id);
    if (!item) return;

    document.getElementById('product-modal-title').innerText = 'Edit Marketing Package';
    document.getElementById('edit-product-id').value = item.id;
    document.getElementById('p-title').value = item.title;
    document.getElementById('p-category').value = item.category;
    document.getElementById('p-price').value = item.price;
    document.getElementById('p-original-price').value = item.original_price || '';
    document.getElementById('p-image').value = item.image_url || '';
    document.getElementById('p-badge').value = item.badge || '';
    document.getElementById('p-desc').value = item.description || '';

    const featuresArr = Array.isArray(item.features) ? item.features : [];
    document.getElementById('p-features').value = featuresArr.join('\n');

    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

// Save Product Form Handler
function setupProductForm() {
    const form = document.getElementById('product-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        const editId = document.getElementById('edit-product-id').value;
        const featuresText = document.getElementById('p-features').value;
        const featuresArr = featuresText.split('\n').map(f => f.trim()).filter(f => f.length > 0);

        const productData = {
            title: document.getElementById('p-title').value,
            category: document.getElementById('p-category').value,
            price: document.getElementById('p-price').value,
            original_price: document.getElementById('p-original-price').value,
            image_url: document.getElementById('p-image').value,
            badge: document.getElementById('p-badge').value,
            description: document.getElementById('p-desc').value,
            features: featuresArr
        };

        try {
            if (editId) {
                await MarketingDB.updateProduct(editId, productData);
                showToast('Package updated successfully!', 'success');
            } else {
                await MarketingDB.addProduct(productData);
                showToast('New Package added successfully!', 'success');
            }
            closeProductModal();
            await refreshProductsTable();
        } catch (err) {
            console.error(err);
            showToast('Error saving package.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Package';
        }
    });
}

// Delete Product ("me khod bi add or remove kar sakhu")
async function deleteProduct(id) {
    if (confirm('Are you sure you want to remove/delete this package? It will be removed from your website immediately.')) {
        await MarketingDB.deleteProduct(id);
        showToast('Package removed successfully!', 'error');
        await refreshProductsTable();
    }
}

// SQL Schema Modal Copy Tool
function openSqlModal() {
    const sqlCode = `-- =========================================================
-- ALL MARKETING - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor:
-- https://vvfrvcfjokaeznhuxiox.supabase.co -> SQL Editor -> New Query -> Run
-- =========================================================

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Digital Marketing',
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC DEFAULT 0,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    badge TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_title TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Select Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Insert Products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Products" ON products FOR UPDATE USING (true);
CREATE POLICY "Public Delete Products" ON products FOR DELETE USING (true);

CREATE POLICY "Public Select Inquiries" ON inquiries FOR SELECT USING (true);
CREATE POLICY "Public Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Inquiries" ON inquiries FOR UPDATE USING (true);
CREATE POLICY "Public Delete Inquiries" ON inquiries FOR DELETE USING (true);
`;
    document.getElementById('sql-code-area').value = sqlCode;
    document.getElementById('sql-modal').classList.add('active');
}

function closeSqlModal() {
    document.getElementById('sql-modal').classList.remove('active');
}

function copySqlCode() {
    const textarea = document.getElementById('sql-code-area');
    textarea.select();
    document.execCommand('copy');
    showToast('SQL Script copied to clipboard!', 'success');
}

// Toast Notification Helper
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
