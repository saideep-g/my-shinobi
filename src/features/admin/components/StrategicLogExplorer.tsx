import React, { useState } from 'react';
import { QuestionLog } from '@/types/assessment';
import { Clock, CheckCircle2, XCircle, Search, Info } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * STRATEGIC LOG EXPLORER
 * A high-density data table for reviewing individual student interactions.
 * Visualizes the AI's selection rationale and student accuracy.
 */

interface Props {
    logs: QuestionLog[];
}

export const StrategicLogExplorer: React.FC<Props> = ({ logs }) => {
    const [selectedLog, setSelectedLog] = useState<QuestionLog | null>(null);

    const formatTimestamp = (ts: number) => {
        return new Date(ts).toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-app-surface border border-app-border rounded-[40px] shadow-sm overflow-hidden flex flex-col h-[600px]">
            <header className="p-8 border-b border-app-border flex justify-between items-center bg-app-bg/30">
                <div>
                    <h4 className="text-xl font-black text-text-main flex items-center gap-3">
                        <Clock className="text-indigo-500" /> Strategic Stream
                    </h4>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Direct view of Bayesian decision logs</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search atoms..."
                        className="bg-app-bg border border-app-border rounded-2xl py-2 pl-12 pr-6 text-xs font-bold outline-none focus:ring-2 focus:ring-app-primary/20 transition-all"
                    />
                </div>
            </header>

            <div className="flex-1 overflow-hidden flex">
                {/* Table Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-app-surface z-10 border-b border-app-border">
                            <tr>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Timestamp</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Atom / Subject</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted text-center">Result</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Speed</th>
                                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">Selection Rationale</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-app-border">
                            {logs.map((log, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => setSelectedLog(log)}
                                    className={clsx(
                                        "hover:bg-app-bg transition-colors cursor-pointer group",
                                        selectedLog === log && "bg-app-primary/5"
                                    )}
                                >
                                    <td className="px-8 py-4">
                                        <p className="text-xs font-bold text-text-main">{formatTimestamp(log.timestamp)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-black text-text-main group-hover:text-app-primary transition-colors">{log.atomId}</p>
                                        <p className="text-[9px] font-bold text-text-muted opacity-60">Mastery: {(log.masteryBefore * 100).toFixed(0)}% → {(log.masteryAfter * 100).toFixed(0)}%</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            {log.isCorrect ? (
                                                <CheckCircle2 size={20} className="text-emerald-500" />
                                            ) : (
                                                <XCircle size={20} className="text-rose-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={clsx(
                                                "text-xs font-black",
                                                (log.duration || 0) < 5 ? "text-emerald-500" : (log.duration || 0) > 15 ? "text-amber-500" : "text-text-main"
                                            )}>
                                                {log.duration || 0}s
                                            </span>
                                            {log.isValidForSpeed === false && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" title="Outlier filtered" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-[10px] font-medium text-text-muted italic leading-tight line-clamp-2">
                                            {log.selectionRationale || "System Default Practice"}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detail View Side Panel */}
                <div className={clsx(
                    "w-96 border-l border-app-border bg-app-bg/20 transition-all duration-300 overflow-y-auto custom-scrollbar p-8",
                    !selectedLog && "opacity-0 w-0 p-0 overflow-hidden"
                )}>
                    {selectedLog && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <header className="flex justify-between items-start">
                                <div>
                                    <h5 className="font-black text-lg text-text-main">Log Details</h5>
                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Ref: {selectedLog.questionId}</p>
                                </div>
                                <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-app-bg rounded-xl">
                                    <Info size={20} className="text-text-muted" />
                                </button>
                            </header>

                            <div className="space-y-6">
                                <section>
                                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-2">Question Context</label>
                                    <div className="bg-app-surface border border-app-border p-5 rounded-2xl">
                                        <p className="text-sm font-medium text-text-main leading-relaxed">
                                            {(selectedLog as any).metadata?.questionText || "Question text unavailable in this log slice."}
                                        </p>
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
                                        <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Correct Answer</p>
                                        <p className="text-xs font-black text-emerald-700">{(selectedLog as any).metadata?.correctAnswer || "---"}</p>
                                    </div>
                                    <div className={clsx(
                                        "p-4 rounded-2xl border",
                                        selectedLog.isCorrect ? "bg-emerald-50/50 border-emerald-100" : "bg-rose-50/50 border-rose-100"
                                    )}>
                                        <p className={clsx(
                                            "text-[8px] font-black uppercase tracking-widest mb-1",
                                            selectedLog.isCorrect ? "text-emerald-600" : "text-rose-600"
                                        )}>Student Answer</p>
                                        <p className={clsx(
                                            "text-xs font-black",
                                            selectedLog.isCorrect ? "text-emerald-700" : "text-rose-700"
                                        )}>{(selectedLog as any).metadata?.studentAnswer || "---"}</p>
                                    </div>
                                </div>

                                <section>
                                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-2">Bayesian Shift</label>
                                    <div className="h-2 w-full bg-app-border rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-slate-300"
                                            style={{ width: `${selectedLog.masteryBefore * 100}%` }}
                                        />
                                        <div
                                            className={clsx(
                                                "h-full",
                                                selectedLog.masteryAfter > selectedLog.masteryBefore ? "bg-emerald-500" : "bg-rose-500"
                                            )}
                                            style={{ width: `${Math.abs(selectedLog.masteryAfter - selectedLog.masteryBefore) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-[9px] font-black text-text-muted">
                                        <span>BEFORE: {(selectedLog.masteryBefore * 100).toFixed(1)}%</span>
                                        <span className={clsx(selectedLog.masteryAfter > selectedLog.masteryBefore ? "text-emerald-500" : "text-rose-500")}>
                                            AFTER: {(selectedLog.masteryAfter * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
