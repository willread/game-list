import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SingleDataSet, Label } from 'ng2-charts';

import { List, ListService } from '../list.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public list: List;
  public genreCounts: SingleDataSet;
  public genreLabels: Label[];
  public platformCounts: SingleDataSet;
  public platformLabels: Label[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(first()).subscribe(params => {
      this.listService.getList(params.get('id'))
        .subscribe(list => {
          const genres = this.listService.getGenresForList(list);

          this.genreCounts = genres.map(genre => list.games.filter(game => game.genres.includes(genre)).length);
          this.genreLabels = genres;

          const platforms = this.listService.getPlatformsForList(list);

          this.platformCounts = platforms.map(platform => list.games.filter(game => game.platform === platform).length);
          this.platformLabels = platforms;

          this.list = list;
        });
    });
  }

}
