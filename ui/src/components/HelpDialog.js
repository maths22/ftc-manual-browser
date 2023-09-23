import React from 'react';

import { useTheme, useMediaQuery, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';

import { Close } from '@mui/icons-material';

export default function HelpDialog({visible, onClose}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
        fullScreen={fullScreen}
        open={visible}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" style={{display: 'flex', alignItems: 'center'}}>
        <Typography variant="h6" style={{flexGrow: 1}}>Search Help</Typography>
        <IconButton onClick={onClose} size="large"><Close/></IconButton>
      </DialogTitle>
      <DialogContent>
        By default terms are joined with a logical "AND".  The following operators are supported:
        <dl>
          <dt>+</dt> <dd>signifies AND operation</dd>
          <dt>|</dt> <dd>signifies OR operation</dd>
          <dt>-</dt> <dd>excludes a single word</dd>
          <dt>"</dt> <dd>wraps multiple words to signify a phrase for searching</dd>
          <dt>*</dt> <dd>signifies a wildcard for the end of a word</dd>
          <dt>( )</dt> <dd>signify precedence</dd>
          <dt>~N</dt> <dd>after a word signifies edit distance (fuzziness)</dd>
          <dt>~N</dt> <dd>after a phrase signifies slop amount</dd>
        </dl>
        To use one of these characters literally, escape it with a preceding backslash (\).

        For more information see the <a target="_blank" href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#simple-query-string-syntax">
          ElasticSearch documentation
        </a>
      </DialogContent>
    </Dialog>
  );
}
