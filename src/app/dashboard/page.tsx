"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Users, Clock, MapPin, Plus, Star, TrendingUp, BookOpen, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GroupCard from "@/components/GroupCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/lib/supabase";

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

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Business"];
const frequencies = ["All Frequencies", "Daily", "Twice weekly", "Weekly", "Bi-weekly"];

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

        // Fetch distinct active members count
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select('user_id');

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

  // Pagination calculations
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject, selectedFrequency]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Discover and join study groups that match your interests
              </p>
            </div>
            
            {/* Create Group Button */}
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

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-purple-300 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search groups, subjects, or topics..."
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

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={selectedFrequency}
                    onChange={(e) => setSelectedFrequency(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
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

        {/* Results Info */}
        {!loading && filteredGroups.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-600 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredGroups.length)} of {filteredGroups.length} groups
            </p>
            <p className="text-gray-600 text-sm mt-2 sm:mt-0">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        )}

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading study groups...</p>
          </div>
        ) : currentGroups.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      page === currentPage || 
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className="w-10 h-10 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies" 
                ? "No study groups found" 
                : "No study groups yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSubject !== "All Subjects" || selectedFrequency !== "All Frequencies"
                ? "Try adjusting your search criteria or create a new study group."
                : "Be the first to create a study group and start learning together!"}
            </p>
            <Button asChild variant="primary">
              <Link href="/create-group">
                <Plus className="h-4 w-4 mr-2" />
                Create New Group
              </Link>
            </Button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
