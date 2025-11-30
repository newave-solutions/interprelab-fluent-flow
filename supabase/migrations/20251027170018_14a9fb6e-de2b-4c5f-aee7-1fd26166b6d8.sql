-- Add RLS policies for user_roles table to allow admin role management
-- This enables admins to assign and manage user roles through the application

-- Policy: Admins can insert new role assignments
CREATE POLICY "Admins can insert roles" 
ON public.user_roles 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update existing role assignments
CREATE POLICY "Admins can update roles" 
ON public.user_roles 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete role assignments
CREATE POLICY "Admins can delete roles" 
ON public.user_roles 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create the first admin user (replace with your actual user ID after signup)
-- Uncomment and update the user_id after creating your admin account:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'admin'::app_role)
-- ON CONFLICT (user_id, role) DO NOTHING;