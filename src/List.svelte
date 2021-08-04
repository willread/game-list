<script>
  import { collectionData } from 'rxfire/firestore';
  import { startWith, tap } from 'rxjs';

  import { db, firestore, functions } from './firebase';

  export let list;

  const MAX_LIST_SIZE = 10000; // We need to keep the document size under 1MB so some limit is needed here
  const listRef = db.collection('lists').doc(list.id);
  let results = [];
  let timer;

  const gamesRef = db.collection('games');
  const gamesQuery = gamesRef.where(firestore.FieldPath.documentId(), 'in', list.games.map(id => id.toString()));
  const games = collectionData(gamesQuery, 'id')
    .pipe(startWith([]));

  function remove() {
    listRef.delete();
  }

  function update() {
    listRef.update(list);
  }

  function addGame(gameId) {
    const games = Array.isArray(list.games) ? list.games : [];

    if (games.includes(gameId)) {
      return;
    }

    if (games.length >= MAX_LIST_SIZE) {
      // todo: handle list being full
      return;
    }

    listRef.update({ games: games.concat(gameId) });
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
