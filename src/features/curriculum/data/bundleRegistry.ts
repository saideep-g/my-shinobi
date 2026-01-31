import { Grade7EnglishBundle } from './grade-7/english-bundle';
import { Grade7MathBundle } from './grade-7/math-bundle';
import { MultiplicationTablesBundle } from './grade-7/multiplication-tables';
import { SubjectBundle } from '@/types/bundles';

export const BUNDLE_REGISTRY: Record<string, SubjectBundle> = {
    'grade-7-english': Grade7EnglishBundle,
    'english-g7': Grade7EnglishBundle,
    'grade-7-math': Grade7MathBundle,
    'multiplication-tables': MultiplicationTablesBundle
};

export const getAllBundles = () => {
    // Return unique bundles by their ID to avoid duplicate keys in UI lists
    const uniqueBundles = new Map<string, SubjectBundle>();
    Object.values(BUNDLE_REGISTRY).forEach(bundle => {
        uniqueBundles.set(bundle.id, bundle);
    });
    return Array.from(uniqueBundles.values());
};

export const getBundleById = (id: string) => BUNDLE_REGISTRY[id] || null;
