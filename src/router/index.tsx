import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const Home = lazy(() => import('@/page/Home'));

export const ROUTER_CONFIG: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
];
