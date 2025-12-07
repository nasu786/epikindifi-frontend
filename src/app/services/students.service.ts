import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface Student {
  id: string;
  name: string;
  address: string;
  class: string;
  fatherName: string;
  motherName: string;
}

export interface StudentsResponse {
  success: boolean;
  data: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  sort: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

@Injectable({ providedIn: 'root' })
export class StudentsService {
  private baseUrl = 'http://localhost:3000/students'; // your Express API

  constructor(private http: HttpClient) {}

  getStudents(options: StudentQueryOptions): Observable<StudentsResponse> {
    let params = new HttpParams();

    if (options.page != null) params = params.set('page', options.page);
    if (options.limit != null) params = params.set('limit', options.limit);
    if (options.sortBy) params = params.set('sortBy', options.sortBy);
    if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
    if (options.search) params = params.set('search', options.search);

    return this.http.get<StudentsResponse>(this.baseUrl, { params });
  }
}
