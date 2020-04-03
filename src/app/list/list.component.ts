import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GameComponent } from '../game/game.component';
import { ListService, Game } from '../list.service';
import { FilterGamesPipe, GamesFilter } from '../filter-games.pipe';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public filter: GamesFilter;

  constructor(
    public listService: ListService,
    private dialog: MatDialog,
    private filterGames: FilterGamesPipe
  ) { }

  ngOnInit(): void {
  }

  remove(game: Game) {
    this.listService.removeFromList(game);
  }

  showGame(game: Game) {
    this.dialog.open(GameComponent, { data: game });
  }

  updateFilter(filter: GamesFilter) {
    this.filter = filter;
  }
}
