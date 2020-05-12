import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Label } from 'ng2-charts';
import * as patternomaly from 'patternomaly';

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
  public genreCounts: any;
  public genreLabels: Label[];
  public platformCounts: any;
  public platformLabels: Label[];
  public secondsPlayed: number;
  public currentlyPlaying: Game;
  public genreCount: number;
  public platformCount: number;
  public finishedGamesCount: number;
  public unplayedGamesCount: number;
  public activities: Activity[];
  public alias: string;
  public chartColors = [

    // Kelly's 22 colors of maximum contrast

    '#FFB300', '#803E75', '#FF6800', '#A6BDD7', '#C10020', '#CEA262',
    '#817066', '#007D34', '#F6768E', '#00538A', '#FF7A5C', '#53377A',
    '#FF8E00', '#B32851', '#F4C800', '#7F180D', '#93AA00', '#593315',
    '#F13A13', '#232C16'
  ];
  public chartPatterns = [ null, 'diagonal', 'triangle', 'zigzag', 'square', 'dot', 'weave', 'disc', 'line-vertical','diamond' ];
  public chartColoredPatterns = (() => {
    const patterns = [];

    this.chartPatterns.forEach(pattern => {
      this.chartColors.forEach(color => {
        // @ts-ignore: Expression expected error
        const fill = pattern ? patternomaly.draw(pattern, color) : color;
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        patterns.push({
          fill,
          dataUrl: this.sanitizer.bypassSecurityTrustStyle(`url(${canvas.toDataURL()})`)
        });
      });
    });

    return patterns;
  })();
  public chartColorsWrapped = [{ backgroundColor: this.chartColoredPatterns.map(p => p.fill) }];

  public chartOptions = {
    responsive: true,
    tooltips: {
      borderWidth: 1,
      borderColor: '#fff',
    },
    borderWidth: 0,
    cutoutPercentage: 30,
    legend: {
      display: false
    }
  }

  @ViewChild(GameFilterComponent)
  public gameFilterComponent: GameFilterComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService,
    private filterGames: FilterGamesPipe,
    private apiService: ApiService,
    private bottomSheet: MatBottomSheet,
    private sanitizer: DomSanitizer
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

    this.genreCounts = this.dataSetWrapper(genres.map(genre => filteredGames
        .map(g => g.game)
        .filter(game => game.genres.includes(genre)).length));
    this.genreLabels = genres;

    const platforms = this.listService.getPlatformsForGames(filteredGames.map(g => g.game));

    this.platformCounts = this.dataSetWrapper(platforms.map(platform => filteredGames.filter(g => g.game.platform === platform).length));
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

  dataSetWrapper(data: any[]) {
    return [{ borderWidth: 0, data }];
  }
}
