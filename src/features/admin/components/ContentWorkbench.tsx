import React, { useState } from 'react';
import { BundleEditor } from './BundleEditor';
import { UserManagement } from './UserManagement';
import { Database, FileJson, UploadCloud, Plus, Users } from 'lucide-react';

/**
 * CONTENT WORKBENCH
 * The primary interface for subject and bundle management.
 * * Allows the Admin to switch between different grades/subjects.
 * * Orchestrates the "Preview -> Edit -> Publish" workflow.
 */

export const ContentWorkbench: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'content' | 'users'>('content');
    const [activeBundle, setActiveBundle] = useState<string>('English Grade 7');

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

                    <button
                        onClick={() => setActiveTab('content')}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 ${activeTab === 'content'
                            ? 'bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm'
                            : 'hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent'
                            }`}
                    >
                        <FileJson size={20} />
                        <span className="font-bold">Syllabus Editor</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 ${activeTab === 'users'
                            ? 'bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm'
                            : 'hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent'
                            }`}
                    >
                        <Users size={20} />
                        <span className="font-bold">System Guards</span>
                    </button>

                    <div className="pt-8 pb-4">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] px-3 mb-4">Master Curriculum</p>
                    </div>

                    <button
                        disabled={activeTab !== 'content'}
                        onClick={() => setActiveBundle('English Grade 7')}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${activeBundle === 'English Grade 7'
                            ? 'bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm'
                            : 'hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent'
                            }`}
                    >
                        <span className="font-bold">English Grade 7</span>
                        {activeBundle === 'English Grade 7' && <div className="w-1.5 h-1.5 rounded-full bg-app-primary animate-pulse" />}
                    </button>

                    <button
                        onClick={() => setActiveBundle('Math Grade 7')}
                        className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group ${activeBundle === 'Math Grade 7'
                            ? 'bg-app-primary/10 text-app-primary border border-app-primary/20 shadow-sm'
                            : 'hover:bg-app-bg text-text-muted hover:text-text-main border border-transparent'
                            }`}
                    >
                        <span className="font-bold">Math Grade 7</span>
                        {activeBundle === 'Math Grade 7' && <div className="w-1.5 h-1.5 rounded-full bg-app-primary animate-pulse" />}
                    </button>

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
                {activeTab === 'content' ? (
                    <>
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-app-primary/10 text-app-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-app-primary/20">
                                        Active Bundle
                                    </span>
                                    <span className="text-[10px] font-bold text-text-muted">v1.0.1 • Production</span>
                                </div>
                                <h2 className="text-4xl font-black tracking-tight text-text-main">{activeBundle}</h2>
                                <p className="text-text-muted font-medium mt-1">Bundle ID: {activeBundle.toLowerCase().replace(/ /g, '-')}</p>
                            </div>

                            <div className="flex gap-4">
                                <button className="flex items-center gap-3 px-8 py-4 bg-app-surface border border-app-border rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all active:translate-y-0">
                                    <FileJson size={20} className="text-text-muted" /> Export JSON
                                </button>
                                <button className="flex items-center gap-3 px-8 py-4 bg-app-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-app-primary/30 hover:scale-105 transition-all active:scale-95">
                                    <UploadCloud size={20} /> Publish Bundle
                                </button>
                            </div>
                        </header>
                        <BundleEditor />
                    </>
                ) : (
                    <UserManagement />
                )}
            </main>
        </div>
    );
};
