import React from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from "@apollo/client/utilities";
import Games from './Games';
import './App.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:3004/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-Parse-Application-Id': 'myAppId',
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
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Games />
      </div>
    </ApolloProvider>
  );
}

export default App;
