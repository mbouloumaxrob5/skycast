'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { logger } from '@/lib/utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', { error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-200 mb-2">
            Quelque chose s&apos;est mal passé
          </h3>
          <p className="text-red-300/80 mb-4 text-sm">
            {this.state.error?.message || 'Une erreur inattendue est survenue'}
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
