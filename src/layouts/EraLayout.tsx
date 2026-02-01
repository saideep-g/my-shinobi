import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BookOpen, Activity, LayoutGrid, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@core/theme/ThemeContext';

/**
 * ERA LAYOUT SHELL
 * A desktop-optimized shell featuring a sidebar and broad header.
 * * Ideal for detailed curriculum browsing and complex analytics views.
 */

export const EraLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();

    const getTitle = () => {
        if (location.pathname.startsWith('/quest')) return 'Quest Scroll';
        if (location.pathname.startsWith('/syllabus')) return 'Syllabus';
        if (location.pathname.startsWith('/profile')) return 'Hero Identity';
        return 'Training Room';
    };

    return (
        <div className="flex min-h-screen bg-app-bg text-text-main transition-colors duration-500">
            {/* 1. Sidebar - Visible from Tablet (md) upwards */}
            <aside className="w-60 bg-app-surface border-r border-app-border hidden md:flex flex-col sticky top-0 h-screen shadow-2xl shadow-black/5 z-50">
                <Link to="/" className="p-8 pb-12 hover:opacity-80 transition-opacity">
                    <div className="text-xl font-black text-app-primary tracking-tighter leading-none italic">
                        STUDY<br />ERA
                    </div>
                </Link>

                <nav className="flex-1 px-4 space-y-3">
                    <SidebarItem to="/quest" icon={<BookOpen size={22} />} label="Quest Scroll" />
                    <SidebarItem to="/syllabus" icon={<LayoutGrid size={22} />} label="Syllabus" />
                    <SidebarItem to="/profile" icon={<Activity size={22} />} label="Hero Stats" />
                </nav>

                <div className="p-6 border-t border-app-border bg-app-bg/30">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-app-surface transition-all text-text-muted hover:text-text-main font-bold"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* 2. Mobile / Small Tablet Overlay Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-300">
                    <div className="w-72 h-full bg-app-surface shadow-2xl animate-in slide-in-from-left duration-500 flex flex-col">
                        <div className="p-8 flex justify-between items-center">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-app-primary italic">STUDY ERA</Link>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-text-muted"><X /></button>
                        </div>
                        <nav className="flex-1 px-4 space-y-4 pt-4">
                            <SidebarItem to="/quest" icon={<BookOpen size={24} />} label="Quest Scroll" onClick={() => setIsMobileMenuOpen(false)} />
                            <SidebarItem to="/syllabus" icon={<LayoutGrid size={24} />} label="Syllabus" onClick={() => setIsMobileMenuOpen(false)} />
                            <SidebarItem to="/profile" icon={<Activity size={24} />} label="Hero Stats" onClick={() => setIsMobileMenuOpen(false)} />
                        </nav>
                    </div>
                </div>
            )}

            {/* 3. Main Body */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-app-surface/80 backdrop-blur-xl border-b border-app-border flex items-center px-6 md:px-10 justify-between sticky top-0 z-40 transition-all">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-3 bg-app-bg border border-app-border rounded-2xl text-text-muted hover:text-app-primary transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Current Focus</p>
                            <h2 className="text-lg font-black text-text-main">{getTitle()}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end mr-2">
                            <div className="text-xs font-black text-text-main uppercase tracking-tight">Young Shinobi</div>
                            <div className="text-[9px] font-bold text-app-primary uppercase tracking-widest">Active Training</div>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-app-primary/10 border border-app-primary/20 flex items-center justify-center text-app-primary font-black text-sm shadow-inner group-hover:scale-105 transition-all">
                            AD
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-10 lg:p-12 flex-1 overflow-auto bg-app-bg/50">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

const SidebarItem = ({ to, icon, label, onClick }: { to: string, icon: React.ReactNode, label: string, onClick?: () => void }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) => `
      flex items-center gap-4 px-5 py-4 rounded-[20px] font-black uppercase tracking-widest text-[10px] transition-all
      ${isActive ? 'bg-app-primary/10 text-app-primary shadow-inner' : 'text-text-muted hover:bg-app-bg hover:text-text-main'}
    `}
    >
        {icon} <span>{label}</span>
    </NavLink>
);
