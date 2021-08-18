<script>
  import { gameForId } from './lists';
  import AddToList from './components/AddToList.svelte';
  import Cover from './components/Cover.svelte';

  export let id;

  $: game = gameForId(id);
</script>

{#if $game}
  <h1>{$game.name}</h1>
  <Cover game={$game}></Cover>
  <AddToList game={$game} />
{/if}
