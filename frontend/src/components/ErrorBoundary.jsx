import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log the error to an error reporting service (optional)
    this.setState({ error, info });
    console.error('Error in component:', error);
    console.error('Error info:', info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any fallback UI here
      return (
        <div>
          <h2>Something went wrong. Please try again later.</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
