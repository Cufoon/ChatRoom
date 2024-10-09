import { createHashRouter } from 'react-router-dom';
import ForbiddenPage from './pages/404';
import LoginPage from './pages/login';
import ChatPage from './pages/chat';
import Auth from './auth';

export const router = createHashRouter([
  {
    path: '/',
    element: <Auth></Auth>
  },
  {
    path: '/login',
    element: <Auth><LoginPage /></Auth>
  },
  {
    path: '/chat',
    element: <Auth><ChatPage /></Auth>
  },
  {
    path: '*',
    element: <ForbiddenPage />
  }
]);
