module.exports = (admin, functions) => {
  const writeList = functions.firestore
    .document('lists/{id}')
    .onWrite((change, context) => {
      if (change.after.exists) {
        const data = change.after.data();
        const previousData = change.before.data();
        const changes = {};

        // todo: add timestamp if new or there are changes

        if (Object.keys(changes).length) {
          return change.after.ref.set(changes, {merge: true});
        }

        return null;
      }
    });

  try {
    return {
      writeList,
    };
  } catch(e) {
    functions.logger.error('Error:', e);
  }
};
