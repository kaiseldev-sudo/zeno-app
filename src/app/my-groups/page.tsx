"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Users, Clock, MapPin, Plus, Settings, Crown, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface MyGroup {
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
  member_count: number;
  is_creator: boolean;
  joined_at: string;
}

export default function MyGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<MyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "created" | "joined">("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchMyGroups() {
      if (!user) return;

      try {
        // Get all groups where user is a member
        const { data, error } = await supabase
          .from('group_members')
          .select(`
            joined_at,
            study_groups (
              id,
              name,
              subject,
              description,
              frequency,
              platform,
              schedule,
              max_members,
              creator_id,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching my groups:', error);
          return;
        }

        // Transform data and add member counts
        const groupsWithCounts = await Promise.all(
          (data || []).map(async (item: any) => {
            const group = item.study_groups;
            if (!group) return null;

            // Get member count for this group
            const { count } = await supabase
              .from('group_members')
              .select('*', { count: 'exact', head: true })
              .eq('group_id', group.id);

            return {
              ...group,
              member_count: count || 0,
              is_creator: group.creator_id === user.id,
              joined_at: item.joined_at,
            } as MyGroup;
          })
        );

        const validGroups = groupsWithCounts.filter(Boolean) as MyGroup[];
        setGroups(validGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyGroups();
  }, [user]);

  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === "all" ||
      (filter === "created" && group.is_creator) ||
      (filter === "joined" && !group.is_creator);
    
    return matchesSearch && matchesFilter;
  });

  const createdGroups = groups.filter(group => group.is_creator);
  const joinedGroups = groups.filter(group => !group.is_creator);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your groups...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Study Groups
              </h1>
              <p className="text-gray-600">
                Manage and track all your study groups in one place
              </p>
            </div>
            
            <div className="mt-4 lg:mt-0 w-full lg:w-auto">
              <Button asChild variant="primary" className="w-full lg:w-auto">
                <Link href="/create-group">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="border-purple-300 hover:border-purple-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg transition-colors duration-200 group-hover:bg-purple-200">
                  <Users className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600 transition-colors duration-200">Total Groups</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 transition-colors duration-200">{groups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-300 hover:border-purple-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg transition-colors duration-200 group-hover:bg-green-200">
                  <Crown className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600 transition-colors duration-200">Groups Created</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 transition-colors duration-200">{createdGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-300 hover:border-purple-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg transition-colors duration-200 group-hover:bg-blue-200">
                  <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div className="ml-3 md:ml-4">
                  <p className="text-xs md:text-sm font-medium text-gray-600 transition-colors duration-200">Groups Joined</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900 transition-colors duration-200">{joinedGroups.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-purple-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search your groups..."
                    value={searchTerm}
                                            onChange={(e) => setSearchTerm(sanitizeInput(e.target.value, { maxLength: 100 }))}
                    className="pl-10 border-purple-300"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <Button
                variant="primary"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filter === "all" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All Groups ({groups.length})
                  </Button>
                  <Button
                    variant={filter === "created" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("created")}
                  >
                    Created by Me ({createdGroups.length})
                  </Button>
                  <Button
                    variant={filter === "joined" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setFilter("joined")}
                  >
                    Joined Groups ({joinedGroups.length})
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredGroups.map((group) => (
              <MyGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filter !== "all" 
                ? "No groups found" 
                : "You haven't joined any groups yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "Start by creating your own group or joining existing ones!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="primary">
                <Link href="/create-group">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Groups
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function MyGroupCard({ group }: { group: MyGroup }) {
  const progressPercentage = (group.member_count / group.max_members) * 100;

  return (
    <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-200 bg-white flex flex-col">
      <CardHeader className="pb-2 md:pb-3 p-4 md:p-6">
        <div className="flex justify-between items-start mb-2 md:mb-3">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs">
            {group.subject}
          </Badge>
          <div className="flex items-center gap-1 md:gap-2">
            {group.is_creator && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Crown className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Creator</span>
              </Badge>
            )}
            <div className="text-xs text-gray-500">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
        <CardTitle className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
          {group.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 md:space-y-4 pb-3 md:pb-4 flex-1 px-4 md:px-6">
        {/* Description */}
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2">
          {group.description}
        </p>

        {/* Details */}
        <div className="space-y-1 md:space-y-2">
          <div className="flex items-center text-xs md:text-sm text-gray-500">
            <Clock className="w-3 h-3 md:w-4 md:h-4 mr-2 text-purple-500 flex-shrink-0" />
            <span className="truncate">{group.frequency} • {group.schedule}</span>
          </div>
          <div className="flex items-center text-xs md:text-sm text-gray-500">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-2 text-purple-500 flex-shrink-0" />
            <span className="truncate">{group.platform}</span>
          </div>
          <div className="flex items-center text-xs md:text-sm text-gray-500">
            <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-2 text-purple-500 flex-shrink-0" />
            <span className="truncate">
              Joined {new Date(group.joined_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Members Progress */}
        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between items-center text-xs md:text-sm">
            <span className="flex items-center text-gray-700">
              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 text-purple-500" />
              {group.member_count}/{group.max_members} members
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 md:h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>

      <div className="flex gap-2 p-3 md:p-4 pt-0 mt-auto">
        <Button 
          variant="outline" 
          className="flex-1 text-purple-600 hover:bg-purple-50 hover:text-purple-700 border-purple-300 hover:border-purple-500 text-xs md:text-sm h-8 md:h-10" 
          asChild
        >
          <Link href={`/groups/${group.id}`}>
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </Link>
        </Button>
        {group.is_creator && (
          <Button 
            variant="outline" 
            className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 h-8 md:h-10 px-2 md:px-3" 
            asChild
          >
            <Link href={`/groups/${group.id}/manage`}>
              <Settings className="h-3 w-3 md:h-4 md:w-4" />
            </Link>
          </Button>
        )}
      </div>
    </Card>
  );
}