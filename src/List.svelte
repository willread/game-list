<script>
  import { createEventDispatcher } from 'svelte';

  import { functions } from './firebase';

  export let list;

  let results = [];
  let timer;

  const dispatch = createEventDispatcher();

  function remove() {
		dispatch('remove', { id: list.id });
	}

  function update() {
    dispatch('update', list);
  }

  function addGame(id) {
    list.games = list.games ? list.games.concat(id) : [id];
    update();
  }

  async function search(search) {
    const searchGames = functions.httpsCallable('searchGames');

    try {
      results = (await searchGames({ search })).data;
    } catch(e) {
      results = [];
      console.log('error', e);
    }
  }

	const debounce = e => {
    clearTimeout(timer);
		timer = setTimeout(() => {
      search(e.target.value);
		}, 100);
	}
</script>

<input bind:value={list.name}>
<button on:click={update}>Update</button>
<button on:click={remove}>X</button>
<ul>
  {#if list.games}
    {#each list.games as game}
      <li>{game}</li>
    {/each}
  {/if}
</ul>

<hr />

<input on:input={debounce} />
<ul>
  {#each results as game}
    <li on:click={addGame(game.id)}>{game.name}</li>
  {/each}
</ul>
