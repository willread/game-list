import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { ListGame, ListService } from '../services/list.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public listGame: ListGame;
  public status = new FormControl('');
  public digitalCopy = new FormControl(false);
  public physicalCopy = new FormControl(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public listService: ListService,
    public dialogRef: MatDialogRef<GameComponent>
  ) {
    this.listGame = data;
  }

  ngOnInit() {
    this.status.setValue(this.listGame.status);
    this.status.valueChanges.subscribe(status => this.listService.updateListGame(this.listGame, { status }));

    this.digitalCopy.setValue(this.listGame.digitalCopy);
    this.digitalCopy.valueChanges.subscribe(digitalCopy => this.listService.updateListGame(this.listGame, { digitalCopy }));

    this.physicalCopy.setValue(this.listGame.physicalCopy);
    this.physicalCopy.valueChanges.subscribe(physicalCopy => this.listService.updateListGame(this.listGame, { physicalCopy }));

    this.listService.updateList();
  }

  remove() {
    if (confirm('Are you sure?')) {
      this.listService.removeFromList(this.listGame);
      this.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
