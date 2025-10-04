-- Safe update script - drops existing policies before recreating them
-- This prevents "already exists" errors

-- Drop existing policies for inquiries (if they exist)
DROP POLICY IF EXISTS "Anyone can create inquiries (including anonymous)" ON public.inquiries;
DROP POLICY IF EXISTS "Users can view their own inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Staff and admins can view all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Staff and admins can update inquiries" ON public.inquiries;

-- Drop existing policies for reviews (if they exist)
DROP POLICY IF EXISTS "Anyone can create reviews (including anonymous)" ON public.reviews;
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Staff and admins can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Staff can update assigned reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can delete reviews" ON public.reviews;

-- Create or update inquiries table with new columns
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add new columns if they don't exist (safe to run multiple times)
ALTER TABLE public.inquiries 
  ADD COLUMN IF NOT EXISTS adults INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS travel_dates TEXT,
  ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;

-- Create or update reviews table with new columns
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  tour TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add new columns to reviews if they don't exist
ALTER TABLE public.reviews 
  ADD COLUMN IF NOT EXISTS assigned_staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;

-- Create indexes (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_assigned_staff ON public.inquiries(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved_at ON public.reviews(approved_at DESC);

-- Drop existing triggers to recreate them
DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;

-- Create updated_at triggers
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Recreate RLS Policies for inquiries
CREATE POLICY "Anyone can create inquiries (including anonymous)" ON public.inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own inquiries" ON public.inquiries
  FOR SELECT USING (
    auth.uid() = user_id 
    OR user_id IS NULL
  );

CREATE POLICY "Staff and admins can view all inquiries" ON public.inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff and admins can update inquiries" ON public.inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- Recreate RLS Policies for reviews
CREATE POLICY "Anyone can create reviews (including anonymous)" ON public.reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own reviews" ON public.reviews
  FOR SELECT USING (
    auth.uid() = user_id 
    OR user_id IS NULL 
    OR status = 'approved'
  );

CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Staff and admins can view all reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Admins can update reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Staff can update assigned reviews" ON public.reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'staff'
    )
  );

CREATE POLICY "Admins can delete reviews" ON public.reviews
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Try to enable realtime (may already be enabled, ignore errors)
DO $$ 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore if already added
END $$;

DO $$ 
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore if already added
END $$;
