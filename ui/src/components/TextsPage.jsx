import React from 'react';
import { useLoaderData } from 'react-router-dom';

import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addLocale(en);

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


export default function SourcesPage() {
  const classes = useStyles();
  const { definitions, forum_posts, rules} = useLoaderData();

  return <Paper className={classes.root}>
      <h2>Definitions</h2>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Body</TableCell>
            <TableCell>Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {definitions.map((definition, index) => (
            <TableRow key={index}>
              <TableCell>{definition.category}</TableCell>
              <TableCell>{definition.title}</TableCell>
              <TableCell>{definition.body}</TableCell>
              <TableCell>{definition.version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Rules</h2>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Body</TableCell>
            <TableCell>Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rules.map((definition, index) => (
            <TableRow key={index}>
              <TableCell>{definition.category}</TableCell>
              <TableCell>{definition.number}</TableCell>
              <TableCell>{definition.title}</TableCell>
              <TableCell>
                <p style={{whiteSpace: 'pre-line'}}>
                  {definition.body}
                </p>  
              </TableCell>
              <TableCell>{definition.version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Q&A</h2>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Posted</TableCell>
            <TableCell>Version</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forum_posts.sort((p1, p2) => p1.number - p2.number).map((post, index) => (
            <TableRow key={index}>
              <TableCell>{post.number}</TableCell>
              <TableCell>{post.category}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>
                <div dangerouslySetInnerHTML={{__html: post.question}} /> — {post.questionAuthor}
              </TableCell>
              <TableCell>
                <div dangerouslySetInnerHTML={{__html: post.answer}} />
              </TableCell>
              <TableCell>{post.tags.join(', ')}</TableCell>
              <TableCell>{new Date(parseInt(post.posted)).toLocaleString()}</TableCell>
              <TableCell>{post.version}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>;
}
