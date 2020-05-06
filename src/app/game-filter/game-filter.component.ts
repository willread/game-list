import { Component, OnInit, Inject, Input, Optional, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { first } from 'rxjs/operators';
import * as equal from 'fast-deep-equal';

import { ListGame, ListService } from '../services/list.service';
import { GamesFilter } from '../pipes/filter-games.pipe'

@Component({
  selector: 'app-game-filter',
  templateUrl: './game-filter.component.html',
  styleUrls: ['./game-filter.component.scss']
})
export class GameFilterComponent implements OnInit {
  @Input() listGames: ListGame[];
  @Output() filterChanged = new EventEmitter<GamesFilter>();

  public form = new FormGroup({
    platform: new FormControl(),
    genre: new FormControl(),
    query: new FormControl(),
    status: new FormControl(),
    sort: new FormControl()
  });
  public genres: string[];
  public platforms: string[];
  public sortOptions = [
    { id: 'name', key: 'name', label: 'Name &#8593;', desc: false },
    { id: 'name-desc', key: 'name', label: 'Name &#8595;', desc: true },
    { id: 'status', key: 'status', label: 'Status', desc: false },
    { id: 'time', key: 'secondsPlayed', label: 'Time Played &#8593;', desc: false },
    { id: 'time-desc', key: 'secondsPlayed', label: 'Time Played &#8595;', desc: true }
  ];

  private defaults = {
    platform: '',
    query: '',
    genre: '',
    status: '',
    sort: this.sortOptions[0]
  };

  constructor(
    public listService: ListService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) private bottomSheetData,
    @Optional() @Inject(MatBottomSheetRef) private bottomSheet
  ) { }

  ngOnInit(): void {
    if (this.bottomSheetData) {
      this.listGames = this.bottomSheetData.listGames;
    }

    this.initializeForm();

    this.form.valueChanges.subscribe(value => {
      this.updateQueryParams();
      this.updateFilter();
    });

    this.platforms = this.listService.getPlatformsForGames(this.listGames.map(g => g.game));
    this.genres = this.listService.getGenresForGames(this.listGames.map(g => g.game));

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
      },
      default: this.defaultValues
    });
  }

  public initializeForm() {
    this.activatedRoute.queryParamMap.pipe(first()).subscribe(params => {
      this.form.setValue({
        platform: params.get('platform') || '',
        query: params.get('query') || '',
        genre: params.get('genre') || '',
        status: params.get('status') || '',
        sort: this.sortOptions.find(sort => sort.id === (params.get('sort') || '')) || this.sortOptions[0]
      });
    });
  }

  public reset() {
    this.form.setValue(this.defaults);
  }

  public get defaultValues() {
    return equal(this.form.getRawValue(), this.defaults);
  }

  public dismissBottomSheet() {
    if (this.bottomSheet) {
      this.bottomSheet.dismiss();
    }
  }
}
