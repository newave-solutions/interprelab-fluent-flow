-- Drop the existing public policy that exposes content to everyone
DROP POLICY IF EXISTS "Anyone can view active modules" ON public.study_modules;

-- Create a new policy that requires authentication to view modules
CREATE POLICY "Authenticated users can view active modules" 
ON public.study_modules 
FOR SELECT 
TO authenticated
USING (is_active = true);