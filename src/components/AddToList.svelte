<script>
  import { clickOutside } from '../actions/clickOutside';
  import { lists, listItemsForId } from '../lists';

  export let game;

  let active = false;

  function handleClick() {
    active = true;
  }

  function handleClickOutside() {
    active = false;
  }

  function addToList(list) {
    listItemsForId(list.id)
      .add({gameId: game.id});

    active = false;
  }
</script>

<div class="dropdown {active ? 'is-active' : ''}" use:clickOutside on:click-outside={handleClickOutside}>
  <div class="dropdown-trigger" on:click={handleClick}>
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
      <span>Add To List</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" role="menu">
    <div class="dropdown-content">
      {#each $lists as list}
        <button class="dropdown-item" on:click={() => addToList(list)}>{list.name}</button>
      {/each}
    </div>
  </div>
</div>
