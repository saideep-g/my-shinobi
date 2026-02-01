import React, { useState } from 'react';
import { ChapterList } from './ChapterList';
import { QuestionGrid } from './QuestionGrid';

/**
 * BUNDLE EDITOR
 * Handles the granular editing of a Subject Bundle.
 * Switches between Curriculum (Logic) and Question Bank (Content).
 */

interface Props {
    mode?: 'curriculum' | 'questions';
}

export const BundleEditor: React.FC<Props> = ({ mode }) => {
    const [internalTab, setInternalTab] = useState<'curriculum' | 'questions'>('curriculum');
    const activeTab = mode || internalTab;

    return (
        <div className="space-y-6">
            {/* Tab Navigation (Only show if not in forced mode) */}
            {!mode && (
                <div className="flex gap-1 bg-app-surface p-1 rounded-2xl border border-app-border w-fit shadow-sm">
                    <button
                        onClick={() => setInternalTab('curriculum')}
                        className={`px-8 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'curriculum'
                            ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                            : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                            }`}
                    >
                        Curriculum Graph
                    </button>
                    <button
                        onClick={() => setInternalTab('questions')}
                        className={`px-8 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'questions'
                            ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                            : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                            }`}
                    >
                        Question Bank
                    </button>
                </div>
            )}

            {/* View Switcher Area */}
            <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                {activeTab === 'curriculum' ? (
                    <ChapterList />
                ) : (
                    <QuestionGrid />
                )}
            </div>
        </div>
    );
};
