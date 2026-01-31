import { SubjectBundle } from '@/types/bundles';
import { Atom } from '@/types/curriculum';

/**
 * GENERATE TABLE ATOMS
 * Helper to create granular atoms for every multiplication fact (1x1 to 12x12).
 * Naming: table-{tableNum}-{multiplier} (e.g., table-7-8)
 */
const generateTableAtoms = (): Atom[] => {
    const atoms: Atom[] = [];
    // We cover tables 2 through 12
    for (let t = 2; t <= 12; t++) {
        // To unlock table T, all facts of table T-1 should be mastered
        const prevTableAtoms = t === 2 ? [] : Array.from({ length: 12 }, (_, i) => `table-${t - 1}-${i + 1}`);

        for (let m = 1; m <= 12; m++) {
            atoms.push({
                id: `table-${t}-${m}`,
                title: `${t} × ${m}`,
                description: `Master the fluency of ${t} multiplied by ${m}.`,
                type: 'procedural',
                prerequisites: prevTableAtoms,
                status: 'LIVE',
                recommendedTemplates: ['math-table-v1']
            });
        }
    }
    return atoms;
};

export const MultiplicationTablesBundle: SubjectBundle = {
    id: 'multiplication-tables',
    grade: 7,
    subjectId: 'math',
    version: '1.0.0',
    lastUpdated: Date.now(),
    isDynamic: true,
    curriculum: {
        id: 'math-tables',
        name: 'Multiplication Mastery',
        grade: 7,
        chapters: [
            {
                id: 'tables-ch1',
                title: 'The Basic Grid (2-12)',
                order: 1,
                atoms: generateTableAtoms()
            }
        ],
        metadata: {
            theme: 'emerald',
            icon: 'grid-3x3'
        }
    },
    // For dynamic bundles, the static questions array provides fallback or special anchors,
    // but the primary generation is handled by the selection engine.
    questions: [],
    stats: {
        totalAtoms: 11,
        totalQuestions: 144, // 12x12 conceptual
        supportedTemplates: ['math-table-v1']
    }
};
