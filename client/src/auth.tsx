import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.ts';

const Auth: React.FC<PropsWithChildren> = ({ children }) => {
  const isAuthed = useAuth();
  const navigate = useNavigate();
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!isAuthed) {
      if (location.hash === '#/login') {
        setInit(true);
        return;
      }
      navigate('/login');
      return;
    }
    if (location.hash !== '#/chat') {
      navigate('/chat');
      return;
    }
    setInit(true);
  }, [isAuthed, navigate]);

  return <>{init && children}</>;
};

export default Auth;
