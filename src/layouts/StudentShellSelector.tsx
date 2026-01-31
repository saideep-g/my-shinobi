import React from 'react';
import { useAuth } from '@core/auth/AuthContext';
import { QuestLayout } from './QuestLayout';
import { EraLayout } from './EraLayout';

/**
 * STUDENT SHELL SELECTOR
 * Acts as a wrapper for all student-facing routes.
 * * It reads the layout preference from the Auth Profile and 
 * wraps the current route content in the appropriate visual shell.
 */

import { QuestSummary } from '@/features/assessment/components/QuestSummary';

export const StudentShellSelector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { profile } = useAuth();

    // Default to 'mobile-quest' if no preference is set
    const layout = profile?.preferredLayout || 'mobile-quest';

    return (
        <>
            <QuestSummary />
            {layout === 'study-era' ? (
                <EraLayout>{children}</EraLayout>
            ) : (
                <QuestLayout>{children}</QuestLayout>
            )}
        </>
    );
};
