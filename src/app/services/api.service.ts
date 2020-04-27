import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  startPlaying(listGame: ListGame): void {
    this.http.put<any>(`${environment.apiPath}/profile/playing`, { listGame: listGame._id }).subscribe();
  }

  stopPlaying$(): Observable<number> {
    return this.http.delete<any>(`${environment.apiPath}/profile/playing`)
      .pipe(
        map(response => response.secondsPlayed)
      );
  }

  cancelPlaying$(): Observable<void> {
    return this.http.delete<any>(`${environment.apiPath}/profile/playing?cancel=true`);
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
  alias: string,
  playing: {
    listGame: string,
    startedAt: string
  }
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
