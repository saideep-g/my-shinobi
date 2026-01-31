import { SubjectBundle } from '@/types/bundles';
import { Atom } from '@/types/curriculum';

/**
 * GENERATE TABLE ATOMS
 * Helper to create atoms for tables 2 through 12 with sequential prerequisites.
 */
const generateTableAtoms = (): Atom[] => {
    const atoms: Atom[] = [];
    for (let i = 2; i <= 12; i++) {
        atoms.push({
            id: `table-${i}`,
            title: `Table of ${i}`,
            description: `Master the multiplication facts for ${i}.`,
            type: 'procedural',
            prerequisites: i === 2 ? [] : [`table-${i - 1}`],
            status: 'LIVE',
            recommendedTemplates: ['math-table-v1']
        });
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
