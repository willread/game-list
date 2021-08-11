<script>
  import { Link } from 'svelte-routing';

  import { lists } from './lists';

  let newListName = '';

  function addList() {
    lists.add({ name: newListName });
    newListName = '';
  }
</script>

<h1>My Lists ({$lists.length})</h1>
<ul>
	{#each $lists as list}
    <li>
      <Link to="/lists/{list.id}">{list.name}</Link>
    </li>
	{/each}
</ul>

<h1>New List</h1>

<input bind:value={newListName} placeholder="Name">
<button on:click={addList}>Add</button>
