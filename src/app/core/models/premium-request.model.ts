export enum PremiumServiceType {
  PROFESSIONAL_CV = 'PROFESSIONAL_CV',
  PERSONAL_STATEMENT = 'PERSONAL_STATEMENT',
  MOTIVATION_LETTER = 'MOTIVATION_LETTER',
  LINKEDIN_OPTIMIZATION = 'LINKEDIN_OPTIMIZATION',
  EXPERT_REVIEW = 'EXPERT_REVIEW'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface PremiumServiceRequest {
  id: string;
  userId: string;
  serviceType: PremiumServiceType;
  status: RequestStatus;
  notes?: string;
  adminNotes?: string;
  uploadedFileUrls: string[];
  createdAt: string;
  updatedAt: string;
}
