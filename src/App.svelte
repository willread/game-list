<script>
  import { Router } from 'svelte-routing';

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
</Router>
