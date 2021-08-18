<script>
  import { Route, Router } from 'svelte-routing';

  import Game from './Game.svelte';
  import List from './List.svelte';
  import Lists from './Lists.svelte';
  import Navbar from './Navbar.svelte';
  import Profile from './Profile.svelte';
  import ProtectedRoute from './ProtectedRoute.svelte';

  export let url = '';
</script>

<Router url="{url}">
  <Navbar />

  <ProtectedRoute path="profile" component="{Profile}" />
  <ProtectedRoute path="lists" component="{Lists}" />
  <ProtectedRoute path="lists/:id" component="{List}" />
  <Route path="games/:id" component="{Game}" />
</Router>
