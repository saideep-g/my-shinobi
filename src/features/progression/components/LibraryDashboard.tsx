import React from 'react';
import { SubjectMasteryList } from './SubjectMasteryList';
import { getAllBundles } from '@features/curriculum/data/bundleRegistry';
import { useNavigate } from 'react-router-dom';

export const LibraryDashboard: React.FC = () => {
    const navigate = useNavigate();
    const bundles = getAllBundles();

    return (
        <div className="p-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SubjectMasteryList
                bundles={bundles}
                onSelect={(bundle) => navigate(`/syllabus/${bundle.id}`)}
            />
        </div>
    );
};
