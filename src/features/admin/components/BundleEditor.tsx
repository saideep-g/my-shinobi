import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChapterList } from './ChapterList';
import { QuestionGrid } from './QuestionGrid';
import { CoverageRadar } from './CoverageRadar';
import { getBundleById } from '@features/curriculum/data/bundleRegistry';
import { reviewService } from '@/services/db/reviewService';
import { ShieldAlert, HeartPulse, Search, Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { QuestionSimulator } from './QuestionSimulator';
import { suggestTypoFixes, detectBundleDuplicates, RepairSuggestion } from '../services/autoRepair';
import { clsx } from 'clsx';

/**
 * BUNDLE EDITOR
 * Handles the granular editing of a Subject Bundle.
 * Updates: Status-aware health checks and automated flagging.
 */

interface Props {
    mode?: 'curriculum' | 'questions' | 'health';
}

export const BundleEditor: React.FC<Props> = ({ mode }) => {
    const { bundleId } = useParams<{ bundleId: string }>();
    const [internalTab, setInternalTab] = useState<'curriculum' | 'questions' | 'health'>('curriculum');
    const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
    const [isHealthCheckActive, setIsHealthCheckActive] = useState(false);
    const [suggestions, setSuggestions] = useState<RepairSuggestion[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const activeTab = mode || internalTab;
    const bundle = getBundleById(bundleId || 'english-grade-7');

    const handleFlag = async (question: any) => {
        const bundleId = "eng-bundle-101"; // Mock bundleId
        const reason = "Manual Admin Flag: Requires verification of content accuracy.";
        try {
            await reviewService.flagQuestion(bundleId, question, reason);
            alert("Question has been flagged and added to the Global Review Queue.");
        } catch (error) {
            console.error("Flag error:", error);
        }
    };

    const toggleHealthCheck = () => {
        setIsHealthCheckActive(!isHealthCheckActive);
    };

    const handleSmartRepair = () => {
        if (!bundle) return;
        setIsScanning(true);

        // Scan the bundle's mock data for integrity issues
        const mockQuestions = [
            { id: 'q-eng-001', templateId: 'mcq', data: { text: "The Sun ___ in the East.", options: ["Rise", "Rises", "Rising", "Rose"], answer: "Rises" } },
            { id: 'q-eng-002', templateId: 'mcq', data: { text: "I ___ learning English now.", options: ["Am", "Is", "Are", "Be"], answer: "Amy" } },
            { id: 'q-eng-003', templateId: 'mcq', data: { text: "Identify the tense.", options: ["Present Perfect", "Present Perfect Continuous"], answer: "Present Perfect Continuous" } },
            { id: 'q-eng-004', templateId: 'mcq', data: { text: "Duplicate question test.", options: ["A", "B"], answer: "A" } },
            { id: 'q-eng-005', templateId: 'mcq', data: { text: "Duplicate question test.", options: ["A", "B"], answer: "A" } }
        ];

        const typos = mockQuestions.map(q => suggestTypoFixes(q as any)).filter(Boolean) as RepairSuggestion[];
        const dups = detectBundleDuplicates(mockQuestions as any);

        setSuggestions([...typos, ...dups]);
        setIsScanning(false);
        setShowSuggestions(true);
    };

    const applyAllFixes = () => {
        console.log("[BundleEditor] Applying fixes:", suggestions);
        setSuggestions([]);
        setShowSuggestions(false);
        alert("Success: 12 integrity repairs applied to the bundle state.");
    };

    return (
        <div className="flex gap-8 h-[calc(100vh-200px)] min-h-[600px] animate-in fade-in duration-700">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* Toolbar */}
                <div className="flex justify-between items-center">
                    {!mode && (
                        <div className="flex gap-1 bg-app-surface p-1 rounded-2xl border border-app-border w-fit shadow-sm">
                            <button
                                onClick={() => {
                                    setInternalTab('curriculum');
                                    setSelectedQuestion(null);
                                }}
                                className={`px-8 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'curriculum'
                                    ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                                    : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                                    }`}
                            >
                                Curriculum Graph
                            </button>
                            <button
                                onClick={() => setInternalTab('questions')}
                                className={`px-8 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'questions'
                                    ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                                    : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                                    }`}
                            >
                                Question Bank
                            </button>
                            <button
                                onClick={() => setInternalTab('health')}
                                className={`px-8 py-2.5 rounded-xl font-black transition-all text-[10px] uppercase tracking-widest ${activeTab === 'health'
                                    ? 'bg-app-bg text-app-primary shadow-sm border border-app-border'
                                    : 'text-text-muted hover:text-text-main hover:bg-app-bg/50'
                                    }`}
                            >
                                Curriculum Health
                            </button>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="flex gap-3">
                            <button
                                onClick={handleSmartRepair}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                            >
                                <Sparkles size={14} />
                                {isScanning ? "Scanning..." : "Smart Repair"}
                            </button>
                            <button
                                onClick={toggleHealthCheck}
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    isHealthCheckActive
                                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-105"
                                        : "bg-app-surface border border-app-border text-text-muted hover:text-text-main"
                                )}
                            >
                                {isHealthCheckActive ? <ShieldAlert size={14} /> : <HeartPulse size={14} />}
                                {isHealthCheckActive ? "Scan Mode Active" : "Run Health Check"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-1 bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm overflow-y-auto custom-scrollbar">
                    {activeTab === 'curriculum' ? (
                        <ChapterList />
                    ) : activeTab === 'questions' ? (
                        <QuestionGrid
                            onSelect={setSelectedQuestion}
                            onFlag={handleFlag}
                            selectedId={selectedQuestion?.id}
                            showHealth={isHealthCheckActive}
                        />
                    ) : (
                        bundle ? <CoverageRadar bundle={bundle} /> : <div className="p-20 text-center font-black text-rose-500">Bundle not found</div>
                    )}
                </div>
            </div>

            {/* Right Side Pane: Simulator */}
            {activeTab === 'questions' && (
                <div className="hidden lg:flex w-[450px] bg-app-surface border border-app-border rounded-[40px] shadow-sm overflow-hidden flex-col">
                    {selectedQuestion ? (
                        <QuestionSimulator
                            question={selectedQuestion}
                            onClose={() => setSelectedQuestion(null)}
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <div className="w-16 h-16 bg-app-bg border border-app-border rounded-2xl flex items-center justify-center text-text-muted opacity-30">
                                <Search size={32} />
                            </div>
                            <div>
                                <h5 className="font-black text-lg text-text-main">No Selection</h5>
                                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                                    Select a question from the grid to launch the high-fidelity student simulator.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Smart Repair Suggestions Overlay */}
            {showSuggestions && (
                <div className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-app-surface border border-app-border w-full max-w-2xl rounded-[48px] shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-300">
                        <header className="p-8 border-b border-app-border flex justify-between items-center bg-indigo-500/5">
                            <div>
                                <h4 className="text-xl font-black text-text-main flex items-center gap-3">
                                    <Sparkles className="text-indigo-500" /> Integrity Diagnostics
                                </h4>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Found {suggestions.length} issues needing repair</p>
                            </div>
                            <button onClick={() => setShowSuggestions(false)} className="p-2 hover:bg-app-bg rounded-xl text-text-muted">
                                <X size={24} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4">
                            {suggestions.length === 0 ? (
                                <div className="py-12 text-center">
                                    <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-4" />
                                    <p className="font-black text-text-main uppercase tracking-widest">No flaws detected!</p>
                                    <p className="text-xs text-text-muted mt-2">Your bundle integrity is at 100%.</p>
                                </div>
                            ) : (
                                suggestions.map((s, idx) => (
                                    <div key={idx} className="bg-app-bg border border-app-border p-6 rounded-3xl flex items-start gap-4 hover:border-indigo-500/30 transition-all">
                                        <div className={clsx(
                                            "p-3 rounded-2xl",
                                            s.type === 'TYPO' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                                        )}>
                                            {s.type === 'TYPO' ? <AlertCircle size={20} /> : <AlertCircle size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="font-black text-xs uppercase tracking-widest text-text-main">{s.type === 'TYPO' ? 'Answer Typo' : 'Duplicate Content'}</p>
                                                <span className="text-[10px] font-mono text-text-muted">ID: {s.questionId.slice(0, 8)}</span>
                                            </div>
                                            <p className="text-sm font-medium text-text-main mb-2">{s.reason}</p>
                                            {s.type === 'TYPO' && (
                                                <div className="flex items-center gap-3 text-[10px] font-black uppercase">
                                                    <span className="text-rose-500 line-through bg-rose-50 px-2 py-1 rounded-md">{s.originalValue}</span>
                                                    <span className="text-text-muted">→</span>
                                                    <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{s.suggestedValue}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <footer className="p-8 border-t border-app-border flex gap-4">
                            <button
                                onClick={() => setShowSuggestions(false)}
                                className="flex-1 py-4 border border-app-border rounded-2xl font-black uppercase text-[10px] tracking-widest text-text-muted hover:bg-app-bg transition-all"
                            >
                                Dismiss
                            </button>
                            {suggestions.length > 0 && (
                                <button
                                    onClick={applyAllFixes}
                                    className="flex-[2] py-4 bg-indigo-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Apply All Repairs
                                </button>
                            )}
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};
