import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * BASE TEMPLATE WRAPPER
 * The standard layout container for all question types.
 * * It provides consistent padding, typography, and a "Slot" for 
 * the specific interaction (MCQ options, input boxes, etc.)
 */

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BaseTemplateWrapperProps {
    title?: string;
    stem: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

export const BaseTemplateWrapper: React.FC<BaseTemplateWrapperProps> = ({
    title,
    stem,
    children,
    footer,
    className
}) => {
    return (
        <div className={cn(
            "w-full max-w-2xl mx-auto flex flex-col gap-6 p-4 md:p-0 animate-in fade-in slide-in-from-bottom-4 duration-500",
            className
        )}>
            {/* Question Header & Stem */}
            <div className="space-y-4">
                {title && (
                    <span className="inline-block px-3 py-1 rounded-full bg-app-primary/10 text-app-primary text-[10px] font-black uppercase tracking-widest">
                        {title}
                    </span>
                )}
                <h2 className="text-xl md:text-2xl font-bold text-text-main leading-snug">
                    {stem}
                </h2>
            </div>

            {/* The Interaction Slot (Where MCQ/Numeric components render) */}
            <div className="bg-app-surface border border-app-border rounded-[32px] p-6 md:p-8 shadow-sm">
                {children}
            </div>

            {/* Standard Feedback/Footer Area */}
            {footer && (
                <div className="mt-2">
                    {footer}
                </div>
            )}
        </div>
    );
};
