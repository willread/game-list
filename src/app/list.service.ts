import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, distinct } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

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
    this.list$.subscribe(list => this.platforms = this.getPlatformsForGames(list.games));
    this.list$.subscribe(list => this.genres = this.getGenresForGames(list.games));

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

  updateList(): void {
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

  getList(id: string): Observable<List> {
    return this.http.get<List>(`${environment.apiPath}/list/${id}`);
  }

  addToList(game: SearchGame) {
    this.http.post(`${environment.apiPath}/list/games/${game.id}`, { platform: game.platform })
      .subscribe((newGame: Game) => {
        this.list.games.push(newGame);
        this.subject.next(this.list);
      });
  }

  removeFromList(game: Game) {
    this.list.games = this.list.games.filter(g => g._id !== game._id);
    this.subject.next(this.list);
    this.http.delete(`${environment.apiPath}/list/games/${game._id}`).subscribe(); // Silently update
  }

  setStatus(game: Game, status: GameStatus) {
    try {
      this.list.games.find(g => g._id === game._id).status = status;
      this.list.games = [... this.list.games]; // Trigger change detection
      this.subject.next(this.list);
    } catch (e) {
      // TODO
    } finally {
      this.http.patch(`${environment.apiPath}/list/games/${game._id}`, { status }).subscribe();
    }
  }

  logTime(game: Game, seconds: number) {
    try {
      this.list.games.find(g => g._id === game._id).secondsPlayed = (game.secondsPlayed || 0) + seconds;
      this.list.games = [... this.list.games]; // Trigger change detection
      this.subject.next(this.list);
    } catch (e) {
      // TODO
    } finally {
      this.http.put(`${environment.apiPath}/list/games/${game._id}/time`, { seconds }).subscribe();
    }
  }

  updateTime(game: Game, secondsPlayed: number) {
    try {
      this.list.games.find(g => g._id === game._id).secondsPlayed = secondsPlayed;
      this.list.games = [... this.list.games]; // Trigger change detection
      this.subject.next(this.list);
    } catch (e) {
      // TODO
    } finally {
      this.http.patch(`${environment.apiPath}/list/games/${game._id}`, { secondsPlayed }).subscribe();
    }
  }
}

export interface List {
  games: Array<Game>;
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
  secondsPlayed: number;
  status: GameStatus;
  dateFinished: Date;
  pricePaid: number;
}

export enum GameStatus {
  Finished = 'finished',
  Unplayed = 'unplayed',
  Stopped = 'stopped',
  Playing = 'playing'
}
