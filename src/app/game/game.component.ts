import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { ListGame, ListService } from '../list.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public listGame: ListGame;
  public status = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public listService: ListService
  ) {
    this.listGame = data;
  }

  ngOnInit() {
    this.status.setValue(this.listGame.status);
    this.status.valueChanges.subscribe(status => this.listService.setStatus(this.listGame, status));
  }

  logTime(seconds: number) {
    this.listService.logTime(this.listGame, seconds);
  }

  updateTime(seconds: number) {
    this.listService.updateTime(this.listGame, seconds);
  }
}
