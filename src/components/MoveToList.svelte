<script>
  import { lists } from '../lists';

  export let listItemId;
  export let listItems;

  let newListId;

  function move() {
    listItems.move(listItemId, newListId);
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
