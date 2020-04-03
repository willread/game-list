import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { List, ListService } from '../list.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public list: List;

  constructor(
    private activatedRoute: ActivatedRoute,
    private listService: ListService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(first()).subscribe(params => {
      this.listService.getList(params.get('id'))
        .subscribe(list => this.list = list);
    });
  }

}
