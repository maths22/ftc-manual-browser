import React, {useState} from 'react';
import {Form} from 'react-router-dom';
import { Button, Grid, IconButton, TextField } from '@mui/material';
import {makeStyles} from '@mui/styles';
import { Help } from '@mui/icons-material';

import HelpDialog from './HelpDialog';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    width: '100%',
  }
}));

export default function SearchForm() {
  const classes = useStyles();
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Form>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6}>
          <TextField
              label={'Query'}
              name={'query'}
              required
              className={classes.input}
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" type="submit" color="primary" className={classes.button}>
            Search
          </Button>
          <IconButton onClick={() => setShowHelp(true)} size="large">
            <Help />
          </IconButton>
        </Grid>
      </Grid>
      <HelpDialog visible={showHelp} onClose={() => setShowHelp(false)}/>
      <input type="hidden" name="page" value="1"/>
    </Form>
  );
}
