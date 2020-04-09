import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GameComponent } from '../game/game.component';
import { ListService, ListGame } from '../list.service';
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

  remove(listGame: ListGame) {
    this.listService.removeFromList(listGame);
  }

  showGame(listGame: ListGame) {
    this.dialog.open(GameComponent, { data: listGame });
  }

  updateFilter(filter: GamesFilter) {
    this.filter = filter;
  }
}
