import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortGames'
})
export class SortGamesPipe implements PipeTransform {
  public transform(games, key: string, desc: boolean = false) {
    const sorted = games.sort((a, b) => (a[key] || '').toString().localeCompare((b[key] || '').toString()));

    return desc ? sorted.reverse() : sorted;
  }
}
