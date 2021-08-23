<script>
  import { writable } from 'svelte/store';
  import Icon from 'svelte-awesome';
  import { search as searchIcon } from 'svelte-awesome/icons';

  import { gamesForIds, listItemsForId } from '../lists';
  import MoveToList from './MoveToList.svelte';
  import { platforms } from '../services/platforms';

  export let listId;

  const sortOptions = [
    {obj: 'game', key: 'name', ascending: true, label: 'Name'},
    {obj: 'game', key: 'name', ascending: false, label: 'Name'},
  ];
  const defaultSortOption = localStorage.getItem('sortBy') || sortOptions[0];
  let sortBy = new writable(sortOptions.find(o => JSON.stringify(defaultSortOption) === JSON.stringify(o)) || sortOptions[0]);
  let filters = new writable({
    search: '',
  });
  let filteredListItems = [];

  $: listItems = listItemsForId(listId);
  $: games = gamesForIds($listItems.map(i => i.gameId));
  $: games.subscribe(() => filteredListItems = sort(filter($listItems, $filters), $sortBy));

  function filter(listItemsToFilter, filters) {
    return listItemsToFilter.filter(i => {
      const game = $games[i.gameId] || {};
      const name = (game.name || '').toLowerCase();

      let match = true;

      if (filters.search) {
        const query = filters.search.toLowerCase();
        const terms = query.split(/\s+/);

        if (!terms.every(t => name.includes(t))) {
          match = false;
        }
      }

      return match;
    });
  }

  function sort(listItemsToSort, sortBy) {
    return listItemsToSort.sort((a, b) => {
      const objA = (sortBy.obj === 'game' ? $games[a.gameId] : a) || {};
      const objB = (sortBy.obj === 'game' ? $games[b.gameId] : b) || {};
      const diff = (objA[sortBy.key] || '').localeCompare((objB[sortBy.key] || ''));

      return sortBy.ascending ? -diff : diff;
    });
  }

  function removeListItem(listItem) {
    listItems.remove(listItem.id);
  }
</script>

<span class="control has-icons-left">
  <input class="input is-small is-rounded" bind:value={$filters.search} />
  <span class="icon is-small is-left">
    <Icon data={searchIcon} />
  </span>
</span>

<div class="select">
  <select bind:value={$sortBy}>
    {#each sortOptions as sortOption}
      <option value={sortOption}>
        {sortOption.label}
        {@html sortOption.ascending ? '&uarr;' : '&darr;'}
      </option>
    {/each}
  </select>
</div>

<ul>
  {#if filteredListItems}
    {#each filteredListItems as listItem}
      <li>
        {listItem.gameId}:
        {#if $games && $games[listItem.gameId]}
          {$games[listItem.gameId].name}
          {#if $platforms[listItem.platformId]}
            ({$platforms[listItem.platformId].name})
          {/if}
          {#if listItem.notes}
            <p>{listItem.notes}</p>
          {/if}
        {/if}

        <button on:click={removeListItem(listItem)}>Remove</button>
        <MoveToList listItems={listItems} listItemId={listItem.id} />
      </li>
    {/each}
  {/if}
</ul>
