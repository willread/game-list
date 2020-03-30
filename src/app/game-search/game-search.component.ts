import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { ListService } from '../list.service';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss']
})
export class GameSearchComponent implements OnInit {
  private query: String
  private subject = new Subject<String>()
  private results$: Observable<any>

  results: any[]
  loading: boolean

  constructor(
    private api: ApiService,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.results$ = this.subject.pipe(
      debounceTime(1000),
      switchMap(q => {
        this.loading = true
        return this.api.search$(q)
      })
    )

    this.results$.subscribe((r: any[]) => {
      this.loading = false
      this.results = r
    })
  }

  search(e) {
    this.subject.next(e.target.value)
  }

  add(game) {
    this.listService.addToList(game);
    this.results = [];
  }

}
