import { Users, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const progressPercentage = (group.members / group.maxMembers) * 100;

  return (
    <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group border border-gray-200 bg-white">
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

      <CardContent className="space-y-4 pb-4">
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {group.description}
        </p>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-purple-500" />
            <span className="truncate">{group.frequency} • {group.schedule}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-purple-500" />
            <span className="truncate">{group.platform}</span>
          </div>
        </div>

        {/* Members Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center text-gray-700">
              <Users className="w-4 h-4 mr-1 text-purple-500" />
              {group.members}/{group.maxMembers} members
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
        {group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
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
          </div>
        )}
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
        <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
          Join Group
        </Button>
      </CardFooter>
    </Card>
  );
}