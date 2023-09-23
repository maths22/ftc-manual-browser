import * as Sentry from '@sentry/browser';
import React from 'react';
// import TextLink from './TextLink';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    console.log(error);
    console.log(errorInfo);
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (<div>
            <p>An error has occured!</p>
            {/*TODO FIX THIS*/}
          {/*<TextLink onClick={() => Sentry.showReportDialog()}>Report feedback</TextLink>*/}
        </div>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}