"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Users, Trash2, UserMinus, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

interface GroupMember {
  id: string;
  user_id: string;
  joined_at: string;
  profiles: {
    name: string;
    email: string;
    course: string;
    year_level: string;
  };
}

interface GroupDetails {
  id: string;
  name: string;
  subject: string;
  description: string;
  frequency: string;
  platform: string;
  schedule: string;
  max_members: number;
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
    email: string;
    course: string;
    year_level: string;
  };
  group_members: GroupMember[];
}

export default function ManageGroupPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_members: "",
  });

  // Calculate if deletion should be disabled (1 day before event)
  const isDeleteDisabled = () => {
    if (!group?.schedule) return false;
    
    try {
      // Parse schedule format: "Mon/Wed 7:00 PM - 9:00 PM" or "Thu/Fri 17:00 - 18:00"
      const scheduleMatch = group.schedule.match(/^([A-Za-z/]+)\s+(\d{1,2}):(\d{2})/);
      if (!scheduleMatch) return false;

      const [, daysStr, hours, minutes] = scheduleMatch;
      const days = daysStr.split('/');
      
      // Convert day abbreviations to numbers (0 = Sunday, 1 = Monday, etc.)
      const dayMap: { [key: string]: number } = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
      };
      
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Find the next occurrence of any scheduled day
      let nextEventDate: Date | null = null;
      
      for (const dayAbbr of days) {
        const dayKey = dayAbbr.toLowerCase().substring(0, 3);
        const targetDay = dayMap[dayKey];
        
        if (targetDay !== undefined) {
          // Calculate days until this scheduled day
          let daysUntil = targetDay - currentDay;
          if (daysUntil < 0) daysUntil += 7; // Next week
          
          // If it's today, check if the time has passed
          if (daysUntil === 0) {
            const eventTime = parseInt(hours) * 60 + parseInt(minutes);
            if (currentTime >= eventTime) {
              daysUntil = 7; // Next week's occurrence
            }
          }
          
          const eventDate = new Date(now);
          eventDate.setDate(now.getDate() + daysUntil);
          eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (!nextEventDate || eventDate < nextEventDate) {
            nextEventDate = eventDate;
          }
        }
      }
      
      if (nextEventDate) {
        const timeDiff = nextEventDate.getTime() - now.getTime();
        const hoursUntil = timeDiff / (1000 * 60 * 60);
        return hoursUntil <= 24; // Disable if 24 hours or less
      }
      
      return false;
    } catch (error) {
      console.error('Error parsing schedule:', error);
      return false;
    }
  };

  const getNextEventInfo = () => {
    if (!group?.schedule) return null;
    
    try {
      const scheduleMatch = group.schedule.match(/^([A-Za-z/]+)\s+(\d{1,2}):(\d{2})/);
      if (!scheduleMatch) return null;

      const [, daysStr, hours, minutes] = scheduleMatch;
      const days = daysStr.split('/');
      
      const dayMap: { [key: string]: number } = {
        'sun': 0, 'mon': 1, 'tue': 2, 'wed': 3, 'thu': 4, 'fri': 5, 'sat': 6
      };
      
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      let nextEventDate: Date | null = null;
      
      for (const dayAbbr of days) {
        const dayKey = dayAbbr.toLowerCase().substring(0, 3);
        const targetDay = dayMap[dayKey];
        
        if (targetDay !== undefined) {
          let daysUntil = targetDay - currentDay;
          if (daysUntil < 0) daysUntil += 7;
          
          if (daysUntil === 0) {
            const eventTime = parseInt(hours) * 60 + parseInt(minutes);
            if (currentTime >= eventTime) {
              daysUntil = 7;
            }
          }
          
          const eventDate = new Date(now);
          eventDate.setDate(now.getDate() + daysUntil);
          eventDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
          
          if (!nextEventDate || eventDate < nextEventDate) {
            nextEventDate = eventDate;
          }
        }
      }
      
      if (nextEventDate) {
        const timeDiff = nextEventDate.getTime() - now.getTime();
        const hoursUntil = Math.ceil(timeDiff / (1000 * 60 * 60));
        return {
          date: nextEventDate,
          hoursUntil,
          isWithin24Hours: hoursUntil <= 24
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error calculating next event:', error);
      return null;
    }
  };

  const groupId = params.id as string;

  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        const { data, error } = await supabase
          .from('study_groups')
          .select(`
            *,
            creator:profiles!creator_id (
              name,
              email,
              course,
              year_level
            ),
            group_members (
              id,
              user_id,
              joined_at,
              profiles (
                name,
                email,
                course,
                year_level
              )
            )
          `)
          .eq('id', groupId)
          .single();

        if (error) {
          console.error('Error fetching group:', error);
          setError("Group not found");
          return;
        }

        // Check if user is the creator
        if (data.creator_id !== user?.id) {
          setError("You don't have permission to manage this group");
          return;
        }

        setGroup(data);
        setFormData({
          name: data.name,
          description: data.description,
          max_members: data.max_members.toString(),
        });
      } catch (err) {
        console.error('Error:', err);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    }

    if (groupId && user) {
      fetchGroupDetails();
    }
  }, [groupId, user]);

  const handleSaveBasic = async () => {
    try {
      setSaving(true);
      setError("");

      const { error } = await supabase
        .from('study_groups')
        .update({
          name: formData.name,
          description: formData.description,
          max_members: parseInt(formData.max_members),
        })
        .eq('id', groupId);

      if (error) {
        throw error;
      }

      setSuccess("Group updated successfully!");
      setEditingBasic(false);
      
      // Refresh group data
      if (group) {
        setGroup({
          ...group,
          name: formData.name,
          description: formData.description,
          max_members: parseInt(formData.max_members),
        });
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error('Error updating group:', err);
      setError(err.message || "Failed to update group");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (memberUserId === user?.id) {
      setError("You cannot remove yourself as the creator");
      return;
    }

    try {
      setError("");
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        throw error;
      }

      // Update local state
      if (group) {
        setGroup({
          ...group,
          group_members: group.group_members.filter(member => member.id !== memberId)
        });
      }

      setSuccess("Member removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error('Error removing member:', err);
      setError(err.message || "Failed to remove member");
    }
  };

  const handleDeleteGroup = async () => {
    // Check if deletion is disabled due to upcoming event
    if (isDeleteDisabled()) {
      const nextEvent = getNextEventInfo();
      setError(`Cannot delete group - next session is in ${nextEvent?.hoursUntil} hours. Groups cannot be deleted within 24 hours of a scheduled session.`);
      return;
    }

    if (!confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      
      // Delete group members first
      await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);

      // Delete the group
      const { error } = await supabase
        .from('study_groups')
        .delete()
        .eq('id', groupId);

      if (error) {
        throw error;
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error('Error deleting group:', err);
      setError(err.message || "Failed to delete group");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading group details...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !group) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!group) return null;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push(`/groups/${groupId}`)}
            className="mb-4 flex items-center bg-transparent hover:bg-transparent cursor-pointer shadow-none text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Group Details
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manage Group
              </h1>
              <p className="text-gray-600">
                Manage your study group settings and members
              </p>
            </div>
            <Badge className="bg-red-100 text-red-800 border-red-200">
              Creator Access
            </Badge>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Basic Information</CardTitle>
                  {!editingBasic ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBasic(true)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingBasic(false);
                          setFormData({
                            name: group.name,
                            description: group.description,
                            max_members: group.max_members.toString(),
                          });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveBasic}
                        disabled={saving}
                        variant="primary"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingBasic ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group Name
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Enter group name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        rows={3}
                        placeholder="Enter group description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Members
                      </label>
                      <Input
                        type="number"
                        value={formData.max_members}
                        onChange={(e) => setFormData({...formData, max_members: e.target.value})}
                        min="2"
                        max="50"
                        placeholder="Maximum number of members"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <p className="text-gray-600 mt-1">{group.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Subject:</span>
                        <span className="ml-2 text-gray-600">{group.subject}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Max Members:</span>
                        <span className="ml-2 text-gray-600">{group.max_members}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Frequency:</span>
                        <span className="ml-2 text-gray-600">{group.frequency}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Platform:</span>
                        <span className="ml-2 text-gray-600">{group.platform}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Member Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Member Management ({group.group_members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.group_members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {member.profiles?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.profiles?.name || 'Unknown'}
                            {member.user_id === group.creator_id && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Creator
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.profiles?.course} • {member.profiles?.year_level}
                          </p>
                          <p className="text-xs text-gray-400">
                            Joined {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {member.user_id !== group.creator_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id, member.user_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  {group.group_members.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No members yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delete Group</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Permanently delete this group and remove all members. This action cannot be undone.
                    </p>
                    
                    {/* Show warning if deletion is disabled */}
                    {isDeleteDisabled() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">
                              Deletion Temporarily Disabled
                            </h3>
                            <div className="mt-1 text-sm text-yellow-700">
                              <p>
                                Cannot delete group within 24 hours of a scheduled session.
                                {(() => {
                                  const nextEvent = getNextEventInfo();
                                  return nextEvent ? (
                                    <> Next session is in {nextEvent.hoursUntil} hour{nextEvent.hoursUntil !== 1 ? 's' : ''}.</>
                                  ) : null;
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={handleDeleteGroup}
                      disabled={isDeleteDisabled()}
                      className={`w-full ${
                        isDeleteDisabled() 
                          ? "text-gray-400 border-gray-300 cursor-not-allowed" 
                          : "text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Group
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
