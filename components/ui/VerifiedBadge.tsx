
import React from 'react';

// A simple verified badge component
// We can enhance this with a Tooltip if needed later, but sticking to simple SVG for now for speed/perf.
export const VerifiedBadge: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <svg
            className={`text-blue-500 inline-block align-middle ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.78 4 4 0 0 1 0-6.74Z" />
            <path d="m9 12 2 2 4-4" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};
