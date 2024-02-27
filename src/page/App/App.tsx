import React from 'react';
import { useRoutes, BrowserRouter } from 'react-router-dom';

import { ROUTER_CONFIG } from '@/router';

const Router = () => {
  const element = useRoutes(ROUTER_CONFIG);
  return element;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;
