import React, { useContext } from 'react';
import { ExposeData } from '../utils/type.ts';

export const enum ActionType {
  SET_NAME = 'SET_NAME'
}

export interface GlobalState {
  name?: string;
}

interface Action {
  [ActionType.SET_NAME]?: GlobalState['name'];
}

type ActionDataMap<T> = {
  [K in keyof T]-?: undefined extends T[K]
    ? T[K] extends undefined
      ? { type: K }
      : { type: K; payload?: T[K] }
    : { type: K; payload: T[K] };
};
export type ActionData = ExposeData<ActionDataMap<Action>>;

export const StateContext = React.createContext<GlobalState>({});
export const DispatchContext = React.createContext<React.Dispatch<ActionData>>(
  () => {
    console.log('dispatch is not exist');
  }
);

type Selector<T> = (global: GlobalState) => T;

interface UseSelector {
  (): GlobalState;

  <T>(selector: Selector<T>): T;
}

export const useSelector: UseSelector = (selector = (v: GlobalState) => v) => {
  const state = useContext(StateContext);
  return selector(state);
};

export const useDispatch = () => {
  return useContext(DispatchContext);
};
