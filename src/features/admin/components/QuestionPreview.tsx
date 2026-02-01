import React, { useMemo } from 'react';
import { QuestionBase } from '@/types/questions';
import { QuestionRenderer } from '@features/questions/components/QuestionRenderer';
import { similarityService } from '../services/similarity';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface Props {
    question: QuestionBase;
    onFixAnswer?: (newAnswer: string) => void;
}

/**
 * QUESTION PREVIEW
 * A high-fidelity simulator for Admins to view questions exactly as students see them.
 * Includes automated "Authoring Polish" like typo detection.
 */
export const QuestionPreview: React.FC<Props> = ({ question, onFixAnswer }) => {
    // 1. Authoring Integrity Check (Similarity)
    const typoAnalysis = useMemo(() => {
        if (question.templateId !== 'mcq') return null;

        const data = question.data as any;
        const answer = data.answer || '';
        const options = data.options || [];

        const hasExactMatch = options.some((o: string) => o.toLowerCase() === answer.toLowerCase());

        if (!hasExactMatch) {
            // Check for potential typos (>85% similarity)
            const suggestions = options
                .map((o: string) => ({ option: o, score: similarityService.getSimilarity(o, answer) }))
                .filter((s: any) => s.score > 0.85)
                .sort((a: any, b: any) => b.score - a.score);

            return { isBroken: true, suggestions };
        }

        return { isBroken: false };
    }, [question]);

    return (
        <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
            <header className="p-6 border-b border-app-border bg-app-surface/50">
                <h4 className="font-black text-lg tracking-tight">Question Preview</h4>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Live Simulator • {question.templateId} v{question.version}</p>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {/* 1. Integrity Alerts */}
                {typoAnalysis?.isBroken && (
                    <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-widest">
                            <AlertTriangle size={16} /> Integrity Alert
                        </div>
                        <p className="text-sm font-medium text-rose-900 leading-snug">
                            The answer <b className="font-black italic">"{question.data?.answer}"</b> does not exist in the choices.
                        </p>
                        {typoAnalysis.suggestions.length > 0 && (
                            <div className="pt-2">
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Lightbulb size={12} /> Did you mean?
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {typoAnalysis.suggestions.map((s: any) => (
                                        <button
                                            key={s.option}
                                            onClick={() => onFixAnswer?.(s.option)}
                                            className="px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-[10px] font-black text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
                                        >
                                            {s.option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!typoAnalysis?.isBroken && question.templateId === 'mcq' && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Answer Match Verified</span>
                    </div>
                )}

                {/* 2. Live Simulator Frame */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-app-primary/20 to-app-accent/20 rounded-[40px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-app-bg border border-app-border rounded-[32px] p-6 shadow-xl aspect-[9/16] max-h-[600px] flex flex-col justify-center overflow-hidden">
                        <QuestionRenderer
                            question={question}
                            data={question.data}
                            isReviewMode={true}
                            onAnswer={() => { }}
                        />
                    </div>
                </div>

                {/* 3. Metadata Table */}
                <section className="bg-app-surface/30 border border-app-border p-6 rounded-[32px] space-y-4">
                    <h5 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Raw Fingerprint</h5>
                    <div className="bg-app-bg p-4 rounded-xl font-mono text-[9px] break-all border border-app-border opacity-60">
                        {question.contentHash || 'NO_HASH_GENERATED'}
                    </div>
                </section>
            </div>
        </div>
    );
};
