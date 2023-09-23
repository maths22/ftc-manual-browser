import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga';

import './index.css';
import * as serviceWorker from './serviceWorker';
import appRouter from './AppRouter';
import * as Sentry from '@sentry/browser';
import {
  RouterProvider,
} from 'react-router-dom';

import { StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import orange from '@mui/material/colors/orange';

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: orange,
  },
}));

Sentry.init({
 dsn: process.env.REACT_APP_SENTRY_DSN
});

ReactGA.initialize(process.env.REACT_APP_GA_KEY);

const root = createRoot(document.getElementById('root'));
root.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </StyledEngineProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
