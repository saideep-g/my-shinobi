import React from 'react';
import { Layers, ChevronRight, Hash } from 'lucide-react';

/**
 * CHAPTER LIST
 * A management view for the Curriculum Graph.
 * Visualizes chapters and their constituent atoms.
 */

export const ChapterList: React.FC = () => {
    // Mock curriculum structure
    const chapters = [
        {
            id: 'ch-1',
            title: 'Present Tenses',
            atoms: ['Present Simple', 'Present Continuous', 'Present Perfect']
        },
        {
            id: 'ch-2',
            title: 'Past Tenses',
            atoms: ['Past Simple', 'Past Continuous']
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-black text-text-main">Curriculum Graph</h4>
                <button className="text-app-primary font-black text-sm hover:underline p-2 rounded-lg hover:bg-app-primary/5 transition-all">
                    + Add Chapter
                </button>
            </div>

            <div className="space-y-4">
                {chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-app-bg border border-app-border rounded-3xl p-6 hover:border-app-primary/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-app-primary/10 rounded-lg text-app-primary">
                                    <Layers size={18} />
                                </div>
                                <h5 className="font-black text-lg">{chapter.title}</h5>
                            </div>
                            <button className="text-xs font-bold text-app-primary uppercase tracking-widest hover:underline">
                                Edit Structure
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {chapter.atoms.map((atom, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-app-surface border border-app-border rounded-xl group cursor-pointer hover:bg-app-bg transition-colors">
                                    <div className="flex items-center gap-2">
                                        <Hash size={14} className="text-text-muted" />
                                        <span className="text-sm font-medium">{atom}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                                </div>
                            ))}
                            <div className="flex items-center justify-center p-3 border-2 border-dashed border-app-border rounded-xl text-[10px] font-black uppercase text-text-muted hover:border-app-primary hover:text-app-primary cursor-pointer transition-all">
                                + Add Atom
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
