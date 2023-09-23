import { CircularProgress } from '@mui/material';
import React from 'react';

export default function LoadingSpinner() {
  return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    <h3>Loading...</h3>
    <CircularProgress/>
  </div>;
};