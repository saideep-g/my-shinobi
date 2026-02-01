import React, { useMemo } from 'react';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { questionRegistry } from '@features/questions/registry';
import { Grid3X3, Layers } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * COVERAGE RADAR
 * A high-resolution heatmap showing question density across chapters and templates.
 */
export const CoverageRadar: React.FC = () => {
    const bundles = getAllBundles();
    const templateIds = useMemo(() => Array.from(new Set(questionRegistry.getAll().map(m => m.id))), []);

    // Calculate Global Health Score
    const globalHealth = useMemo(() => {
        let totalAtoms = 0;
        let populatedAtoms = 0;

        bundles.forEach(bundle => {
            const liveAtoms = bundle.curriculum.chapters.flatMap(ch => ch.atoms).filter(a => a.status === 'LIVE');
            totalAtoms += liveAtoms.length;

            liveAtoms.forEach(atom => {
                const count = bundle.questions.filter(q => q.atomId === atom.id).length;
                if (count > 0) populatedAtoms++;
            });
        });

        return totalAtoms > 0 ? Math.round((populatedAtoms / totalAtoms) * 100) : 100;
    }, [bundles]);

    return (
        <div className="space-y-12 p-6 animate-in fade-in duration-700">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter">Curriculum Radar</h2>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Health Matrix • Global Mastery Prep</p>
                </div>
                <div className="bg-app-surface border border-app-border p-6 rounded-[32px] shadow-sm flex items-center gap-8">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Health Score</p>
                        <p className={clsx(
                            "text-3xl font-black leading-none",
                            globalHealth > 80 ? "text-emerald-500" : globalHealth > 50 ? "text-amber-500" : "text-rose-500"
                        )}>{globalHealth}%</p>
                    </div>
                    <div className="h-10 w-px bg-app-border" />
                    <div className="text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Live Atoms</p>
                        <p className="text-3xl font-black text-text-main leading-none">
                            {bundles.reduce((acc, b) => acc + b.curriculum.chapters.flatMap(ch => ch.atoms).filter(a => a.status === 'LIVE').length, 0)}
                        </p>
                    </div>
                </div>
            </header>

            <div className="space-y-16">
                {bundles.map(bundle => (
                    <section key={bundle.id} className="bg-app-surface border border-app-border rounded-[48px] overflow-hidden shadow-sm">
                        <header className="px-10 py-8 bg-app-bg/50 border-b border-app-border flex justify-between items-center">
                            <div>
                                <p className="text-[10px] font-black text-app-primary uppercase tracking-widest mb-1">{bundle.id}</p>
                                <h3 className="text-2xl font-black text-text-main tracking-tight">{bundle.curriculum.name}</h3>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-app-bg rounded-2xl flex items-center gap-3 text-text-muted font-black text-[10px] uppercase tracking-widest">
                                    <Grid3X3 size={14} /> {bundle.questions.length} Questions
                                </div>
                            </div>
                        </header>

                        <div className="p-2 overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-2">
                                <thead>
                                    <tr>
                                        <th className="p-4 bg-app-bg/30 rounded-2xl min-w-[200px]">
                                            <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">Chapter / Atom</div>
                                        </th>
                                        {templateIds.map(tId => (
                                            <th key={tId} className="p-4 bg-app-bg/30 rounded-2xl text-center min-w-[100px]">
                                                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{tId}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {bundle.curriculum.chapters.map(chapter => (
                                        <React.Fragment key={chapter.id}>
                                            <tr className="bg-app-primary/5">
                                                <td colSpan={templateIds.length + 1} className="px-6 py-3 rounded-2xl">
                                                    <div className="flex items-center gap-2">
                                                        <Layers size={14} className="text-app-primary" />
                                                        <span className="text-xs font-black text-app-primary uppercase tracking-widest">{chapter.title}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            {chapter.atoms.filter(a => a.status === 'LIVE').map(atom => (
                                                <tr key={atom.id}>
                                                    <td className="p-4 bg-app-bg/10 rounded-2xl">
                                                        <p className="text-sm font-bold text-text-main">{atom.title}</p>
                                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-tighter mt-1">{atom.id}</p>
                                                    </td>
                                                    {templateIds.map(tId => {
                                                        const count = bundle.questions.filter(q => q.atomId === atom.id && q.templateId === tId).length;
                                                        return (
                                                            <td key={tId} className="p-2">
                                                                <div className={clsx(
                                                                    "h-12 w-full rounded-2xl flex items-center justify-center font-black transition-all",
                                                                    count === 0 ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                                                                        count < 3 ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                                            "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                                )}>
                                                                    {count}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};
