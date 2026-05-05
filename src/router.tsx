import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import LandingPage from './components/pages/landing.page';
import MainLayout from './components/layouts/main.layout';
import NotFoundPage from './components/pages/notfound.page';
import AuthLayout from './components/layouts/auth.layout';
import LoginPage from './components/pages/login.page';
import ProfilePage from './components/pages/profile.page';
import Protected from './components/molecules/protected';
import MembersPage from './components/pages/members.page';
import LessonsPage from './components/pages/lessons.page';

const routes: RouteObject[] = [
  {
    path: '',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: 'members',
        element: <MembersPage />,
      },
      {
        path: 'lessons',
        element: <LessonsPage />,
      },
      {
        path: 'profil',
        element: (
          <Protected>
            <ProfilePage />,
          </Protected>
        ),
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

const browserRouter: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(routes);

export { routes };
export default browserRouter;
