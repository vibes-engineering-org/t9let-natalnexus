"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { UserProfile as UserProfileType } from "~/lib/astro-types";

interface UserProfileProps {
  profile?: UserProfileType;
  onSave: (profile: Partial<UserProfileType>) => void;
  isEditing?: boolean;
}

export default function UserProfile({ profile, onSave, isEditing = false }: UserProfileProps) {
  const [editMode, setEditMode] = useState(isEditing);
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    bio: profile?.bio || "",
    skills: profile?.skills?.join(", ") || "",
    userType: profile?.userType || "talent" as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedProfile: Partial<UserProfileType> = {
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      userType: formData.userType
    };

    onSave(updatedProfile);
    setEditMode(false);
  };

  if (!editMode && profile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{profile.name}</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={profile.userType === "talent" ? "default" : "secondary"}>
              {profile.userType === "talent" ? "Talent" : "Employer"}
            </Badge>
            {profile.verified && (
              <Badge variant="outline" className="text-green-600">
                Verified
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {profile.natalChart && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Astrological Profile</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Sun: {profile.natalChart.sun.sign}</div>
                <div>Moon: {profile.natalChart.moon.sign}</div>
                <div>Rising: {profile.natalChart.ascendant.sign}</div>
                <div>Mercury: {profile.natalChart.mercury.sign}</div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Reputation: {profile.reputation}/100
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{profile ? "Edit Profile" : "Create Profile"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md resize-none"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Skills</label>
            <Input
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              placeholder="JavaScript, Design, Marketing (comma separated)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">I am a</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="talent"
                  checked={formData.userType === "talent"}
                  onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as "talent" }))}
                />
                <span className="text-sm">Talent</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="employer"
                  checked={formData.userType === "employer"}
                  onChange={(e) => setFormData(prev => ({ ...prev, userType: e.target.value as "employer" }))}
                />
                <span className="text-sm">Employer</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {profile ? "Update" : "Create"} Profile
            </Button>
            {profile && (
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}