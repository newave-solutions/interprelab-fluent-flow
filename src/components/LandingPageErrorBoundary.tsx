import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle React errors gracefully
 * Prevents the entire app from crashing when an error occurs
 */
export class LandingPageErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to console in development
        console.error('Error Boundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // In production, you could send error to monitoring service
        // Example: Sentry.captureException(error);
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-8">
                    <div className="max-w-2xl w-full bg-card border border-border rounded-lg shadow-lg p-8 space-y-6">
                        {/* Icon and Title */}
                        <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="w-12 h-12 text-destructive" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    We're sorry for the inconvenience. An unexpected error has occurred.
                                </p>
                            </div>
                        </div>

                        {/* Error Details (Development Only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="bg-muted/50 border border-border rounded-md p-4 space-y-2">
                                <p className="font-mono text-sm text-destructive font-semibold">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
                                            View Stack Trace
                                        </summary>
                                        <pre className="mt-2 text-xs overflow-auto max-h-64 p-2 bg-background rounded border border-border">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={this.handleReset}
                                variant="default"
                                className="flex-1"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                            <Button
                                onClick={this.handleGoHome}
                                variant="outline"
                                className="flex-1"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go to Home
                            </Button>
                        </div>

                        {/* Help Text */}
                        <p className="text-sm text-muted-foreground text-center pt-2">
                            If this problem persists, please{' '}
                            <a
                                href="/contact"
                                className="text-primary hover:underline"
                            >
                                contact support
                            </a>
                            .
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
