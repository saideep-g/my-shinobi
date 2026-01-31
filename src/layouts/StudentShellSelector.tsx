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
import { MistakeReview } from '@/features/assessment/components/MistakeReview';
import { useSession } from '@core/engine/SessionContext';

export const StudentShellSelector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { profile } = useAuth();
    const { isSessionComplete } = useSession();
    const [reviewFinished, setReviewFinished] = React.useState(false);

    // Reset review state when a new session starts (i.e., when isSessionComplete becomes false)
    React.useEffect(() => {
        if (!isSessionComplete) {
            setReviewFinished(false);
        }
    }, [isSessionComplete]);

    // Default to 'mobile-quest' if no preference is set
    const layout = profile?.preferredLayout || 'mobile-quest';

    return (
        <>
            {/* Completion Flow: MistakeReview -> QuestSummary */}
            {isSessionComplete && !reviewFinished && (
                <MistakeReview onComplete={() => setReviewFinished(true)} />
            )}

            {isSessionComplete && reviewFinished && (
                <QuestSummary />
            )}

            {layout === 'study-era' ? (
                <EraLayout>{children}</EraLayout>
            ) : (
                <QuestLayout>{children}</QuestLayout>
            )}
        </>
    );
};
