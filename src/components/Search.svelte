<script>
  import { format, fromUnixTime } from 'date-fns';
  import { link } from 'svelte-routing';

  import { clickOutside } from '../actions/clickOutside';
  import { functions } from '../firebase';
  import { gamesForIds } from '../lists';

  import Cover from './Cover.svelte';

  let query;
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
        openDropdown();
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

  function openDropdown() {
    if (resultsLoading || results.length) {
      dropdownOpen = true;
    }
  }

  function closeDropdown() {
    dropdownOpen = false;
  }

  function handleClickResult() {
    closeDropdown();
    query = '';
  }
</script>

<style lang="scss">
  .dropdown-content {
    max-height: 200px;
    overflow: auto;
  }
</style>

<div class="dropdown {dropdownOpen ? 'is-active' : ''}" use:clickOutside on:click-outside={closeDropdown}>
  <div class="dropdown-trigger" aria-haspopup="true" aria-controls="dropdown-menu">
    <input class="input" on:input={debounce} on:focus={openDropdown} bind:value={query} />
  </div>
  <nav class="dropdown-menu" role="menu">
    <div class="dropdown-content is-flex is-justify-content-center is-flex-direction-column">
      {#if resultsLoading}
        <div class="button is-disabled is-white is-loading"></div>
      {:else}
        {#if results.length}
          {#each results as result}
            {#if $games[result.id]}
              <a href='/games/{result.slug}' use:link on:click={handleClickResult} class="dropdown-item is-flex is-align-items-center">
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
          <span class="has-text-dark px-3">No results found</span>
        {/if}
      {/if}
    </div>
  </nav>
</div>

