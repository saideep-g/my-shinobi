import React, { useState } from 'react';
import { UniversalNav } from './shared/layouts/UniversalNav';
import { DailyMissionCard } from '@features/progression/components/DailyMissionCard';
import { PathToMaster } from '@features/progression/components/PathToMaster';
import { StudyEraLibrary } from '@features/progression/components/StudyEraLibrary';
import { useSession } from '@core/engine/SessionContext';
import { Grade7EnglishBundle } from '@features/curriculum/data/grade-7/english-bundle';

/**
 * APP CONTROLLER
 * Orchestrates the primary view switching logic for the student experience.
 * Connects the "Quest" (Game) and "Library" (Focus) domains.
 */

export const AppController: React.FC = () => {
    const [section, setSection] = useState<'quest' | 'library' | 'profile'>('quest');
    const { startSession } = useSession();

    /**
     * Helper to launch a quest for a specific atom.
     * This bridges the curriculum map to the session engine.
     */
    const handleLaunchQuest = async (atomId: string) => {
        console.log(`[Controller] Launching quest for atom: ${atomId}`);
        // Start session using the Grade 7 bundle
        await startSession(Grade7EnglishBundle);
    };

    return (
        <UniversalNav activeSection={section} setSection={setSection}>

            {/* QUEST SECTION: The Gamified Map */}
            {section === 'quest' && (
                <div className="max-w-md mx-auto p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <DailyMissionCard />

                    <div className="space-y-2 text-center">
                        <h3 className="text-2xl font-black tracking-tight text-text-main">Your Path</h3>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em]">Master Grade 7 English</p>
                    </div>

                    <div className="relative pb-10">
                        <PathToMaster
                            bundle={Grade7EnglishBundle}
                            onSelectAtom={handleLaunchQuest}
                        />
                    </div>
                </div>
            )}

            {/* LIBRARY SECTION: The Structured Syllabus */}
            {section === 'library' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <StudyEraLibrary
                        bundle={Grade7EnglishBundle}
                        onSelectAtom={handleLaunchQuest}
                    />
                </div>
            )}

            {/* PROFILE SECTION: Progress & Sharing */}
            {section === 'profile' && (
                <div className="p-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-app-surface rounded-[32px] border-2 border-app-border mx-auto flex items-center justify-center text-4xl shadow-inner">
                        👤
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-text-main">Student Profile</h2>
                        <p className="text-text-muted font-medium mt-1">Review your long-term Shinobi history.</p>
                    </div>

                    <div className="bg-app-surface border border-app-border rounded-[32px] p-8 max-w-sm mx-auto">
                        <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4">Coming Soon in Phase 39</p>
                        <p className="text-xs text-text-main leading-relaxed">
                            Unlock deeper insights into your learning patterns and download your Master Achievement certificates.
                        </p>
                    </div>
                </div>
            )}
        </UniversalNav>
    );
};
