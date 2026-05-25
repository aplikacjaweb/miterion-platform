
-- Migration to add the uploads table for RFP file tracking

-- 1. Create the uploads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow service role / admin access (already handled by default for service_role)
-- But let's add an explicit policy for safety if needed for authenticated/anon.
-- For now, since we use supabaseAdmin, no extra policy is strictly required for the backend.

-- 4. Add index for performance
CREATE INDEX IF NOT EXISTS idx_uploads_lead_id ON public.uploads(lead_id);

COMMENT ON TABLE public.uploads IS 'Tracks file uploads associated with leads from the RFP form.';
