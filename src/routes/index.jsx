import React from 'react';
import {Routes, Route} from 'react-router-dom';
import routes from './routes';
import Article from '../components/article/article';

const Router = () => {
  return (
      <Routes>
        {routes.map((route) => (
          <Route
            path={route.path}
            key={`${route.name}:${route.path}`}
            element={<route.component />}
            />
        ))}
      </Routes>
  );
};

export default Router;