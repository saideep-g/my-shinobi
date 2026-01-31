import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBundleById } from '@features/curriculum/data/bundleRegistry';
import { StudyEraLibrary } from './StudyEraLibrary';
import { ChevronLeft } from 'lucide-react';

export const StudyEraSubjectView: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();

    const bundle = subjectId ? getBundleById(subjectId) : null;

    if (!bundle) {
        return <div className="p-20 text-center text-text-muted">Loading syllabus...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex items-center gap-4 px-10 pt-6">
                <button
                    onClick={() => navigate('/library')}
                    className="p-3 bg-app-surface border border-app-border rounded-2xl hover:bg-app-bg transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h3 className="text-xl font-black text-text-main">{bundle.curriculum.name}</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Syllabus Archive</p>
                </div>
            </header>

            <StudyEraLibrary
                bundle={bundle}
                onSelectAtom={(atomId) => navigate(`/quest/${bundle.id}/play?atom=${atomId}`)}
            />
        </div>
    );
};
