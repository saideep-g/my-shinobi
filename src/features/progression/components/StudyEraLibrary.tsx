import React, { useState } from 'react';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { SubjectBundle } from '@/types/bundles';
import { BookOpen, ChevronRight } from 'lucide-react';
import { MasteryGauge } from '@features/assessment/components/MasteryGauge';

/**
 * STUDY ERA LIBRARY
 * A comprehensive, browseable view of the student's curriculum.
 * Designed for deep-dive learning and self-reflection on Bayesian progress.
 */

interface LibraryProps {
    bundle: SubjectBundle;
    onSelectAtom: (atomId: string) => void;
}

export const StudyEraLibrary: React.FC<LibraryProps> = ({ bundle, onSelectAtom }) => {
    const { getAtomMastery } = useIntelligence();
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    const activeChapter = bundle.curriculum.chapters[activeChapterIndex];

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 p-6 animate-in fade-in duration-700">

            {/* Sidebar: Chapter Navigation */}
            <aside className="w-full lg:w-80 space-y-6">
                <header className="mb-8">
                    <h2 className="text-3xl font-black tracking-tighter text-text-main">Scroll Library</h2>
                    <p className="text-sm font-medium text-text-muted mt-2">Select a path to master</p>
                </header>

                <nav className="space-y-3">
                    {bundle.curriculum.chapters.map((chapter, index) => (
                        <button
                            key={chapter.id}
                            onClick={() => setActiveChapterIndex(index)}
                            className={`w-full p-5 rounded-[28px] border-2 text-left transition-all duration-300 relative overflow-hidden group ${activeChapterIndex === index
                                ? 'border-app-primary bg-app-primary/5 shadow-xl shadow-app-primary/5 ring-1 ring-app-primary/20 scale-[1.02]'
                                : 'border-app-border bg-app-surface hover:border-app-primary/40 hover:translate-x-1'
                                }`}
                        >
                            {activeChapterIndex === index && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-app-primary" />
                            )}
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1 group-hover:text-app-primary transition-colors">
                                Module {index + 1}
                            </p>
                            <p className="font-bold text-text-main text-lg leading-tight line-clamp-2">{chapter.title}</p>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content: Atom Drilldown */}
            <main className="flex-1 space-y-8">
                {/* Chapter Context Header */}
                <header className="bg-app-surface border border-app-border rounded-[40px] p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute -right-8 -bottom-8 text-app-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rotate-12">
                        <BookOpen size={180} />
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="p-4 bg-app-primary/10 rounded-3xl text-app-primary shadow-inner">
                            <BookOpen size={40} />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-app-primary uppercase tracking-[0.3em] mb-1">Current Focus</p>
                            <h1 className="text-4xl font-black tracking-tight text-text-main">{activeChapter.title}</h1>
                        </div>
                    </div>
                </header>

                {/* Atom List Grid */}
                <div className="grid grid-cols-1 gap-5">
                    {activeChapter.atoms.map((atom) => {
                        const mastery = getAtomMastery(atom.id);
                        const isMastered = mastery >= 0.85;

                        return (
                            <div
                                key={atom.id}
                                className="bg-app-surface border border-app-border rounded-[32px] p-1 pr-6 flex items-center justify-between group hover:border-app-primary/50 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6 p-7">
                                    {/* Status Indicator */}
                                    <div className="relative">
                                        <div className={`w-4 h-4 rounded-full ${isMastered ? 'bg-app-accent shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'}`} />
                                        {isMastered && (
                                            <div className="absolute inset-0 bg-app-accent rounded-full animate-ping opacity-20" />
                                        )}
                                    </div>

                                    <div className="space-y-4 flex-1">
                                        <h4 className="font-black text-xl text-text-main group-hover:text-app-primary transition-colors">
                                            {atom.title}
                                        </h4>
                                        <div className="max-w-md bg-app-bg p-4 rounded-2xl border border-app-border shadow-inner">
                                            <MasteryGauge label="Current Strength" probability={mastery} />
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Start Button */}
                                <button
                                    onClick={() => onSelectAtom(atom.id)}
                                    className="p-5 bg-app-bg border border-app-border rounded-[24px] text-text-muted hover:bg-app-primary hover:text-white hover:border-app-primary hover:scale-110 active:scale-95 transition-all shadow-sm"
                                    title="Jump to Quest"
                                >
                                    <ChevronRight size={28} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};
