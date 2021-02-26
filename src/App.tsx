import React, { useContext, useEffect } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from "@apollo/client/utilities";

import LogInForm from './components/LogInForm';
import { storeContext } from './state/Store';
import SignUpForm from './components/SignUpForm';
import Games from './Games';
import './App.css';

const FETCH_USER = gql`
  query viewer {
    viewer {
      sessionToken
      user {
        username
        email
      }
    }
  }
`;

const httpLink = createHttpLink({
  uri: 'http://localhost:3004/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
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

  useEffect(() => {
    useQuery(FETCH_USER, {
      onCompleted: data => {
        const token = data.viewer.sessionToken;
  
        localStorage.setItem('token', token); // TODO: Move to action
        console.log('fethced user', data):
        // dispatch({
        //   type: 'SET_USER',
        //   payload: data.viewer.user,
        // });
      },
    });
  }, []);

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
