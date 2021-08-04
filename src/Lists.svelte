<script>
  import firebase from 'firebase/app';
  import { collectionData } from 'rxfire/firestore';
  import { pipe } from 'rxjs';
  import { startWith } from 'rxjs/operators';

  import { db } from './firebase';
  import List from './List.svelte';

  export let uid;

  const MAX_LIST_SIZE = 10000; // We need to keep the document size under 1MB so some limit is needed here
  const listsRef = db.collection('lists');

  function removeList(event) {
    const { id } = event.detail;

    listsRef.doc(id).delete();
  }

  function updateList(event) {
    const { id, ...data } = event.detail;

    listsRef.doc(id).update(data);
  }

  async function addGame(event) {
    const { listId, gameId } = event.detail;
    const list = await listsRef.doc(listId).get();
    console.log('existing games', listId, list.games);
    let games = typeof list.games === 'Array' ? list.games : [];

    if (games.includes(gameId)) {
      return;
    }

    if (games.length >= MAX_LIST_SIZE) {
      // todo: handle list being full
      return;
    }

    games = games.concat(gameId);
    console.log('new list of games', games);

    listsRef.doc(listId).update({ games });
  }

  function addList() {
    listsRef.add({ uid, name: newListName, created: firebase.firestore.FieldValue.serverTimestamp() });
    newListName = '';
  }

  const listsQuery = listsRef.where('uid', '==', uid);
  const lists = collectionData(listsQuery, 'id')
    .pipe(startWith([]));
  let newListName = '';
</script>

<h1>My Lists ({$lists.length})</h1>
<ul>
	{#each $lists as list}
    <li>
      {list.name}:
      <List list={{...list}} on:remove={removeList} on:update={updateList} on:add-game={addGame} />
    </li>
	{/each}
</ul>

<h1>New List</h1>

<input bind:value={newListName} placeholder="Name">
<button on:click={addList}>Add</button>
