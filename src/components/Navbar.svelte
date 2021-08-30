<script>
  import { Link, link, navigate } from 'svelte-routing';

  import { auth, googleProvider } from '../firebase';
  import { clickOutside } from '../actions/clickOutside';
  import { user } from '../auth';

  import Search from './Search.svelte';

  let dropdownOpen = false;

  function login() {
      auth.signInWithPopup(googleProvider);
  }

  function logout() {
    auth.signOut().then(() => {
      navigate('/');
    });
  }

  function closeDropdown() {
    dropdownOpen = false;
  }

  function openDropdown(e) {
    if (e) {
      e.stopPropagation();
    }

    dropdownOpen = true;
  }
</script>

<style lang="scss">
  @use '../styles/button';
  @use '../styles/layout';
  @use '../styles/dropdown';
  @use '../styles/menu';

  .navbar {
    background: var(--navbar-bg);

    .container {
      @include layout.container();

      display: flex;
      align-items: center;
    }
  }

  .logo {
    font-family: "Bungee", sans-serif;
    font-size: 20px;
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

  .search {
    flex: 1 1 auto;
    margin: 0 var(--padding-m);
  }

  .dropdown-wrapper {
    @include dropdown.wrapper();
  }

  .dropdown {
    @include dropdown.container();
    @include dropdown.is-anchored-right();

    &.is-visible {
      @include dropdown.is-visible();
    }

    ul {
      @include menu.list();

      li {
        @include menu.item();
      }
    }

    button {
      @include button.button();
      @include button.is-primary();

      margin-top: var(--padding-m);
    }
  }
</style>

<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="container">
    <a class="logo" href="/" use:link>
      <span>G</span>
      <span>a</span>
      <span>m</span>
      <span>e</span>
      <span>r</span>
      <span>a</span>
    </a>

    <div class="search">
      <Search />
    </div>

    <div class="dropdown-wrapper" use:clickOutside on:click-outside={closeDropdown} on:click={closeDropdown}>
      <button class="dropdown-trigger" on:click={openDropdown}></button>
      <div class="dropdown {dropdownOpen ? 'is-visible' : ''}">
        {#if !$user}
          <button class="waves-effect waves-light btn" on:click={login}>
            Sign in with Google
          </button>
        {:else}
          <ul>
            <li><Link to="profile" class="navbar-item">Profile</Link></li>
            <li><Link to="lists" class="navbar-item">Lists</Link></li>
          </ul>

          <button class="waves-effect waves-light btn" on:click={logout}>
            Sign out
          </button>
        {/if}
      </div>
    </div>
  </div>
</nav>
