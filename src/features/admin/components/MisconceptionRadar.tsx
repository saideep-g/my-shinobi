import React, { useMemo } from 'react';
import { QuestionLog } from '@/types/assessment';
import { AlertCircle, TrendingDown, Target, HelpCircle } from 'lucide-react';

/**
 * MISCONCEPTION RADAR
 * Aggregates incorrect answers and identifies clusters of confusion.
 * Helps admins see if specific conceptual gaps exist across atoms.
 */

interface Props {
    logs: QuestionLog[];
}

interface MisconceptionCluster {
    atomId: string;
    incorrectCount: number;
    topWrongAnswer: string;
    frequency: number; // % of incorrect answers that were this specific wrong answer
    impactScore: number; // Potential "danger" level
}

export const MisconceptionRadar: React.FC<Props> = ({ logs }) => {
    const clusters = useMemo(() => {
        const atomIncorrects: Record<string, string[]> = {};

        logs.forEach(log => {
            if (!log.isCorrect && (log as any).metadata?.studentAnswer) {
                if (!atomIncorrects[log.atomId]) atomIncorrects[log.atomId] = [];
                atomIncorrects[log.atomId].push(String((log as any).metadata.studentAnswer));
            }
        });

        const results: MisconceptionCluster[] = Object.entries(atomIncorrects).map(([atomId, wrongAnswers]) => {
            // Find most frequent wrong answer
            const frequencyMap: Record<string, number> = {};
            wrongAnswers.forEach(ans => frequencyMap[ans] = (frequencyMap[ans] || 0) + 1);

            const [topAnswer, count] = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0];

            return {
                atomId,
                incorrectCount: wrongAnswers.length,
                topWrongAnswer: topAnswer,
                frequency: (count / wrongAnswers.length) * 100,
                impactScore: (count * (count / wrongAnswers.length)) // Weighted by recurrence
            };
        });

        return results.sort((a, b) => b.impactScore - a.impactScore).slice(0, 5);
    }, [logs]);

    return (
        <div className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm h-full">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h4 className="text-xl font-black text-text-main flex items-center gap-3">
                        <AlertCircle className="text-rose-500" /> Misconception Radar
                    </h4>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Detecting systematic confusion clusters</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
                    <TrendingDown size={20} />
                </div>
            </header>

            <div className="space-y-4">
                {clusters.length === 0 ? (
                    <div className="py-20 text-center">
                        <Target size={40} className="mx-auto text-emerald-500/20 mb-4" />
                        <p className="text-sm font-black text-text-muted uppercase tracking-widest">No confusion clusters detected</p>
                    </div>
                ) : (
                    clusters.map((cluster, idx) => (
                        <div key={idx} className="bg-app-bg border border-app-border p-6 rounded-3xl group hover:border-rose-500/30 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-1">Atom Cluster</p>
                                    <h5 className="font-black text-lg text-text-main group-hover:text-rose-500 transition-colors uppercase italic tracking-tighter">{cluster.atomId}</h5>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-text-main leading-none">{cluster.incorrectCount}</p>
                                    <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-1">Missed Attempts</p>
                                </div>
                            </div>

                            <div className="bg-app-surface border border-app-border/50 rounded-2xl p-4 flex items-center gap-4">
                                <div className="p-2 bg-rose-100/50 rounded-xl text-rose-600">
                                    <HelpCircle size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Primary Misconception</p>
                                    <p className="text-sm font-bold text-text-main truncate">
                                        Answered "<span className="text-rose-600 underline decoration-rose-200 decoration-2 underline-offset-4">{cluster.topWrongAnswer}</span>"
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-rose-500">{cluster.frequency.toFixed(0)}%</p>
                                    <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Recurrence</p>
                                </div>
                            </div>

                            <div className="mt-4 h-1 w-full bg-app-border rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                                    style={{ width: `${cluster.frequency}%` }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="mt-8 pt-6 border-t border-app-border">
                <p className="text-[9px] font-medium text-text-muted leading-relaxed italic">
                    Sensei Tip: High recurrence ( {'>'} 60% ) suggests a fundamental misunderstanding of the atom's core logic. Consider a manual intervention.
                </p>
            </footer>
        </div>
    );
};
