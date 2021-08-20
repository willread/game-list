<script>
  import 'bulma/css/bulma.css';
  import { Route, Router } from 'svelte-routing';

  import Navbar from './components/Navbar.svelte';
  import Toasts from './components/Toasts.svelte';
  import Game from './Game.svelte';
  import List from './List.svelte';
  import Lists from './Lists.svelte';
  import Profile from './Profile.svelte';
  import ProtectedRoute from './ProtectedRoute.svelte';

  export let url = '';
</script>

<Router url="{url}">
  <Navbar />

  <ProtectedRoute path="profile" component="{Profile}" />
  <ProtectedRoute path="lists" component="{Lists}" />
  <ProtectedRoute path="lists/:slug" component="{List}" />
  <Route path="games/:slug" component="{Game}" />

  <Toasts />
</Router>
