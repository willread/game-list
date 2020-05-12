import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SingleDataSet, Label } from 'ng2-charts';

import { GameFilterComponent } from '../game-filter/game-filter.component';
import { ApiService, Activity } from '../services/api.service';
import { Game, GameStatus, List, ListGame, ListService } from '../services/list.service';
import { FilterGamesPipe, GamesFilter } from '../pipes/filter-games.pipe';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public filter: GamesFilter;
  public list: List;
  public genreCounts: SingleDataSet;
  public genreLabels: Label[];
  public platformCounts: SingleDataSet;
  public platformLabels: Label[];
  public secondsPlayed: number;
  public currentlyPlaying: Game;
  public genreCount: number;
  public platformCount: number;
  public finishedGamesCount: number;
  public unplayedGamesCount: number;
  public activities: Activity[];
  public alias: string;

  @ViewChild(GameFilterComponent)
  public gameFilterComponent: GameFilterComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private filterGames: FilterGamesPipe,
    private apiService: ApiService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(first()).subscribe(params => {
      this.alias = params.get('id');
      this.listService.getList(params.get('id'))
        .subscribe(list => {
          this.list = list;

          this.updateGraphsAndStats();
        });

        this.apiService.getActivitiesForUser$(params.get('id'))
          .subscribe(activities => {
            this.activities = activities;
          });
    });

  }

  updateFilter(filter: GamesFilter) {
    this.filter = filter;
    this.updateGraphsAndStats();
  }

  updateGraphsAndStats() {
    const filteredGames = this.filterGames.transform(this.list.games, this.filter);
    const genres = this.listService.getGenresForGames(filteredGames.map(g => g.game));

    this.genreCounts = genres.map(genre => filteredGames
      .map(g => g.game)
      .filter(game => game.genres.includes(genre)).length);
    this.genreLabels = genres;

    const platforms = this.listService.getPlatformsForGames(filteredGames.map(g => g.game));

    this.platformCounts = platforms.map(platform => filteredGames.filter(g => g.game.platform === platform).length);
    this.platformLabels = platforms;

    // Stats

    const currentlyPlayingGames = filteredGames.filter(g => g.startedPlayingAt);

    this.secondsPlayed = filteredGames.reduce((total, game) => (game.secondsPlayed || 0) + total, 0);
    this.currentlyPlaying = currentlyPlayingGames.length ? currentlyPlayingGames[0].game : null;
    this.genreCount = genres.length;
    this.platformCount = platforms.length;
    this.finishedGamesCount = filteredGames.reduce((count: number, g: ListGame) => g.status === GameStatus.Finished ? count + 1 : count, 0);
    this.unplayedGamesCount = filteredGames.reduce((count: number, g: ListGame) => g.status === GameStatus.Unplayed ? count + 1 : count, 0);
  }

  openFilterBottomSheet() {
    const ref = this.bottomSheet.open(GameFilterComponent, {
      backdropClass: 'game-filter-backdrop',
      data: { listGames: this.listService.list.games }
    });

    ref.instance.filterChanged.subscribe(filter => this.updateFilter(filter));
  }
}
