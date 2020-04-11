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
    const time = this.utilities.timeFromSeconds(seconds);
    let formatted = `${time.hours}:${time.minutes}:${time.seconds}`;

    return formatted;
  }

}
