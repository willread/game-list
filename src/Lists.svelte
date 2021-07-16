<script>
  import { db } from './firebase';
  import { collectionData } from 'rxfire/firestore';
  import { startWith } from 'rxjs/operators';

  export let uid;

  const query = db.collection('lists').where('uid', '==', uid).orderBy('created');
  const lists = collectionData(query, 'id').pipe(startWith([]));
</script>

<h1>My Lists ({$lists.length})</h1>
<h1>{uid}</h1>
<ul>
	{#each $lists as list}
    {list.name}
	{/each}
</ul>
