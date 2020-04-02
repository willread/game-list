import { Component, OnInit, Input, Output, Inject, OnDestroy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Game } from '../list.service';

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;
const PLAY_START_TIMES_KEY = 'play-start-times';
const UPDATE_DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-time-played',
  templateUrl: './time-played.component.html',
  styleUrls: ['./time-played.component.scss']
})
export class TimePlayedComponent implements OnInit, OnDestroy {
  @Input() game: Game;
  @Output() finishedPlaying = new EventEmitter<number>();
  @Output() secondsChanged = new EventEmitter<number>();

  public hours = new FormControl();
  public minutes = new FormControl();
  public seconds = new FormControl();
  public totalSecondsPlayed: number;
  public playing: boolean = false;

  private playTimeInputValueUpdateInterval;
  private _playStartTime;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService
  ) { }

  ngOnInit(): void {
    if (this.playStartTime) {
      this.continuePlaying();
    }

    this.updateInputs();
    this.hours.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.emitSecondsIfEnabled());
    this.minutes.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.emitSecondsIfEnabled());
    this.seconds.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.emitSecondsIfEnabled());
  }

  ngOnDestroy() {
    clearInterval(this.playTimeInputValueUpdateInterval);
  }

  disableInputs() {
    this.hours.disable();
    this.minutes.disable();
    this.seconds.disable();
  }

  enableInputs() {
    this.hours.enable();
    this.minutes.enable();
    this.seconds.enable();
  }

  updateInputs() {
    this.hours.setValue(this.totalTime.hours);
    this.minutes.setValue(this.totalTime.minutes);
    this.seconds.setValue(this.totalTime.seconds);
  }

  timeFromSeconds(seconds: number): HoursMinutesSeconds {
    const h = Math.floor(seconds / SECONDS_IN_HOUR);
    const m = Math.floor((seconds - h * SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    const s = Math.floor((seconds - h * SECONDS_IN_HOUR - m * SECONDS_IN_MINUTE));

    return { hours: h, minutes: m, seconds: s };
  }

  get secondsPlayed(): number {
    return this.hours.value * SECONDS_IN_HOUR + this.minutes.value * SECONDS_IN_MINUTE + this.seconds.value;
  }

  startPlaying() {
    this.playStartTime = new Date();
    this.continuePlaying();
  }

  continuePlaying() {
    this.playing = true;
    this.disableInputs();

    this.playTimeInputValueUpdateInterval = setInterval(() => {
      if (this.playStartTime) {
        this.updateInputs();
      }
    }, 1000);
  }

  stopPlaying() {
    this.finishedPlaying.emit(this.secondsPlayedSincePlayStarted);
    this.playStartTime = null;
    clearInterval(this.playTimeInputValueUpdateInterval);

    setTimeout(() => this.enableInputs());
  }

  emitSecondsIfEnabled() {
    if (this.hours.enabled) {
      const seconds = this.hours.value * SECONDS_IN_HOUR + this.minutes.value * SECONDS_IN_MINUTE + this.seconds.value;
      this.secondsChanged.emit(seconds);
    }
  }

  get totalSeconds(): number {
    return this.game.secondsPlayed + this.secondsPlayedSincePlayStarted;
  }

  get totalTime(): HoursMinutesSeconds {
    return this.timeFromSeconds(this.totalSeconds);
  }

  get secondsPlayedSincePlayStarted(): number {
    if (!this.playStartTime) { return 0; }
    return Math.floor(((new Date()).getTime() - this.playStartTime.getTime()) / 1000);
  }

  get playStartTime(): Date | undefined | null {
    if (this._playStartTime) {
      return this._playStartTime;
    }

    const playStartTimes = this.storage.get(PLAY_START_TIMES_KEY) || {};

    if (playStartTimes[this.game._id]) {
      this._playStartTime = new Date(playStartTimes[this.game._id]);
    }

    return this._playStartTime;
  }

  set playStartTime(date: Date | null) {
    const playStartTimes = this.storage.get(PLAY_START_TIMES_KEY) || {};

    if (date === null) {
      delete playStartTimes[this.game._id];
    } else {
      playStartTimes[this.game._id] = date.getTime();
    }
    this.storage.set(PLAY_START_TIMES_KEY, playStartTimes);
    this._playStartTime = date;
  }
}

interface HoursMinutesSeconds {
  hours: number;
  minutes: number;
  seconds: number;
}
