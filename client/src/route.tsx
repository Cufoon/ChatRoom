import { createBrowserRouter } from 'react-router-dom';
import ForbiddenPage from './pages/404';
import LoginPage from './pages/login';
import ChatPage from './pages/chat';
import AuthChecker from './auth.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthChecker>
        <LoginPage />
      </AuthChecker>
    )
  },
  {
    path: '/login',
    element: (
      <AuthChecker>
        <LoginPage />
      </AuthChecker>
    )
  },
  {
    path: '/chat',
    element: (
      <AuthChecker>
        <ChatPage />
      </AuthChecker>
    )
  },
  {
    path: '*',
    element: <ForbiddenPage />
  }
]);
