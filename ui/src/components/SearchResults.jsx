import React from 'react';
import {useLoaderData, useSearchParams} from 'react-router-dom';

import { Table, TableBody, TableCell, TableFooter, TablePagination, TableRow, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  breadcrumbParent: {
    display: 'flex',
    height: '2em',
    alignItems: 'center',
    padding: '1em',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
    overflowX: 'auto',
  },
  table: {
    minWidth: '20em',
  },
  tableCell: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    textAlign: 'left',
    '&:last-child': {
      paddingRight: theme.spacing(1),
    }
  }
}));


function Definition({item}) {
  return <div>
      <Typography variant="h6">{item.title} ({item.category})</Typography>
      <p>
        {item.body}
      </p>
    </div>;
}

function Rule({item}) {
  return <div>
  <Typography variant="h6">{item.number} ({item.category})</Typography>
  <p style={{whiteSpace: 'pre-line'}}>
    <b>{item.title}</b> – {item.body}
  </p>
</div>;
}

function ForumPost({item}) {
  const date = new Date(parseInt(item.posted));
  return <div>
  <Typography variant="h6"><a target='_blank' href={item.url} dangerouslySetInnerHTML={{__html: item.title}}/></Typography>
  <Typography variant="caption">Posted at {date.toLocaleString()}</Typography>
  <p>
    <div dangerouslySetInnerHTML={{__html: item.question}} /> — {item.questionAuthor}
  </p>
  <hr/>
  <p>
    <div dangerouslySetInnerHTML={{__html: item.answer}} />
  </p>
</div>;
}

export default function SearchResults() {
  const classes = useStyles();
  const search = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  if(!search) return null;

  const renderCell = {
    'Definition': Definition,
    'Rule': Rule,
    'ForumPost': ForumPost,
  };

  const rowStyle = { height: '2rem' };

  return <Paper className={classes.root}>
    <Table className={classes.table}>
        <TableBody>
          {search.items.map(row => {
            const Element = renderCell[row.type];
            return (
              <TableRow key={row.id} style={rowStyle}>
                <TableCell component="th" scope="row">
                  <Element item={row} />
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
              count={search.totalSize}
              rowsPerPage={parseInt(searchParams.get('pageSize')) || 10}
              page={search.pageNumber}
              onPageChange={(_, page) => setSearchParams((was) => {
                const ret = new URLSearchParams(was);
                ret.set('page', page + 1);
                return ret;
              })}
              onRowsPerPageChange={(evt) => setSearchParams((was) => {
                const ret = new URLSearchParams(was);
                ret.set('pageSize', evt.target.value);
                return ret;
              })}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </Paper>;
}
