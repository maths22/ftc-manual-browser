import React, {useEffect} from 'react';

import { makeStyles } from '@mui/styles';

import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';

import {Link} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  tab: {
    minWidth: 0
  }
});

export default function HeadingBar({title}) {
  const classes = useStyles();
  useEffect(() => {
    document.title = title || 'FTC Manual Search';
  }, [title]);

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Home"
              to="/"
              component={Link}
              size="large">
              <Home />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {title || 'FTC Manual Search'}
            </Typography>
            <Button color="inherit" to="/sources" 
                    component={Link}>Sources</Button>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
}
