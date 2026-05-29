import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
          <h1 className="text-4xl font-serif text-foreground mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <div className="p-4 bg-muted rounded-2xl text-left font-mono text-xs overflow-auto max-w-full">
            {this.state.error?.toString()}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
