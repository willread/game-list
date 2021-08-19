import { writable } from 'svelte/store';

import { db } from '../firebase';

const platformsRef = db.collection('platforms');

export const platforms = (() => {
	const store = writable({});

  platformsRef
    .get()
    .then(p => p.docs.forEach(d => {
      store.update(value => {
        value[d.id] = d.data();
        return value;
      });
    }))
    .catch(e => {
      // todo
    });

  return {
    subscribe: store.subscribe,
  };
})();
