import React from 'react';
import { DailyMissionCard } from '@features/progression/components/DailyMissionCard';
import { SubjectMissionList } from '@features/progression/components/SubjectMissionList';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { useNavigate } from 'react-router-dom';

/**
 * QUEST DASHBOARD
 * The root view for the Quest section.
 * Shows daily progress and allow navigation to specific subjects.
 */

export const QuestDashboard: React.FC = () => {
    const navigate = useNavigate();
    const bundles = getAllBundles();

    return (
        <div className="p-6 max-w-md mx-auto space-y-10 animate-in fade-in duration-700">
            <DailyMissionCard />
            <SubjectMissionList
                bundles={bundles}
                onSelect={(bundle) => navigate(`/quest/${bundle.id}`)}
            />
        </div>
    );
};
