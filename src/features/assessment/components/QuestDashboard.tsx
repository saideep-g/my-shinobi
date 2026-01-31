import { RecentActivityLimit } from './RecentActivityLimit';
import { DailyMissionCard } from '@features/progression/components/DailyMissionCard';
import { SubjectMissionList } from '@features/progression/components/SubjectMissionList';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { useNavigate } from 'react-router-dom';
import React from 'react';

/**
 * QUEST DASHBOARD
 * The root view for the Quest section.
 * Shows daily progress, recent activity history, and subject masteries.
 */

export const QuestDashboard: React.FC = () => {
    const navigate = useNavigate();
    const bundles = getAllBundles();

    return (
        <div className="space-y-10 pb-24 max-w-md mx-auto animate-in fade-in duration-700">
            {/* 1. Habit Loop (Daily Practice) */}
            <div className="px-4 pt-6">
                <DailyMissionCard />
            </div>

            {/* 2. Recent Activity (The Practice History) */}
            <section className="px-4">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Recent Adventures</h3>
                <RecentActivityLimit count={3} />
            </section>

            {/* 3. Skill Map (Long-term Mastery) */}
            <section className="px-4">
                <SubjectMissionList
                    bundles={bundles}
                    onSelect={(bundle) => navigate(`/quest/${bundle.id}`)}
                />
            </section>
        </div>
    );
};
