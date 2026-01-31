import React from 'react';
import { SubjectMasteryList } from './SubjectMasteryList';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { useNavigate } from 'react-router-dom';

export const LibraryDashboard: React.FC = () => {
    const navigate = useNavigate();
    const bundles = getAllBundles();

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-10 px-4">
                <h2 className="text-3xl font-black text-text-main tracking-tight">Wisdom Archives</h2>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Global Mastery Overview</p>
            </header>

            <SubjectMasteryList
                bundles={bundles}
                onSelect={(bundle) => navigate(`/library/${bundle.id}`)}
            />
        </div>
    );
};
