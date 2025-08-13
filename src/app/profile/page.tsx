"use client";

import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Save, Edit3, X, Plus, Trash2, MessageSquare, Phone, Facebook, Instagram, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase, type SocialContact } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { sanitizePassword, sanitizeName, sanitizeCourse, sanitizeYearLevel } from "@/lib/inputSanitization";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  course: string;
  year_level: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Using SocialContact type from supabase.ts

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [socialContacts, setSocialContacts] = useState<SocialContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [addingSocial, setAddingSocial] = useState(false);
  const [deletingContact, setDeletingContact] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [basicForm, setBasicForm] = useState({
    name: "",
    course: "",
    year_level: "",
    bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [socialForm, setSocialForm] = useState({
    platform: "",
    username: "",
    url: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const socialPlatforms = [
    { name: "WhatsApp", icon: Phone, placeholder: "Phone number", urlPrefix: "https://wa.me/" },
    { name: "Instagram", icon: Instagram, placeholder: "@username", urlPrefix: "https://instagram.com/" },
    { name: "Facebook", icon: Facebook, placeholder: "Facebook URL or username", urlPrefix: "https://facebook.com/" },
    { name: "Messenger", icon: MessageSquare, placeholder: "Messenger username", urlPrefix: "https://m.me/" },
  ];

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError("Failed to load profile");
          return;
        }

        setProfile(profileData);
        setBasicForm({
          name: profileData.name || "",
          course: profileData.course || "",
          year_level: profileData.year_level || "",
          bio: profileData.bio || "",
        });

        // Fetch social contacts
        const { data: socialData, error: socialError } = await supabase
          .from('social_contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (socialError) {
          console.error('Error fetching social contacts:', socialError);
        } else {
          setSocialContacts(socialData || []);
        }

      } catch (err) {
        console.error('Error:', err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleSaveBasic = async () => {
    try {
      setSaving(true);
      setError("");

      const { error } = await supabase
        .from('profiles')
        .update({
          name: basicForm.name,
          course: basicForm.course,
          year_level: basicForm.year_level,
          bio: basicForm.bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      setSuccess("Profile updated successfully!");
      setEditingBasic(false);
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          name: basicForm.name,
          course: basicForm.course,
          year_level: basicForm.year_level,
          bio: basicForm.bio,
          updated_at: new Date().toISOString(),
        });
      }

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      setError("");

      if (passwordForm.new_password !== passwordForm.confirm_password) {
        throw new Error("New passwords don't match");
      }

      if (passwordForm.new_password.length < 6) {
        throw new Error("New password must be at least 6 characters");
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password
      });

      if (error) {
        throw error;
      }

      setSuccess("Password changed successfully!");
      setEditingPassword(false);
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocial = async () => {
    try {
      if (!socialForm.platform || !socialForm.username) {
        setError("Please fill in both platform and username");
        return;
      }

      if (!user) {
        setError("You must be logged in to add social contacts");
        return;
      }

      setError("");
      const platform = socialPlatforms.find(p => p.name === socialForm.platform);
      const url = socialForm.url || (platform ? platform.urlPrefix + socialForm.username.replace('@', '') : '');

      const { data, error } = await supabase
        .from('social_contacts')
        .insert({
          user_id: user.id,
          platform: socialForm.platform as 'WhatsApp' | 'Instagram' | 'Facebook' | 'Messenger',
          username: socialForm.username,
          url: url,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding social contact:', error);
        if (error.code === '23505') { // Unique constraint violation
          setError("You already have this contact added");
        } else {
          setError("Failed to add social contact");
        }
        return;
      }

      // Add to local state
      setSocialContacts([data, ...socialContacts]);
      setSocialForm({ platform: "", username: "", url: "" });
      setAddingSocial(false);
      setSuccess("Social contact added successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err: any) {
      console.error('Error adding social contact:', err);
      setError(err.message || "Failed to add social contact");
    }
  };

  const handleRemoveSocial = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('social_contacts')
        .delete()
        .eq('id', contactId)
        .eq('user_id', user?.id); // Extra security check

      if (error) {
        console.error('Error removing social contact:', error);
        setError("Failed to remove social contact");
        return;
      }

      // Remove from local state
      setSocialContacts(socialContacts.filter(contact => contact.id !== contactId));
      setSuccess("Social contact removed successfully!");
      setTimeout(() => setSuccess(""), 3000);
      setDeletingContact(null); // Close confirmation dialog

    } catch (err: any) {
      console.error('Error removing social contact:', err);
      setError(err.message || "Failed to remove social contact");
      setDeletingContact(null); // Close confirmation dialog
    }
  };

  const confirmDeleteContact = (contactId: string) => {
    setDeletingContact(contactId);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        setError("Failed to sign out");
      }
      // The auth context will handle the redirect
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message || "Failed to sign out");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
            <p className="text-gray-600">Unable to load your profile information.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>

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

        {/* Mobile Profile Avatar - Shows only on mobile */}
        <div className="block lg:hidden mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Avatar</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-24 h-24 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {profile.name?.charAt(0) || profile.email.charAt(0)}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {profile.name || 'User'}
              </p>
              <Button variant="outline" size="sm" disabled>
                <Edit3 className="h-4 w-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-xs text-gray-500 mt-2">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Basic Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBasic(!editingBasic)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {editingBasic ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingBasic ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <Input
                          value={basicForm.name}
                          onChange={(e) => setBasicForm({...basicForm, name: sanitizeName(e.target.value)})}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Course/Major
                        </label>
                        <Input
                          value={basicForm.course}
                          onChange={(e) => setBasicForm({...basicForm, course: sanitizeCourse(e.target.value)})}
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year Level
                        </label>
                        <select
                          value={basicForm.year_level}
                          onChange={(e) => setBasicForm({...basicForm, year_level: sanitizeYearLevel(e.target.value)})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="">Select year level</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Graduate">Graduate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          value={profile.email}
                          disabled
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={basicForm.bio}
                        onChange={(e) => setBasicForm({...basicForm, bio: sanitizeInput(e.target.value, { maxLength: 500 })})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                        rows={3}
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={handleSaveBasic}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span>
                        <span className="ml-2 text-gray-600">{profile.name || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <span className="ml-2 text-gray-600">{profile.email}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Course:</span>
                        <span className="ml-2 text-gray-600">{profile.course || 'Not set'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Year Level:</span>
                        <span className="ml-2 text-gray-600">{profile.year_level || 'Not set'}</span>
                      </div>
                    </div>
                    {profile.bio && (
                      <div className="pt-4 border-t border-gray-200">
                        <span className="font-medium text-gray-700">Bio:</span>
                        <p className="mt-1 text-gray-600">{profile.bio}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            
            {/* Social Contacts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Social Contacts</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddingSocial(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addingSocial ? (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform
                      </label>
                      <select
                        value={socialForm.platform}
                        onChange={(e) => setSocialForm({...socialForm, platform: sanitizeInput(e.target.value, { maxLength: 50 })})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
                      >
                        <option value="">Select platform</option>
                        {socialPlatforms.map((platform) => (
                          <option key={platform.name} value={platform.name}>
                            {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {socialForm.platform === 'WhatsApp' ? 'Phone Number' : 'Username'}
                      </label>
                      <Input
                        value={socialForm.username}
                        onChange={(e) => setSocialForm({...socialForm, username: sanitizeInput(e.target.value, { maxLength: 100 })})}
                        placeholder={
                          socialForm.platform 
                            ? socialPlatforms.find(p => p.name === socialForm.platform)?.placeholder 
                            : "Enter username or contact"
                        }
                        className="text-sm"
                      />
                      {socialForm.platform && (
                        <p className="text-xs text-gray-500 mt-1">
                          {socialForm.platform === 'WhatsApp' 
                            ? 'Include country code (e.g., +1234567890)'
                            : socialForm.platform === 'Instagram' 
                            ? 'Enter without @ symbol'
                            : `Enter your ${socialForm.platform} username or profile URL`
                          }
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAddingSocial(false);
                          setSocialForm({ platform: "", username: "", url: "" });
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={handleAddSocial}
                        className="flex-1"
                        disabled={!socialForm.platform || !socialForm.username}
                      >
                        Add Contact
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialContacts.length > 0 ? (
                      socialContacts.map((contact) => {
                        const platform = socialPlatforms.find(p => p.name === contact.platform);
                        const IconComponent = platform ? platform.icon : MessageSquare;
                        return (
                          <div key={contact.id} className="flex items-start sm:items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                              <div className="flex-shrink-0 mt-0.5 sm:mt-0">
                                <IconComponent className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="text-sm font-medium text-gray-900">{contact.platform}</p>
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 hidden sm:inline-flex">
                                    {contact.platform === 'WhatsApp' ? 'Phone' : 'Username'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 break-all sm:truncate mb-1">{contact.username}</p>
                                {contact.url && (
                                  <a 
                                    href={contact.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center"
                                  >
                                    <span className="truncate max-w-[120px] sm:max-w-[150px]">Open {contact.platform}</span>
                                    <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-start sm:items-center space-x-2 flex-shrink-0 mt-0.5 sm:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => confirmDeleteContact(contact.id)}
                                className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <div className="flex justify-center space-x-2 mb-4">
                          <Phone className="w-6 h-6 text-gray-300" />
                          <Instagram className="w-6 h-6 text-gray-300" />
                          <Facebook className="w-6 h-6 text-gray-300" />
                          <MessageSquare className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-1">No contacts added yet</p>
                        <p className="text-xs text-gray-400 mb-4">Add your social media for easier group communication</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddingSocial(true)}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Contact
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Password Settings
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPassword(!editingPassword)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {editingPassword ? "Cancel" : "Change Password"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editingPassword ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({...passwordForm, current_password: sanitizePassword(e.target.value)})}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm({...passwordForm, new_password: sanitizePassword(e.target.value)})}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordForm.confirm_password}
                          onChange={(e) => setPasswordForm({...passwordForm, confirm_password: sanitizePassword(e.target.value)})}
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      className="w-full"
                      onClick={handleChangePassword}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>Update your password to keep your account secure.</p>
                    <p className="mt-2 text-xs text-gray-500">
                      Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Avatar - Desktop only */}
            <Card className="hidden lg:block">
              <CardHeader>
                <CardTitle>Profile Avatar</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-24 h-24 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {profile.name?.charAt(0) || profile.email.charAt(0)}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {profile.name || 'User'}
                </p>
                <Button variant="outline" size="sm" disabled>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
                <p className="text-xs text-gray-500 mt-2">Coming soon</p>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <span className="font-medium text-gray-700">Member since:</span>
                  <p className="text-gray-600">{new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Account status:</span>
                  <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sign Out Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center text-red-800">
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-red-700">
                  Sign out of your account. You'll need to sign in again to access your profile and groups.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Confirmation Dialog */}
        {deletingContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Social Contact
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this social contact? This action cannot be undone.
                </p>
                {(() => {
                  const contact = socialContacts.find(c => c.id === deletingContact);
                  const platform = socialPlatforms.find(p => p.name === contact?.platform);
                  const IconComponent = platform ? platform.icon : MessageSquare;
                  
                  return contact ? (
                    <div className="flex items-center justify-center space-x-3 p-3 bg-gray-50 rounded-lg mb-6">
                      <IconComponent className="h-5 w-5 text-purple-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{contact.platform}</p>
                        <p className="text-sm text-gray-600">{contact.username}</p>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeletingContact(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleRemoveSocial(deletingContact)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}