import { Pipe, PipeTransform } from '@angular/core';
import { Ng2SearchPipe } from 'ng2-search-filter';

import { GameStatus, ListGame } from './list.service';

const filterValueMap = {
  platform: v => v.game,
  genres: v => v.game,
  name: v => v.game
};

@Pipe({
  name: 'filterGames'
})
export class FilterGamesPipe implements PipeTransform {
  constructor(public searchPipe: Ng2SearchPipe) {}

  public transform(games: ListGame[], filter: GamesFilter) {
    if (!filter) {
      return games;
    }

    const filteredGames = (games || []).filter(listGame => {
      return Object.keys(filter.filters || {}).every(key => {
        if (typeof filter.filters[key] === 'undefined' || filter.filters[key] === '') {
          return true;
        }

        const value = filterValueMap[key] ? filterValueMap[key](listGame)[key] : listGame[key];

        if (Array.isArray(value)) {
          return value.includes(filter.filters[key]);
        }

        return value === filter.filters[key];
      });
    });

    const searchedGames = this.searchPipe.transform(filteredGames, filter.query);
    const sortedGames = searchedGames.sort((a: ListGame, b: ListGame) => {
      const key = filter.sort.key;
      const aValue = filterValueMap[key] ? filterValueMap[key](a)[key] : a[key];
      const bValue = filterValueMap[key] ? filterValueMap[key](b)[key] : b[key];

      return aValue.toString().localeCompare(bValue.toString());
    });

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
