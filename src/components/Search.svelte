<script>
  import { format, fromUnixTime } from 'date-fns';
  import { link } from 'svelte-routing';

  import { clickOutside } from '../actions/clickOutside';
  import { functions } from '../firebase';

  import Cover from './Cover.svelte';

  let query;
  let results = [];
  let timer;
  let lastSearchTime = -Infinity;
  let dropdownOpen = false;
  let resultsLoading = false;

  const DEBOUNCE_TIMEOUT = 200;
  const MIN_SEARCH_CHARACTERS = 3;

  async function search(search) {
    const searchGames = functions.httpsCallable('igdb-searchGames');

    lastSearchTime = (new Date()).getTime();

    try {
      resultsLoading = true;
      openDropdown();

      const newResults = (await searchGames({ search: search })).data;

      if ((new Date()).getTime() >= lastSearchTime) {
        results = newResults;
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
  @use '../styles/dropdown';
  @use '../styles/input';

  .dropdown-wrapper {
    @include dropdown.wrapper();
  }

  .dropdown-menu {
    @include dropdown.container();

    &.is-visible {
      @include dropdown.is-visible();
    }
  }

  .dropdown-content {
    max-height: 200px;
    overflow: auto;
  }

  .input {
    @include input.wrapper();

    input {
      @include input.control();
    }
  }
</style>

<div class="dropdown-wrapper" use:clickOutside on:click-outside={closeDropdown}>
  <div class="dropdown-trigger" aria-haspopup="true" aria-controls="dropdown-menu">
    <div class="input">
      <input on:input={debounce} on:focus={openDropdown} bind:value={query} />
    </div>
  </div>
  <nav class="dropdown-menu {dropdownOpen ? 'is-visible' : ''}" role="menu">
    <div class="dropdown-content">
      {#if resultsLoading}
        <div class="spinner"></div>
      {:else}
        {#if results.length}
          {#each results as result}
            <a href='/games/{result.slug}' use:link on:click={handleClickResult}>
              <span class="cover">
                <Cover game={result} size='micro' />
              </span>
              <span class="name">{result.name}</span>
              {#if result.first_release_date}
                <span class="meta">({format(fromUnixTime(result.first_release_date), 'yyyy')})</span>
              {/if}
            </a>
          {/each}
        {:else}
          <span class="no-results">No results found</span>
        {/if}
      {/if}
    </div>
  </nav>
</div>

