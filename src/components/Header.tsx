import React, { useContext, useEffect } from 'react';
import { useApolloClient  } from '@apollo/client';

import { storeContext } from '../state/Store';

const Header: React.FC = () => {
  const { state, dispatch } = useContext(storeContext);
  const client = useApolloClient();

  const logout = () => {
    dispatch({ type: 'SET_TOKEN', payload: null });
    dispatch({ type: 'SET_USER', payload: null });
    client.resetStore();
  };

  return (
    <header>
      { state.user && 
        <>
          <div>Logged in as: { state.user.username }</div>
          <button onClick={logout}>Log Out</button>
        </>
      }
    </header>
  );
};

export default Header;