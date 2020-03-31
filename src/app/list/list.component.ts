import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { GameComponent } from '../game/game.component'
import { ListService, Game } from '../list.service'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  constructor(
    public listService: ListService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  remove(game: Game) {
    this.listService.removeFromList(game)
  }

  showGame(game: Game) {
    this.dialog.open(GameComponent, { data: game })
  }
}
