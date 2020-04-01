import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { tap, distinct } from 'rxjs/operators'

import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private subject = new Subject()

  public list: List;
  public list$: Observable<List> = new Observable(fn => this.subject.subscribe(fn))
  public platforms: String[];

  constructor(
    private http: HttpClient
  ) {
    this.list$.subscribe(list => this.list = list)
    this.list$.subscribe(list => this.platforms = Array.from(new Set(list.games.map(game => game.platform))))
    this.updateList()
  }

  updateList(): void {
    this.http.get(`${environment.apiPath}/list`)
      .pipe(
        tap(list => this.subject.next(list))
      )
      .subscribe()
  }

  addToList(game: SearchGame) {
    this.http.post(`${environment.apiPath}/list/games/${game.id}`, { platform: game.platform })
      .subscribe((newGame: Game) => {
        this.list.games.push(newGame);
        this.subject.next(this.list);
      })
  }

  removeFromList(game: Game) {
    this.list.games = this.list.games.filter(g => g._id !== game._id);
    this.subject.next(this.list);
    this.http.delete(`${environment.apiPath}/list/games/${game._id}`).subscribe(); // Silently update
  }
}

export interface List {
  games: Array<Game>
}

export interface SearchGame {
  id: String,
  name: String,
  platform: String,
  images: {
    icon: String
  }
};

export interface TimeLogEntry {
  date: Date,
  time: Number
}

export interface Game {
  _id: String,
  name: String,
  platform: String,
  images: {
    icon: String
  },
  timeLog: TimeLogEntry[],
  finished: Boolean,
  dateFinished: Date,
  pricePaid: Number
}
