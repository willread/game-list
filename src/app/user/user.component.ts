import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SingleDataSet, Label } from 'ng2-charts';

import { List, ListService } from '../list.service';
import { FilterGamesPipe, GamesFilter } from '../filter-games.pipe';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private filterGames: FilterGamesPipe
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(first()).subscribe(params => {
      this.listService.getList(params.get('id'))
        .subscribe(list => {
          this.list = list;

          this.updateGraphs();
        });
    });
  }

  updateFilter(filter: GamesFilter) {
    this.filter = filter;
    this.updateGraphs();
  }

  updateGraphs() {
    const filteredGames = this.filterGames.transform(this.list.games, this.filter);
    const genres = this.listService.getGenresForGames(filteredGames);

    this.genreCounts = genres.map(genre => filteredGames.filter(game => game.genres.includes(genre)).length);
    this.genreLabels = genres;

    const platforms = this.listService.getPlatformsForGames(filteredGames);

    this.platformCounts = platforms.map(platform => filteredGames.filter(game => game.platform === platform).length);
    this.platformLabels = platforms;

    this.secondsPlayed = filteredGames.reduce((total, game) => game.secondsPlayed + total, 0);

    console.log('update graphs', filteredGames);
  }
}
