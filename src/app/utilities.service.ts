import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public timeFromSeconds(seconds: number): HoursMinutesSeconds {
    const h = Math.floor(seconds / SECONDS_IN_HOUR);
    const m = Math.floor((seconds - h * SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
    const s = Math.floor((seconds - h * SECONDS_IN_HOUR - m * SECONDS_IN_MINUTE));

    return { hours: h, minutes: m, seconds: s };
  }
}

export interface HoursMinutesSeconds {
  hours: number;
  minutes: number;
  seconds: number;
}

export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;
