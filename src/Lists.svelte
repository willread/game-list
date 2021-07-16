<script>
  import { db } from './firebase';
  import firebase from 'firebase/app';
  import { collectionData } from 'rxfire/firestore';
  import { startWith } from 'rxjs/operators';

  import List from './List.svelte';

  export let uid;

  function removeList(event) {
    const { id } = event.detail;

    db.collection('lists').doc(id).delete();
  }

  function updateList(event) {
    const { id, ...data } = event.detail;

    db.collection('lists').doc(id).update(data);
  }

  function addList() {
    db.collection('lists').add({ uid, name: newListName, created: firebase.firestore.FieldValue.serverTimestamp() });
    newListName = '';
  }

  const query = db.collection('lists').where('uid', '==', uid).orderBy('created');
  const lists = collectionData(query, 'id').pipe(startWith([]));
  let newListName = '';
</script>

<h1>My Lists ({$lists.length})</h1>
<ul>
	{#each $lists as list}
    <li>
      {list.name}:
      <List list={{...list}} on:remove={removeList} on:update={updateList} />
    </li>
	{/each}
</ul>

<h1>New List</h1>

<input bind:value={newListName} placeholder="Name">
<button on:click={addList}>Add</button>
