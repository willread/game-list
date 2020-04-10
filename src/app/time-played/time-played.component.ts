import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { ApiService, Profile } from '../api.service';
import { ListGame, ListService } from '../list.service';
import { SECONDS_IN_HOUR, SECONDS_IN_MINUTE, HoursMinutesSeconds, UtilitiesService } from '../utilities.service';

const UPDATE_DEBOUNCE_TIME = 500;
const SECONDS_PLAYED_UPDATE_INTERVAL = 500;

@Component({
  selector: 'app-time-played',
  templateUrl: './time-played.component.html',
  styleUrls: ['./time-played.component.scss']
})
export class TimePlayedComponent implements OnInit, OnDestroy {
  @Input() listGame: ListGame;

  public hours = new FormControl();
  public minutes = new FormControl();
  public seconds = new FormControl();
  public playing: boolean = false;
  public loading: boolean = true;
  public secondsPlayed: number;
  public startTime: Date;

  private profile: Profile;
  private playTimeUpdateInterval: any;
  private updatedSeconds: number;

  constructor(
    private utilities: UtilitiesService,
    private apiService: ApiService,
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.apiService.getProfile$().subscribe(
      profile => {
        this.profile = profile;

        if (profile.playing) {
          this.playing = profile.playing.listGame === this.listGame._id;

          if (this.playing) {
            this.startTime = new Date(profile.playing.startedAt);
            this.startUpdatingSecondsPlayed();
          }
        }
        this.loading = false;
      }
    );

    this.updateInputs();
    this.hours.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.updateSeconds());
    this.minutes.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.updateSeconds());
    this.seconds.valueChanges.pipe(distinctUntilChanged(), debounceTime(UPDATE_DEBOUNCE_TIME)).subscribe(() => this.updateSeconds());
  }

  ngOnDestroy() {
    this.stopUpdatingSecondsPlayed();
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
    const time = this.utilities.timeFromSeconds(this.listGame.secondsPlayed);

    this.hours.setValue(time.hours, { emitEvent: false });
    this.minutes.setValue(time.minutes, { emitEvent: false });
    this.seconds.setValue(time.seconds, { emitEvent: false });
  }

  startPlaying() {
    this.apiService.startPlaying(this.listGame);
    this.playing = true;
    this.startTime = new Date();
    this.startUpdatingSecondsPlayed();
  }

  stopPlaying() {
    this.apiService.stopPlaying$()
      .subscribe(secondsPlayed => {
        this.listGame.secondsPlayed = secondsPlayed;
        this.updateInputs();
      });
    this.playing = false;
    this.stopUpdatingSecondsPlayed();
  }

  startUpdatingSecondsPlayed() {
    this.playTimeUpdateInterval = setInterval(() => {
      this.secondsPlayed =  Math.floor(((new Date()).getTime() - this.startTime.getTime()) / 1000);
    }, SECONDS_PLAYED_UPDATE_INTERVAL);
  }

  stopUpdatingSecondsPlayed() {
    clearInterval(this.playTimeUpdateInterval);
  }

  updateSeconds() {
    const seconds = this.hours.value * SECONDS_IN_HOUR + this.minutes.value * SECONDS_IN_MINUTE + this.seconds.value;

    this.updatedSeconds = seconds;
  }

  saveUpdatedSeconds() {
    this.listService.updateTime(this.listGame, this.updatedSeconds);
    this.updatedSeconds = null;
  }

  cancelUpdatingSeconds() {
    this.updatedSeconds = null;
    this.updateInputs(fase);
  }
}
