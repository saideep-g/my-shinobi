import { Achievement } from '@/types/progression';
import { MasteryMap } from '@/types/progression';
import { StudentStats } from '@/types/progression';

/**
 * BADGE REGISTRY
 * Defines all unlockable achievements in My-Shinobi.
 * Criteria are checked against the MasteryMap and StudentStats.
 */

export interface AchievementDefinition extends Omit<Achievement, 'criteria'> {
    criteria: (mastery: MasteryMap, stats: StudentStats) => boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
    {
        id: 'tense-apprentice',
        name: 'Tense Apprentice',
        description: 'Master the Present Simple atom with > 90% signal.',
        icon: '📜',
        criteria: (mastery) => (mastery['eng-7-pres-simple-01'] || 0) >= 0.90,
        unlockedAt: 0
    },
    {
        id: 'tense-master',
        name: 'Master of Tenses',
        description: 'Achieve > 85% signal across all English Tense atoms.',
        icon: '⚡',
        criteria: (mastery) => {
            // These IDs should match the curriculum atoms defined in Phase 20
            const tenseAtoms = ['eng-7-pres-simple-01', 'eng-7-pres-cont-01', 'eng-7-past-simple-01'];
            return tenseAtoms.every(id => (mastery[id] || 0) >= 0.85);
        },
        unlockedAt: 0
    },
    {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a learning streak for 7 consecutive days.',
        icon: '🔥',
        criteria: (_, stats) => stats.streakCount >= 7,
        unlockedAt: 0
    }
];
