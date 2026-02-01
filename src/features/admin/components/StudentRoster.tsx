import React, { useState, useEffect } from 'react';
import { dbAdapter } from '@core/database/adapter';
import { StudentStats } from '@/types/progression';
import { User, Download, RotateCcw, ShieldAlert, GraduationCap, Flame, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { db } from '@core/database/firebase';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';

/**
 * STUDENT ROSTER
 * Simplified student view for the Analytics domain.
 * Includes data export and recovery tools (Danger Zone).
 */

interface UserStats extends StudentStats {
    id: string;
}

interface Props {
    onSelectStudent: (userId: string) => void;
    selectedUserId: string | null;
}

export const StudentRoster: React.FC<Props> = ({ onSelectStudent, selectedUserId }) => {
    const [students, setStudents] = useState<UserStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const roster = await dbAdapter.getAll<UserStats>('stats');
            setStudents(roster);
            setIsLoading(false);
            if (roster.length > 0 && !selectedUserId) {
                onSelectStudent(roster[0].id);
            }
        };
        load();
    }, []);

    const handleDownloadLogs = async (studentId: string) => {
        try {
            const sessionRef = collection(db, 'students', studentId, 'sessions');
            const snap = await getDocs(sessionRef);
            const logs = snap.docs.map(d => d.data());

            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `shinobi_logs_${studentId}_${new Date().toISOString().split('T')[0]}.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please check your cloud connection.");
        }
    };

    const handleResetMastery = async (studentId: string) => {
        const confirmed = window.confirm("🚨 DANGER ZONE: This will permanently RESET all Bayesian mastery probabilities for this student to 0%. This cannot be undone. Proceed?");
        if (!confirmed) return;

        try {
            const masteryRef = doc(db, 'students', studentId, 'intelligence', 'mastery');
            await updateDoc(masteryRef, { map: {} });
            alert("Mastery data purged. Student will restart from Diagnostic phase.");
        } catch (error) {
            console.error("Reset failed:", error);
        }
    };

    if (isLoading) return <div className="p-12 text-center animate-pulse font-black text-text-muted">Analyzing Roster...</div>;

    return (
        <div className="bg-app-surface border border-app-border rounded-[40px] shadow-sm overflow-hidden flex flex-col h-full">
            <header className="p-8 border-b border-app-border bg-app-bg/30">
                <h4 className="text-xl font-black text-text-main flex items-center gap-3">
                    <GraduationCap className="text-indigo-500" /> Administrative Roster
                </h4>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Select a shinobi for deep signal analysis</p>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
                {students.map(s => (
                    <div
                        key={s.id}
                        onClick={() => onSelectStudent(s.id)}
                        className={clsx(
                            "group p-5 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between",
                            selectedUserId === s.id
                                ? "border-app-primary bg-app-primary/5 shadow-lg shadow-app-primary/5"
                                : "border-app-border bg-app-bg hover:border-app-primary/30"
                        )}
                    >
                        <div className="flex items-center gap-5">
                            <div className={clsx(
                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6",
                                selectedUserId === s.id ? "bg-app-primary text-white" : "bg-app-surface text-text-muted border border-app-border"
                            )}>
                                <User size={28} />
                            </div>
                            <div>
                                <h5 className="font-black text-text-main group-hover:text-app-primary transition-colors">{s.displayName || "Unknown Shinobi"}</h5>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-text-muted opacity-60">
                                        <GraduationCap size={12} /> Grade {s.grade}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-indigo-500">
                                        <Flame size={12} className="animate-pulse" /> {s.streakCount || 0} Day Streak
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ChevronRight className={clsx("transition-transform", selectedUserId === s.id ? "text-app-primary translate-x-2" : "text-text-muted")} size={20} />
                    </div>
                ))}
            </div>

            <footer className="p-8 bg-rose-50/50 border-t border-rose-100 space-y-4">
                <div className="flex items-center gap-3 text-rose-500 mb-2">
                    <ShieldAlert size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Administrative Actions</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={() => selectedUserId && handleDownloadLogs(selectedUserId)}
                        className="w-full py-4 bg-app-surface border border-app-border rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-white hover:border-app-primary/30 transition-all shadow-sm"
                    >
                        <Download size={16} className="text-app-primary" /> Download Export (.JSON)
                    </button>
                    <button
                        onClick={() => selectedUserId && handleResetMastery(selectedUserId)}
                        className="w-full py-4 bg-rose-500 text-white rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-rose-500/20"
                    >
                        <RotateCcw size={16} /> Reset Student Mastery
                    </button>
                </div>
            </footer>
        </div>
    );
};
