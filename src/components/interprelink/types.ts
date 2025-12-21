export interface Post {
  id: string;
  content: string;
  created_at: string;
  media_url?: string;
  media_type?: string;
  tags?: string[];
  user_id: string;
}
