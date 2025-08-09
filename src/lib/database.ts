import { supabase } from './supabase'
import type { StudyGroup, Profile, GroupMember } from './supabase'

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Study Group functions
export async function getStudyGroups(): Promise<StudyGroup[]> {
  const { data, error } = await supabase
    .from('study_groups')
    .select(`
      *,
      profiles:creator_id(name),
      group_members(count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching study groups:', error)
    return []
  }

  return data || []
}

export async function getStudyGroup(id: string): Promise<StudyGroup | null> {
  const { data, error } = await supabase
    .from('study_groups')
    .select(`
      *,
      profiles:creator_id(name, email),
      group_members(
        *,
        profiles:user_id(name, email)
      ),
      tags(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching study group:', error)
    return null
  }

  return data
}

export async function createStudyGroup(groupData: Omit<StudyGroup, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('study_groups')
    .insert(groupData)
    .select()
    .single()

  if (error) throw error

  // Add creator as admin member
  if (data) {
    await supabase
      .from('group_members')
      .insert({
        group_id: data.id,
        user_id: groupData.creator_id,
        role: 'admin'
      })
  }

  return data
}

export async function joinGroup(groupId: string, userId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: userId,
      role: 'member'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function leaveGroup(groupId: string, userId: string) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)

  if (error) throw error
}

export async function getUserGroups(userId: string): Promise<StudyGroup[]> {
  const { data, error } = await supabase
    .from('group_members')
    .select(`
      *,
      study_groups(
        *,
        profiles:creator_id(name)
      )
    `)
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user groups:', error)
    return []
  }

  return data?.map(item => item.study_groups).filter(Boolean) || []
}

// Check if user is member of group
export async function isGroupMember(groupId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('group_members')
    .select('id')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single()

  return !error && !!data
}