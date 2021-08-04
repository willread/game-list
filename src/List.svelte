<script>
  import { collectionData } from 'rxfire/firestore';
  import { startWith, tap } from 'rxjs';
  import { createEventDispatcher } from 'svelte';

  import { db, firestore, functions } from './firebase';

  export let list;

  let results = [];
  let timer;

  const dispatch = createEventDispatcher();
  const gamesRef = db.collection('games');
  const gamesQuery = gamesRef.where(firestore.FieldPath.documentId(), 'in', list.games.map(id => id.toString()));
  const games = collectionData(gamesQuery, 'id')
    .pipe(startWith([]))
    .pipe(tap(games => console.log('games', games)));
  console.log('games', games);

  function remove() {
		dispatch('remove', { id: list.id });
	}

  function update() {
    dispatch('update', list);
  }

  function addGame(id) {
    dispatch('add-game', { listId: list.id, gameId: id });
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

	function debounce(e) {
    clearTimeout(timer);
		timer = setTimeout(() => {
      search(e.target.value);
		}, 100);
	}

  function test() {
    console.log(list);
  }
</script>

<input bind:value={list.name}>
<button on:click={update}>Update</button>
<button on:click={remove}>X</button>
<button on:click={test}>Test</button>
<ul>
  {#if $games}
    {#each $games as game}
      <li>{game.name}</li>
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
