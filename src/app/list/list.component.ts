import { Component, OnInit, Pipe, PipeTransform } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { GameComponent } from '../game/game.component'
import { ListService, Game } from '../list.service'
import { FilterGamesPipe } from '../filter-games.pipe';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public platform = new FormControl('');
  public genre = new FormControl('');
  public query = new FormControl('');

  constructor(
    public listService: ListService,
    private dialog: MatDialog,
    private filterGames: FilterGamesPipe,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(first()).subscribe(params => {
      this.platform.setValue(params.get('platform') || '');
      this.query.setValue(params.get('query') || '');
      this.genre.setValue(params.get('genre' || ''));
    });

    this.platform.valueChanges.subscribe(platform => this.updateQueryParam('platform', platform));
    this.genre.valueChanges.subscribe(genre => this.updateQueryParam('genre', genre));
    this.query.valueChanges.subscribe(query => this.updateQueryParam('query', query));
  }

  remove(game: Game) {
    this.listService.removeFromList(game)
  }

  showGame(game: Game) {
    this.dialog.open(GameComponent, { data: game })
  }

  updateQueryParam(key, value) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { [key]: value === '' ? null : value },
        queryParamsHandling: 'merge'
      });
  }
}
