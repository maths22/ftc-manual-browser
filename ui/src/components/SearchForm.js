import React, {Component} from 'react';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';

import HelpDialog from './HelpDialog';

const validate = values => {
  const errors = {};
  const requiredFields = [
    'query'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

const renderTextField = ({
                           input,
                           label,
                           meta: { touched, error },
                           ...custom
                         }) => (
    <TextField
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    width: '100%',
  }
});

class SearchForm extends Component {
  state = { showHelp: false };

  render() {
    const { handleSubmit, pristine, submitting, invalid, error, classes, fetchData } = this.props;

    const onSubmit = (values, dispatch) => {
      return fetchData(Object.assign({}, values, {page: 0})).then((resp) => {
        if(resp.error) {
          throw new SubmissionError({_error: resp.payload.response.errors});
        }
        return true;
      });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={24} justify="center">
            <Grid item xs={6}>
              <Field name="query" component={renderTextField} label="Query" className={classes.input} />
            </Grid>
            <Grid item xs={6}>
              <Button variant="contained" type="submit" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
                Search
              </Button>
              <IconButton onClick={() => this.setState({showHelp: true})}>
                <HelpIcon />
              </IconButton>
            </Grid>
            {error && <Grid item xs={12}>
              <Typography color="error">{error.join(', ')}</Typography>
            </Grid> }
          </Grid>
          <HelpDialog visible={this.state.showHelp} onClose={() => this.setState({showHelp: false})}/>
        </form>
    );
  }
}

export default reduxForm({
  form: 'SearchForm', // a unique identifier for this form
  validate,
  // asyncValidate,
  // onSubmit
})(withStyles(styles)(SearchForm));