import { Component, OnInit } from '@angular/core';

import { ListService } from '../list.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(
    public listService: ListService
  ) { }

  ngOnInit(): void {
  }

  remove(game: any) {
    this.listService.removeFromList(game);
  }
}
