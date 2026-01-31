import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * THEMED ICON COMPONENT
 * A wrapper for SVG assets that integrates with the platform's Design Tokens.
 * * It allows icons to change color based on the Light/Dark theme 
 * using standard Tailwind 'text-app-*' or 'fill-current' classes.
 */

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ThemedIconProps {
    /** The SVG path or component */
    children: React.ReactNode;
    /** Tailwind classes for sizing and coloring (e.g., 'w-6 h-6 text-app-primary') */
    className?: string;
    /** Accessibility label */
    label?: string;
}

export const ThemedIcon: React.FC<ThemedIconProps> = ({
    children,
    className,
    label
}) => {
    return (
        <span
            role="img"
            aria-label={label}
            className={cn(
                "inline-flex items-center justify-center transition-colors duration-300",
                className
            )}
        >
            {/* The SVG child should ideally use 'currentColor' for its 
        stroke or fill properties to respond to the className.
      */}
            {children}
        </span>
    );
};
