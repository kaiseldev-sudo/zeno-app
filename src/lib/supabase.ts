import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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