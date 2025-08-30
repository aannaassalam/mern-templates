'use client';

import { AlertTriangle } from 'lucide-react';
import React, { ReactNode } from 'react';
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-center">
              <AlertTriangle className="size-12 text-yellow-500" />
            </div>
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
              Oops, there is an error!
            </h2>
            <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
              We apologize for the inconvenience. Please try again or contact
              support if the problem persists.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => this.setState({ hasError: false })}
                className="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-600"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
