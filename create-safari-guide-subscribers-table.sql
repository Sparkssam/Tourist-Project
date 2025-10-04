-- Create table for safari guide subscribers
CREATE TABLE IF NOT EXISTS public.safari_guide_subscribers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL UNIQUE,
    subscribed_at timestamptz DEFAULT now() NOT NULL,
    source text DEFAULT 'home_page_lead_magnet',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_safari_guide_subscribers_email 
ON public.safari_guide_subscribers(email);

-- Create index for date filtering
CREATE INDEX IF NOT EXISTS idx_safari_guide_subscribers_subscribed_at 
ON public.safari_guide_subscribers(subscribed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.safari_guide_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for public form submissions)
DROP POLICY IF EXISTS "Allow anonymous inserts for safari guide subscribers" ON public.safari_guide_subscribers;
CREATE POLICY "Allow anonymous inserts for safari guide subscribers"
ON public.safari_guide_subscribers
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access to safari guide subscribers" ON public.safari_guide_subscribers;
CREATE POLICY "Allow service role full access to safari guide subscribers"
ON public.safari_guide_subscribers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Allow admins to view all subscribers
DROP POLICY IF EXISTS "Allow admins to view safari guide subscribers" ON public.safari_guide_subscribers;
CREATE POLICY "Allow admins to view safari guide subscribers"
ON public.safari_guide_subscribers
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_safari_guide_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS safari_guide_subscribers_updated_at ON public.safari_guide_subscribers;
CREATE TRIGGER safari_guide_subscribers_updated_at
    BEFORE UPDATE ON public.safari_guide_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_safari_guide_subscribers_updated_at();

-- Enable realtime (optional - if you want real-time updates in admin dashboard)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.safari_guide_subscribers;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

-- Grant permissions
GRANT SELECT ON public.safari_guide_subscribers TO authenticated;
GRANT INSERT ON public.safari_guide_subscribers TO anon;
GRANT ALL ON public.safari_guide_subscribers TO service_role;

COMMENT ON TABLE public.safari_guide_subscribers IS 'Stores email addresses of users who requested the free safari planning guide';
COMMENT ON COLUMN public.safari_guide_subscribers.email IS 'Subscriber email address';
COMMENT ON COLUMN public.safari_guide_subscribers.subscribed_at IS 'When the user subscribed';
COMMENT ON COLUMN public.safari_guide_subscribers.source IS 'Where the subscription came from (e.g., home_page_lead_magnet)';
