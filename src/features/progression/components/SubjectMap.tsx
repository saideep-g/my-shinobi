import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBundleById } from '@features/curriculum/data/bundleRegistry';
import { PathToMaster } from './PathToMaster';
import { ChevronLeft } from 'lucide-react';

/**
 * SUBJECT MAP WRAPPER
 * Extracts subjectId from URL and renders the PathToMaster map.
 */

export const SubjectMap: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();

    const bundle = subjectId ? getBundleById(subjectId) : null;

    if (!bundle) {
        return (
            <div className="p-20 text-center">
                <p className="text-text-muted">Subject not found.</p>
                <button
                    onClick={() => navigate('/quest')}
                    className="mt-4 px-6 py-2 bg-app-primary text-white rounded-xl"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <header className="flex items-center gap-4 max-w-lg mx-auto">
                <button
                    onClick={() => navigate('/quest')}
                    className="p-3 bg-app-surface border border-app-border rounded-2xl hover:bg-app-bg transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h3 className="text-xl font-black text-text-main">{bundle.curriculum.name}</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Training Path</p>
                </div>
            </header>

            <PathToMaster
                bundle={bundle}
                onSelectAtom={(atomId) => navigate(`/quest/${bundle.id}/play?atom=${atomId}`)}
            />
        </div>
    );
};
