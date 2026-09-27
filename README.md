# 🚀 All Marketing - Digital Marketing & Services Platform

A high-converting, modern digital marketing agency website connected with **Supabase** backend database and a full-featured **Admin Panel** to add, edit, and remove marketing packages & pricing in real-time.

---

## ✨ Features

- ** Modern & Responsive Design**: Designed with glassmorphism header, hero stats counter, responsive product cards, category filters, and live search bar.
- ** Accurate & Reasonable Pricing**: Comes with pre-configured high-demand marketing packages (Social Media, Google Ads, SEO, Branding, Video Reels) with PKR pricing and feature checklists.
- ** Admin Panel (`admin.html`)**: 
  - Passcode protection (Default Passcode: `admin123`).
  - **Add New Services/Products**: Set title, category, price, discount price, image URL, badge, description, and bulleted features.
  - **Edit & Update Services**: Instant update across the entire website.
  - **Remove / Delete Services**: Instantly remove products from your catalog.
  - **Manage Customer Orders**: View incoming customer inquiries, open direct WhatsApp chats with customers, change status (`Pending`, `Contacted`, `Completed`), or delete entries.
- ** Supabase Connected**: Pre-configured with your Supabase URL & Publishable API key.
- ** Fallback Dual Storage**: Works out of the box with LocalStorage when offline or before Supabase tables are created, and seamlessly syncs with Supabase once tables are active!

---

## 🔑 Supabase Credentials Configured

- **Supabase Project URL**: `https://vvfrvcfjokaeznhuxiox.supabase.co`
- **Publishable Key**: `sb_publishable_4LDz1rEt9MtYAnClusNgFw_d4CnkSx5`

---

## 🗄️ Supabase SQL Database Setup (1-Step Setup)

To enable permanent database storage in your Supabase account:

1. Go to your Supabase Dashboard: [https://vvfrvcfjokaeznhuxiox.supabase.co](https://vvfrvcfjokaeznhuxiox.supabase.co)
2. Open **SQL Editor** from the left sidebar.
3. Click **New Query**.
4. Copy the contents of the `schema.sql` file (or click **SQL Schema** button in the Admin Panel) and click **Run**.

---

## 📁 File Structure

```
all-marketing/
├── index.html        # Main Customer Website (Services, Pricing, Order Modal, Contact)
├── admin.html        # Admin Dashboard (Add, Edit, Remove Products & Orders)
├── schema.sql        # Supabase SQL Database Schema & Sample Data
├── css/
│   └── style.css     # Responsive modern styling, badges, modals & tables
├── js/
│   ├── supabase.js   # Supabase client setup & dual-storage DAO layer
│   ├── app.js        # Main customer website logic (search, category tabs, orders)
│   └── admin.js      # Admin portal logic (auth, CRUD operations, inquiry manager)
└── README.md         # Full User Guide
```

---

## 🔑 Admin Access Details

- **Admin Page**: Open `admin.html` in your browser or click **Admin Panel** in the website header.
- **Default Passcode**: `admin123`
