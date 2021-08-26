<script>
  import { db } from './firebase';
  import { gameForSlug } from './lists';
  import AddToList from './components/AddToList.svelte';
  import Cover from './components/Cover.svelte';

  export let slug;

  $: game = gameForSlug(slug);

  db.collection('games').doc('159171').get().then(doc => console.log(doc.data()));
</script>

{#if $game}
  <h1>{$game.name}</h1>
  <Cover game={$game}></Cover>
  <AddToList game={$game} />
{/if}
