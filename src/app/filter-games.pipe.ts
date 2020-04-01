import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'filterGames'
})
export class FilterGamesPipe implements PipeTransform {
  public transform(games, filters: Object) {
    return (games || []).filter(game => {
      return Object.keys(filters || {}).every(key => {
        if (typeof filters[key] === 'undefined' || filters[key] === '') {
          return true;
        }

        if (isArray(game[key])) {
          return game[key].includes(filters[key]);
        }

        return game[key] === filters[key];
      });
    })
  }
}
