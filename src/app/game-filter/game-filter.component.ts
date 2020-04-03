import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { Game, ListService } from '../list.service';
import { GamesFilter } from '../filter-games.pipe'

@Component({
  selector: 'app-game-filter',
  templateUrl: './game-filter.component.html',
  styleUrls: ['./game-filter.component.scss']
})
export class GameFilterComponent implements OnInit {
  @Input() games: Game[];
  @Output() filterChanged = new EventEmitter<GamesFilter>();

  public genres: string[];
  public platforms: string[];

  public form = new FormGroup({
    platform: new FormControl(),
    genre: new FormControl(),
    query: new FormControl(),
    status: new FormControl(),
    sort: new FormControl()
  })

  public sortOptions = [
    { id: 'name', key: 'name', label: 'Name (A-Z)', desc: false },
    { id: 'name-desc', key: 'name', label: 'Name (Z-A)', desc: true },
    { id: 'status', key: 'status', label: 'Status', desc: false }
  ];

  constructor(
    public listService: ListService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.pipe(first()).subscribe(params => {
      this.form.setValue({
        platform: params.get('platform') || '',
        query: params.get('query') || '',
        genre: params.get('genre') || '',
        status: params.get('status') || '',
        sort: this.sortOptions.find(sort => sort.id === (params.get('sort') || '')) || this.sortOptions[0]
      });
    });

    this.form.valueChanges.subscribe(value => {
      this.updateQueryParams();
      this.updateFilter();
    });

    this.platforms = this.listService.getPlatformsForGames(this.games);
    this.genres = this.listService.getGenresForGames(this.games);

    this.updateFilter();
  }

  updateQueryParams() {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          platform: this.form.value.platform || null,
          genre: this.form.value.genre || null,
          query: this.form.value.query || null,
          status: this.form.value.status || null,
          sort: this.form.value.sort.id || null
        },
        queryParamsHandling: 'merge'
      });
  }

  updateFilter() {
    this.filterChanged.emit({
      sort: this.form.value.sort,
      query: this.form.value.query,
      filters: {
        platform: this.form.value.platform,
        genres: this.form.value.genre,
        status: this.form.value.status
      }
    });
  }
}
