export interface BirthData {
  date: string;
  time: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
}

export interface NatalChart {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  ascendant: PlanetPosition;
  midheaven: PlanetPosition;
}

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

export interface SignAttributes {
  element: Element;
  modality: Modality;
  ruler: string;
}

export interface CompatibilityScore {
  overall: number;
  communication: number;
  collaboration: number;
  leadership: number;
  creativity: number;
  workStyle: number;
}

export interface UserProfile {
  id: string;
  walletAddress?: string;
  userType: 'talent' | 'employer';
  name: string;
  bio: string;
  skills: string[];
  birthData: BirthData;
  natalChart?: NatalChart;
  verified: boolean;
  reputation: number;
  createdAt: string;
}

export interface JobListing {
  id: string;
  employerId: string;
  title: string;
  description: string;
  requirements: string[];
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  location: 'remote' | 'hybrid' | 'onsite';
  duration: string;
  skillsRequired: string[];
  stakeAmount: number;
  active: boolean;
  createdAt: string;
}

export interface Match {
  talentId: string;
  employerId: string;
  jobId: string;
  compatibilityScore: CompatibilityScore;
  matchedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}