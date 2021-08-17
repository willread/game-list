<script>
  import { createEventDispatcher } from 'svelte';

  import { functions } from './firebase';

  let results = [];
  let timer;
  let lastSearchTime = -Infinity;
  let dropdownOpen = false;
  let resultsLoading = false;

  const DEBOUNCE_TIMEOUT = 200;
  const MIN_SEARCH_CHARACTERS = 3;
  const dispatch = createEventDispatcher();

  function addListItem(listItem) {
    dispatch('add-list-item', listItem);
    dropdownOpen = false;
  }

  async function search(search) {
    const searchGames = functions.httpsCallable('searchGames');

    lastSearchTime = (new Date()).getTime();

    try {
      resultsLoading = true;
      const newResults = (await searchGames({ search: search })).data;

      if ((new Date()).getTime() >= lastSearchTime) {
        results = newResults;
        dropdownOpen = true;
      }
    } catch(e) {
      results = [];
      // todo
    } finally {
      resultsLoading = false;
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

<div class="dropdown {dropdownOpen ? 'is-active' : ''}">
  <div class="dropdown-trigger" aria-haspopup="true" aria-controls="dropdown-menu">
    <input class="input" on:input={debounce} />
  </div>
  <nav class="dropdown-menu" role="menu">
    <div class="dropdown-content is-flex is-justify-content-center is-flex-direction-column">
      {#if resultsLoading}
        <div class="button is-disabled is-white is-loading"></div>
      {:else}
        {#if results.length}
          {#each results as game, index}
            <a class="dropdown-item" on:click={addListItem({gameId: game.id})}>
              {game.name}
            </a>
          {/each}
        {:else}
            No results found
        {/if}
      {/if}
    </div>
  </nav>
</div>
