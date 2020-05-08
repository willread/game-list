import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { SearchGame, Game, ListGame } from './list.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  search$(query: string): Observable<SearchGame[]> {
    return this.http.get<SearchGame[]>(`${environment.apiPath}/games?query=${query}`);
  }

  getPopularGames$(): Observable<[PopularListGame]> {
    return this.http.get<[PopularListGame]>(`${environment.apiPath}/games/popular`);
  }

  getProfile$(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiPath}/profile`);
  }

  updateProfile$(updates: any): Observable<Profile> {
    return this.http.patch<Profile>(`${environment.apiPath}/profile`, updates);
  }

  getActivitiesForUser$(idOrAlias: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${environment.apiPath}/activity/user/${idOrAlias}`);
  }

  getActivities$(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${environment.apiPath}/activity`);
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

export interface Activity {
  profile: Profile,
  action: 'log-time' | 'update-status' |'add-game',
  meta: any,
  createdAt: string,
  updatedAt: string,
  game?: Game
};

export interface PopularListGame {
  count: number,
  game: Game
};
