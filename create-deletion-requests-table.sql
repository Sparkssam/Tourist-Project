-- Create deletion_requests table for staff to request inquiry deletions
-- Admin must approve before actual deletion occurs

CREATE TABLE IF NOT EXISTS public.deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON public.deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_inquiry_id ON public.deletion_requests(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_requested_by ON public.deletion_requests(requested_by);

-- Enable RLS
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Staff can view their own deletion requests
CREATE POLICY "Staff can view their own deletion requests"
  ON public.deletion_requests
  FOR SELECT
  USING (
    auth.uid() = requested_by
    OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Staff can create deletion requests
CREATE POLICY "Staff can create deletion requests"
  ON public.deletion_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = requested_by
    AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- Only admins can update deletion requests (approve/reject)
CREATE POLICY "Admins can update deletion requests"
  ON public.deletion_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_deletion_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_deletion_requests_updated_at_trigger ON public.deletion_requests;

CREATE TRIGGER update_deletion_requests_updated_at_trigger
  BEFORE UPDATE ON public.deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_deletion_requests_updated_at();
