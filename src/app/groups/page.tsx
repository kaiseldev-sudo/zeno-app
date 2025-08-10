"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Users, Clock, MapPin, ExternalLink } from "lucide-react";
import GroupCard from "@/components/GroupCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Business", "Engineering"];
const frequencies = ["All Frequencies", "Daily", "Twice weekly", "Weekly", "Bi-weekly"];

// Interface matching GroupCard expectations
interface Group {
  id: string;
  name: string;
  subject: string;
  description: string;
  frequency: string;
  platform: string;
  members: number;
  maxMembers: number;
  schedule: string;
  tags: string[];
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch groups from Supabase
  useEffect(() => {
    async function fetchGroups() {
      try {
        const { data, error } = await supabase
          .from('study_groups')
          .select(`
            *,
            group_members(user_id),
            tags(name)
          `);

        if (error) {
          console.error('Error fetching groups:', error);
          return;
        }

        // Transform data to match GroupCard interface
        const groupsWithMembers = data?.map(group => ({
          ...group,
          members: group.group_members?.length || 0,
          maxMembers: group.max_members,
          tags: group.tags?.map((tag: any) => tag.name) || []
        })) || [];

        setGroups(groupsWithMembers);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((group: any) => {
    const matchesSearch = group.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = selectedSubject === "All Subjects" || group.subject === selectedSubject;
    const matchesFrequency = selectedFrequency === "All Frequencies" || group.frequency === selectedFrequency;
    
    return matchesSearch && matchesSubject && matchesFrequency;
  });

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Study Groups
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find and join study groups that match your interests and schedule
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search groups by name, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Frequency
                </label>
                <select
                  value={selectedFrequency}
                  onChange={(e) => setSelectedFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {frequencies.map((frequency) => (
                    <option key={frequency} value={frequency}>
                      {frequency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredGroups.length} study group{filteredGroups.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading study groups...</p>
        </div>
      ) : (
        /* Groups Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No study groups found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your search criteria or create a new study group.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
            Create New Group
          </button>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}

