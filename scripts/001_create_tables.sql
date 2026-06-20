-- ============================================
-- KEKEOsafari Database Schema
-- Simple, clean, and functional database structure
-- ============================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TOURS TABLE
-- Stores all safari tour packages
-- ============================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- wildlife, adventure, culture, beach
  description TEXT NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  min_days INTEGER NOT NULL,
  max_days INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  highlights TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INQUIRIES TABLE
-- Stores customer tour inquiries and bookings
-- ============================================
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  tour_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT,
  start_date DATE,
  num_days INTEGER,
  num_adults INTEGER DEFAULT 1,
  num_children INTEGER DEFAULT 0,
  total_price DECIMAL(10,2),
  special_requests TEXT,
  status TEXT DEFAULT 'pending', -- pending, contacted, confirmed, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- Stores customer reviews and testimonials
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_country TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  review_text TEXT NOT NULL,
  tour_date DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLOG POSTS TABLE
-- Stores safari blog articles
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- wildlife, travel-tips, conservation, culture
  author TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONTACT MESSAGES TABLE
-- Stores general contact form submissions
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- unread, read, responded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- EMAIL SUBSCRIBERS TABLE
-- Stores newsletter subscribers
-- ============================================
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_tours_category ON tours(category);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);
CREATE INDEX IF NOT EXISTS idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX IF NOT EXISTS idx_reviews_featured ON reviews(is_featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Public read access for tours
CREATE POLICY "Anyone can view published tours" ON tours
  FOR SELECT USING (true);

-- Public read access for approved reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews
  FOR SELECT USING (is_approved = true);

-- Public read access for published blog posts
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (is_published = true);

-- Anyone can submit inquiries
CREATE POLICY "Anyone can submit inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

-- Anyone can submit reviews (pending approval)
CREATE POLICY "Anyone can submit reviews" ON reviews
  FOR INSERT WITH CHECK (true);

-- Anyone can submit contact messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Anyone can subscribe to newsletter
CREATE POLICY "Anyone can subscribe" ON email_subscribers
  FOR INSERT WITH CHECK (true);
