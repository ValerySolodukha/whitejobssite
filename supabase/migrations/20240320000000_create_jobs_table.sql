-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TABLE IF EXISTS public.site_content CASCADE;

-- Create jobs table with built-in permissions
CREATE TABLE public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    apply_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create site_content table with built-in permissions
CREATE TABLE public.site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions
GRANT ALL ON public.jobs TO authenticated;
GRANT ALL ON public.site_content TO authenticated;
GRANT ALL ON public.jobs TO service_role;
GRANT ALL ON public.site_content TO service_role;

-- Create indexes for text search
CREATE INDEX jobs_title_idx ON public.jobs USING GIN (to_tsvector('simple', title));
CREATE INDEX jobs_description_idx ON public.jobs USING GIN (to_tsvector('simple', description));
CREATE INDEX jobs_category_idx ON public.jobs USING GIN (to_tsvector('simple', category));
CREATE INDEX jobs_location_idx ON public.jobs USING GIN (to_tsvector('simple', location));

-- Insert default content
INSERT INTO public.site_content (page_name, content, created_by, updated_by)
VALUES 
    ('home', 'ברוכים הבאים לאתר הדרושים שלנו', auth.uid(), auth.uid()),
    ('about', 'אודות האתר', auth.uid(), auth.uid()),
    ('contact', 'צור קשר', auth.uid(), auth.uid())
ON CONFLICT (page_name) DO NOTHING; 