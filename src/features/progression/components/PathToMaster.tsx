import React from 'react';
import { SubjectBundle } from '@/types/bundles';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { PathNode } from './PathNode';

/**
 * PATH TO MASTER
 * Visualizes the hierarchical journey through a subject.
 * Arranges curriculum Atoms in a snake-like vertical path.
 */

interface PathToMasterProps {
    bundle: SubjectBundle;
    onSelectAtom: (atomId: string) => void;
}

export const PathToMaster: React.FC<PathToMasterProps> = ({ bundle, onSelectAtom }) => {
    const { mastery } = useIntelligence();

    // Helper to determine if an atom is unlocked based on prerequisites
    const checkUnlocked = (prereqs?: string[]) => {
        if (!prereqs || prereqs.length === 0) return true;
        return prereqs.every(id => (mastery[id] || 0) >= 0.85);
    };

    return (
        <div className="relative py-12 flex flex-col items-center min-h-screen bg-app-bg/50 rounded-[4rem]">
            {/* Subject Path Background Line - Represents the continuity of knowledge */}
            <div className="absolute top-20 bottom-20 w-1.5 bg-app-border left-1/2 -translate-x-1/2 z-0 opacity-20 rounded-full" />

            <div className="space-y-32 relative z-10 w-full max-w-lg px-8">
                {bundle.curriculum.chapters.map((chapter, cIndex) => (
                    <div key={chapter.id} className="space-y-16">
                        {/* Chapter Milestone Header */}
                        <div className="text-center">
                            <span className="bg-app-surface shadow-sm text-text-muted text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] border border-app-border inline-block hover:text-app-primary hover:border-app-primary transition-colors cursor-default">
                                Chapter {cIndex + 1}: {chapter.title}
                            </span>
                        </div>

                        <div className="flex flex-col gap-24">
                            {chapter.atoms.map((atom, aIndex) => {
                                const isUnlocked = checkUnlocked(atom.prerequisites);
                                const atomMastery = mastery[atom.id] || 0;

                                // Snake-like alternating layout
                                const sideClass = aIndex % 2 === 0 ? "self-start" : "self-end";

                                return (
                                    <div key={atom.id} className={sideClass}>
                                        <PathNode
                                            title={atom.title}
                                            mastery={atomMastery}
                                            isUnlocked={isUnlocked}
                                            isSuggested={isUnlocked && atomMastery < 0.85} // Simple suggestion logic
                                            onClick={() => onSelectAtom(atom.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* End of Path Goal */}
                <div className="pt-20 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-app-accent/5 border-4 border-dashed border-app-accent flex items-center justify-center opacity-50 grayscale">
                        🏆
                    </div>
                    <p className="text-[10px] font-black uppercase text-app-accent mt-4 tracking-widest">Master Goal Area</p>
                </div>
            </div>
        </div>
    );
};
