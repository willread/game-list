import { writable } from 'svelte/store';

const TOAST_DELAY = 2000;

export const toasts = (() => {
  const store = writable([]);

  function add({ message, color, allowHTML = false, autoRemove = true }) {
    const toast = {
      color,
      message,
      allowHTML,
    };

    if (autoRemove) {
      toast.timeout = setTimeout(() => remove(toast), TOAST_DELAY);
    }

    toast.cancelRemoval = () => clearTimeout(toast.timeout);

    store.update(value => {
      value.push(toast);
      return value;
    });
  }

  function remove(toast) {
    store.update(value => {
      const index = value.indexOf(toast);

      if (index > -1) {
        value.splice(index, 1);
      }

      return value;
    });
  }

  return {
    subscribe: store.subscribe,
    add,
    remove,
  };
})();
