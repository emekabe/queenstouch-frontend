export interface CvScore {
  overall: number;              // out of 100
  structure: number;
  keywordStrength: number;
  atsCompatibility: number;
  strengths: string[];
  improvements: string[];
}

export interface JobMatchResult {
  jdSnippetHash: string;
  matchPercent: number;
  missingKeywords: string[];
  suggestions: string[];
}
