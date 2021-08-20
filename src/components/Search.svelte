<script>
  import { format, fromUnixTime } from 'date-fns';
  import { link } from 'svelte-routing';

  import { functions } from '../firebase';
  import { gamesForIds } from '../lists';

  import Cover from './Cover.svelte';

  let results = [];
  let timer;
  let lastSearchTime = -Infinity;
  let dropdownOpen = false;
  let resultsLoading = false;

  const DEBOUNCE_TIMEOUT = 200;
  const MIN_SEARCH_CHARACTERS = 3;

  $: games = gamesForIds(results.map(i => i.id));

  async function search(search) {
    const searchGames = functions.httpsCallable('search-searchGames');

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
          {#each results as result}
            {#if $games[result.id]}
              <a href='/games/{result.slug}' use:link class="dropdown-item is-flex is-align-items-center">
                <span class="mr-1">
                  <Cover game={$games[result.id]} size='micro' />
                </span>
                <span class="mr-1">{result.name}</span>
                {#if $games[result.id].first_release_date}
                  <span class="has-text-grey-light">({format(fromUnixTime($games[result.id].first_release_date), 'yyyy')})</span>
                {/if}
              </a>
            {/if}
          {/each}
        {:else}
            No results found
        {/if}
      {/if}
    </div>
  </nav>
</div>

