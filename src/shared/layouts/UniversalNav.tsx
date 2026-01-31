import React from 'react';
import { useAuth } from '@core/auth/AuthContext';
import { useProgression } from '@core/engine/ProgressionContext';
import { Sword, Library, User, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * UNIVERSAL NAVIGATION
 * The high-level wrapper that manages the primary app sections.
 * * Handles the transition between Quest (Game) and Library (Study).
 * * Provides an entry point for Admin tools if the user is authorized.
 */

interface NavProps {
    activeSection: 'quest' | 'library' | 'profile';
    setSection: (section: 'quest' | 'library' | 'profile') => void;
    children: React.ReactNode;
}

export const UniversalNav: React.FC<NavProps> = ({ activeSection, setSection, children }) => {
    const { user, isAdmin } = useAuth();
    const { stats } = useProgression();

    return (
        <div className="min-h-screen bg-app-bg flex flex-col transition-colors duration-500">
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
                            <a
                                href="/admin"
                                className="p-3 text-app-primary hover:bg-app-primary/10 rounded-2xl transition-all group"
                                title="Open Admin Workbench"
                            >
                                <ShieldCheck size={22} className="group-hover:scale-110 transition-transform" />
                            </a>
                        )}

                        <div className="p-1 bg-app-surface border border-app-border rounded-full shadow-inner flex items-center">
                            <div className="w-9 h-9 rounded-full bg-app-bg border border-app-border overflow-hidden shadow-sm">
                                <img
                                    src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.uid}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pb-28 md:pb-0">
                <div className="max-w-6xl mx-auto w-full">
                    {children}
                </div>
            </main>

            {/* Bottom Navigation (Mobile-First) */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-app-surface/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[32px] shadow-2xl shadow-black/20 md:bottom-8">
                <div className="flex justify-around items-center">
                    <NavButton
                        active={activeSection === 'quest'}
                        onClick={() => setSection('quest')}
                        icon={<Sword size={22} />}
                        label="Quest"
                    />
                    <NavButton
                        active={activeSection === 'library'}
                        onClick={() => setSection('library')}
                        icon={<Library size={22} />}
                        label="Library"
                    />
                    <NavButton
                        active={activeSection === 'profile'}
                        onClick={() => setSection('profile')}
                        icon={<User size={22} />}
                        label="Profile"
                    />
                </div>
            </nav>
        </div>
    );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
    <button
        onClick={onClick}
        className={clsx(
            "flex flex-col items-center gap-1.5 px-6 py-3 rounded-[24px] transition-all duration-300 group",
            active
                ? "text-app-primary bg-app-primary/10 shadow-inner"
                : "text-text-muted hover:text-text-main hover:bg-app-bg"
        )}
    >
        <div className={clsx(
            "transition-transform",
            active ? "scale-110" : "group-hover:scale-110"
        )}>
            {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
);
