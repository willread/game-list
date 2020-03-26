import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

import { ApiService } from '../api.service';

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

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.results$ = this.subject.pipe(
      debounceTime(1000),
      switchMap(q => {
        this.results = [];
        return this.api.search$(q)
      })
    )

    this.results$.subscribe((r: any[]) => this.results = r)
  }

  search(e) {
    this.subject.next(e.target.value)
  }
}
