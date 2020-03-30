import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  search$(query: String): Observable<any> {
    return this.http.get(`${environment.apiPath}/games?query=${query}`);
  }
}
