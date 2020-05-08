import { Component, Input, OnInit } from '@angular/core';

import { ListGame } from '../services/list.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {
  @Input() public listGame: ListGame;

  constructor() { }

  ngOnInit(): void {
  }

}
