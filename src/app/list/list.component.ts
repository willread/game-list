import { Component, OnInit } from '@angular/core';

import { ListService, Game } from '../list.service';

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

  remove(game: Game) {
    this.listService.removeFromList(game);
  }
}
