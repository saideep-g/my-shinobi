import React from 'react';
import { Home, Trophy, User, MessageCircle, Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@core/theme/ThemeContext';

/**
 * QUEST LAYOUT SHELL
 * Provides a mobile-first experience with a persistent bottom navigation.
 * * Maintains the "Quest" feel from Blue Ninja while allowing nested 
 * content to render in the 'main' area.
 */

export const QuestLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="flex flex-col min-h-screen bg-app-bg text-text-main font-sans selection:bg-app-primary/30">
            {/* Dynamic Header */}
            <header className="sticky top-0 z-30 bg-app-surface/80 backdrop-blur-md border-b border-app-border p-4">
                <div className="flex justify-between items-center max-w-lg mx-auto">
                    <h1 className="text-xl font-black tracking-tight text-app-primary">SHINOBI QUEST</h1>
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={toggleTheme}
                            className="p-1.5 hover:bg-app-bg rounded-lg transition-colors text-text-muted"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <div className="bg-app-accent/10 px-3 py-1 rounded-full text-xs font-bold text-app-accent border border-app-accent/20">
                            Lvl 12
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pb-24 overflow-x-hidden">
                <div className="max-w-lg mx-auto">
                    {children}
                </div>
            </main>

            {/* Persistent Bottom Nav (Enhanced from Blue Ninja) */}
            <nav className="fixed bottom-6 left-4 right-4 z-40 bg-app-surface border border-app-border shadow-2xl rounded-2xl p-2 backdrop-blur-lg">
                <ul className="flex justify-around items-center">
                    <NavItem to="/dashboard" icon={<Home size={22} />} label="Home" />
                    <NavItem to="/awards" icon={<Trophy size={22} />} label="Awards" />
                    <NavItem to="/voice" icon={<MessageCircle size={22} />} label="Help" />
                    <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
                </ul>
            </nav>
        </div>
    );
};

const NavItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <li>
        <NavLink
            to={to}
            className={({ isActive }) => `
        flex flex-col items-center p-2 rounded-xl transition-all duration-300
        ${isActive ? 'bg-app-primary text-white shadow-lg scale-110' : 'text-text-muted hover:bg-app-bg'}
      `}
        >
            {icon}
            <span className="text-[10px] font-bold uppercase mt-1 tracking-tighter">{label}</span>
        </NavLink>
    </li>
);
