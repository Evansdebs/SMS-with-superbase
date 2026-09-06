'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[450px] w-full flex items-center justify-center p-6 my-6">
          <div className="max-w-lg w-full bg-slate-900/90 border border-rose-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-sm text-slate-400 mb-6">
              An unexpected error occurred in this view. Your session data is intact.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all shadow-md active:scale-95"
              >
                Try Again
              </button>
              <Link
                href="/school/dashboard"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
              >
                School Dashboard
              </Link>
              <button
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                {this.state.showDetails ? 'Hide Details' : 'View Details'}
              </button>
            </div>

            {this.state.showDetails && (
              <div className="text-left bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs font-mono text-rose-300 overflow-x-auto max-h-48">
                <div className="font-semibold text-rose-400 mb-1">
                  {this.state.error?.name}: {this.state.error?.message}
                </div>
                {this.state.error?.stack && (
                  <pre className="text-[10px] text-slate-500 whitespace-pre-wrap mt-2">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
