<script>
  import { collectionData } from 'rxfire/firestore';
  import { map, startWith, reduce, tap } from 'rxjs';

  import { db, firestore, functions } from './firebase';

  export let list;

  const listRef = db.collection('lists').doc(list.id);
  const listItemsRef = listRef.collection('listItems');
  const gamesRef = db.collection('games');
  let results = [];
  let timer;
  let gamesById = {};
  let listItems;

  function updateGames(gameIds) {
    if (!gameIds || !gameIds.length) { return; }
    const gamesQuery = gamesRef.where(firestore.FieldPath.documentId(), 'in', gameIds);
    collectionData(gamesQuery, 'id')
      .pipe(startWith([]))
      .pipe(tap(games => gamesById = games.reduce((obj, game) => ({[game.id]: game, ...obj}), {})))
      .subscribe();
  }

  listRef.onSnapshot(updateListItems);

  function updateListItems() {
    listItems = collectionData(listItemsRef, 'id')
      .pipe(startWith([]))
      .pipe(tap(listItems => updateGames(listItems.map(l => l.gameId.toString()))));
  }

  function remove() {
    listRef.delete();
  }

  function update() {
    listRef.update(list);
  }

  function addListItem({...gameId}) {
    listItemsRef.add(gameId);
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
    console.log(gamesById);
    console.log($listItems);
  }
</script>

<input bind:value={list.name}>
<button on:click={update}>Update</button>
<button on:click={remove}>X</button>
<button on:click={test}>Test</button>
<ul>
  {#if $listItems}
    {#each $listItems as listItem}
      <li>
        {listItem.gameId}:
        {#if gamesById && gamesById[listItem.gameId]}
          {gamesById[listItem.gameId].name}
        {/if}
      </li>
    {/each}
  {/if}
</ul>

<hr />

<input on:input={debounce} />
<ul>
  {#each results as game}
    <li on:click={addListItem({gameId: game.id})}>{game.name}</li>
  {/each}
</ul>
