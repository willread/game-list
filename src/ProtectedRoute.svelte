<script>
  import { Route } from 'svelte-routing';
  import { user } from './auth';

  import Error403 from './Error403.svelte';

  export let path;
  export let component;
</script>

{#if $user}
  <Route path={path} component={component} />
{:else}
  <Route path={path} component={Error403} />
{/if}
