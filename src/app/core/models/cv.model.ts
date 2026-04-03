import { CvScore, JobMatchResult } from './cv-response.model';

export enum CvType {
  STANDARD = 'STANDARD',
  ACADEMIC = 'ACADEMIC'
}

export enum CvStatus {
  DRAFT = 'DRAFT',
  COMPLETE = 'COMPLETE'
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
}

export interface WorkExperience {
  id?: string;
  company: string;
  jobTitle: string;
  location?: string;
  startDate: string; // ISO String or "YYYY-MM"
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate?: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Publication {
    id?: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  description?: string;
}

export interface Conference {
    id?: string;
  name: string;
  role: string;
  date: string;
  description?: string;
}

// Removing local CvScore and JobMatchResult interfaces as they are now in cv-response.model.ts

export interface CvDocument {
  id: string;
  userId: string;
  type: CvType;
  status: CvStatus;
  scholarshipMode: boolean;
  cvScore?: CvScore;
  lastJobMatchResult?: JobMatchResult;
  lastAnalysisDate?: string;
  
  // Standard Sections
  personalInfo?: PersonalInfo;
  fullName?: string; // Unified with backend
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  professionalSummary?: string;
  summary?: string; // Backend field name
  workExperiences: WorkExperience[];
  education: Education[]; // Map from backend 'educations'
  skills: Skill[];
  certifications: Certification[];
  
  // Academic Sections
  researchInterests: string[];
  publications: Publication[];
  conferences: Conference[];

  createdAt: string;
  updatedAt: string;
}
