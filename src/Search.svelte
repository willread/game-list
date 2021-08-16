<script>
  import { createEventDispatcher } from 'svelte';

  import { functions } from './firebase';

  let results = [];
  let timer;
  let lastSearchTime = -Infinity;

  const DEBOUNCE_TIMEOUT = 200;
  const MIN_SEARCH_CHARACTERS = 3;
  const dispatch = createEventDispatcher();

  function addListItem(listItem) {
    dispatch('add-list-item', listItem);
  }

  async function search(search) {
    const searchGames = functions.httpsCallable('searchGames');

    lastSearchTime = (new Date()).getTime();

    try {
      const newResults = (await searchGames({ search: search })).data;

      if ((new Date()).getTime() >= lastSearchTime) {
        results = newResults;
      }
    } catch(e) {
      results = [];
      // todo
    }
  }

	function debounce(e) {
    clearTimeout(timer);

    if (e.target.value.length > MIN_SEARCH_CHARACTERS) {
      timer = setTimeout(() => {
        search(e.target.value);
      }, DEBOUNCE_TIMEOUT);
    }
	}
</script>

<input on:input={debounce} />
<ul>
  {#each results as game}
    <li on:click={addListItem({gameId: game.id})}>{game.name}</li>
  {/each}
</ul>
