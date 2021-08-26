<script>
  import { Link, link, navigate } from 'svelte-routing';

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
  .navbar {
    background: #111;
  }

  .search {
    display: flex;
    align-items: center;
  }

  .logo {
    font-family: "Bungee";
    color: #fff;
    text-decoration: none;
    text-shadow: 3px 5px 0 rgba(#000, 0.75);

    &:hover {
      span {
        display: inline-block;
        animation: bump 0.15s ease-in-out;
      }

      span:nth-child(1) { animation-delay: 0s; }
      span:nth-child(2) { animation-delay: 0.025s; }
      span:nth-child(3) { animation-delay: 0.05s; }
      span:nth-child(4) { animation-delay: 0.075s; }
      span:nth-child(5) { animation-delay: 0.1s; }
      span:nth-child(6) { animation-delay: 0.125s; }
    }

    @keyframes bump {
      0% {
        transform: scale(1);
      }

      40% {
        transform: scale(1.5);
      }

      100% {
        transform: scale(1);
      }
    }
  }
</style>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item logo" href="/" use:link>
      <span>G</span>
      <span>a</span>
      <span>m</span>
      <span>e</span>
      <span>r</span>
      <span>a</span>
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

  <div class="search">
    <Search />
  </div>

  <div class="navbar-end">
    <div class="navbar-item">
      <div class="buttons">
        {#if !$user}
          <a class="button is-primary is-small" on:click={login}>
            <strong>Sign in with Google</strong>
          </a>
        {:else}
          <a class="button is-primary is-small" on:click={logout}>
            <strong>Sign out</strong>
          </a>
        {/if}
      </div>
    </div>
  </div>
</nav>
