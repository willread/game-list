import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { storeContext } from '../state/Store';

const SIGN_UP = gql`
  mutation signUp($username: String!, $password: String!, $email: String!) {
    signUp(
      input: {
        fields: {
          username: $username
          password: $password
          email: $email
        }
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

const SignUpForm: React.FC = () => {
  const { dispatch } = useContext(storeContext)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [signUp, { loading, error }] = useMutation(SIGN_UP, {
    onCompleted: data => {
      const token = data.signUp.viewer.sessionToken;
      const user = data.signUp.viewer.user;

      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_USER', payload: user });
    },
  });

  const handleSubmit = () => {
    signUp({
      variables: {
        username,
        password,
        email,
      },
    })
    .catch(e => {});
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <input type="text" placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input type="email" placeholder="email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
      <button type="submit" onClick={handleSubmit} disabled={loading}>Sign Up</button>
    
      {error && <div>
         <div>{error.message}</div>
      </div>}
    </div>
  );
};

export default SignUpForm;
