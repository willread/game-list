import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { debounceTime, throttleTime, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../services/api.service';
import { ListService, Game, SearchGame } from '../services/list.service';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss']
})
export class GameSearchComponent implements OnInit {
  public query: FormControl = new FormControl();
  private subject = new Subject<string>();
  private results$: Observable<SearchGame[]>;

  results: SearchGame[];
  loading: boolean;

  constructor(
    private api: ApiService,
    private listService: ListService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GameSearchComponent>
  ) { }

  ngOnInit() {
    this.results$ = this.subject.pipe(
      debounceTime(500),
      // throttleTime(1000, undefined, { leading: true, trailing: true }),
      switchMap(q => {
        this.loading = true;
        return this.api.search$(q);
      })
    );

    this.results$.subscribe((r: SearchGame[]) => {
      this.loading = false;
      this.results = r;
    });

    this.query.valueChanges.subscribe(query => this.search(query));
  }

  search(query) {
    this.subject.next(query);
  }

  add(game: SearchGame) {
    this.listService.addToList$(game)
      .subscribe(() => {
        this.snackBar.open(`${game.name} added!`, undefined, { duration: 1000 });
      }, () => {
        this.snackBar.open(`${game.name} is already in your list.`, undefined, { duration: 1000 });
      });
    this.results = [];
    this.query.setValue('');
    this.close();
  }

  close() {
    this.dialogRef.close();
  }
}
