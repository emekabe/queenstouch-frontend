import { CvType, SkillLevel } from './cv.model';

export interface CreateCvRequest {
  title: string;
  cvType: CvType;
  scholarshipMode: boolean;
}

export interface WorkExperienceDto {
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
}

export interface EducationDto {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: string;
  endDate?: string;
}

export interface SkillDto {
  name: string;
  level: SkillLevel;
}

export interface CertificationDto {
  name: string;
  issuer: string;
  year: string;
}

export interface UpdateCvRequest {
  title?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  summary?: string;
  scholarshipMode?: boolean;
  workExperiences?: WorkExperienceDto[];
  educations?: EducationDto[];
  skills?: SkillDto[];
  certifications?: CertificationDto[];
  languages?: string[];
  researchInterests?: string[];
  publications?: string[];
  conferences?: string[];
  teachingExperience?: string[];
  awards?: string[];
}

export interface AchievementBuilderRequest {
  role: string;
  task: string;
  result: string;
}

export interface GenerateSummaryRequest {
  jobTitle: string;
  yearsOfExperience: string;
  skills: string;
  achievements: string;
}

export interface JobMatchRequest {
  jobDescription: string;
}
