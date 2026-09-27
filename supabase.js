/**
 * ALL MARKETING - SUPABASE INTEGRATION ENGINE
 * Configured with User's Supabase Credentials
 */

const SUPABASE_URL = 'https://vvfrvcfjokaeznhuxiox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4LDz1rEt9MtYAnClusNgFw_d4CnkSx5';

// Initialize Supabase Client if library loaded
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Default initial products if local/supabase storage is empty
const DEFAULT_PRODUCTS = [
    {
        id: '1',
        title: 'Social Media Marketing Starter',
        category: 'Social Media',
        price: 15000,
        original_price: 22000,
        description: 'Complete 30-day social media management for Instagram & Facebook with engaging graphics and reel strategies.',
        features: ['15 Custom Graphic Posts', '5 Engaging Reels/Shorts', 'Page Setup & Optimization', 'Hashtag & Audience Growth', 'Monthly Performance Report'],
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80',
        badge: 'Popular',
        is_featured: true,
        created_at: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Google Ads & PPC Lead Generator',
        category: 'Paid Ads',
        price: 25000,
        original_price: 35000,
        description: 'Drive high-intent buyers directly to your business with targeted Google Search & Display Ads campaigns.',
        features: ['High Converting Keyword Setup', 'Compelling Ad Copywriting', 'Conversion Pixel Setup', 'Daily Bid & Budget Tuning', 'Detailed Performance Audit'],
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
        badge: 'High ROI',
        is_featured: true,
        created_at: new Date().toISOString()
    },
    {
        id: '3',
        title: 'Complete Google SEO Ranking Package',
        category: 'SEO',
        price: 30000,
        original_price: 45000,
        description: 'Rank #1 on Google for target customer keywords using proven white-hat SEO strategies.',
        features: ['Comprehensive Technical Audit', 'On-Page Content Optimization', 'High-Authority Backlinks', 'Google Business Profile Setup', 'Monthly Keyword Rank Tracking'],
        image_url: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=600&q=80',
        badge: 'Best Seller',
        is_featured: true,
        created_at: new Date().toISOString()
    },
    {
        id: '4',
        title: 'Full Brand Identity & Design Kit',
        category: 'Branding',
        price: 20000,
        original_price: 30000,
        description: 'Transform your company with a professional logo, brand guidelines, and high-quality marketing materials.',
        features: ['3 Unique Logo Concepts', 'Brand Colors & Typography', 'Business Card & Letterhead', 'Social Media Cover Banners', 'Brand Style Guide PDF'],
        image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
        badge: 'Creative',
        is_featured: false,
        created_at: new Date().toISOString()
    },
    {
        id: '5',
        title: 'E-Commerce All-In-One Scale Bundle',
        category: 'Full Marketing',
        price: 55000,
        original_price: 80000,
        description: '360° digital marketing package designed to double online sales for Shopify, WooCommerce, or Custom stores.',
        features: ['Meta (FB/IG) High-ROAS Ads', 'Google Shopping & Search Ads', 'TikTok Viral Campaign Setup', 'Sales Funnel & Email Marketing', 'Dedicated Account Growth Manager'],
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        badge: 'Ultimate',
        is_featured: true,
        created_at: new Date().toISOString()
    },
    {
        id: '6',
        title: 'HD Video Editing & Reels Pack',
        category: 'Content Creation',
        price: 18000,
        original_price: 25000,
        description: 'Engaging, fast-paced video editing for Instagram Reels, TikTok, and YouTube Shorts that hook viewers.',
        features: ['10 Edited Short Videos (Up to 60s)', 'Engaging Subtitles & Graphics', 'Trending Sound Design & FX', 'Custom Clickable Thumbnails', '4K High Resolution Output'],
        image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
        badge: 'Trending',
        is_featured: false,
        created_at: new Date().toISOString()
    }
];

// Helper: Read products from LocalStorage
function getLocalProducts() {
    const data = localStorage.getItem('all_marketing_products');
    if (!data) {
        localStorage.setItem('all_marketing_products', JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    try {
        return JSON.parse(data);
    } catch (e) {
        return DEFAULT_PRODUCTS;
    }
}

// Helper: Save products to LocalStorage
function saveLocalProducts(products) {
    localStorage.setItem('all_marketing_products', JSON.stringify(products));
}

// Helper: Read inquiries from LocalStorage
function getLocalInquiries() {
    const data = localStorage.getItem('all_marketing_inquiries');
    return data ? JSON.parse(data) : [];
}

// Helper: Save inquiries to LocalStorage
function saveLocalInquiries(inquiries) {
    localStorage.setItem('all_marketing_inquiries', JSON.stringify(inquiries));
}

// DATA ACCESS OBJECT (DAO) FOR SUPABASE + LOCALSTORAGE FALLBACK
const MarketingDB = {
    // Check Supabase connection state
    async checkConnection() {
        if (!supabaseClient) return { online: false, mode: 'Local Storage' };
        try {
            const { data, error } = await supabaseClient.from('products').select('count', { count: 'exact', head: true });
            if (error) {
                console.warn('Supabase table check note:', error.message);
                return { online: false, mode: 'Local Storage (Supabase tables pending)' };
            }
            return { online: true, mode: 'Supabase Real-Time DB' };
        } catch (err) {
            return { online: false, mode: 'Local Storage' };
        }
    },

    // Fetch all marketing products/services
    async getProducts() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data && data.length > 0) {
                    // Normalize features JSON if string
                    return data.map(item => ({
                        ...item,
                        features: typeof item.features === 'string' ? JSON.parse(item.features) : (item.features || [])
                    }));
                }
            } catch (err) {
                console.warn('Supabase fetch failed, falling back to local:', err);
            }
        }
        return getLocalProducts();
    },

    // Add a new product/service (Admin)
    async addProduct(product) {
        const newProduct = {
            title: product.title,
            category: product.category,
            price: Number(product.price),
            original_price: Number(product.original_price || 0),
            description: product.description || '',
            features: product.features || [],
            image_url: product.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
            badge: product.badge || '',
            is_featured: product.is_featured || false,
            created_at: new Date().toISOString()
        };

        // Always save to LocalStorage first to guarantee immediate offline functionality
        const local = getLocalProducts();
        const localItem = { ...newProduct, id: Date.now().toString() };
        local.unshift(localItem);
        saveLocalProducts(local);

        // Attempt Supabase insert
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .insert([newProduct])
                    .select();

                if (!error && data && data[0]) {
                    console.log('Successfully saved to Supabase:', data[0]);
                    return data[0];
                }
            } catch (err) {
                console.warn('Supabase add failed, stored locally:', err);
            }
        }
        return localItem;
    },

    // Update an existing product/service (Admin)
    async updateProduct(id, product) {
        const updateData = {
            title: product.title,
            category: product.category,
            price: Number(product.price),
            original_price: Number(product.original_price || 0),
            description: product.description || '',
            features: product.features || [],
            image_url: product.image_url,
            badge: product.badge,
            is_featured: product.is_featured
        };

        // Update LocalStorage
        let local = getLocalProducts();
        local = local.map(p => p.id == id ? { ...p, ...updateData } : p);
        saveLocalProducts(local);

        // Update Supabase
        if (supabaseClient) {
            try {
                await supabaseClient
                    .from('products')
                    .update(updateData)
                    .eq('id', id);
            } catch (err) {
                console.warn('Supabase update error:', err);
            }
        }
        return true;
    },

    // Delete a product/service (Admin - "me khod bi add or remove kar sakhu")
    async deleteProduct(id) {
        // Remove from LocalStorage
        let local = getLocalProducts();
        local = local.filter(p => p.id != id);
        saveLocalProducts(local);

        // Remove from Supabase
        if (supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('products')
                    .delete()
                    .eq('id', id);
                if (error) console.warn('Supabase delete error:', error.message);
            } catch (err) {
                console.warn('Supabase delete exception:', err);
            }
        }
        return true;
    },

    // Submit Customer Order / Inquiry
    async submitInquiry(inquiry) {
        const newInquiry = {
            customer_name: inquiry.customer_name,
            customer_email: inquiry.customer_email,
            customer_phone: inquiry.customer_phone,
            service_title: inquiry.service_title,
            message: inquiry.message || '',
            status: 'Pending',
            created_at: new Date().toISOString()
        };

        // Local storage save
        const local = getLocalInquiries();
        const localItem = { ...newInquiry, id: Date.now().toString() };
        local.unshift(localItem);
        saveLocalInquiries(local);

        // Supabase save
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('inquiries')
                    .insert([newInquiry])
                    .select();
                if (!error && data && data[0]) return data[0];
            } catch (err) {
                console.warn('Supabase inquiry insert error:', err);
            }
        }
        return localItem;
    },

    // Get Customer Inquiries (Admin)
    async getInquiries() {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('inquiries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error && data) return data;
            } catch (err) {
                console.warn('Supabase inquiries fetch error:', err);
            }
        }
        return getLocalInquiries();
    },

    // Update Inquiry Status (Admin)
    async updateInquiryStatus(id, newStatus) {
        let local = getLocalInquiries();
        local = local.map(item => item.id == id ? { ...item, status: newStatus } : item);
        saveLocalInquiries(local);

        if (supabaseClient) {
            try {
                await supabaseClient
                    .from('inquiries')
                    .update({ status: newStatus })
                    .eq('id', id);
            } catch (err) {
                console.warn('Supabase update inquiry status error:', err);
            }
        }
        return true;
    },

    // Delete Inquiry (Admin)
    async deleteInquiry(id) {
        let local = getLocalInquiries();
        local = local.filter(item => item.id != id);
        saveLocalInquiries(local);

        if (supabaseClient) {
            try {
                await supabaseClient
                    .from('inquiries')
                    .delete()
                    .eq('id', id);
            } catch (err) {
                console.warn('Supabase delete inquiry error:', err);
            }
        }
        return true;
    }
};
