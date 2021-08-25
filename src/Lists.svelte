<script>
  import { link } from 'svelte-routing';

  import { lists } from './lists';
  import { toasts } from './services/toasts';

  let newListName = '';

  function addList() {
    if (!newListName) {
      return;
    }

    try {
      lists.add({ name: newListName });
      newListName = '';
    } catch(e) {
      if (e.name === 'NameTakenError') {
        toasts.add({message: 'This name is already taken', color: 'danger'});
      }
    }
  }
</script>

<section class="section">
  <h1 class="title">Lists</h1>
  {#if $lists.length}
    <div class="columns is-multiline">
      {#each $lists as list}
        {#if list.slug}
          <div class="column is-one-quarter">
            <a use:link href="/lists/{list.slug}">
              <div class="card">
                <div class="card-content">
                  <p>{list.name}</p>
                </div>
              </div>
            </a>
          </div>
        {/if}
      {/each}
    </div>
  {:else}
    <div class="content">You haven't created any lists</div>
  {/if}

  <h1 class="title">New List</h1>

  <div class="field has-addons">
    <div class="control">
      <input class="input" bind:value={newListName} placeholder="Name">
    </div>

    <div class="control">
      <button class="button" disabled={!newListName} on:click={addList}>Add</button>
    </div>
  </div>
</section>
