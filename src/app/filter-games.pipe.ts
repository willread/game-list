import { Pipe, PipeTransform } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';

import { GameStatus } from './list.service';

@Pipe({
  name: 'filterGames'
})
export class FilterGamesPipe implements PipeTransform {
  constructor(public searchPipe: Ng2SearchPipe) {}

  public transform(games, filter: GamesFilter) {
    if (!filter) {
      return games;
    }

    const filteredGames = (games || []).filter(game => {
      return Object.keys(filter.filters || {}).every(key => {
        if (typeof filter.filters[key] === 'undefined' || filter.filters[key] === '') {
          return true;
        }

        if (Array.isArray(game[key])) {
          return game[key].includes(filter.filters[key]);
        }

        return game[key] === filter.filters[key];
      });
    });

    const searchedGames = this.searchPipe.transform(filteredGames, filter.query);
    const sortedGames = searchedGames.sort((a, b) => a[filter.sort.key].toString().localeCompare(b[filter.sort.key].toString()));

    return filter.sort.desc ? sortedGames.reverse() : sortedGames;
  }
}

export interface GamesFilter {
  query: string,
  sort: {
    key: string,
    desc: boolean
  },
  filters: {
    platform: string,
    genres: string,
    status: GameStatus
  }
}
