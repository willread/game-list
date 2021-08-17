<script>
  export let game;
  export let size = 'default';

  const sizes = {
    default: { igdbSize: 'cover_small' },
    micro: { igdbSize: 'micro', bulmaSize: '24x24' },
  };

  const DEFAULT_URL = '';

  $: url = game && game.cover ? game.cover.url.replace(/\/t_[a-z_]+\//i, `\/t_${sizes[size].igdbSize}\/`) : DEFAULT_URL;
</script>

<div>
  <img class='image {sizes[size].bulmaSize ? `is-${sizes[size].bulmaSize}` : ''}' alt='' src={url}>
</div>
