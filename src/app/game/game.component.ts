import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { Game, ListService } from '../list.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public game: Game;
  public status = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public listService: ListService
  ) {
    this.game = data;
  }

  ngOnInit(): void {
    this.status.setValue(this.game.status);
    this.status.valueChanges.subscribe(status => this.listService.setStatus(this.game, status));
  }

}
