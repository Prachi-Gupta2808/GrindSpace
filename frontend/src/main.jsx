import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import "stream-chat-react/dist/css/v2/index.css";
import './index.css';

import useAuthUser from './hooks/useAuthUser';
import ChatPage from './pages/ChatPage';
import ChooseProfile from './pages/ChooseProfile';
import Home from './pages/Home';
import { Login } from './pages/Login';
import Notifications from './pages/Notifications';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import { Signup } from './pages/Signup';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CallPage from './pages/CallPage';

const queryClient = new QueryClient();

// ✅ ProtectedRoute: User must be logged in and onboarded
const ProtectedRoute = ({ children }) => {
  const { isLoading, authUser } = useAuthUser();
  console.log('ProtectedRoute:', { isLoading, authUser });

  if (isLoading) return <p>Loading user data...</p>;

  if (!authUser) {
    console.log('User not authenticated, redirecting...');
    return <Navigate to="/login" />;
  }

  if (!authUser.isOnboarded) {
    console.log('User not onboarded, redirecting...');
    return <Navigate to="/onboarding" />;
  }

  return children;
};

// ✅ Onboarding route
const OnboardingRoute = () => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return null;
  if (!authUser) return <Navigate to="/login" />;
  if (!authUser.hasChosenProfile) return <Navigate to="/choose-profile" />;
  if (authUser.isOnboarded) return <Navigate to="/" />;

  return <Onboarding />;
};

// ✅ ChooseProfile route
const ChooseProfileRoute = () => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return null;
  if (!authUser) return <Navigate to="/login" />;
  if (authUser.hasChosenProfile) return <Navigate to="/onboarding" />;

  return <ChooseProfile />;
};

// ✅ AuthRoute
const AuthRoute = ({ children }) => {
  const { isLoading, authUser } = useAuthUser();

  if (isLoading) return null;

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  const hasChosenProfile = authUser?.hasChosenProfile;

  if (isAuthenticated) {
    if (!hasChosenProfile) return <Navigate to="/choose-profile" />;
    return <Navigate to={isOnboarded ? '/' : '/onboarding'} />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthRoute>
        <Signup />
      </AuthRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthRoute>
        <Login />
      </AuthRoute>
    ),
  },
  {
    path: '/choose-profile',
    element: <ChooseProfileRoute />,
  },
  {
    path: '/onboarding',
    element: <OnboardingRoute />,
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
  {
    path: '/call/:id',
    element: (
      <ProtectedRoute>
        <CallPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat/:id',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
