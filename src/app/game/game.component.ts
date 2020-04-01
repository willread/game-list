import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

import { Game, ListService } from '../list.service';

const PLAY_START_TIMES_KEY = 'play-start-times';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  public game: Game;
  public status = new FormControl('');
  public playStartTime: Date;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    public listService: ListService
  ) {
    this.game = data;
  }

  ngOnInit() {
    this.playStartTime = this.getStoredPlayStartTime();

    this.status.setValue(this.game.status);
    this.status.valueChanges.subscribe(status => this.listService.setStatus(this.game, status));
  }

  ngOnDestroy() {
  }

  startPlaying() {
    this.playStartTime = new Date();
    this.setStoredPlayStartTime(this.playStartTime);
  }

  stopPlaying() {
    this.listService.logTime(this.game, this.secondsPlayed);
    this.setStoredPlayStartTime(null);
    delete this.playStartTime;
  }

  get secondsPlayed(): number {
    if (!this.playStartTime) { return 0; }

    return Math.floor(((new Date()).getTime() - this.playStartTime.getTime()) / 1000);
  }

  getStoredPlayStartTime(): Date | undefined {
    const playStartTimes = this.storage.get(PLAY_START_TIMES_KEY) || {};

    if (playStartTimes[this.game._id]) {
      return new Date(playStartTimes[this.game._id]);
    }
  }

  setStoredPlayStartTime(date: Date | null) {
    const playStartTimes = this.storage.get(PLAY_START_TIMES_KEY) || {};

    if (date === null) {
      delete playStartTimes[this.game._id];
    } else {
      playStartTimes[this.game._id] = date.getTime();
    }
    this.storage.set(PLAY_START_TIMES_KEY, playStartTimes);
  }
}
