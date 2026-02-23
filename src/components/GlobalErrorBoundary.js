import { Component } from 'react';

const ERROR_REDIRECT_URL = 'https://hortelan.vercel.app/404';

export default class GlobalErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    window.location.replace(ERROR_REDIRECT_URL);
  }

  render() {
    if (this.state?.hasError) {
      return null;
    }

    return this.props.children;
  }
}
