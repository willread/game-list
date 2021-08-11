
import firebase from 'firebase/app';
import { writable } from 'svelte/store';

import { user } from './auth';
import { db } from './firebase';

function createLists() {
	const { subscribe, set, update } = writable([]);
  const listsRef = db.collection('lists');

  let uid;

  function reset() {
    set([]);
  }

  function fetch() {
    const listsQuery = listsRef.where('uid', '==', uid)

    listsQuery
      .onSnapshot(snapshot => {
        set(snapshot.docs.map(d => d.data()));
      }, error => {
        // todo
      });
  }

  function add({ name }) {
    listsRef.add({ uid, name, created: firebase.firestore.FieldValue.serverTimestamp() });
  }

  user.subscribe(u => {
    if (u) {
      uid = u.uid;
      fetch();
    } else {
      uid = undefined;
      reset();
    }
  });

	return {
		subscribe,
    reset,
    add,
	};
}

export const lists = createLists();
