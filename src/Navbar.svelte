<script>
  import 'bulma/css/bulma.css'
  import { auth, googleProvider } from './firebase';
  import { authState } from 'rxfire/auth';

  let user;

  authState(auth).subscribe(u => user = u);

  function login() {
      auth.signInWithPopup(googleProvider);
  }

  function logout() {
    auth.signOut();
  }
</script>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      Gamera
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      {#if user}
        <a href="/" class="navbar-item">
          Profile
        </a>
      {/if}
    </div>
  </div>

  <div class="navbar-end">
    <div class="navbar-item">
      <div class="buttons">
        {#if !user}
          <a class="button is-primary" on:click={login}>
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
</nav>
