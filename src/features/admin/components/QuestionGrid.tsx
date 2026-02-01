import React, { useMemo } from 'react';
import { Trash2, Edit3, Fingerprint, Flag, AlertTriangle, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { qualityGuard } from '../services/qualityGuard';

/**
 * QUESTION GRID
 * A tabular view of all questions within the subject bundle.
 * Allows for quick review and administrative actions.
 */

interface Props {
    onSelect?: (question: any) => void;
    onFlag?: (question: any) => void;
    selectedId?: string;
    showHealth?: boolean;
}

export const QuestionGrid: React.FC<Props> = ({ onSelect, onFlag, selectedId, showHealth }) => {
    // Enhanced mock data to support the simulator
    const questions = [
        {
            id: 'q-eng-001',
            text: "The Sun ___ in the East.",
            templateId: "mcq",
            version: 1,
            atomId: "verb-tenses",
            contentHash: "abc123456789",
            data: {
                text: "The Sun ___ in the East.",
                options: ["Rise", "Rises", "Rising", "Rose"],
                answer: "Rises"
            }
        },
        {
            id: 'q-eng-002',
            text: "I ___ learning English now.",
            templateId: "mcq",
            version: 1,
            atomId: "present-continuous",
            contentHash: "xyz789012345",
            data: {
                text: "I ___ learning English now.",
                options: ["Am", "Is", "Are", "Be"],
                answer: "Amy" // Intentional typo for testing the Simulator
            }
        },
        {
            id: 'q-eng-003',
            text: "Identify the tense: 'He has been reading.'",
            templateId: "mcq",
            version: 1,
            atomId: "perfect-continuous",
            contentHash: "def456789012",
            data: {
                text: "Identify the tense: 'He has been reading.'",
                options: ["Present Perfect", "Present Perfect Continuous", "Past Perfect"],
                answer: "Present Perfect Continuous"
            }
        },
        {
            id: 'q-eng-004',
            text: "Which of these is the most correct way to complete the sentence if you are talking about the past event that happened yesterday?",
            templateId: "mcq",
            version: 1,
            atomId: "bias-test",
            contentHash: "ghi012345678",
            data: {
                text: "Which of these is the most correct way to complete the sentence if you are talking about the past event that happened yesterday?",
                options: ["I go", "I went yesterday to the store with my friend", "I gone"],
                answer: "I went yesterday to the store with my friend" // Intentional bias
            }
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-black text-text-main">Question Pool ({questions.length})</h4>
                <button className="text-app-primary font-black text-sm hover:underline p-2 rounded-lg hover:bg-app-primary/5 transition-all">
                    + Add Manually
                </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {questions.map((q) => {
                    const bias = showHealth ? qualityGuard.detectLengthBias(q) : false;
                    const integrity = showHealth ? qualityGuard.validateIntegrity(q) : { isValid: true };
                    const isUnhealthy = bias || !integrity.isValid;

                    return (
                        <button
                            key={q.id}
                            onClick={() => onSelect?.(q)}
                            className={clsx(
                                "w-full text-left flex items-center justify-between p-5 transition-all group rounded-2xl border",
                                selectedId === q.id
                                    ? "bg-app-bg border-app-primary ring-2 ring-app-primary/20 shadow-md translate-x-2"
                                    : isUnhealthy
                                        ? "bg-rose-50/30 border-rose-200 hover:border-rose-300"
                                        : "bg-app-bg border-app-border hover:border-app-primary/30"
                            )}
                        >
                            <div className="flex items-center gap-6">
                                {/* Status Indicator */}
                                <div className={clsx(
                                    "w-12 h-12 rounded-xl border flex items-center justify-center text-[10px] font-black uppercase shadow-inner",
                                    selectedId === q.id
                                        ? "bg-app-primary text-white border-app-primary"
                                        : isUnhealthy
                                            ? "bg-rose-500 text-white border-rose-500"
                                            : "bg-app-surface border-app-border text-text-muted"
                                )}>
                                    {isUnhealthy ? <AlertTriangle size={18} /> : q.templateId}
                                </div>
                                <div>
                                    <p className="font-bold text-text-main line-clamp-1">{q.text}</p>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                            <Fingerprint size={12} className="text-app-primary/50" />
                                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">{q.id}/{q.version}</span>
                                        </div>
                                        {showHealth && !isUnhealthy && (
                                            <div className="flex items-center gap-1.5 text-emerald-500">
                                                <ShieldCheck size={12} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                            </div>
                                        )}
                                        {bias && (
                                            <span className="text-[9px] font-black text-amber-600 uppercase bg-amber-100 px-1.5 py-0.5 rounded">Length Bias</span>
                                        )}
                                        {!integrity.isValid && (
                                            <span className="text-[9px] font-black text-rose-600 uppercase bg-rose-100 px-1.5 py-0.5 rounded">Integrity Fail</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onFlag?.(q); }}
                                    title="Flag for Review"
                                    className="p-2.5 hover:bg-amber-50 text-amber-600 rounded-xl transition-colors border border-transparent hover:border-amber-100"
                                >
                                    <Flag size={18} />
                                </button>
                                <button title="Edit Question" className="p-2.5 hover:bg-app-primary/10 text-app-primary rounded-xl transition-colors border border-transparent hover:border-app-primary/20">
                                    <Edit3 size={18} />
                                </button>
                                <button title="Delete Question" className="p-2.5 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors border border-transparent hover:border-rose-100">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
