import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Book, ClipboardList, Command } from 'lucide-react';
import { dbAdapter } from '@core/database/adapter';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';

/**
 * GLOBAL ADMINISTRATIVE SEARCH
 * A command-palette style search (Ctrl+K) for rapid navigation.
 * Searches across Students, Bundles, and Questions.
 */
export const GlobalAdminSearch: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ type: 'student' | 'bundle' | 'question', id: string, title: string, subtitle?: string }[]>([]);
    const paletteRef = useRef<HTMLDivElement>(null);

    // 1. Hotkey Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 2. Click Outside Listener
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 3. Search Logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const runSearch = async () => {
            const q = query.toLowerCase();
            const found: any[] = [];

            // Search Students
            const students = await dbAdapter.getAll<any>('stats');
            students.forEach(s => {
                if (s.displayName?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q)) {
                    found.push({ type: 'student', id: s.id, title: s.displayName || 'Shinobi', subtitle: `Lvl ${s.heroLevel} • Grade ${s.grade}` });
                }
            });

            // Search Bundles
            const bundles = getAllBundles();
            bundles.forEach(b => {
                if (b.curriculum.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q)) {
                    found.push({ type: 'bundle', id: b.id, title: b.curriculum.name, subtitle: `Curriculum • Grade ${b.grade}` });
                }
            });

            // Search Questions (Placeholder for bundle-wide search)
            if (q.startsWith('q-')) {
                found.push({ type: 'question', id: q, title: `Question ID: ${q}`, subtitle: "Rapid ID Lookup" });
            }

            setResults(found.slice(0, 8));
        };

        const timer = setTimeout(runSearch, 150);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (result: any) => {
        setIsOpen(false);
        setQuery('');
        if (result.type === 'student') navigate('/admin/students'); // Would ideally select the student
        if (result.type === 'bundle') navigate(`/admin/curriculum/${result.id}`);
        if (result.type === 'question') navigate('/admin/curriculum'); // Generic
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] p-6 animate-in fade-in duration-300">
            <div
                ref={paletteRef}
                className="bg-app-surface border border-app-border w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300"
            >
                {/* Search Input */}
                <div className="flex items-center gap-4 p-6 border-b border-app-border bg-app-bg/50">
                    <Search className="text-app-primary" size={24} />
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search for students, bundles, or questions... (Esc to close)"
                        className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-text-main placeholder:text-text-muted"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-app-bg border border-app-border rounded-lg text-[10px] font-black text-text-muted opacity-60">
                        <Command size={10} />
                        <span>K</span>
                    </div>
                </div>

                {/* Results List */}
                <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                    {query && results.length === 0 && (
                        <div className="py-12 text-center text-text-muted">
                            <p className="text-sm font-black uppercase tracking-widest">No matching records found</p>
                        </div>
                    )}
                    {!query && (
                        <div className="py-8 text-center text-text-muted opacity-40">
                            <p className="text-xs font-bold italic">Start typing to search global shinobi data</p>
                        </div>
                    )}
                    {results.map((res, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelect(res)}
                            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-app-primary/5 group transition-all text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-app-bg border border-app-border rounded-xl group-hover:bg-app-primary/10 group-hover:border-app-primary/30 transition-all">
                                    {res.type === 'student' && <User size={20} className="text-indigo-500" />}
                                    {res.type === 'bundle' && <Book size={20} className="text-emerald-500" />}
                                    {res.type === 'question' && <ClipboardList size={20} className="text-amber-500" />}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-black text-text-main">{res.title}</p>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-text-muted opacity-60">{res.subtitle}</p>
                                </div>
                            </div>
                            <div className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black uppercase tracking-widest">Enter ⮐</span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer Tip */}
                <footer className="p-4 bg-app-bg/50 border-t border-app-border flex justify-between items-center text-[9px] font-black text-text-muted uppercase tracking-widest px-8">
                    <span>Shinobi Administrative Registry v5.0</span>
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> All systems operational
                    </span>
                </footer>
            </div>
        </div>
    );
};
