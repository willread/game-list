import React, {createContext, useReducer, Dispatch, PropsWithChildren} from "react";

type Context = { state: State; dispatch: Dispatch<Action> }

type User = {
  username: string
}

type State = {
  user: User|null;
}

type Action =
  | SetUserAction;

interface SetUserAction {
  type: 'SET_USER'
  payload: User
}

const initialStoreContext: Context = {
  state: {
    user: null,
  },
  dispatch: (_a) => {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
  
    default:
      return state;
  }
};

const storeContext = createContext(initialStoreContext);
const { Provider } = storeContext;
const StateProvider = ({ children }: PropsWithChildren<any>) => {
  const [state, dispatch] = useReducer(reducer, initialStoreContext.state);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
}

export { storeContext, StateProvider }