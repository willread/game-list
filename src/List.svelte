<script>
  import { createEventDispatcher } from 'svelte';

  import { functions } from './firebase';

  export let list;

  const dispatch = createEventDispatcher();

  function remove() {
		dispatch('remove', { id: list.id });
	}

  function update() {
    dispatch('update', list);
  }

  function search() {
    const searchGames = functions.httpsCallable('searchGames');
    searchGames({ search: 'doom' });
  }
</script>

<input bind:value={list.name}>
<button on:click={update}>Update</button>
<button on:click={remove}>X</button>

<hr />

<button on:click={search}>Search</button>
