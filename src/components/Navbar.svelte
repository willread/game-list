<script>
  import { Link, navigate } from 'svelte-routing';

  import { auth, googleProvider } from '../firebase';
  import { user } from '../auth';

  import Search from './Search.svelte';

  function login() {
      auth.signInWithPopup(googleProvider);
  }

  function logout() {
    auth.signOut().then(() => {
      navigate('/');
    });
  }
</script>

<style lang="scss">
  .search {
    display: flex;
    align-items: center;
  }
</style>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      Gamera
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      {#if $user}
        <Link to="profile" class="navbar-item">Profile</Link>
        <Link to="lists" class="navbar-item">Lists</Link>
      {/if}
    </div>
  </div>

  <div class="navbar-end">
    <div class="navbar-item">
      <div class="buttons">
        {#if !$user}
          <a class="button is-primary is-small" on:click={login}>
            <strong>Sign in with Google</strong>
          </a>
        {:else}
          <a class="button is-primary" on:click={logout}>
            <strong>Sign out</strong>
          </a>
        {/if}
      </div>
    </div>
  </div>

  <div class="search pr-2">
    <Search />
  </div>
</nav>
