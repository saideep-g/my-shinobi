import React, { useEffect, useState } from 'react';
import { reviewService } from '@/services/db/reviewService';
import { ReviewItem } from '@/types/admin';
import { AlertCircle, Edit3, Trash2, CheckCircle, ExternalLink, ShieldCheck, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * REVIEW QUEUE DASHBOARD
 * A specialized interface for managing flagged content and automated bias detections.
 */
export const ReviewQueue: React.FC = () => {
    const [items, setItems] = useState<ReviewItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadItems = async () => {
        setIsLoading(true);
        try {
            const data = await reviewService.getReviewItems();
            setItems(data.sort((a, b) => b.flaggedAt - a.flaggedAt));
        } catch (error) {
            console.error("[ReviewQueue] Load error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleAction = async (id: string, action: 'KEEP' | 'DELETE' | 'EDITED') => {
        if (action === 'DELETE' && !confirm("Permanently delete this question from the bundle? This cannot be undone.")) return;

        try {
            await reviewService.resolveReviewItem(id, action);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error("[ReviewQueue] Action error:", error);
        }
    };

    const filteredItems = items.filter(i =>
        i.question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.bundleId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[500px] animate-pulse">
                <div className="w-12 h-12 bg-app-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="text-app-primary animate-bounce" />
                </div>
                <p className="text-sm font-black text-text-muted uppercase tracking-widest">Scanning Firestore...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter">Content Integrity</h2>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-[0.2em] mt-2">Active Review Queue • {items.length} Pending Flags</p>
                </div>

                <div className="flex items-center gap-4 bg-app-surface border border-app-border p-2 rounded-2xl shadow-inner w-full md:w-96">
                    <Search size={18} className="ml-3 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search by text, reason, or bundle..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-text-muted/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {filteredItems.length === 0 ? (
                <div className="bg-app-surface border border-app-border rounded-[48px] p-24 text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <CheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">System Healthy</h3>
                    <p className="max-w-md mx-auto text-text-muted font-medium mt-3">
                        No pending integrity flags or bias alerts. Your curriculum is currently meeting all quality standards.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="group bg-app-surface border border-app-border hover:border-app-primary/30 rounded-[40px] p-10 flex flex-col xl:flex-row gap-8 transition-all hover:shadow-2xl hover:shadow-app-primary/5 relative overflow-hidden">
                            {/* Marker */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500/50" />

                            {/* Question Details */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center gap-1.5">
                                        <AlertCircle size={12} /> {item.reason}
                                    </span>
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                        <ExternalLink size={12} /> {item.bundleId}
                                    </span>
                                </div>

                                <h4 className="text-xl font-bold leading-tight text-text-main line-clamp-3">
                                    {item.question.text}
                                </h4>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {item.question.data?.options?.map((opt: string, idx: number) => (
                                        <div key={idx} className={clsx(
                                            "px-4 py-2 rounded-xl text-xs font-bold border",
                                            opt === item.question.data?.answer
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                                : "bg-app-bg border-app-border text-text-muted"
                                        )}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row xl:flex-col gap-3 justify-center">
                                <button
                                    onClick={() => handleAction(item.id, 'EDITED')}
                                    className="p-4 bg-indigo-500/10 text-indigo-600 rounded-3xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm flex items-center gap-3 xl:w-48 group/btn"
                                >
                                    <Edit3 size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest xl:inline hidden">Quick Edit</span>
                                </button>

                                <button
                                    onClick={() => handleAction(item.id, 'DELETE')}
                                    className="p-4 bg-rose-500/10 text-rose-600 rounded-3xl hover:bg-rose-500 hover:text-white transition-all shadow-sm flex items-center gap-3 xl:w-48 group/btn"
                                >
                                    <Trash2 size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest xl:inline hidden">Safe Delete</span>
                                </button>

                                <button
                                    onClick={() => handleAction(item.id, 'KEEP')}
                                    className="p-4 bg-emerald-500/10 text-emerald-600 rounded-3xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm flex items-center gap-3 xl:w-48 group/btn"
                                >
                                    <CheckCircle size={20} />
                                    <span className="text-xs font-black uppercase tracking-widest xl:inline hidden">Dismiss</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
