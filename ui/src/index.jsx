import React from 'react';
import { createRoot } from 'react-dom/client';
import ReactGA from 'react-ga';

import './index.css';
import appRouter from './AppRouter';
import * as Sentry from '@sentry/browser';
import {
  RouterProvider,
} from 'react-router-dom';

import { StyledEngineProvider, createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import orange from '@mui/material/colors/orange';

const theme = createTheme({
  palette: {
    primary: orange,
  },
});

Sentry.init({
 dsn: import.meta.env.VITE_SENTRY_DSN
});

ReactGA.initialize(import.meta.env.VITE_GA_KEY);

const root = createRoot(document.getElementById('root'));
root.render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </StyledEngineProvider>
);

