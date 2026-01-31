import React from 'react';
import { BookOpen, Activity, Settings, LayoutGrid, Sun, Moon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@core/theme/ThemeContext';

/**
 * ERA LAYOUT SHELL
 * A desktop-optimized shell featuring a sidebar and broad header.
 * * Ideal for detailed curriculum browsing and complex analytics views.
 */

export const EraLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div className="flex min-h-screen bg-app-bg text-text-main">
            {/* Sidebar */}
            <aside className="w-64 bg-app-surface border-r border-app-border hidden lg:flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="text-2xl font-black text-app-primary tracking-tighter">STUDY ERA</div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem to="/dashboard" icon={<LayoutGrid size={20} />} label="Learning Path" />
                    <SidebarItem to="/curriculum" icon={<BookOpen size={20} />} label="Curriculum" />
                    <SidebarItem to="/analytics" icon={<Activity size={20} />} label="Insights" />
                    <SidebarItem to="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-app-surface border-b border-app-border flex items-center px-8 justify-between sticky top-0 z-20">
                    <div className="text-sm font-bold text-text-muted">Welcome back, Shinobi</div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-app-bg rounded-lg transition-colors text-text-muted"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <div className="h-8 w-8 rounded-full bg-app-primary flex items-center justify-center text-white font-bold text-xs shadow-md">SD</div>
                    </div>
                </header>

                <main className="p-8 flex-1 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all
      ${isActive ? 'bg-app-primary/10 text-app-primary' : 'text-text-muted hover:bg-app-bg hover:text-text-main'}
    `}
    >
        {icon} <span>{label}</span>
    </NavLink>
);
