import React, {createContext, useEffect, useReducer, Dispatch, PropsWithChildren} from "react";

type Context = { state: State; dispatch: Dispatch<Action> }

type User = {
  username: string
}

type State = {
  user: User|null
  token: string|null
}

type Action =
  | SetUserAction
  | SetTokenAction;

interface SetUserAction {
  type: 'SET_USER'
  payload: User|null
}

interface SetTokenAction {
  type: 'SET_TOKEN'
  payload: string|null
}

const initialStoreContext: Context = {
  state: {
    user: null,
    token: null,
  },
  dispatch: (_a) => {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_TOKEN':
      return { ...state, token: action.payload };
  
    default:
      return state;
  }
};

const storeContext = createContext(initialStoreContext);
const { Provider } = storeContext;
const StateProvider = ({ children }: PropsWithChildren<any>) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialStoreContext.state,
    state => {
      return { ...state, ...getPersistedState() };
    },
  );

  useEffect(() => {
    persistState(state);
  }, [state]);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

const STORAGE_KEY = 'state';

const getPersistedState = () => {
  const persistedData = localStorage.getItem(STORAGE_KEY);
  const props = persistedData ? JSON.parse(persistedData) : {};

  return props;
};

const persistState = (state: State) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export { getPersistedState, storeContext, StateProvider }