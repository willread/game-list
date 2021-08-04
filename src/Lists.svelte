<script>
  import firebase from 'firebase/app';
  import { collectionData } from 'rxfire/firestore';
  import { startWith } from 'rxjs/operators';

  import { db } from './firebase';
  import List from './List.svelte';

  export let uid;

  const listsRef = db.collection('lists');

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
      <List list={list}/>
    </li>
	{/each}
</ul>

<h1>New List</h1>

<input bind:value={newListName} placeholder="Name">
<button on:click={addList}>Add</button>
