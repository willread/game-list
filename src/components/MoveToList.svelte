<script>
  import { lists } from '../lists';
  import { toasts } from '../services/toasts';

  export let listItemId;
  export let listItems;

  let newListId;

  function move() {
    const newList = $lists.find(l => l.id === newListId);

    listItems.move(listItemId, newListId);
    toasts.add({message: `Moved game to <b>${newList.name}</b>`, allowHTML: true, color: 'success'})
  }
</script>

<div class="select">
  <select bind:value={newListId}>
    {#each $lists as list}
      <option value={list.id}>{list.name}</option>
    {/each}
  </select>
</div>
<button on:click={move}>Move</button>
