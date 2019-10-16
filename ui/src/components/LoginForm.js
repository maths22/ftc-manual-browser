import React from 'react';
import {Field, reduxForm, SubmissionError} from 'redux-form';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core';
import {login, resetPassword} from '../actions/api';
import {clearUserDependentState} from '../../actions/util';

const validate = values => {
  const errors = {};
  const requiredFields = [
    'email'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });
  if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }
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

const onSubmit = (values, dispatch) => {
  return dispatch(login(values)).then((resp) => {
    if(resp.error) {
      throw new SubmissionError({_error: resp.payload.response.errors});
    }
    dispatch(clearUserDependentState());
    return true;
  });
};

const onResetPassword = (values, dispatch) => {
  function getRootUrl(url) {
    return url.toString().replace(/^(.*\/\/[^/?#]*).*$/,'$1');
  }

  return dispatch(resetPassword(values, getRootUrl(window.location) + '/account')).then((resp) => {
    if(resp.error) {
      throw new SubmissionError({_error: resp.payload.response.errors});
    }
    return true;
  });
};

const LoginForm = props => {
  const { handleSubmit, pristine, submitting, invalid, error, classes } = props;
  return (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={12}>
            <Field name="email" component={renderTextField} label="Email" className={classes.input} />
          </Grid>
          <Grid item xs={12}>
            <Field name="password" component={renderTextField} label="Password" type="password" className={classes.input} />
          </Grid>
          {error && <Grid item xs={12}>
            <Typography color="error">{error.join(', ')}</Typography>
          </Grid> }
          <Grid item xs={12}>
            <Button variant="contained" type="submit" color="primary" disabled={pristine || submitting || invalid} className={classes.button}>
              Login
            </Button>
            <Button type="submit" onClick={handleSubmit(onResetPassword)} color="primary" disabled={pristine || submitting} className={classes.button}>
              Forgot?
            </Button>
            {/*<Button variant="contained" type="button" disabled={pristine || submitting || invalid} onClick={reset} className={classes.button}>*/}
              {/*Clear*/}
            {/*</Button>*/}
          </Grid>
        </Grid>
      </form>
  );
};

export default reduxForm({
  form: 'LoginForm', // a unique identifier for this form
  validate,
  // asyncValidate,
  onSubmit
})(withStyles(styles)(LoginForm));