<script>
  import { db } from './firebase';
  import { gameForSlug } from './lists';
  import AddToList from './components/AddToList.svelte';
  import Cover from './components/Cover.svelte';

  export let slug;

  $: game = gameForSlug(slug);
</script>

{#if $game}
  <h1>{$game.name}</h1>
  <Cover game={$game}></Cover>
  <AddToList game={$game} />
{/if}
