import { useSelector } from './useStore.ts';
import { useMemo } from 'react';

export const useAuth = () => {
  const username = useSelector((global) => global.name);
  return useMemo(() => username !== undefined, [username]);
};
