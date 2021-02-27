import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { storeContext } from '../state/Store';

const LOG_IN = gql`
  mutation logIn($username: String!, $password: String!) {
    logIn(
      input: {
        username: $username
        password: $password
      }
    ) {
      viewer {
        sessionToken
        user {
          username
          email
        }
      }
    }
  }
`;

const LogInForm: React.FC = () => {
  const { dispatch } = useContext(storeContext)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logIn, { loading, error }] = useMutation(LOG_IN, {
    onCompleted: data => {
      const token = data.logIn.viewer.sessionToken;
      const user = data.logIn.viewer.user;

      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    },
  });

  const handleSubmit = () => {
    logIn({
      variables: {
        username,
        password,
      },
    })
    .catch(e => {});
  };

  return (
    <div>
      <h1>Log In</h1>
      <input type="text" placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" onClick={handleSubmit} disabled={loading}>Sign Up</button>
    
      {error && <div>
         <div>{error.message}</div>
      </div>}
    </div>
  );
};

export default LogInForm;
