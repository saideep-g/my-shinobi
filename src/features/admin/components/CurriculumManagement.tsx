import { useParams, useLocation } from 'react-router-dom';
import { BundleEditor } from './BundleEditor';
import { FileJson, UploadCloud } from 'lucide-react';

export const CurriculumManagement: React.FC = () => {
    const { bundleId } = useParams<{ bundleId: string }>();
    const location = useLocation();

    const mode = location.pathname.includes('/admin/questions') ? 'questions' : 'curriculum';

    // Fallback or lookup display name
    const activeBundleName = bundleId
        ? bundleId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'English Grade 7';

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-app-primary/10 text-app-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-app-primary/20">
                            Active Bundle
                        </span>
                        <span className="text-[10px] font-bold text-text-muted">v1.0.1 • Production</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-text-main">{activeBundleName}</h2>
                    <p className="text-text-muted font-medium mt-1">Bundle ID: {bundleId || 'english-grade-7'}</p>
                </div>

                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-app-surface border border-app-border rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all active:translate-y-0 text-text-main">
                        <FileJson size={20} className="text-text-muted" /> Export JSON
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-app-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-app-primary/30 hover:scale-105 transition-all active:scale-95">
                        <UploadCloud size={20} /> Publish Bundle
                    </button>
                </div>
            </header>
            <BundleEditor mode={mode} />
        </>
    );
};
