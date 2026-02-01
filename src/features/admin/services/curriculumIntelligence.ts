import { SubjectBundle } from '@/types/bundles';

export type HealthStatus = 'CRITICAL' | 'LOW' | 'HEALTHY' | 'WEAK' | 'ROBUST';

export interface ChapterHealth {
    chapterId: string;
    totalQuestions: number;
    coverageStatus: 'CRITICAL' | 'LOW' | 'HEALTHY';
    uniqueTemplates: number;
    diversityStatus: 'WEAK' | 'ROBUST';
    hasFullDifficulty: boolean;
    templateBreakdown: Record<string, number>;
    emptyAtoms: string[];
}

/**
 * CURRICULUM INTELLIGENCE SERVICE
 * Provides deep analysis of curriculum coverage and health.
 */
export const curriculumIntelligence = {
    /**
     * Calculates health metrics for a specific chapter in a bundle.
     */
    calculateChapterHealth(bundle: SubjectBundle, chapterId: string): ChapterHealth {
        const chapter = bundle.curriculum.chapters.find((c: any) => c.id === chapterId);
        if (!chapter) throw new Error(`Chapter ${chapterId} not found in bundle`);

        const chapterAtoms = chapter.atoms.filter((a: any) => a.status === 'LIVE');
        const atomIds = chapterAtoms.map((a: any) => a.id);
        const chapterQuestions = bundle.questions.filter((q: any) => atomIds.includes(q.atomId));

        // Metric 1: Coverage
        const totalQuestions = chapterQuestions.length;
        let coverageStatus: 'CRITICAL' | 'LOW' | 'HEALTHY' = 'HEALTHY';
        if (totalQuestions === 0) coverageStatus = 'CRITICAL';
        else if (totalQuestions < 5) coverageStatus = 'LOW';

        // Metric 2: Diversity
        const uniqueTemplates = new Set(chapterQuestions.map((q: any) => q.templateId)).size;
        const diversityStatus: 'WEAK' | 'ROBUST' = uniqueTemplates <= 1 ? 'WEAK' : 'ROBUST';

        // Metric 3: Difficulty (EASY and (MEDIUM or HARD))
        const levels = new Set(chapterQuestions.map((q: any) => q.level));
        const hasFullDifficulty = levels.has(1) && (levels.has(2) || levels.has(3));

        // Template Breakdown
        const templateBreakdown: Record<string, number> = {};
        chapterQuestions.forEach((q: any) => {
            templateBreakdown[q.templateId] = (templateBreakdown[q.templateId] || 0) + 1;
        });

        // Identify Empty Atoms
        const emptyAtoms = atomIds.filter((id: string) => !chapterQuestions.some((q: any) => q.atomId === id));

        return {
            chapterId,
            totalQuestions,
            coverageStatus,
            uniqueTemplates,
            diversityStatus,
            hasFullDifficulty,
            templateBreakdown,
            emptyAtoms
        };
    },

    /**
     * Calculates the overall health score for a bundle.
     * Formula: (Total questions / (Total Atoms * 5 target)) * 100
     */
    getBundleSummary(bundle: SubjectBundle) {
        const liveAtoms = bundle.curriculum.chapters.flatMap((ch: any) => ch.atoms).filter((a: any) => a.status === 'LIVE');
        const totalAtoms = liveAtoms.length;
        const totalQuestions = bundle.questions.length;
        const targetQuestions = totalAtoms * 5;

        const healthPercentage = targetQuestions > 0 ? Math.min(100, Math.round((totalQuestions / targetQuestions) * 100)) : 100;

        const gaps = liveAtoms.filter((atom: any) => !bundle.questions.some((q: any) => q.atomId === atom.id)).length;

        return {
            totalQuestions,
            totalAtoms,
            healthPercentage,
            totalGaps: gaps
        };
    }
};
