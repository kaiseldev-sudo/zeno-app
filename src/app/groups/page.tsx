"use client";

import { useState } from "react";
import { Search, Filter, Users, Clock, MapPin, ExternalLink } from "lucide-react";
import GroupCard from "@/components/GroupCard";
import ProtectedRoute from "@/components/ProtectedRoute";

// Mock data for study groups
const mockGroups = [
  {
    id: 1,
    name: "Advanced Calculus Study Circle",
    subject: "Mathematics",
    description: "Weekly calculus problem-solving sessions with focus on derivatives and integrals.",
    frequency: "Twice weekly",
    platform: "Discord + Meet",
    members: 8,
    maxMembers: 12,
    schedule: "Mon/Wed 7:00 PM",
    tags: ["Calculus", "Problem Solving", "Derivatives"],
  },
  {
    id: 2,
    name: "React Development Bootcamp",
    subject: "Computer Science",
    description: "Learn React fundamentals through hands-on projects and peer programming.",
    frequency: "Daily",
    platform: "Zoom",
    members: 15,
    maxMembers: 20,
    schedule: "Daily 6:00 PM",
    tags: ["React", "JavaScript", "Web Development"],
  },
  {
    id: 3,
    name: "Organic Chemistry Lab Prep",
    subject: "Chemistry",
    description: "Prepare for organic chemistry labs and review reaction mechanisms.",
    frequency: "Weekly",
    platform: "Google Meet",
    members: 6,
    maxMembers: 10,
    schedule: "Saturdays 2:00 PM",
    tags: ["Organic Chemistry", "Lab Prep", "Mechanisms"],
  },
  {
    id: 4,
    name: "Data Structures & Algorithms",
    subject: "Computer Science",
    description: "Master coding interviews and competitive programming together.",
    frequency: "Twice weekly",
    platform: "Discord",
    members: 12,
    maxMembers: 15,
    schedule: "Tue/Thu 8:00 PM",
    tags: ["Algorithms", "Data Structures", "Coding Interview"],
  },
  {
    id: 5,
    name: "Business Analytics Study Group",
    subject: "Business",
    description: "Analyze case studies and work on business strategy projects collaboratively.",
    frequency: "Weekly",
    platform: "Teams",
    members: 9,
    maxMembers: 12,
    schedule: "Sundays 3:00 PM",
    tags: ["Analytics", "Case Studies", "Strategy"],
  },
  {
    id: 6,
    name: "Physics Problem Solvers",
    subject: "Physics",
    description: "Tackle challenging physics problems from mechanics to quantum physics.",
    frequency: "Twice weekly",
    platform: "Zoom",
    members: 7,
    maxMembers: 10,
    schedule: "Mon/Fri 5:00 PM",
    tags: ["Physics", "Problem Solving", "Mechanics"],
  },
];

const subjects = ["All Subjects", "Computer Science", "Mathematics", "Physics", "Chemistry", "Business", "Engineering"];
const frequencies = ["All Frequencies", "Daily", "Twice weekly", "Weekly", "Bi-weekly"];

export default function Groups() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedFrequency, setSelectedFrequency] = useState("All Frequencies");
  const [showFilters, setShowFilters] = useState(false);

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredGroups.length} study group{filteredGroups.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {/* No Results */}
      {filteredGroups.length === 0 && (
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

