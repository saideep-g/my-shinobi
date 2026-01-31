import React, { useState } from 'react';
import { ChapterList } from './ChapterList';
import { QuestionGrid } from './QuestionGrid';

/**
 * BUNDLE EDITOR
 * Handles the granular editing of a Subject Bundle.
 * Switches between Curriculum (Logic) and Question Bank (Content).
 */

export const BundleEditor: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'curriculum' | 'questions'>('curriculum');

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-app-surface p-1 rounded-2xl border border-app-border w-fit shadow-sm">
                <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`px-8 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'curriculum'
                            ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                            : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                        }`}
                >
                    Curriculum Graph
                </button>
                <button
                    onClick={() => setActiveTab('questions')}
                    className={`px-8 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'questions'
                            ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                            : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                        }`}
                >
                    Question Bank
                </button>
            </div>

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
