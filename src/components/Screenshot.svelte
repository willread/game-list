<script>
  export let game;

  const DEFAULT_URL = '';

  $: url = game && game.screenshots && game.screenshots.length ? game.screenshots[0] : DEFAULT_URL;
</script>

<div>
  <img alt='' src={url}>
</div>
