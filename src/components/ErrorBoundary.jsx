import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    // Log the error to an error reporting service
    console.error('Error caught in Error Boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>An error occurred: {this.state.errorMessage}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
