import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SingleDataSet, Label } from 'ng2-charts';

import { ApiService, Activity } from '../services/api.service';
import { List, ListService } from '../services/list.service';
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
  public activities: Activity[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private filterGames: FilterGamesPipe,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(first()).subscribe(params => {
      this.listService.getList(params.get('id'))
        .subscribe(list => {
          this.list = list;

          this.updateGraphs();
        });

        this.apiService.getActivitiesForUser$(params.get('id'))
          .subscribe(activities => {
            this.activities = activities;
          });
    });

  }

  updateFilter(filter: GamesFilter) {
    this.filter = filter;
    this.updateGraphs();
  }

  updateGraphs() {
    const filteredGames = this.filterGames.transform(this.list.games, this.filter);
    const genres = this.listService.getGenresForGames(filteredGames.map(g => g.game));

    this.genreCounts = genres.map(genre => filteredGames
      .map(g => g.game)
      .filter(game => game.genres.includes(genre)).length);
    this.genreLabels = genres;

    const platforms = this.listService.getPlatformsForGames(filteredGames.map(g => g.game));

    this.platformCounts = platforms.map(platform => filteredGames.filter(g => g.game.platform === platform).length);
    this.platformLabels = platforms;

    this.secondsPlayed = filteredGames.reduce((total, game) => game.secondsPlayed + total, 0);
  }
}
