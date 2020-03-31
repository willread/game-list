import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Game } from '../list.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public game: Game;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.game = data;
  }

  ngOnInit(): void {
  }

}
