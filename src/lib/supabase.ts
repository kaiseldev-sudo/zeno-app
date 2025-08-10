import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Get the base URL for redirects
export const getBaseUrl = () => {
  // For production, use the environment variable or fallback to the deployed domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // For production deployment, use the known domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://zeno-study.vercel.app';
  }
  
  // For development, check for custom port
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for development
  return 'http://localhost:3000';
}

// Utility function to safely get current session
export const safeGetSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session retrieval error:', error);
      return { session: null, error };
    }
    return { session, error: null };
  } catch (error) {
    console.error('Failed to get session:', error);
    return { session: null, error };
  }
}

// Utility function to safely sign out
export const safeSignOut = async () => {
  try {
    const { session } = await safeGetSession();
    if (session) {
      const { error } = await supabase.auth.signOut();
      return { error };
    }
    return { error: null };
  } catch (error) {
    console.error('Safe sign out error:', error);
    return { error };
  }
}

// Types for our database tables
export type Profile = {
  id: string
  email: string
  name: string
  course: string
  year_level: string
  bio?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export type StudyGroup = {
  id: string
  name: string
  subject: string
  description: string
  frequency: string
  platform: string
  schedule: string
  max_members: number
  creator_id: string
  created_at: string
  updated_at: string
}

export type GroupMember = {
  id: string
  group_id: string
  user_id: string
  joined_at: string
  role: 'member' | 'admin' | 'moderator'
}

export type SocialContact = {
  id: string
  user_id: string
  platform: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Messenger'
  username: string
  url?: string
  created_at: string
  updated_at: string
}

export type Tag = {
  id: string
  name: string
  color: string
}

export type GroupTag = {
  id: string
  group_id: string
  tag_id: string
}