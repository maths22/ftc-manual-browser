import React from 'react';
import App from './App';
import SourcesPage from './components/SourcesPage';
import TextsPage from './components/TextsPage';
import DefaultLayout from './components/DefaultLayout';
import { createBrowserRouter, useRouteError } from 'react-router-dom';

import { API_BASE } from './util';

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  return <div>
    <p>An error has occured!</p>
  </div>;
}


export default createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        path: '/',
        Component: App,
        loader: async ({ request }) => {
          const params = new URL(request.url).searchParams;
          const query = params.get('query');
          if(!query) {
            return null;
          }
          const page = params.get('page') || 1;
          const size = params.get('pageSize') || 10;
          return fetch(`${API_BASE}/texts/search?page=${page - 1}&size=${size}`, {
            method: 'POST',
            body: query
          });
        }
      },
      {
        path: '/sources',
        Component: SourcesPage,
        ErrorBoundary: ErrorBoundary,
        loader: async () => {
          return fetch(`${API_BASE}/sources`);
        }
      },
      {
        path: '/texts',
        Component: TextsPage,
        ErrorBoundary: ErrorBoundary,
        loader: async () => {
          return fetch(`${API_BASE}/texts`);
        }
      },
      {
        path: '*',
        element: <div>404 – Page Not Found</div>,
      },
    ]
  }
]);
