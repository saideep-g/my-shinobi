import React from 'react';
import { clsx } from 'clsx';

/**
 * SKELETON LOADER
 * A high-performance placeholder for content that is still loading.
 * It uses a subtle pulse animation and follows the platform's Design Tokens.
 */

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={clsx(
                "animate-pulse bg-app-surface/50 rounded-2xl",
                className
            )}
        />
    );
};

/**
 * Card Skeleton Preset
 */
export const CardSkeleton = () => (
    <div className="bg-app-surface border border-app-border p-6 rounded-[32px] space-y-6 shadow-sm">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-3">
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
        </div>
    </div>
);

/**
 * Profile Skeleton Preset
 */
export const ProfileSkeleton = () => (
    <div className="bg-app-surface border border-app-border rounded-[40px] p-8 text-center space-y-6">
        <div className="flex justify-center">
            <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        <div className="space-y-3">
            <Skeleton className="h-7 w-1/2 mx-auto rounded-lg" />
            <Skeleton className="h-4 w-1/3 mx-auto rounded-lg" />
        </div>
    </div>
);
