import React, { useState } from 'react';
import { publishService } from '../services/publishService';
import { SubjectBundle } from '@/types/bundles';
import { Rocket, ShieldAlert, CheckCircle, X } from 'lucide-react';

/**
 * PUBLISH MODAL
 * The final confirmation gate before pushing content to production.
 * Provides transparency on what is being updated and the impact.
 */

interface PublishModalProps {
    bundle: SubjectBundle;
    onClose: () => void;
    onSuccess: (version: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({ bundle, onClose, onSuccess }) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePublish = async () => {
        setIsPublishing(true);
        setError(null);
        try {
            const newVersion = await publishService.publishBundle(bundle, 'patch');
            onSuccess(newVersion);
        } catch (err: any) {
            setError(err.message || "Publishing failed. Check console for details.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
            <div className="bg-app-surface w-full max-w-md rounded-[48px] border border-app-border p-10 shadow-3xl relative animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-8 p-2 text-text-muted hover:text-text-main hover:bg-app-bg rounded-full transition-all"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-24 h-24 bg-app-primary/10 rounded-full flex items-center justify-center text-app-primary shadow-inner">
                        <Rocket size={44} className={isPublishing ? "animate-bounce" : ""} />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">Publish Update?</h3>
                    <p className="text-text-muted text-sm leading-relaxed px-4">
                        You are pushing <span className="text-text-main font-bold">Grade 7 English</span> to production.
                        This will increment the version from <span className="font-mono bg-app-bg px-2 py-0.5 rounded text-app-primary">{bundle.version}</span>.
                    </p>
                </div>

                {/* Impact Summary */}
                <div className="mt-8 space-y-3">
                    <div className="p-5 bg-app-bg border border-app-border rounded-3xl flex items-center gap-4 group">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <CheckCircle size={20} className="text-emerald-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Content Verified</p>
                            <p className="text-sm font-bold text-text-main">{bundle.questions.length} Questions in Pool</p>
                        </div>
                    </div>

                    <div className="p-5 bg-app-bg border border-app-border rounded-3xl flex items-center gap-4 group">
                        <div className="p-2 bg-amber-500/10 rounded-xl">
                            <ShieldAlert size={20} className="text-amber-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Broadcast Status</p>
                            <p className="text-sm font-bold text-text-main">All Students Will Sync</p>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold text-center">
                        ⚠️ {error}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onClose}
                        disabled={isPublishing}
                        className="flex-1 py-4 font-bold text-text-muted hover:text-text-main transition-colors text-sm uppercase tracking-widest"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex-1 py-4 bg-app-primary text-white rounded-3xl font-black text-sm uppercase tracking-[0.1em] shadow-xl shadow-app-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                    >
                        {isPublishing ? "Publishing..." : "Launch Update"}
                    </button>
                </div>
            </div>
        </div>
    );
};
