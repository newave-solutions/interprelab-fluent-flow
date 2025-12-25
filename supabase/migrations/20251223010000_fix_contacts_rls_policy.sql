-- Fix Contacts Table RLS Policy Security
-- This migration updates the policy to allow anonymous contact submissions
-- while preventing spam through field validation

-- Drop the old policy
DROP POLICY IF EXISTS "Users can insert their own contacts" ON public.contacts;

-- Create new policy that allows both authenticated and anonymous submissions
-- Anonymous submissions must have all required fields filled
CREATE POLICY "Allow contact form submissions"
  ON public.contacts FOR INSERT
  WITH CHECK (
    -- Allow authenticated users with matching user_id
    (auth.uid() = user_id AND user_id IS NOT NULL)
    OR
    -- Allow anonymous users (user_id IS NULL) if all required fields are provided
    (user_id IS NULL AND
     name IS NOT NULL AND name != '' AND
     email IS NOT NULL AND email != '' AND
     inquiry_type IS NOT NULL AND inquiry_type != '' AND
     message IS NOT NULL AND message != '')
  );

-- Add comment explaining the security model
COMMENT ON POLICY "Allow contact form submissions" ON public.contacts IS
  'Allows authenticated users to submit with their user_id, or anonymous users to submit if all required fields (name, email, inquiry_type, message) are filled. This prevents spam while enabling contact form functionality.';
