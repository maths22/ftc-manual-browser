import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';

import {Link} from 'react-router-dom';

const styles = {
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
  loginForm: {
    width: '18em',
    padding: '1em'
  },
  tab: {
    minWidth: 0
  }
};

class HeadingBar extends Component {
  componentWillUpdate(nextProps) {
    document.title = nextProps.title || 'FTC Manual Search';
  }

  render () {

    return <div>
      <div className={this.props.classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={this.props.classes.menuButton} color="inherit" aria-label="Home"
                        to="/"
                        component={props => <Link {...props}/>}>
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={this.props.classes.grow}>
              {this.props.title || 'FTC Manual Search'}
            </Typography>
            <Button color="inherit" to="/sources" 
                    component={props => <Link {...props}/>}>Sources</Button>
          </Toolbar>
        </AppBar>
      </div>
    </div>;
  }
}


export default withStyles(styles)(HeadingBar);