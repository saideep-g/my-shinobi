/**
 * LAYOUT REGISTRY
 * Defines the available visual "Shells" for My-Shinobi.
 * * This allows the application to switch the entire navigation 
 * and background structure based on the student's profile settings.
 */

export type StudentLayoutType = 'mobile-quest' | 'study-era';

export interface LayoutManifest {
    id: StudentLayoutType;
    name: string;
    description: string;
    isMobileOptimized: boolean;
}

export const LAYOUT_REGISTRY: Record<StudentLayoutType, LayoutManifest> = {
    'mobile-quest': {
        id: 'mobile-quest',
        name: 'Mobile Quest',
        description: 'A gamified, mobile-first experience with a bottom navigation bar.',
        isMobileOptimized: true,
    },
    'study-era': {
        id: 'study-era',
        name: 'Study Era',
        description: 'A professional grid-based layout for desktop and tablet users.',
        isMobileOptimized: false,
    },
};
