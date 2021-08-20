<script>
  import ListItems from './components/ListItems.svelte';
  import { lists } from './lists';

  export let slug;

  $: list = $lists.find(l => l.slug === slug);

  function remove() {
    lists.remove(list.id);
  }

  function update() {
    lists.update(list).then(newDoc => console.log('new doc', newDoc));
  }
</script>

{#if list}
  <input bind:value={list.name}>
  <button on:click={update}>Update</button>
  <button on:click={remove}>X</button>

  <ListItems listId={list.id} />
{/if}
