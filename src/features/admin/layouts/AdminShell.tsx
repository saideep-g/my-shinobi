import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ClipboardCheck,
    Activity,
    Home,
    Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { SyncGuard } from '../components/SyncGuard';
import { GlobalAdminSearch } from '../components/GlobalAdminSearch';

/**
 * ADMIN SHELL
 * A laptop-optimized, sidebar-first layout for administrative operations.
 * Replaces mobile-first top navigation with a persistent 240px sidebar.
 */
export const AdminShell: React.FC = () => {
    const navigate = useNavigate();

    const navItems = [
        { to: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { to: '/admin/students', icon: <Users size={18} />, label: 'User Management' },
        { to: '/admin/curriculum', icon: <BookOpen size={18} />, label: 'Curriculum Workbench' },
        { to: '/admin/review', icon: <ClipboardCheck size={18} />, label: 'Review Queue' },
        { to: '/admin/health', icon: <Activity size={18} />, label: 'Health Radar' },
    ];

    return (
        <div className="flex bg-app-bg min-h-screen text-text-main font-sans overflow-hidden">
            {/* 1. Global Utilities */}
            <SyncGuard />
            <GlobalAdminSearch />

            {/* 2. Admin Sidebar (240px) */}
            <aside className="w-[240px] bg-app-surface border-r border-app-border flex flex-col fixed inset-y-0 left-0 z-40">
                <header className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-app-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-app-primary/20">
                            <Zap size={18} fill="currentColor" />
                        </div>
                        <h1 className="text-lg font-black tracking-tighter uppercase italic">
                            Shinobi <span className="text-app-primary">Pro</span>
                        </h1>
                    </div>
                </header>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-4 px-5 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all group",
                                isActive
                                    ? "bg-app-primary/10 text-app-primary shadow-inner"
                                    : "text-text-muted hover:bg-app-bg hover:text-text-main"
                            )}
                        >
                            <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <footer className="p-6 mt-auto">
                    <button
                        onClick={() => navigate('/power')}
                        className="flex items-center gap-4 w-full px-5 py-4 bg-app-bg border border-app-border rounded-2xl font-black uppercase tracking-widest text-[9px] text-text-muted hover:text-app-primary hover:border-app-primary/30 transition-all group"
                    >
                        <Home size={18} className="transition-transform group-hover:-translate-y-0.5" />
                        <span>Return to Hero</span>
                    </button>
                </footer>
            </aside>

            {/* 3. Main Content Wrapper (shifted by 240px) */}
            <main className="flex-1 ml-[240px] min-w-0">
                {/* Secondary Background Pattern */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.03] select-none z-0">
                    <div className="absolute inset-0 bg-grid-slate-900/[0.1] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
                </div>

                <div className="relative z-10 p-10 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
