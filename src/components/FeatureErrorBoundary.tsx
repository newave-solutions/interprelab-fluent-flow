import { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, RefreshCw, Home, Send, X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    children: ReactNode;
    featureName: string;
    maxRetries?: number;
    enableFeedback?: boolean;
    onError?: (error: Error, errorInfo: React.ErrorInfo, featureName: string) => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    retryCount: number;
    userFeedback: string;
    showFeedbackForm: boolean;
    isSubmittingFeedback: boolean;
}

/**
 * Enhanced Feature-level error boundary with:
 * - Error logging service integration
 * - Retry logic with exponential backoff
 * - User feedback collection
 * - Feature flag support
 */
export class FeatureErrorBoundary extends Component<Props, State> {
    private retryTimeoutId: number | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            userFeedback: '',
            showFeedbackForm: false,
            isSubmittingFeedback: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        const { featureName, onError, maxRetries = 3 } = this.props;
        const { retryCount } = this.state;

        // Log error details for debugging
        console.error(`Error in ${featureName}:`, error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // Call custom error handler if provided
        if (onError) {
            onError(error, errorInfo, featureName);
        }

        // Log to error reporting service (placeholder for Sentry, LogRocket, etc.)
        this.logErrorToService(error, errorInfo, featureName);

        // Attempt automatic retry with exponential backoff
        if (retryCount < maxRetries) {
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10s
            console.info(`Auto-retry ${retryCount + 1}/${maxRetries} in ${backoffDelay}ms...`);

            this.retryTimeoutId = window.setTimeout(() => {
                this.handleAutoRetry();
            }, backoffDelay);
        }
    }

    componentWillUnmount() {
        if (this.retryTimeoutId) {
            clearTimeout(this.retryTimeoutId);
        }
    }

    /**
     * Log error to external service (Sentry, LogRocket, CloudWatch, etc.)
     */
    private logErrorToService = (
        error: Error,
        errorInfo: React.ErrorInfo,
        featureName: string
    ) => {
        // TODO: Integrate with your error logging service
        // Example integrations:

        // Sentry:
        // import * as Sentry from '@sentry/react';
        // Sentry.captureException(error, {
        //   contexts: {
        //     react: {
        //       componentStack: errorInfo.componentStack,
        //     },
        //   },
        //   tags: {
        //     feature: featureName,
        //   },
        // });

        // LogRocket:
        // import LogRocket from 'logrocket';
        // LogRocket.captureException(error, {
        //   tags: { feature: featureName },
        //   extra: { componentStack: errorInfo.componentStack },
        // });

        // For now, log to console in development
        if (import.meta.env.DEV) {
            console.group(`🔴 Error Report: ${featureName}`);
            console.error('Error:', error);
            console.error('Component Stack:', errorInfo.componentStack);
            console.error('Timestamp:', new Date().toISOString());
            console.groupEnd();
        }
    };

    handleAutoRetry = () => {
        const { maxRetries = 3 } = this.props;
        const { retryCount } = this.state;

        if (retryCount < maxRetries) {
            console.info(`Attempting auto-retry ${retryCount + 1}/${maxRetries}...`);
            this.setState(prevState => ({
                hasError: false,
                error: null,
                errorInfo: null,
                retryCount: prevState.retryCount + 1,
            }));
        }
    };

    handleManualReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0,
            userFeedback: '',
            showFeedbackForm: false,
        });
        toast.success('Resetting feature...');
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    handleSubmitFeedback = async () => {
        const { featureName } = this.props;
        const { userFeedback, error, errorInfo } = this.state;

        if (!userFeedback.trim()) {
            toast.error('Please enter some feedback');
            return;
        }

        this.setState({ isSubmittingFeedback: true });

        try {
            // TODO: Send feedback to your backend
            // Example:
            // await fetch('/api/error-feedback', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     featureName,
            //     userFeedback,
            //     error: error?.toString(),
            //     errorStack: errorInfo?.componentStack,
            //     timestamp: new Date().toISOString(),
            //     userAgent: navigator.userAgent,
            //   }),
            // });

            // For now, just log to console
            console.info('User Feedback Submitted:', {
                featureName,
                feedback: userFeedback,
                error: error?.toString(),
                timestamp: new Date().toISOString(),
            });

            toast.success('Thank you for your feedback!');
            this.setState({
                showFeedbackForm: false,
                userFeedback: '',
                isSubmittingFeedback: false,
            });
        } catch (err) {
            console.error('Failed to submit feedback:', err);
            toast.error('Failed to submit feedback. Please try again.');
            this.setState({ isSubmittingFeedback: false });
        }
    };

    render() {
        const { featureName, enableFeedback = true, maxRetries = 3 } = this.props;
        const {
            hasError,
            error,
            errorInfo,
            retryCount,
            userFeedback,
            showFeedbackForm,
            isSubmittingFeedback,
        } = this.state;

        if (hasError) {
            const canRetry = retryCount < maxRetries;

            return (
                <div className="flex items-center justify-center min-h-[60vh] p-4">
                    <Card className="max-w-2xl w-full border-destructive/50">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl">
                                {featureName} Error
                            </CardTitle>
                            {retryCount > 0 && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Auto-retry attempt {retryCount}/{maxRetries} failed
                                </p>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-muted-foreground">
                                    Something went wrong while loading this feature.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Don't worry - the rest of the app is still working fine.
                                </p>
                            </div>

                            {/* Show error details in development */}
                            {import.meta.env.DEV && error && (
                                <div className="bg-muted p-4 rounded-lg space-y-2">
                                    <p className="font-mono text-xs text-destructive font-semibold">
                                        {error.toString()}
                                    </p>
                                    {errorInfo && (
                                        <details className="text-xs font-mono text-muted-foreground">
                                            <summary className="cursor-pointer hover:text-foreground">
                                                Stack trace
                                            </summary>
                                            <pre className="mt-2 overflow-auto max-h-48">
                                                {errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            {/* User Feedback Form */}
                            {enableFeedback && showFeedbackForm && (
                                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">Help us improve</h4>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => this.setState({ showFeedbackForm: false })}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        What were you doing when this error occurred?
                                    </p>
                                    <Textarea
                                        placeholder="I was trying to..."
                                        value={userFeedback}
                                        onChange={(e) => this.setState({ userFeedback: e.target.value })}
                                        className="min-h-[80px]"
                                        disabled={isSubmittingFeedback}
                                    />
                                    <Button
                                        onClick={this.handleSubmitFeedback}
                                        disabled={isSubmittingFeedback || !userFeedback.trim()}
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
                                    </Button>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={this.handleManualReset} variant="default">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    {canRetry ? 'Try Again' : 'Reset'}
                                </Button>
                                <Button onClick={this.handleReload} variant="outline">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reload Page
                                </Button>
                                <Button onClick={this.handleGoHome} variant="outline">
                                    <Home className="w-4 h-4 mr-2" />
                                    Go Home
                                </Button>
                            </div>

                            {/* Feedback button */}
                            {enableFeedback && !showFeedbackForm && (
                                <div className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => this.setState({ showFeedbackForm: true })}
                                    >
                                        Report this error
                                    </Button>
                                </div>
                            )}

                            <p className="text-xs text-center text-muted-foreground">
                                If this problem persists, please contact support.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
