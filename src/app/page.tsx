import Link from "next/link";
import { Users, BookOpen, Calendar, Zap, ArrowRight, TriangleAlert, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-100 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-amber-400 text-gray-00 border-amber-500 mb-6">
              <TriangleAlert className="w-4 h-4 mr-2" />
              This is website is under development!
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find Your Perfect
            <span className="text-purple-600 block md:inline"> Study Group</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect with fellow students, share knowledge, and achieve academic success together. 
            Join study groups that match your subjects and schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="primary"	 className="group" asChild>
              <Link href="/groups">
                Browse Study Groups
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">
                Join Free Today
              </Link>
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Instant Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Students Choose Zeno
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find study partners and excel in your academics
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group p-6 rounded-2xl hover:bg-purple-50 transition-all duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Find Your Study Tribe</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with students who share your academic interests and learning goals in your field.
              </p>
            </div>
            <div className="text-center group p-6 rounded-2xl hover:bg-purple-50 transition-all duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Subject-Focused Groups</h3>
              <p className="text-muted-foreground leading-relaxed">
                Filter groups by subject, course level, and study preferences to find exactly what you need.
              </p>
            </div>
            <div className="text-center group p-6 rounded-2xl hover:bg-purple-50 transition-all duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Flexible Scheduling</h3>
              <p className="text-muted-foreground leading-relaxed">
                Find groups that work with your busy schedule, from daily sessions to weekend meetups.
              </p>
            </div>
            <div className="text-center group p-6 rounded-2xl hover:bg-purple-50 transition-all duration-300">
              <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-300">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Quick & Simple</h3>
              <p className="text-muted-foreground leading-relaxed">
                Intuitive interface designed for busy students. Join groups and start studying in minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl text-purple-600 md:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-foreground font-medium">Active Students</div>
            </div>
            <div>
              <div className="text-3xl text-purple-600 md:text-4xl font-bold mb-2">2,500+</div>
              <div className="text-foreground font-medium">Study Groups</div>
            </div>
            <div>
              <div className="text-3xl text-purple-600 md:text-4xl font-bold mb-2">50+</div>
              <div className="text-foreground font-medium">Subjects Covered</div>
            </div>
            <div>
              <div className="text-3xl text-purple-600 md:text-4xl font-bold mb-2">98%</div>
              <div className="text-foreground font-medium">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed text contrast */}
      <section className="bg-purple-700 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
            Ready to Start Studying Together?
          </h2>
          <p className="text-xl text-gray-100 mb-10 leading-relaxed">
            Join thousands of students who have already found their perfect study partners and improved their grades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white text-purple-600 hover:bg-gray-50 hover:text-purple-700"  
              asChild
            >
              <Link href="/signup">
                Get Started for Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}