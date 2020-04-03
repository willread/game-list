import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { SearchGame } from './list.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  search$(query: string): Observable<SearchGame[]> {
    return this.http.get<SearchGame[]>(`${environment.apiPath}/games?query=${query}`);
  }

  getProfile$(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiPath}/profile`);
  }

  updateProfile$(updates: any): Observable<Profile> {
    return this.http.patch<Profile>(`${environment.apiPath}/profile`, updates);
  }
}

export interface ApiError {
  message?: string,
  errors: {
    [fieldName: string]: string
  }
}

export interface Profile {
  alias: string
}
