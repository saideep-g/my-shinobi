import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ClipboardList,
    ShieldAlert,
    LogOut,
    Search,
    Zap,
    Activity
} from 'lucide-react';
import { useAuth } from '@core/auth/AuthContext';
import { clsx } from 'clsx';

/**
 * ADMIN LAYOUT
 * A high-density, sidebar-oriented cockpit for administrators.
 * Optimized for Desktop/Laptop screens.
 */
export const AdminLayout: React.FC = () => {
    const { logout } = useAuth();

    const navItems = [
        { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/admin/curriculum', icon: <BookOpen size={20} />, label: 'Curriculum' },
        { to: '/admin/students', icon: <Users size={20} />, label: 'User Management' },
        { to: '/admin/logs', icon: <Activity size={20} />, label: 'Logs Explorer' },
        { to: '/admin/review', icon: <ClipboardList size={20} />, label: 'Review Queue' },
        { to: '/admin/health', icon: <ShieldAlert size={20} />, label: 'Curriculum Health' },
    ];

    return (
        <div className="flex h-screen bg-app-bg text-text-main overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-app-surface border-r border-app-border flex flex-col shadow-2xl z-50">
                <header className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Zap size={24} fill="currentColor" />
                        </div>
                        <h1 className="text-xl font-black tracking-tighter">SHINOBI <span className="text-indigo-600 italic">CORE</span></h1>
                    </div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-60">Admin Command Center</p>
                </header>

                <div className="px-6 mb-8">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-app-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Global Search..."
                            className="w-full bg-app-bg border border-app-border rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-app-primary/20 focus:border-app-primary transition-all shadow-inner"
                        />
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-4 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all group",
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

                <footer className="p-6 border-t border-app-border">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-rose-500 hover:bg-rose-50 transition-all"
                    >
                        <LogOut size={20} />
                        <span>Terminate Session</span>
                    </button>
                </footer>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none" />

                <header className="h-20 border-b border-app-border bg-app-surface/50 backdrop-blur-md flex items-center justify-between px-10 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">System Status: Optimal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="bg-app-primary text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-app-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Direct Sync Mode
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-app-bg/30">
                    <div className="max-w-7xl mx-auto p-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
