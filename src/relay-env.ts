import { Environment, Network, RecordSource, RequestParameters, Store, Variables } from 'relay-runtime';

import { getPersistedState } from './state/Store';

const fetchQuery = (operation: RequestParameters, variables: Variables) => {
  const state = getPersistedState();
  const token = state.token;
  const headers: { [key: string]: string } = {
    'X-Parse-Application-Id': 'myAppId',
  };

  if (token) {
    headers['X-Parse-Session-Token'] = token;
  }

  return fetch('http://localhost:3004/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;