-- Storage buckets setup for InterpreLab platform

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('user-uploads', 'user-uploads', false, 52428800, ARRAY['image/*', 'application/pdf', 'audio/*', 'video/*']),
  ('study-materials', 'study-materials', true, 52428800, ARRAY['image/*', 'application/pdf', 'text/*']),
  ('flashcard-media', 'flashcard-media', true, 10485760, ARRAY['image/*', 'audio/*']),
  ('call-recordings', 'call-recordings', false, 104857600, ARRAY['audio/*', 'video/*'])
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for user-uploads bucket
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-uploads' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for study-materials bucket (public read)
CREATE POLICY "Anyone can view study materials"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'study-materials');

CREATE POLICY "Authenticated users can upload study materials"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'study-materials');

-- Set up storage policies for flashcard-media bucket (public read)
CREATE POLICY "Anyone can view flashcard media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'flashcard-media');

CREATE POLICY "Authenticated users can upload flashcard media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'flashcard-media');

-- Set up storage policies for call-recordings bucket (private)
CREATE POLICY "Users can upload their own call recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'call-recordings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own call recordings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'call-recordings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own call recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'call-recordings' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
