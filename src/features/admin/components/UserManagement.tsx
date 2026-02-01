import React, { useEffect, useState } from 'react';
import { useProgression } from '@core/engine/ProgressionContext';
import { dbAdapter } from '@core/database/adapter';
import { StudentStats } from '@/types/progression';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { BookOpen, GraduationCap, CheckCircle2, Circle, Users, User as UserIcon, ShieldCheck, Smartphone, Map } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * USER MANAGEMENT (Admin Tool)
 * Allows the manager to override school grade and assign specific curriculum chapters.
 * Now supports selecting which student to manage.
 */
interface UserStats extends StudentStats {
    id: string;
}

export const UserManagement: React.FC = () => {
    const { stats: currentAdminStats, updateProfileDetails } = useProgression();
    const [allUsers, setAllUsers] = useState<UserStats[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Current context stats don't always have ID visible in the same way, but we know uid from auth
    const adminId = (currentAdminStats as any).id || '';

    // Load all local users on mount
    useEffect(() => {
        const loadUsers = async () => {
            const users = await dbAdapter.getAll<UserStats>('stats');
            setAllUsers(users);
            if (users.length > 0) {
                // Default to current admin or first user
                setSelectedUserId(adminId || users[0].id);
            }
            setIsLoading(false);
        };
        loadUsers();
    }, [adminId]);

    const selectedUser = allUsers.find(u => u.id === selectedUserId);

    const handleToggleChapter = async (chapterId: string) => {
        if (!selectedUser) return;

        const current = selectedUser.assignedChapterIds || [];
        const next = current.includes(chapterId)
            ? current.filter(id => id !== chapterId)
            : [...current, chapterId];

        const updatedUser = { ...selectedUser, assignedChapterIds: next };

        // Save to DB
        await dbAdapter.put('stats', updatedUser);

        // Update local state
        setAllUsers(prev => prev.map(u => u.id === selectedUserId ? updatedUser : u));

        // If managing self, also update current context
        if (selectedUserId === adminId) {
            await updateProfileDetails({ assignedChapterIds: next });
        }
    };

    const handleSetGrade = async (grade: number) => {
        if (!selectedUser) return;

        const updatedUser = { ...selectedUser, grade };

        // Save to DB
        await dbAdapter.put('stats', updatedUser);

        // Update local state
        setAllUsers(prev => prev.map(u => u.id === selectedUserId ? updatedUser : u));

        // If managing self, also update current context
        if (selectedUserId === adminId) {
            await updateProfileDetails({ grade });
        }
    };

    const handleSetLayout = async (layout: 'quest' | 'era') => {
        if (!selectedUser) return;

        const updatedUser = { ...selectedUser, preferredLayout: layout };

        // Save to DB
        await dbAdapter.put('stats', updatedUser);

        // Update local state
        setAllUsers(prev => prev.map(u => u.id === selectedUserId ? updatedUser : u));

        // If managing self, also update current context
        if (selectedUserId === adminId) {
            await updateProfileDetails({ preferredLayout: layout });
        }
    };

    if (isLoading) {
        return <div className="p-10 text-center animate-pulse font-black text-text-muted">Loading Shinobi Scrolls...</div>;
    }

    return (
        <div className="space-y-10 p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. User Selection Header */}
            <section className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h4 className="text-lg font-black flex items-center gap-3">
                            <Users className="text-indigo-500" /> Roster Management
                        </h4>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Select a student to modify their learning path</p>
                    </div>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {allUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUserId(user.id)}
                            className={clsx(
                                "p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center group",
                                selectedUserId === user.id
                                    ? "border-app-primary bg-app-primary/5 shadow-lg shadow-app-primary/10"
                                    : "border-app-border bg-app-bg hover:border-app-primary/30"
                            )}
                        >
                            <div className={clsx(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                selectedUserId === user.id ? "bg-app-primary text-white" : "bg-app-surface text-text-muted"
                            )}>
                                <UserIcon size={24} />
                            </div>
                            <div>
                                <p className="font-black text-xs text-text-main truncate w-24">
                                    {user.displayName || "Young Shinobi"}
                                </p>
                                <p className="text-[8px] font-black text-text-muted uppercase tracking-wider mt-0.5">
                                    Lvl {user.heroLevel}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {selectedUser && (
                <div className="space-y-10 animate-in fade-in duration-500">
                    {/* 2. Selected User Badge */}
                    <div className="px-4 py-3 bg-app-primary/10 border border-app-primary/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-app-primary" size={18} />
                            <p className="text-xs font-black text-app-primary uppercase tracking-widest">
                                Managing: <span className="underline">{selectedUser.displayName}</span>
                            </p>
                        </div>
                        <span className="text-[9px] font-black text-text-muted">UID: {selectedUser.id.slice(0, 8)}...</span>
                    </div>

                    {/* 3. Grade Selection */}
                    <section className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                        <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                            <GraduationCap className="text-app-primary" /> Set Student Grade
                        </h4>
                        <div className="flex gap-4">
                            {[2, 7].map(g => (
                                <button
                                    key={g}
                                    onClick={() => handleSetGrade(g)}
                                    className={`px-8 py-3 rounded-2xl font-black transition-all active:scale-95 ${selectedUser.grade === g ? 'bg-app-primary text-white shadow-lg' : 'bg-app-bg text-text-muted border border-app-border'
                                        }`}
                                >
                                    Grade {g}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 4. Layout Preference */}
                    <section className="bg-app-surface border border-app-border rounded-[40px] p-8 shadow-sm">
                        <h4 className="text-lg font-black mb-6 flex items-center gap-3">
                            <Smartphone className="text-app-primary" /> Training Layout
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSetLayout('quest')}
                                className={clsx(
                                    "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center",
                                    selectedUser.preferredLayout === 'quest'
                                        ? "border-app-primary bg-app-primary/5 shadow-lg"
                                        : "border-app-border bg-app-bg text-text-muted hover:border-app-primary/30"
                                )}
                            >
                                <Smartphone size={32} className={selectedUser.preferredLayout === 'quest' ? "text-app-primary" : "text-text-muted"} />
                                <div>
                                    <p className="font-black text-xs text-text-main">Mobile Question</p>
                                    <p className="text-[8px] font-black uppercase tracking-wider opacity-60">Vertical Training Card</p>
                                </div>
                            </button>
                            <button
                                onClick={() => handleSetLayout('era')}
                                className={clsx(
                                    "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 text-center",
                                    selectedUser.preferredLayout === 'era'
                                        ? "border-app-primary bg-app-primary/5 shadow-lg"
                                        : "border-app-border bg-app-bg text-text-muted hover:border-app-primary/30"
                                )}
                            >
                                <Map size={32} className={selectedUser.preferredLayout === 'era' ? "text-app-primary" : "text-text-muted"} />
                                <div>
                                    <p className="font-black text-xs text-text-main">Student Era</p>
                                    <p className="text-[8px] font-black uppercase tracking-wider opacity-60">Historical Journey</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    {/* 4. Chapter Assignment Grid */}
                    <section className="space-y-6">
                        <h4 className="text-lg font-black flex items-center gap-3 px-2">
                            <BookOpen className="text-app-accent" /> School Sync: Assign Chapters
                        </h4>

                        {getAllBundles().filter(bundle => bundle.grade === selectedUser.grade).map(bundle => (
                            <div key={bundle.id} className="bg-app-surface border border-app-border rounded-[40px] overflow-hidden shadow-sm">
                                <header className="bg-app-bg/50 p-6 border-b border-app-border">
                                    <p className="font-black text-app-primary uppercase tracking-widest text-[10px]">{bundle.subjectId}</p>
                                    <h5 className="font-black text-xl">{bundle.curriculum.name}</h5>
                                </header>
                                <div className="p-6 grid gap-3">
                                    {bundle.curriculum.chapters.map(chapter => {
                                        const isAssigned = selectedUser.assignedChapterIds?.includes(chapter.id);
                                        return (
                                            <button
                                                key={chapter.id}
                                                onClick={() => handleToggleChapter(chapter.id)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] ${isAssigned ? 'border-app-primary bg-app-primary/5 shadow-sm' : 'border-app-border opacity-60'
                                                    }`}
                                            >
                                                <div className="text-left">
                                                    <p className="font-bold text-sm text-text-main">{chapter.title}</p>
                                                    <p className="text-[10px] uppercase font-black opacity-40">{chapter.atoms.length} Atoms</p>
                                                </div>
                                                {isAssigned ? <CheckCircle2 className="text-app-primary" size={20} /> : <Circle className="text-text-muted" size={20} />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </div>
    );
};
