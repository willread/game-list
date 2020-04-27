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
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
  }

}
