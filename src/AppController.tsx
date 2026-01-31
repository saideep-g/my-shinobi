import React, { useState } from 'react';
import { UniversalNav } from './shared/layouts/UniversalNav';
import { DailyMissionCard } from '@features/progression/components/DailyMissionCard';
import { PathToMaster } from '@features/progression/components/PathToMaster';
import { StudyEraLibrary } from '@features/progression/components/StudyEraLibrary';
import { HeroProfile } from '@features/progression/components/HeroProfile';
import { SubjectMissionList } from '@features/progression/components/SubjectMissionList';
import { SubjectMasteryList } from '@features/progression/components/SubjectMasteryList';
import { HistoryVault } from '@features/assessment/components/HistoryVault';
import { useSession } from '@core/engine/SessionContext';
import { Grade7EnglishBundle } from '@features/curriculum/data/grade-7/english-bundle';
import { Grade7MathBundle } from '@features/curriculum/data/grade-7/math-bundle';
import { SubjectBundle } from '@/types/bundles';
import { ChevronLeft } from 'lucide-react';

/**
 * APP CONTROLLER
 * Orchestrates the multi-subject dashboard and view switching.
 */

export const AppController: React.FC = () => {
    const [section, setSection] = useState<'quest' | 'library' | 'profile' | 'history'>('quest');
    const [selectedBundle, setSelectedBundle] = useState<SubjectBundle | null>(null);
    const { startSession } = useSession();

    // Active Subjects
    const activeBundles = [Grade7EnglishBundle, Grade7MathBundle];

    const handleLaunchQuest = async (atomId: string) => {
        if (!selectedBundle) return;
        console.log(`[Controller] Launching quest for atom: ${atomId} in ${selectedBundle.id}`);
        await startSession(selectedBundle);
    };

    const handleBackToDashboard = () => setSelectedBundle(null);

    return (
        <UniversalNav
            activeSection={section === 'history' ? 'profile' : section}
            setSection={(s) => {
                setSection(s);
                // Auto-reset selection when switching main sections
                if (s === 'profile') setSelectedBundle(null);
            }}
        >
            <div className="p-0">

                {/* 1. QUEST SECTION */}
                {section === 'quest' && (
                    <div className="p-6 max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {!selectedBundle ? (
                            <>
                                <DailyMissionCard />
                                <SubjectMissionList
                                    bundles={activeBundles}
                                    onSelect={setSelectedBundle}
                                />
                            </>
                        ) : (
                            <div className="space-y-10">
                                <header className="flex items-center gap-4">
                                    <button
                                        onClick={handleBackToDashboard}
                                        className="p-3 bg-app-surface border border-app-border rounded-2xl hover:bg-app-bg transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div>
                                        <h3 className="text-xl font-black text-text-main">{selectedBundle.curriculum.name}</h3>
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Training Path</p>
                                    </div>
                                </header>

                                <PathToMaster
                                    bundle={selectedBundle}
                                    onSelectAtom={handleLaunchQuest}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* 2. LIBRARY SECTION */}
                {section === 'library' && (
                    <div className="p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {!selectedBundle ? (
                            <SubjectMasteryList
                                bundles={activeBundles}
                                onSelect={setSelectedBundle}
                            />
                        ) : (
                            <div className="space-y-8">
                                <header className="flex items-center gap-4">
                                    <button
                                        onClick={handleBackToDashboard}
                                        className="p-3 bg-app-surface border border-app-border rounded-2xl hover:bg-app-bg transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div>
                                        <h3 className="text-xl font-black text-text-main">{selectedBundle.curriculum.name}</h3>
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Curriculum Library</p>
                                    </div>
                                </header>

                                <StudyEraLibrary
                                    bundle={selectedBundle}
                                    onSelectAtom={handleLaunchQuest}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* 3. PROFILE SECTION */}
                {section === 'profile' && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <HeroProfile onViewHistory={() => setSection('history')} />
                    </div>
                )}

                {/* 4. HISTORY VAULT */}
                {section === 'history' && (
                    <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="max-w-md mx-auto p-6 flex items-center gap-4">
                            <button
                                onClick={() => setSection('profile')}
                                className="p-3 bg-app-surface border border-app-border rounded-2xl hover:bg-app-bg transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div>
                                <h3 className="text-xl font-black text-text-main">Archives</h3>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Vault Navigation</p>
                            </div>
                        </div>
                        <HistoryVault />
                    </div>
                )}
            </div>
        </UniversalNav>
    );
};
