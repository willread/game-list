import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { GameComponent } from '../game/game.component';
import { ListService, ListGame } from '../services/list.service';
import { FilterGamesPipe, GamesFilter } from '../pipes/filter-games.pipe';
import { GameFilterComponent } from '../game-filter/game-filter.component';
import { GameSearchComponent } from '../game-search/game-search.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public filter: GamesFilter;
  public filtersDirty: boolean;

  @ViewChild(GameFilterComponent)
  public gameFilterComponent: GameFilterComponent;

  constructor(
    public listService: ListService,
    private dialog: MatDialog,
    private filterGames: FilterGamesPipe,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
  }

  showGame(listGame: ListGame) {
    this.dialog.open(GameComponent, { data: listGame });
  }

  updateFilter(filter: GamesFilter) {
    this.filter = filter;
  }

  addGame() {
    this.dialog.open(GameSearchComponent);
  }

  openFilterBottomSheet() {
    const ref = this.bottomSheet.open(GameFilterComponent, {
      backdropClass: 'game-filter-backdrop',
      data: { listGames: this.listService.list.games }
    });

    ref.instance.filterChanged.subscribe(filter => this.updateFilter(filter));
  }
}
