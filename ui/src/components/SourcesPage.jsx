import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

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


function PdfSource ({source}) {
  return <>
    <TableCell>PDF</TableCell>
    <TableCell component="td" scope="row"><a href={source.url} target='_blank'>{source.name}</a></TableCell>
    <TableCell component="td" scope="row">{source.updatedAt ? timeAgo.format(new Date(source.updatedAt), 'twitter') : '-'}</TableCell>
  </>;
}

function ForumSource ({source}) {
  return <>
    <TableCell>Q&A</TableCell>
    <TableCell><a href={`https://${source.base_url}`} target='_blank'>{source.name}</a></TableCell>
    <TableCell>{source.updatedAt ? timeAgo.format(new Date(source.updatedAt), 'twitter') : '-'}</TableCell>
  </>;
}

function sourceSort(source1, source2) {
  if(source1.type === source2.type) {
    return source1.name.localeCompare(source2.name);
  }
  return source1.type.localeCompare(source2.type);
}

export default function SourcesPage() {
  const classes = useStyles();
  const { sources } = useLoaderData();

  const renderRow = {
    'pdf': PdfSource,
    'qa': ForumSource,
  };

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
          {sources.sort(sourceSort).map(row => {
            const Element = renderRow[row.type];
            return (
              <TableRow key={row.SourceId} style={rowStyle}>
                <Element source={row} />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>;
}
