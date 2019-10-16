import React, {Component} from 'react';
import {connect} from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {withStyles, Typography} from '@material-ui/core';
import LoadingSpinner from './LoadingSpinner';

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

class SearchResults extends Component {
  renderDefinition (def) {
    return <div>
        <Typography variant="h6">{def.title} ({def.category})</Typography>
        <p>
          {def.body}
        </p>
      </div>;
  }

  renderRule (rule) {
    return <div>
    <Typography variant="h6">{rule.number} ({rule.category})</Typography>
    <p style={{whiteSpace: 'pre-line'}}>
      <b>{rule.title}</b> – {rule.body}
    </p>
  </div>;
  }

  renderForumPost (post) {
    const date = new Date(parseInt(post.posted + '000'));
    return <div>
    <Typography variant="h6"><a target='_blank' href={post.url} dangerouslySetInnerHTML={{__html: post.title}}/></Typography>
    <Typography variant="caption">Posted at {date.toLocaleString()}</Typography>
    <p>
      <div dangerouslySetInnerHTML={{__html: post.question}} /> — {post.questionAuthor}
    </p>
    <hr/>
    <p>
      <div dangerouslySetInnerHTML={{__html: post.answer}} /> — {post.author}
    </p>
  </div>;
  }

  render () {
    if(!this.props.search) return null;

    if(this.props.search.inProgress) {
      return <LoadingSpinner/>;
    }

    const renderCell = {
      'Definition': this.renderDefinition,
      'Rule': this.renderRule,
      'ForumPost': this.renderForumPost,
    }

    const {rowsPerPage, classes, search, handleChangePage, handleChangeRowsPerPage} = this.props;
    const rowStyle = { height: '2rem' };

    return <Paper className={classes.root}>
      <Table className={classes.table}>
          <TableBody>
            {search.result.items.map(row => {
              return (
                <TableRow key={row.id} style={rowStyle}>
                  <TableCell component="th" scope="row">
                    {renderCell[row.type](row)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 25]}
                colSpan={1}
                count={search.result.totalSize}
                rowsPerPage={rowsPerPage}
                page={search.result.pageNumber}
                onChangePage={(_, page) => handleChangePage(page)}
                onChangeRowsPerPage={(evt) => handleChangeRowsPerPage(evt.target.value)}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>;
  }
}

const mapStateToProps = (state, props) => {
  return {search: state.search};
};

export default connect(mapStateToProps)(withStyles(styles)(SearchResults));