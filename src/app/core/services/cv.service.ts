import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CvDocument } from '../models/cv.model';
import { CvScore, JobMatchResult } from '../models/cv-response.model';
import { 
  CreateCvRequest, 
  UpdateCvRequest, 
  AchievementBuilderRequest, 
  GenerateSummaryRequest, 
  JobMatchRequest 
} from '../models/cv-request.model';

@Injectable({
  providedIn: 'root'
})
export class CvService {
  private readonly baseUrl = environment.apiUrl + '/cvs';
  private readonly http = inject(HttpClient);

  create(data: CreateCvRequest): Observable<ApiResponse<CvDocument>> {
    return this.http.post<ApiResponse<CvDocument>>(this.baseUrl, data);
  }

  list(): Observable<ApiResponse<CvDocument[]>> {
    return this.http.get<ApiResponse<CvDocument[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<CvDocument>> {
    return this.http.get<ApiResponse<CvDocument>>(`${this.baseUrl}/${id}`);
  }

  updateSection(id: string, section: string, data: UpdateCvRequest): Observable<ApiResponse<CvDocument>> {
    return this.http.patch<ApiResponse<CvDocument>>(`${this.baseUrl}/${id}/${section}`, data);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }

  generateSummary(id: string, data: GenerateSummaryRequest): Observable<ApiResponse<{summary: string}>> {
    return this.http.post<ApiResponse<{summary: string}>>(`${this.baseUrl}/${id}/generate-summary`, data);
  }

  generateAchievement(data: AchievementBuilderRequest): Observable<ApiResponse<{bullet: string}>> {
    return this.http.post<ApiResponse<{bullet: string}>>(`${this.baseUrl}/generate-achievement`, data);
  }

  scoreCv(id: string): Observable<ApiResponse<CvScore>> {
    return this.http.post<ApiResponse<CvScore>>(`${this.baseUrl}/${id}/score`, {});
  }

  jobMatch(id: string, data: JobMatchRequest): Observable<ApiResponse<JobMatchResult>> {
    return this.http.post<ApiResponse<JobMatchResult>>(`${this.baseUrl}/${id}/job-match`, data);
  }

  downloadUrl(id: string, format: 'PDF' | 'DOCX'): string {
    return `${this.baseUrl}/${id}/download?format=${format}`;
  }

  download(id: string, format: 'PDF' | 'DOCX'): Observable<Blob> {
    return this.http.get(this.downloadUrl(id, format), { responseType: 'blob' });
  }
}
