<script>
  import { gamesForIds, listItemsForId, lists } from '../lists';
  import MoveToList from './MoveToList.svelte';
  import { platforms } from '../services/platforms';

  export let listId;

  $: listItems = listItemsForId(listId);
  $: games = gamesForIds($listItems.map(i => i.gameId));

  function removeListItem(listItem) {
    listItems.remove(listItem.id);
  }

  function moveListItem(listItemId, newListId) {
    listItems.move(listItemId, newListId);
  }
</script>

<ul>
  {#if $listItems}
    {#each $listItems as listItem}
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
