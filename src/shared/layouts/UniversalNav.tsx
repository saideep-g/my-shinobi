import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@core/auth/AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Sword, Library, User, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { AVATARS } from '@features/progression/data/avatars';

/**
 * UNIVERSAL NAVIGATION (Router Version)
 * The high-level wrapper that manages the primary app sections.
 * * Uses React Router's Outlet to render nested content.
 * * Implements active-link highlighting using NavLink.
 */

export const UniversalNav: React.FC = () => {
    const { isAdmin } = useAuth();
    const { stats } = useProgression();

    const currentAvatar = AVATARS.find(a => a.id === stats.avatarId) || AVATARS[0];

    return (
        <div className="h-screen bg-app-bg flex flex-col transition-colors duration-500 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Top Bar: Progress & Identity */}
            <header className="sticky top-0 z-40 bg-app-bg/80 backdrop-blur-md border-b border-app-border p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center text-text-main">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-app-primary rounded-[18px] flex items-center justify-center text-white font-black shadow-lg shadow-app-primary/30 transform -rotate-3 hover:rotate-0 transition-transform cursor-default">
                            {stats.heroLevel}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-0.5">Shinobi Hero</p>
                            <div className="flex items-center gap-2">
                                <p className="text-base font-black leading-none">Level {stats.heroLevel}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isAdmin && (
                            <NavLink
                                to="/admin"
                                className="p-3 text-app-primary hover:bg-app-primary/10 rounded-2xl transition-all group"
                                title="Open Admin Workbench"
                            >
                                <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
                            </NavLink>
                        )}

                        <NavLink
                            to="/profile"
                            className="p-1 bg-app-surface border border-app-border rounded-full shadow-inner flex items-center hover:scale-105 transition-transform active:scale-95"
                        >
                            <div className="w-9 h-9 rounded-full bg-app-bg border border-app-border overflow-hidden shadow-sm">
                                <img
                                    src={currentAvatar.url}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </NavLink>
                    </div>
                </div>
            </header>

            {/* Main Content Area: Routed via Outlet */}
            <main className="flex-1 pb-28 md:pb-0">
                <div className="max-w-6xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation (Mobile-First) */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-app-surface/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[32px] shadow-2xl shadow-black/20 md:bottom-8">
                <div className="flex justify-around items-center">
                    <NavItem to="/quest" icon={<Sword size={22} />} label="Quest" />
                    <NavItem to="/library" icon={<Library size={22} />} label="Library" />
                    <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
                </div>
            </nav>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => clsx(
            "flex flex-col items-center gap-1.5 px-6 py-3 rounded-[24px] transition-all duration-300 group",
            isActive
                ? "text-app-primary bg-app-primary/10 shadow-inner scale-105"
                : "text-text-muted hover:text-text-main hover:bg-app-bg"
        )}
    >
        <div className="transition-transform group-hover:scale-110">
            {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </NavLink>
);
