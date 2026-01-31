import { SubjectBundle } from '@/types/bundles';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { Book, Hash, Activity } from 'lucide-react';

/**
 * SUBJECT MASTERY LIST
 * Shows the global Bayesian mastery signal for each subject.
 */

export const SubjectMasteryList = ({ bundles, onSelect }: { bundles: SubjectBundle[], onSelect: (b: SubjectBundle) => void }) => {
    const { mastery } = useIntelligence();

    const calculateGlobalSignal = (bundle: SubjectBundle) => {
        const allAtoms = bundle.curriculum.chapters.flatMap(c => c.atoms);
        if (allAtoms.length === 0) return 0;
        const sum = allAtoms.reduce((acc, a) => acc + (mastery[a.id] || 0), 0);
        return Math.round((sum / allAtoms.length) * 100);
    };

    return (
        <div className="space-y-6">
            <header className="px-2">
                <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.3em]">Knowledge Map</h3>
                <h2 className="text-2xl font-black text-text-main mt-1">Syllabus Overview</h2>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {bundles.map(bundle => {
                    const signal = calculateGlobalSignal(bundle);
                    return (
                        <button
                            key={bundle.id}
                            onClick={() => onSelect(bundle)}
                            className="bg-app-surface border border-app-border p-8 rounded-[40px] text-left hover:border-app-primary/40 transition-all shadow-sm group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bundle.subjectId === 'english' ? 'bg-violet-500/10 text-violet-500' : 'bg-sky-500/10 text-sky-500'
                                    }`}>
                                    {bundle.subjectId === 'english' ? <Book size={24} /> : <Hash size={24} />}
                                </div>
                                <div className="p-2 bg-app-bg rounded-xl text-text-muted group-hover:text-app-primary transition-colors">
                                    <Activity size={18} />
                                </div>
                            </div>

                            <p className="text-sm font-black text-text-muted uppercase tracking-widest mb-1">{bundle.subjectId}</p>
                            <h4 className="text-xl font-black text-text-main leading-none mb-6">{bundle.curriculum.name}</h4>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mastery Signal</span>
                                    <span className="text-lg font-black text-text-main">{signal}%</span>
                                </div>
                                <div className="h-2 bg-app-bg rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ${signal > 80 ? 'bg-emerald-500' : signal > 40 ? 'bg-app-primary' : 'bg-amber-500'
                                            }`}
                                        style={{ width: `${signal}%` }}
                                    />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
