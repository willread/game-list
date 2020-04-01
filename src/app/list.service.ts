import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, distinct } from 'rxjs/operators';

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
    private http: HttpClient
  ) {
    this.list$.subscribe(list => this.list = list);
    this.list$.subscribe(list => this.platforms = Array.from(new Set(list.games.map(game => game.platform))));
    this.list$.subscribe(list => this.genres = Array.from(
      new Set(
        list.games.map(game => {
          return game.genres;
        }).reduce((a, b) => {
          return a.concat(b);
        }, [])
      )
    ));
    this.updateList();
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

export interface TimeLogEntry {
  date: Date;
  time: number;
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
  timeLog: TimeLogEntry[];
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
