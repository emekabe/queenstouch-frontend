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
  startDate: string; // ISO String
  endDate?: string;
  currentJob: boolean;
  achievements: string[];
}

export interface Education {
    id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
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
  issuingOrganization: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
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

export interface CvScore {
  score: number;
  feedback: string[];
}

export interface JobMatchResult {
  matchPercentage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface CvDocument {
  id: string;
  userId: string;
  type: CvType;
  status: CvStatus;
  isScholarshipApplication: boolean;
  score?: CvScore;
  jobMatchResult?: JobMatchResult;
  lastAnalysisDate?: string;
  
  // Standard Sections
  personalInfo?: PersonalInfo;
  professionalSummary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  
  // Academic Sections
  researchInterests: string[];
  publications: Publication[];
  conferences: Conference[];

  createdAt: string;
  updatedAt: string;
}
