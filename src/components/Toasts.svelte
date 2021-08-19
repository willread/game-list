<script>
  import { flip } from 'svelte/animate';
  import { fade, fly } from 'svelte/transition';

  import { toasts } from '../services/toasts';
</script>

<style>
  .toasts {
    position: fixed;
    left: 0;
    bottom: 0;
  }
</style>

<div class="toasts is-flex is-flex-direction-column px-1 py-1">
  {#each $toasts as toast (toast)}
    <article
      class="tag is-small mt-1 {toast.color ? `is-${toast.color}` : ''}"
      animate:flip={{duration: 150}}
      in:fade={{duration: 150}}
      out:fly={{x:100}}
    >
      <span>
        {#if toast.allowHTML}
          {@html toast.message}
        {:else}
          {toast.message}
        {/if}
      </span>

      <button class="delete is-small" aria-label="delete" on:click={toasts.remove(toast)}></button>
    </article>
  {/each}
</div>
