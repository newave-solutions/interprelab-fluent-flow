-- InterpreLink Extensions
-- Migration: Create tables for direct messaging and resource library

-- ==============================================
-- 1. Direct Messages
-- ==============================================
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL CHECK (char_length(message_text) <= 2000),
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- 2. Resource Library
-- ==============================================
CREATE TABLE IF NOT EXISTS public.resource_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (
    resource_type IN ('document', 'video', 'mock-scenario', 'article', 'guide')
  ),
  file_url TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false, -- Free tier has limited private resources
  tags TEXT[],
  downloads_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================
-- Indexes for Performance
-- ==============================================
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON public.direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON public.direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON public.direct_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_direct_messages_unread ON public.direct_messages(recipient_id, read) WHERE read = false;

CREATE INDEX IF NOT EXISTS idx_resource_library_user_id ON public.resource_library(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_library_public ON public.resource_library(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_resource_library_type ON public.resource_library(resource_type);
CREATE INDEX IF NOT EXISTS idx_resource_library_downloads ON public.resource_library(downloads_count DESC);

-- ==============================================
-- Row Level Security
-- ==============================================
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;

-- Direct Messages Policies
CREATE POLICY "Users can view messages they sent"
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can view messages they received"
  ON public.direct_messages FOR SELECT
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON public.direct_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark their received messages as read"
  ON public.direct_messages FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Resource Library Policies
CREATE POLICY "Users can view own resources"
  ON public.resource_library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public resources"
  ON public.resource_library FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can insert own resources"
  ON public.resource_library FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resources"
  ON public.resource_library FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own resources"
  ON public.resource_library FOR DELETE
  USING (auth.uid() = user_id);

-- ==============================================
-- Functions for Messaging
-- ==============================================

-- Function to mark message as read
CREATE OR REPLACE FUNCTION mark_message_read(message_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.direct_messages
  SET read = true, read_at = NOW()
  WHERE id = message_id AND recipient_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment resource downloads
CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.resource_library
  SET downloads_count = downloads_count + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- Grant Permissions
-- ==============================================
GRANT SELECT, INSERT, UPDATE ON public.direct_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resource_library TO authenticated;
GRANT EXECUTE ON FUNCTION mark_message_read TO authenticated;
GRANT EXECUTE ON FUNCTION increment_resource_downloads TO authenticated;

-- ==============================================
-- Enable Real-time
-- ==============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;

-- ==============================================
-- Comments for Documentation
-- ==============================================
COMMENT ON TABLE public.direct_messages IS 'Direct messaging system for interpreter community networking';
COMMENT ON TABLE public.resource_library IS 'Shared resources library with public/private visibility based on subscription tier';
