import { writable } from 'svelte/store';

import { db } from '../firebase';

const platformsRef = db.collection('platforms');

export const platforms = (() => {
	const platforms = writable({});

  platformsRef
    .get()
    .then(p => p.docs.forEach(d => {
      platforms.update(p => {
        p[d.id] = d.data();
        return p;
      });
    }))
    .catch(e => {
      // todo
    });

  return {
    subscribe: platforms.subscribe,
  };
})();
