import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  authTest$(): Observable<any> {
    return this.http.get('/api/auth-test');
  }

  search$(query: String): any {
    return this.http.get(`/api/games?query=${query}`);
  }

}
