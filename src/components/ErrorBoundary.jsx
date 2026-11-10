import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Enterprise Error Boundary component
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the error, and renders a fallback UI instead of crashing the entire app tree.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-[#0A0A0C] border border-rose-800/40 rounded-lg p-6 shadow-subtle my-4 text-center max-w-xl mx-auto space-y-3">
          <div className="w-10 h-10 rounded-full bg-rose-950/40 border border-rose-800/60 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">Something went wrong rendering this view</h3>
          <p className="text-xs text-zinc-400 font-mono">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <div className="pt-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black text-xs font-semibold font-mono transition-colors shadow-button-white cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Component</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
