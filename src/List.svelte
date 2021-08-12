<script>
  import { functions } from './firebase';
  import { gamesForIds, listItemsForId, lists } from './lists';

  export let id;

  let results = [];
  let timer;

  $: list = $lists.find(l => l.id === id);
  $: listItems = listItemsForId(id);
  $: games = gamesForIds($listItems.map(i => i.gameId));

  function remove() {
    lists.remove(list.id);
  }

  function update() {
    lists.update(list);
  }

  function addListItem(listItem) {
    listItems.add(listItem);
  }

  function removeListItem(listItem) {
    listItems.remove(listItem.id);
  }

  async function search(search) {
    const searchGames = functions.httpsCallable('searchGames');

    try {
      results = (await searchGames({ search })).data;
    } catch(e) {
      results = [];
      // todo
    }
  }

	function debounce(e) {
    clearTimeout(timer);
		timer = setTimeout(() => {
      search(e.target.value);
		}, 100);
	}

  function test() {
    console.log('games', $games);
    console.log('list items', $listItems);
  }
</script>

{#if list}
  <input bind:value={list.name}>
  <button on:click={update}>Update</button>
  <button on:click={remove}>X</button>
  <button on:click={test}>Test</button>
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

  <hr />

  <input on:input={debounce} />
  <ul>
    {#each results as game}
      <li on:click={addListItem({gameId: game.id})}>{game.name}</li>
    {/each}
  </ul>
{/if}
