import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { debounceTime, throttleTime, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiService } from '../services/api.service';
import { ListService, ListGame, Game, SearchGame } from '../services/list.service';

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

  add(searchGame: SearchGame) {
    this.listService.addToList$(searchGame)
      .subscribe((listGame: ListGame) => {
        this.snackBar.open(`${listGame.game.name} added!`, undefined, { duration: 1000 });
        this.close(listGame);
        this.reset();
      }, (listGame: ListGame) => {
        this.snackBar.open(`${listGame.game.name} is already in your list.`, undefined, { duration: 1000 });
        this.close();
        this.reset();
      });
  }

  reset() {
    this.results = [];
    this.query.setValue('');
  }

  close(listGame?: ListGame) {
    this.dialogRef.close(listGame);
  }
}
