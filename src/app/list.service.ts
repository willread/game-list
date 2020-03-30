import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { tap, map, take, throwIfEmpty } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private subject = new Subject()
  private list;

  public list$: Observable<any> = new Observable(fn => this.subject.subscribe(fn))

  constructor(
    private http: HttpClient
  ) {
    this.list = this.list$.subscribe(list => this.list = list)
    this.updateList();
  }

  updateList(): void {
    this.http.get(`/api/list`)
      .pipe(
        tap(list => this.subject.next(list))
      )
      .subscribe()
  }

  addToList(game: any) {
    this.list.games.push(game);
    this.subject.next(this.list);
    this.http.post(`/api/list/add`, { game }).subscribe(
      () => this.updateList()
    )
  }

  removeFromList(game: any) {
    this.list.games = this.list.games.filter(g => g.id !== game.id);
    this.subject.next(this.list);
    this.http.delete(`/api/list/${game.id}`).subscribe(
      () => this.updateList()
    )
  }
}
