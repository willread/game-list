<script>
  import { createEventDispatcher } from 'svelte';

  import { functions } from './firebase';

  let results = [];
  let timer;

  const dispatch = createEventDispatcher();

  function addListItem(listItem) {
    dispatch('add-list-item', listItem);
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
</script>

<input on:input={debounce} />
<ul>
  {#each results as game}
    <li on:click={addListItem({gameId: game.id})}>{game.name}</li>
  {/each}
</ul>
