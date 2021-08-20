<script>
  import { Link } from 'svelte-routing';

  import { lists } from './lists';
  import { toasts } from './services/toasts';

  let newListName = '';

  function addList() {
    try {
      lists.add({ name: newListName });
      newListName = '';
    } catch(e) {
      if (e.name === 'NameTakenError') {
        toasts.add({message: 'This name is already taken', color: 'danger'});
      }
    }
  }
</script>

<h1>My Lists ({$lists.length})</h1>
<ul>
	{#each $lists as list}
    <li>
      {#if list.slug}
        <Link to="/lists/{list.slug}">{list.name}</Link>
      {/if}
    </li>
	{/each}
</ul>

<h1>New List</h1>

<input bind:value={newListName} placeholder="Name">
<button on:click={addList}>Add</button>
