import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import React from 'react';

export default () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <h3>Loading...</h3>
    <CircularProgress/>
  </div>
);