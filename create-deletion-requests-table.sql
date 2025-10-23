-- Create deletion_requests table for staff deletion approvals
-- When staff deletes an inquiry, it's marked for deletion and admin must approve
-- If admin denies, the inquiry remains active and staff must deal with it

CREATE TABLE IF NOT EXISTS public.deletion_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  deleted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, denied
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  denial_reason TEXT, -- Reason why admin denied the deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a status column to inquiries to track pending deletions
ALTER TABLE public.inquiries 
  ADD COLUMN IF NOT EXISTS deletion_status TEXT DEFAULT 'active'; -- active, pending_deletion, deleted

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deletion_requests_status ON public.deletion_requests(status);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_inquiry_id ON public.deletion_requests(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_deletion_requests_deleted_by ON public.deletion_requests(deleted_by);
CREATE INDEX IF NOT EXISTS idx_inquiries_deletion_status ON public.inquiries(deletion_status);

-- Enable RLS
ALTER TABLE public.deletion_requests ENABLE ROW LEVEL SECURITY;

-- Staff can view their own deletion requests and pending ones
CREATE POLICY "Staff can view deletion requests"
  ON public.deletion_requests
  FOR SELECT
  USING (
    auth.uid() = deleted_by
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
    auth.uid() = deleted_by
    AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('staff', 'admin')
    )
  );

-- Only admins can update deletion requests (approve/deny)
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
