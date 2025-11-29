-- Create storage bucket for AI-generated images
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-images', 'generated-images', true);

-- Allow public read access to generated images
CREATE POLICY "Allow public read access to generated images"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-images');

-- Allow service role to insert images
CREATE POLICY "Allow service role to insert generated images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-images');