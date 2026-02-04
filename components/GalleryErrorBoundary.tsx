"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GalleryErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6 bg-zinc-900/30 rounded-3xl border border-red-500/20 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center shadow-inner ring-1 ring-red-500/30">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    <div className="max-w-md space-y-2">
                        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
                        <p className="text-zinc-400">
                            We couldn't load the gallery. It might be a momentary glitch in the matrix.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 hover:scale-105 transition-all shadow-lg"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Try Again
                    </button>

                    {process.env.NODE_ENV === 'development' && (
                        <pre className="text-xs text-red-400/80 bg-black/50 p-4 rounded-lg overflow-auto max-w-full text-left mt-8 border border-red-500/10">
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
