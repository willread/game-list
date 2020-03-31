import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../api.service';
import { ListService, Game, SearchGame } from '../list.service';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss']
})
export class GameSearchComponent implements OnInit {
  public query: FormControl = new FormControl()
  private subject = new Subject<String>()
  private results$: Observable<SearchGame[]>

  results: SearchGame[]
  loading: boolean

  constructor(
    private api: ApiService,
    private listService: ListService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.results$ = this.subject.pipe(
      debounceTime(1000),
      switchMap(q => {
        this.loading = true
        return this.api.search$(q)
      })
    )

    this.results$.subscribe((r: SearchGame[]) => {
      this.loading = false
      this.results = r
    })

    this.query.valueChanges.subscribe(query => this.search(query))
  }

  search(query) {
    this.subject.next(query)
  }

  add(game: SearchGame) {
    this.listService.addToList(game);
    this.results = []
    this.query.setValue('')
    this.snackBar.open(`${game.name} added!`, undefined, { duration: 1000 })
  }

}
