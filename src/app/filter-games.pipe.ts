import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterGames'
})
export class FilterGamesPipe implements PipeTransform {
  public transform(games, filters: Object) {
    return (games || []).filter(game => {
      return Object.keys(filters || {}).every(key => {
        return typeof filters[key] === 'undefined' || filters[key] === '' ? true : game[key] === filters[key];
      });
    })
  }
}
