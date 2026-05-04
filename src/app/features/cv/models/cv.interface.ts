export interface CvDocument {
  id: string;
  userId?: string;
  title?: string;
  cvType?: string;
  status?: string;
  scholarshipMode?: boolean;

  // Personal Info
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;

  // Professional Summary
  summary?: string;
  professionalSummary?: string;

  // Work Experience
  workExperiences?: WorkExperience[];

  // Education
  educations?: Education[];

  // Skills
  skills?: Skill[];

  // Certifications
  certifications?: Certification[];

  // Languages
  languages?: string[];

  // Academic-Only Sections
  researchInterests?: string[];
  publications?: string[];
  conferences?: string[];
  teachingExperience?: string[];
  awards?: string[];

  // Extra data from builder
  projects?: Project[];
  personalInfo?: PersonalInfo;

  // AI-Generated Analysis
  cvScore?: CvScore;
  lastJobMatchResult?: JobMatchResult;

  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperience {
  jobTitle?: string;
  company?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  bullets?: string[];
}

export interface Education {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  name?: string;
  level?: string;
}

export interface Certification {
  name?: string;
  issuer?: string;
  year?: string;
}

export interface CvScore {
  overall?: number;
  structure?: number;
  keywordStrength?: number;
  atsCompatibility?: number;
  strengths?: string[];
  improvements?: string[];
}

export interface JobMatchResult {
  jdSnippetHash?: string;
  matchPercent?: number;
  missingKeywords?: string[];
  suggestions?: string[];
}

export interface Project {
  title?: string;
  link?: string;
  description?: string;
}

export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  targetJobTitle?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
