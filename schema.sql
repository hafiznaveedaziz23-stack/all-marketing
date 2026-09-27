-- =========================================================
-- ALL MARKETING - SUPABASE DATABASE SCHEMA
-- Copy and paste this script into your Supabase SQL Editor:
-- https://vvfrvcfjokaeznhuxiox.supabase.co -> SQL Editor -> New Query -> Run
-- =========================================================

-- 1. Create Products / Services Table
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

-- 2. Create Inquiries / Orders Table
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

-- 3. Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (Allow full read/write access with publishable key)
DROP POLICY IF EXISTS "Public Select Products" ON products;
CREATE POLICY "Public Select Products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Products" ON products;
CREATE POLICY "Public Insert Products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Products" ON products;
CREATE POLICY "Public Update Products" ON products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Products" ON products;
CREATE POLICY "Public Delete Products" ON products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public Select Inquiries" ON inquiries;
CREATE POLICY "Public Select Inquiries" ON inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Inquiries" ON inquiries;
CREATE POLICY "Public Insert Inquiries" ON inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Inquiries" ON inquiries;
CREATE POLICY "Public Update Inquiries" ON inquiries FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Inquiries" ON inquiries;
CREATE POLICY "Public Delete Inquiries" ON inquiries FOR DELETE USING (true);

-- 5. Insert Sample Marketing Products / Services
INSERT INTO products (title, category, price, original_price, description, features, image_url, badge, is_featured) VALUES
(
  'Social Media Marketing Starter', 
  'Social Media', 
  15000, 
  22000, 
  'Complete 30-day social media management for Instagram & Facebook with high engaging posts.', 
  '["15 Custom Graphical Posts", "5 Engaging Reels/Shorts", "Page Setup & Optimization", "Hashtag Strategy & Growth", "Monthly Analytics Report"]'::jsonb, 
  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80', 
  'Popular', 
  true
),
(
  'Google Ads & PPC Campaign', 
  'Paid Ads', 
  25000, 
  35000, 
  'Drive instant leads and sales with targeted Google Search & Display Ads campaigns.', 
  '["Keyword Research & Strategy", "Ad Copywriting & Design", "Conversion Tracking Setup", "A/B Testing & Optimization", "Weekly Performance Reports"]'::jsonb, 
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 
  'High ROI', 
  true
),
(
  'Complete SEO Ranking Package', 
  'SEO', 
  30000, 
  45000, 
  'Rank #1 on Google Search for top keywords in your industry with white-hat SEO.', 
  '["Full Technical Audit", "On-Page Keyword Optimization", "High Authority Backlinks", "Google My Business SEO", "Monthly Ranking Reports"]'::jsonb, 
  'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=600&q=80', 
  'Best Seller', 
  true
),
(
  'Full Brand Identity & Design', 
  'Branding', 
  20000, 
  30000, 
  'Establish a modern, luxury brand look with professional logos, colors, and marketing kits.', 
  '["3 Unique Logo Concepts", "Color Palette & Typography", "Business Card & Letterhead", "Social Media Banners", "Brand Style Guidelines PDF"]'::jsonb, 
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80', 
  'Creative', 
  false
),
(
  'E-Commerce Growth Bundle', 
  'Full Marketing', 
  55000, 
  80000, 
  'All-in-one marketing solution for online stores to scale sales on Meta, Google & TikTok.', 
  '["Meta (FB/IG) Ads Management", "Google Shopping & Search Ads", "TikTok Ads Creation", "Sales Funnel & Email Sequence", "Dedicated Account Manager"]'::jsonb, 
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80', 
  'Ultimate', 
  true
),
(
  'Video Editing & Reels Pack', 
  'Content Creation', 
  18000, 
  25000, 
  'Viral video editing for TikTok, Instagram Reels, and YouTube Shorts with motion graphics.', 
  '["10 Short Video Edits (Up to 60s)", "Subtitles & Sound Effects", "Trending Audio Matching", "Thumbnail Design Included", "4K High Quality Export"]'::jsonb, 
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80', 
  'Trending', 
  false
);
