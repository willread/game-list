<script>
  import { lists, listItemsForId } from '../lists';
  import { platforms } from '../services/platforms';
  import { toasts } from '../services/toasts';

  export let game;

  let modalActive = false;
  let listId;
  let platformId;
  let notes = '';

  function openModal() {
    modalActive = true;
  }

  function closeModal() {
    modalActive = false;
  }

  function handleWindowKeydown(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function addToList() {
    const list = $lists.find(l => l.id === listId);

    listItemsForId(listId)
      .add({
        gameId: game.id,
        platformId,
        notes,
      });

    toasts.add({message: `Added game to <b>${list.name}</b>`, color: 'success', allowHTML: true});
    closeModal();
  }
</script>

<svelte:window on:keydown={handleWindowKeydown}/>

<button class="button">
  <span on:click={openModal}>Add To List</span>
</button>

<div class="modal {modalActive ? 'is-active' : ''}">
  <div class="modal-background" on:click={closeModal}></div>
  <div class="modal-content">
    <div class="box">
      <div class="select">
        <select bind:value={listId}>
          {#each $lists as list}
            <option value={list.id}>{list.name}</option>
          {/each}
        </select>
      </div>

      <div class="select">
        <select bind:value={platformId}>
          {#each game.platforms as platformId}
            <option value={platformId}>
              {#if $platforms[platformId]}
                {$platforms[platformId].name}
              {/if}
            </option>
          {/each}
        </select>
      </div>

      <textarea class="textarea" placeholder="Notes..." bind:value={notes}></textarea>

      <button class="button" on:click={addToList}>Add</button>
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" on:click={closeModal}></button>
</div>
