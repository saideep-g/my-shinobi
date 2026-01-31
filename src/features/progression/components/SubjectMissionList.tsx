import { SubjectBundle } from '@/types/bundles';
import { useIntelligence } from '@core/engine/IntelligenceContext';
import { Book, Hash, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * SUBJECT MISSION LIST
 * Shows all subjects and their long-term Mastery Signal.
 * Optimized for high-energy mobile interaction.
 */

interface Props {
    bundles: SubjectBundle[];
    onSelect: (bundle: SubjectBundle) => void;
}

export const SubjectMissionList: React.FC<Props> = ({ bundles, onSelect }) => {
    const { mastery } = useIntelligence();

    const calculateGlobalSignal = (bundle: SubjectBundle) => {
        const allAtoms = bundle.curriculum.chapters.flatMap(c => c.atoms);
        if (allAtoms.length === 0) return 0;
        const sum = allAtoms.reduce((acc, a) => acc + (mastery[a.id] || 0), 0);
        return Math.round((sum / allAtoms.length) * 100);
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.3em]">Current Disciplines</h3>
            </header>

            <div className="space-y-4">
                {bundles.map(bundle => {
                    const signal = calculateGlobalSignal(bundle);
                    return (
                        <button
                            key={bundle.id}
                            onClick={() => onSelect(bundle)}
                            className="w-full bg-app-surface border border-app-border p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-app-primary/30 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                        >
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-transform group-hover:rotate-6 ${bundle.subjectId === 'english' ? 'bg-violet-500/10 text-violet-500' : 'bg-sky-500/10 text-sky-500'
                                    }`}>
                                    {bundle.subjectId === 'english' ? <Book size={24} /> : <Hash size={24} />}
                                </div>
                                <div className="text-left">
                                    <p className="text-lg font-black text-text-main group-hover:text-app-primary transition-colors">{bundle.curriculum.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mastery Status:</p>
                                        <span className={clsx(
                                            "text-[10px] font-black uppercase",
                                            signal > 80 ? "text-emerald-500" : "text-app-primary"
                                        )}>
                                            {signal}% Stable
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* SVG Mastery Ring */}
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-full h-full -rotate-90">
                                        <circle cx="24" cy="24" r="20" className="fill-none stroke-app-border" strokeWidth="4" />
                                        <circle
                                            cx="24"
                                            cy="24"
                                            r="20"
                                            className={clsx(
                                                "fill-none transition-all duration-1000",
                                                signal > 80 ? "stroke-emerald-500" : "stroke-app-primary"
                                            )}
                                            strokeWidth="4"
                                            strokeDasharray="125.6"
                                            strokeDashoffset={125.6 - (125.6 * signal) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className="absolute text-[10px] font-black text-text-main">{signal}%</span>
                                </div>
                                <ChevronRight size={20} className="text-text-muted group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
