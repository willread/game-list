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

  search$(query: String): Observable<SearchGame[]> {
    return this.http.get<SearchGame[]>(`${environment.apiPath}/games?query=${query}`);
  }
}
