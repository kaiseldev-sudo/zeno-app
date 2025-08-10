import { Users, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
}

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [memberCount, setMemberCount] = useState(group.members);
  const progressPercentage = (memberCount / group.maxMembers) * 100;

  // Check if user is already a member
  useEffect(() => {
    async function checkMembership() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('group_members')
          .select('id')
          .eq('group_id', group.id)
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          setIsJoined(true);
        }
      } catch (error) {
        // User is not a member, which is fine
        setIsJoined(false);
      }
    }

    checkMembership();
  }, [user, group.id]);

  const handleJoinGroup = async () => {
    if (!user) return;
    
    setIsJoining(true);
    
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          joined_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error joining group:', error);
        alert('Failed to join group. Please try again.');
        return;
      }

      setIsJoined(true);
      setMemberCount(prev => prev + 1);
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-200 bg-white flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
            {group.subject}
          </Badge>
          <div className="text-xs text-gray-500">
            {Math.round(progressPercentage)}% full
          </div>
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
          {group.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pb-4 flex-1">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {group.description || "No description available."}
        </p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-purple-500" />
            <span className="truncate">
              {group.frequency || "Not specified"} • {group.schedule || "Schedule TBD"}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
            <span className="truncate">{group.platform || "Platform TBD"}</span>
          </div>
        </div>

        {/* Members Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-1 text-purple-500" />
              {memberCount}/{group.maxMembers} members
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
          {group.tags && group.tags.length > 0 ? (
            <>
              {group.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                  {tag}
                </Badge>
              ))}
              {group.tags.length > 2 && (
                <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
                  +{group.tags.length - 2}
                </Badge>
              )}
            </>
          ) : (
            <div className="text-xs text-gray-400 italic">No tags</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button 
          variant="outline" 
          className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300" 
          asChild
        >
          <Link href={`/groups/${group.id}`}>
            View Details
          </Link>
        </Button>
        <Button 
          className={`flex-1 shadow-sm ${
            isJoined 
              ? "bg-purple-600 hover:bg-purple-700 text-white cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          onClick={isJoined ? undefined : handleJoinGroup}
          disabled={isJoining || isJoined || memberCount >= group.maxMembers}
        >
          {isJoining ? "Joining..." : isJoined ? "Joined" : memberCount >= group.maxMembers ? "Full" : "Join Group"}
        </Button>
      </CardFooter>
    </Card>
  );
}