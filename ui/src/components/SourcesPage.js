import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getSources} from '../actions/api';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core';
import LoadingSpinner from './LoadingSpinner';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const styles = (theme) => ({
  breadcrumbParent: {
    display: 'flex',
    height: '2em',
    alignItems: 'center',
    padding: '1em',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: '20em',
  },
  tableCell: {
    paddingLeft: 1 * theme.spacing.unit,
    paddingRight: 1 * theme.spacing.unit,
    textAlign: 'left',
    '&:last-child': {
      paddingRight: 1 * theme.spacing.unit,
    }
  }
});

class SourcesPage extends Component {

  componentDidMount() {
    this.fetchData();
  }

  fetchData = (newData = {}) => {
    this.props.getSources()
  }

  renderPdfSource (source) {
    return [
      <TableCell>PDF</TableCell>,
      <TableCell component="td" scope="row"><a href={source.url} target='_blank'>{source.name}</a></TableCell>,
      <TableCell component="td" scope="row">{timeAgo.format(new Date(source.updatedAt), 'twitter')}</TableCell>
    ];
  }

  renderForumSorce (source) {
    return [
      <TableCell>Q&A</TableCell>,
      <TableCell><a href={`https://${source.base_url}`} target='_blank'>{source.name}</a></TableCell>,
      <TableCell>{timeAgo.format(new Date(source.updatedAt), 'twitter')}</TableCell>
    ];
  }

  sourceSort (source1, source2) {
    if(source1.type === source2.type) {
      return source1.name.localeCompare(source2.name);
    }
    return source1.type.localeCompare(source2.type);
  }

  render () {
    if(!this.props.sources) return null;

    const { classes, sources } = this.props;

    if(sources.inProgress) {
      return <LoadingSpinner/>;
    }

    const renderRow = {
      'pdf': this.renderPdfSource,
      'qa': this.renderForumSorce,
    }

    const rowStyle = { height: '2rem' };

    return <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sources.list.sources.sort(this.sourceSort).map(row => {
              return (
                <TableRow key={row.SourceId} style={rowStyle}>
                  {renderRow[row.type](row)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>;
  }
}

const mapStateToProps = (state, props) => {
  return {sources: state.sources};
};

const mapDispatchToProps = {
  getSources
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SourcesPage));
