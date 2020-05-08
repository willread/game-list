import { Pipe, PipeTransform } from '@angular/core';

import { UtilitiesService } from '../services/utilities.service';

@Pipe({
  name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform {
  constructor(
    private utilities: UtilitiesService
  ) {}

  transform(seconds: number): string {
    const hh = Math.floor(seconds / 3600) < 10 ? ("00" + Math.floor(seconds / 3600)).slice(-2) : Math.floor(seconds / 3600);
    const mm = ("00" + Math.floor((seconds % 3600) / 60)).slice(-2);
    const ss = ("00" + (seconds % 3600) % 60).slice(-2);
    return hh + ":" + mm + ":" + ss;
  }

}
