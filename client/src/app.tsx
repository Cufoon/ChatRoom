import { useEffect, useReducer, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './route';
import {
  ActionData,
  ActionType,
  DispatchContext,
  GlobalState,
  StateContext
} from './hooks/useStore.ts';
import { getUsername } from './utils/storage.ts';

function reducer(_state: GlobalState, action: ActionData) {
  if (action.type === ActionType.SET_NAME) {
    return {
      name: action.payload
    };
  }
  throw Error('Unknown action.');
}

function App() {
  const [state, dispatch] = useReducer<
    (state: GlobalState, action: ActionData) => GlobalState
  >(reducer, {});
  const [init, setInit] = useState(false);

  useEffect(() => {
    (async () => {
      const username = await getUsername();
      if (username !== null) {
        dispatch({ type: ActionType.SET_NAME, payload: username });
      }
      setInit(true);
    })();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {init && <RouterProvider router={router} />}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export default App;
