import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private subject = new Subject();

  public loading: boolean = false;
  public list: List;
  public list$: Observable<List> = new Observable(fn => this.subject.subscribe(fn));
  public platforms: string[];
  public genres: string[];
  public statuses: GameStatus[] = [GameStatus.Finished, GameStatus.Playing, GameStatus.Stopped, GameStatus.Unplayed];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.list$.subscribe(list => this.list = list);
    this.list$.subscribe(list => this.platforms = this.getPlatformsForGames(list.games.map(g => g.game)));
    this.list$.subscribe(list => this.genres = this.getGenresForGames(list.games.map(g => g.game)));

    this.authService.isAuthenticated$.pipe(
      tap(authenticated => {
        if (authenticated) {
          this.updateList();
        }
      })
    ).subscribe();
  }

  public getGenresForGames(games: Game[]): string[] {
    return Array.from(
      new Set(
        games.map(game => {
          return game.genres;
        }).reduce((a, b) => {
          return a.concat(b);
        }, [])
      )
    );
  }

  public getPlatformsForGames(games: Game[]): string[] {
    return Array.from(new Set(games.map(game => game.platform)));
  }

  public updateList(): void {
    this.loading = true;

    this.http.get(`${environment.apiPath}/list`)
      .pipe(
        tap(list => {
          this.loading = false;
          this.subject.next(list);
        })
      )
      .subscribe();
  }

  public getList(id: string): Observable<List> {
    return this.http.get<List>(`${environment.apiPath}/list/${id}`);
  }

  public addToList$(game: SearchGame): Observable<any> {
    return this.http.post(`${environment.apiPath}/list/games/${game.id}`, { platform: game.platform })
      .pipe(
        tap((newListGame: ListGame) => {
          this.list.games.push(newListGame);
          this.list.games = [... this.list.games]; // Trigger change detection
          this.subject.next(this.list);
        })
      );
  }

  removeFromList(listGame: ListGame) {
    this.list.games = this.list.games.filter(g => g._id !== listGame._id);
    this.subject.next(this.list);
    this.http.delete(`${environment.apiPath}/list/games/${listGame._id}`).subscribe(); // Silently update
  }

  updateListGame(listGame: ListGame, updates: any) {
    try {
      const existingListGame = this.list.games.find(g => g._id === listGame._id);
      Object.assign(existingListGame, updates);
      this.list.games = [... this.list.games]; // Trigger change detection
      this.subject.next(this.list);
    } catch (e) {
      // TODO
    } finally {
      this.http.patch(`${environment.apiPath}/list/games/${listGame._id}`, updates).subscribe();
    }
  }

  public logTime(listGame: ListGame, secondsPlayed: number) {
    try {
      this.list.games.find(g => g._id === listGame._id).secondsPlayed += secondsPlayed;
      this.list.games = [... this.list.games]; // Trigger change detection
      this.subject.next(this.list);
    } catch (e) {
      // TODO
    } finally {
      this.http.patch(`${environment.apiPath}/list/games/${listGame._id}/playing`, { secondsPlayed }).subscribe();
    }
  }

  public startPlaying(listGame: ListGame): void {
    this.http.put<any>(`${environment.apiPath}/list/games/${listGame._id}/playing`, {}).subscribe();
  }

  public stopPlaying$(listGame: ListGame): Observable<number> {
    return this.http.delete<any>(`${environment.apiPath}/list/games/${listGame._id}/playing`)
      .pipe(
        map(response => response.secondsPlayed)
      );
  }

  public cancelPlaying$(listGame: ListGame): Observable<void> {
    return this.http.delete<any>(`${environment.apiPath}/list/games/${listGame._id}/playing?cancel=true`);
  }
}

export interface List {
  games: Array<ListGame>;
}

export interface SearchGame {
  id: string;
  name: string;
  platform: string;
  images: {
    icon: string,
    original: string,
    thumbnail: string
  };
}

export interface ListGame {
  _id: string;
  list?: List;
  game?: Game;
  secondsPlayed: number;
  status: GameStatus;
  physicalCopy: boolean;
  digitalCopy: boolean;
  startedPlayingAt: string;
}

export interface Game {
  _id: string;
  name: string;
  platform: string;
  images: {
    icon: string
    original: string,
    thumbnail: string
  };
  genres: string[];
}

export enum GameStatus {
  Finished = 'finished',
  Unplayed = 'unplayed',
  Stopped = 'stopped',
  Playing = 'playing'
}
