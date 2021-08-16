<script>
  import { gamesForIds, listItemsForId, lists } from './lists';
  import Search from './Search.svelte';

  export let id;

  $: list = $lists.find(l => l.id === id);
  $: listItems = listItemsForId(id);
  $: games = gamesForIds($listItems.map(i => i.gameId));

  function remove() {
    lists.remove(list.id);
  }

  function update() {
    lists.update(list);
  }

  function removeListItem(listItem) {
    listItems.remove(listItem.id);
  }

  function handleAddListItem(event) {
    const listItem = {...event.detail};

    listItems.add(listItem);
  }
</script>

{#if list}
  <input bind:value={list.name}>
  <button on:click={update}>Update</button>
  <button on:click={remove}>X</button>
  <ul>
    {#if $listItems}
      {#each $listItems as listItem}
        <li>
          {listItem.gameId}:
          {#if $games && $games[listItem.gameId]}
            {$games[listItem.gameId].name}
          {/if}
          <button on:click={removeListItem(listItem)}>X</button>
        </li>
      {/each}
    {/if}
  </ul>

  <Search on:add-list-item={handleAddListItem} />
{/if}
