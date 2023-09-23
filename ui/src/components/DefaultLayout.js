import React from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import HeadingBar from './HeadingBar';
import {makeStyles} from '@mui/styles';
import { CssBaseline } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';


const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function DefaultLayout() {
  const classes = useStyles();
  const navigation = useNavigation();

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <CssBaseline />
        <HeadingBar/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />

          <ErrorBoundary>
            {navigation.state !== 'idle' ? <LoadingSpinner /> : null}
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}
