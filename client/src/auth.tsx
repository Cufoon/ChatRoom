import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.ts';

const AuthChecker: React.FC<PropsWithChildren> = ({ children }) => {
  const [init, setInit] = useState(false);
  const isAuthed = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthed) {
      if (location.pathname === '/' || location.pathname === '/login') {
        setInit(true);
        return;
      }
      navigate('/login');
      return;
    }
    if (location.pathname === '/' || location.pathname === '/login') {
      navigate('/chat');
      return;
    }
    setInit(true);
  }, [isAuthed, navigate]);

  return <>{init && children}</>;
};

export default AuthChecker;
