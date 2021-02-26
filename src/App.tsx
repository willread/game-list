import React, { useContext } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from "@apollo/client/utilities";

import LogInForm from './components/LogInForm';
import { storeContext } from './state/Store';
import SignUpForm from './components/SignUpForm';
import Games from './Games';
import './App.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:3004/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    headers: {
      ...headers,
      'X-Parse-Application-Id': 'myAppId',
      // 'X-Parse-Session-Token': token,
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
        <header>
          { state.user && <div>Logged in as: { state.user.username }</div> }
        </header>
        <Games />
        { !state.user && <SignUpForm /> }
        { !state.user && <LogInForm /> }
      </div>
    </ApolloProvider>
  );
}

export default App;
