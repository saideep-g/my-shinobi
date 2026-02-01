import { useLocation, NavLink, Outlet, useParams } from 'react-router-dom';
import { Database, FileJson, Plus, Users, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * CONTENT WORKBENCH
 * The primary interface for subject and bundle management.
 * * Allows the Admin to switch between different grades/subjects.
 * * Orchestrates the "Preview -> Edit -> Publish" workflow.
 */

export const ContentWorkbench: React.FC = () => {
    const { bundleId } = useParams<{ bundleId: string }>();
    const location = useLocation();

    // Determine active tab based on path
    const isStudents = location.pathname.includes('/admin/students');
    const isQuestions = location.pathname.includes('/admin/questions');
    const isCurriculum = location.pathname.includes('/admin/curriculum');

    // Base path for bundle selection
    const selectionBasePath = isQuestions ? '/admin/questions' : '/admin/curriculum';

    return (
        <div className="flex h-screen bg-app-bg text-text-main overflow-hidden font-sans">
            {/* Admin Sidebar */}
            <aside className="w-72 border-r border-app-border bg-app-surface p-6 flex flex-col gap-8 shadow-2xl z-10">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-app-primary to-app-secondary rounded-xl flex items-center justify-center text-white shadow-lg shadow-app-primary/20">
                        <Database size={20} />
                    </div>
                    <div>
                        <h1 className="font-black tracking-tighter text-xl leading-none">SHINOBI</h1>
                        <p className="text-[10px] font-bold text-app-primary tracking-widest uppercase">Content Core</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-3 mb-4">Core Controls</p>

                    <NavLink
                        to="/admin/curriculum"
                        className={({ isActive }) => clsx(
                            "w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3",
                            isActive && isCurriculum
                                ? "bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm"
                                : "hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent"
                        )}
                    >
                        <FileJson size={20} />
                        <span className="font-bold">Curriculum</span>
                    </NavLink>

                    <NavLink
                        to="/admin/questions"
                        className={({ isActive }) => clsx(
                            "w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3",
                            isActive && isQuestions
                                ? "bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm"
                                : "hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent"
                        )}
                    >
                        <HelpCircle size={20} />
                        <span className="font-bold">Question Bank</span>
                    </NavLink>

                    <NavLink
                        to="/admin/students"
                        className={({ isActive }) => clsx(
                            "w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3",
                            isActive
                                ? "bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm"
                                : "hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent"
                        )}
                    >
                        <Users size={20} />
                        <span className="font-bold">Student Management</span>
                    </NavLink>

                    <div className="pt-8 pb-4">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-3 mb-4">Master Curriculum</p>
                    </div>

                    <NavLink
                        to={`${selectionBasePath}/english-grade-7`}
                        className={({ isActive }) => clsx(
                            "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                            isActive
                                ? "bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm"
                                : "hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent",
                            isStudents && "opacity-50 pointer-events-none"
                        )}
                    >
                        <span className="font-bold">English Grade 7</span>
                        {bundleId === 'english-grade-7' && <div className="w-1.5 h-1.5 rounded-full bg-app-primary animate-pulse" />}
                    </NavLink>

                    <NavLink
                        to={`${selectionBasePath}/math-grade-7`}
                        className={({ isActive }) => clsx(
                            "w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group",
                            isActive
                                ? "bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm"
                                : "hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent",
                            isStudents && "opacity-50 pointer-events-none"
                        )}
                    >
                        <span className="font-bold">Math Grade 7</span>
                        {bundleId === 'math-grade-7' && <div className="w-1.5 h-1.5 rounded-full bg-app-primary animate-pulse" />}
                    </NavLink>

                    <button className="w-full flex items-center justify-center gap-2 p-4 text-app-primary font-black text-xs uppercase tracking-widest hover:bg-app-primary/5 rounded-2xl border-2 border-dashed border-app-primary/20 mt-6 transition-all hover:border-app-primary/40">
                        <Plus size={16} /> New Subject
                    </button>
                </nav>

                <div className="p-5 bg-app-bg rounded-[2rem] border border-app-border">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Cloud Status: Online</p>
                    </div>
                    <p className="text-[9px] font-bold text-text-muted uppercase mb-1">Last Deployment</p>
                    <p className="text-xs font-mono font-bold text-text-main">2026-01-31 16:15</p>
                </div>
            </aside>

            {/* Main Workbench Area */}
            <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <Outlet />
            </main>
        </div>
    );
};
