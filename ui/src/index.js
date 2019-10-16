import './polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

import configureStore from './store';

import './index.css';
import * as serviceWorker from './serviceWorker';
import AppRouter from './AppRouter';
import * as Sentry from '@sentry/browser';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

const theme = createMuiTheme({
  palette: {
    primary: orange,
  },
});

Sentry.init({
 dsn: process.env.REACT_APP_SENTRY_DSN
});

ReactGA.initialize(process.env.REACT_APP_GA_KEY);

const history = createBrowserHistory();
const store = configureStore(history);

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <AppRouter history={history}/>
      </Provider>
    </MuiThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
