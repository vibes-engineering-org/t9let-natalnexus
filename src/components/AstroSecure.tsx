"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import NatalChartForm from "./NatalChartForm";
import UserProfile from "./UserProfile";
import JobListing from "./JobListing";
import CompatibilityScore from "./CompatibilityScore";
import WalletConnection from "./WalletConnection";
import { 
  UserProfile as UserProfileType, 
  JobListing as JobListingType, 
  BirthData, 
  NatalChart,
  Match 
} from "~/lib/astro-types";
import { generateBasicNatalChart, calculateCompatibility } from "~/lib/astro-utils";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";
import { useAccount } from "wagmi";

type AppView = "onboarding" | "profile" | "jobs" | "matches" | "create-job" | "wallet";

const mockJobs: JobListingType[] = [
  {
    id: "1",
    employerId: "emp1",
    title: "Senior Frontend Developer",
    description: "We're looking for a creative frontend developer to join our team building next-generation web applications. You'll work with React, TypeScript, and modern design systems.",
    requirements: ["3+ years React experience", "TypeScript proficiency", "Design system experience", "Portfolio of modern web apps"],
    budget: { min: 80000, max: 120000, currency: "USD" },
    location: "remote",
    duration: "Full-time permanent",
    skillsRequired: ["React", "TypeScript", "CSS", "Design Systems"],
    stakeAmount: 100,
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    employerId: "emp2", 
    title: "UX/UI Designer",
    description: "Join our design team to create intuitive user experiences for our growing platform. We value creativity, attention to detail, and user-centered design.",
    requirements: ["2+ years UX design", "Figma expertise", "User research skills", "Design system creation"],
    budget: { min: 60000, max: 90000, currency: "USD" },
    location: "hybrid",
    duration: "Full-time permanent",
    skillsRequired: ["Figma", "UX Research", "Prototyping", "Visual Design"],
    stakeAmount: 150,
    active: true,
    createdAt: new Date().toISOString()
  }
];

export default function AstroSecure() {
  const [currentView, setCurrentView] = useState<AppView>("onboarding");
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [userChart, setUserChart] = useState<NatalChart | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const { isSDKLoaded } = useMiniAppSdk();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const savedProfile = localStorage.getItem("astrosecure-profile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setUserProfile(profile);
      if (profile.natalChart) {
        setUserChart(profile.natalChart);
        setCurrentView("jobs");
      } else {
        setCurrentView("profile");
      }
    }
  }, []);

  const handleBirthDataSubmit = (birthData: BirthData) => {
    const birthDate = new Date(`${birthData.date}T${birthData.time}`);
    const chart = generateBasicNatalChart(birthDate);
    setUserChart(chart);
    
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        birthData,
        natalChart: chart
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("astrosecure-profile", JSON.stringify(updatedProfile));
      setCurrentView("jobs");
    }
  };

  const handleProfileSave = (profileData: Partial<UserProfileType>) => {
    const newProfile: UserProfileType = {
      id: userProfile?.id || Date.now().toString(),
      walletAddress: userProfile?.walletAddress,
      name: profileData.name!,
      bio: profileData.bio!,
      skills: profileData.skills!,
      userType: profileData.userType!,
      birthData: userProfile?.birthData || { 
        date: "", 
        time: "", 
        location: { city: "", country: "", latitude: 0, longitude: 0, timezone: "UTC" } 
      },
      natalChart: userChart || undefined,
      verified: false,
      reputation: 75,
      createdAt: new Date().toISOString()
    };
    
    setUserProfile(newProfile);
    localStorage.setItem("astrosecure-profile", JSON.stringify(newProfile));
    
    if (!userChart) {
      setCurrentView("onboarding");
    } else {
      setCurrentView("jobs");
    }
  };

  const handleJobApply = (jobId: string) => {
    if (!userChart || !userProfile) return;
    
    const job = mockJobs.find(j => j.id === jobId);
    if (!job) return;

    const employerChart = generateBasicNatalChart(new Date());
    const compatibility = calculateCompatibility(userChart, employerChart);
    
    const newMatch: Match = {
      talentId: userProfile.id,
      employerId: job.employerId,
      jobId: job.id,
      compatibilityScore: compatibility,
      matchedAt: new Date().toISOString(),
      status: "pending"
    };
    
    setMatches(prev => [...prev, newMatch]);
    setCurrentView("matches");
  };

  const handleWalletVerified = (walletAddress: string) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        walletAddress,
        verified: true
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("astrosecure-profile", JSON.stringify(updatedProfile));
    }
    setCurrentView("profile");
  };

  const getJobsWithCompatibility = () => {
    if (!userChart) return mockJobs.map(job => ({ job, compatibility: null }));
    
    return mockJobs.map(job => {
      const employerChart = generateBasicNatalChart(new Date(job.createdAt));
      const compatibility = calculateCompatibility(userChart, employerChart);
      return { job, compatibility };
    }).sort((a, b) => (b.compatibility?.overall || 0) - (a.compatibility?.overall || 0));
  };

  const renderNavigation = () => (
    <div className="flex justify-center gap-2 mb-6">
      <Button 
        variant={currentView === "profile" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrentView("profile")}
      >
        Profile
      </Button>
      <Button 
        variant={currentView === "jobs" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrentView("jobs")}
        disabled={!userChart}
      >
        Jobs
      </Button>
      <Button 
        variant={currentView === "matches" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrentView("matches")}
        disabled={matches.length === 0}
      >
        Matches ({matches.length})
      </Button>
      <Button 
        variant={currentView === "wallet" ? "default" : "outline"}
        size="sm"
        onClick={() => setCurrentView("wallet")}
      >
        {isConnected ? "Wallet ✓" : "Verify"}
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "onboarding":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Complete Your Astrological Profile</h2>
              <p className="text-sm text-muted-foreground">
                Add your birth information to unlock personalized job matching
              </p>
            </div>
            <NatalChartForm onSubmit={handleBirthDataSubmit} />
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <UserProfile 
              profile={userProfile || undefined}
              onSave={handleProfileSave}
              isEditing={!userProfile}
            />
            {userProfile && !userChart && (
              <div className="text-center">
                <Button onClick={() => setCurrentView("onboarding")}>
                  Add Birth Information
                </Button>
              </div>
            )}
          </div>
        );

      case "jobs":
        const jobsWithCompatibility = getJobsWithCompatibility();
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Job Opportunities</h2>
              <p className="text-sm text-muted-foreground">
                Jobs ranked by astrological compatibility
              </p>
            </div>
            {jobsWithCompatibility.map(({ job, compatibility }) => (
              <JobListing
                key={job.id}
                job={job}
                compatibilityScore={compatibility?.overall}
                onApply={handleJobApply}
              />
            ))}
          </div>
        );

      case "matches":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Your Matches</h2>
              <p className="text-sm text-muted-foreground">
                Applications with compatibility analysis
              </p>
            </div>
            {matches.map((match, index) => {
              const job = mockJobs.find(j => j.id === match.jobId);
              if (!job) return null;
              
              return (
                <div key={index} className="space-y-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <Badge variant={match.status === "pending" ? "secondary" : "default"}>
                          {match.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Applied {new Date(match.matchedAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                  <CompatibilityScore score={match.compatibilityScore} />
                </div>
              );
            })}
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">Wallet Verification</h2>
              <p className="text-sm text-muted-foreground">
                Secure your identity with blockchain verification
              </p>
            </div>
            <WalletConnection onVerified={handleWalletVerified} />
          </div>
        );

      default:
        return null;
    }
  };

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading AstroSecure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">AstroSecure</h1>
        <p className="text-sm text-muted-foreground">
          Astrologically-matched talent and job opportunities
        </p>
      </div>

      {userProfile && renderNavigation()}
      {renderContent()}
    </div>
  );
}