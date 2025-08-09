"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, MapPin, Calendar, UserPlus, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

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

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

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

        console.log('Fetched group data:', data);
        console.log('Creator data:', data?.creator);
        setGroup(data);
      } catch (err) {
        console.error('Error:', err);
        setError("Failed to load group details");
      } finally {
        setLoading(false);
      }
    }

    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  const handleJoinGroup = async () => {
    if (!user || !group) return;

    try {
      setJoining(true);
      setError("");

      // Check if user is already a member
      const isAlreadyMember = group.group_members.some(
        member => member.user_id === user.id
      );

      if (isAlreadyMember) {
        setError("You are already a member of this group");
        return;
      }

      // Check if group is full
      if (group.group_members.length >= group.max_members) {
        setError("This group is already full");
        return;
      }

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id
        });

      if (joinError) {
        console.error('Error joining group:', joinError);
        setError(joinError.message || "Failed to join group");
        return;
      }

      // Refresh group data
      window.location.reload();
    } catch (err) {
      console.error('Error:', err);
      setError("Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  const isCreator = user && group && group.creator_id === user.id;
  const isMember = user && group && group.group_members.some(
    member => member.user_id === user.id
  );
  const isFull = group && group.group_members.length >= group.max_members;

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

  if (error || !group) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Group not found"}
            </h2>
            <Button onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <Badge className="mb-3 bg-purple-100 text-purple-800 hover:bg-purple-200">
                {group.subject}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {group.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {group.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isMember && !isFull && (
                <Button
                  onClick={handleJoinGroup}
                  disabled={joining}
                  variant="primary"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {joining ? "Joining..." : "Join Group"}
                </Button>
              )}

              {isCreator && (
                <Button variant="outline" asChild>
                  <Link href={`/groups/${group.id}/manage`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Group
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Details */}
            <Card>
              <CardHeader>
                <CardTitle>Group Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Frequency</p>
                      <p className="text-sm text-gray-600">{group.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Schedule</p>
                      <p className="text-sm text-gray-600">{group.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Platform</p>
                      <p className="text-sm text-gray-600">{group.platform}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Members</p>
                      <p className="text-sm text-gray-600">
                        {group.group_members.length}/{group.max_members} members
                      </p>
                    </div>
                  </div>
                </div>

                {/* Creator Information */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {group.creator?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Created by {group.creator?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.creator?.course} • {group.creator?.year_level}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Members List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Members ({group.group_members.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {group.group_members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {member.profiles?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.profiles?.name || 'Unknown'}
                          {member.user_id === group.creator_id && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Creator
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.profiles?.course} • {member.profiles?.year_level}
                        </p>
                      </div>
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

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Group Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Members</span>
                    <span>{group.group_members.length}/{group.max_members}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${(group.group_members.length / group.max_members) * 100}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {isFull ? "Group is full!" : `${group.max_members - group.group_members.length} spots remaining`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}