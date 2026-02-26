import { Component } from 'react';

const ERROR_ROUTE_PATH = '/404';

export default class GlobalErrorBoundary extends Component {
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    if (window.location.pathname === ERROR_ROUTE_PATH) {
      return;
    }

    window.history.replaceState({}, '', ERROR_ROUTE_PATH);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  render() {
    if (this.state?.hasError) {
      return null;
    }

    return this.props.children;
  }
}
