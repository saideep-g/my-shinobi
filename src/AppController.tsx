import React, { useState } from 'react';
import { UniversalNav } from './shared/layouts/UniversalNav';
import { DailyMissionCard } from '@features/progression/components/DailyMissionCard';
import { PathToMaster } from '@features/progression/components/PathToMaster';
import { StudyEraLibrary } from '@features/progression/components/StudyEraLibrary';
import { useSession } from '@core/engine/SessionContext';
import { Grade7EnglishBundle } from '@features/curriculum/data/grade-7/english-bundle';
import { HeroProfile } from '@features/progression/components/HeroProfile';

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

            {/* PROFILE SECTION: Student Sanctuary */}
            {section === 'profile' && (
                <HeroProfile />
            )}
        </UniversalNav>
    );
};
