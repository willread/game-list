import React, { useContext } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from "@apollo/client/utilities";

import Header from './components/Header';
import LogInForm from './components/LogInForm';
import { getPersistedState, storeContext } from './state/Store';
import SignUpForm from './components/SignUpForm';
import Games from './Games';
import './App.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:3004/graphql',
});

const authLink = setContext((_, { headers }) => {
  const state = getPersistedState();
  const token = state.token;
  const newHeaders: { [key: string]: string } = {
    'X-Parse-Application-Id': 'myAppId',
  };

  if (token) {
    newHeaders['X-Parse-Session-Token'] = token;
  }
  
  return {
    headers: {
      ...headers,
      ...newHeaders,
    }
  }
});

const client = new ApolloClient({
  uri: 'http://localhost:3004/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          games: relayStylePagination(),
        },
      },
    },
  }),
  link: authLink.concat(httpLink),
});

function App() {
  const { state } = useContext(storeContext);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        <Games />
        { !state.user && <SignUpForm /> }
        { !state.user && <LogInForm /> }
      </div>
    </ApolloProvider>
  );
}

export default App;
