<script>
  import { createEventDispatcher } from 'svelte';

  export let list;

  const dispatch = createEventDispatcher();

  function remove() {
		dispatch('remove', { id: list.id });
	}

  function update() {
    dispatch('update', list);
  }
</script>

<input bind:value={list.name}>
<button on:click={update}>Update</button>
<button on:click={remove}>X</button>
