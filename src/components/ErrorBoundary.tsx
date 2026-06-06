"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches runtime errors in child components and displays a fallback UI
 * instead of crashing the entire page.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log errors for debugging; in production, send to error tracking service
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-[300px] flex items-center justify-center p-8 rounded-2xl border border-gold-500/20"
          style={{ background: "rgba(45,27,17,.5)" }}
        >
          <div className="text-center">
            <p className="text-5xl mb-4">🧴</p>
            <h3 className="font-playfair text-xl font-bold text-gold-400 mb-2">
              حصل مشكلة
            </h3>
            <p className="text-subtle text-sm mb-4">
              حصل خطأ غير متوقع. جرّب تعمل refresh للصفحة.
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2 gold-gradient rounded-lg text-sm transition hover:opacity-90"
            >
              حاول تاني
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
