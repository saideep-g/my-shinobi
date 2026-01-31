import { Grade7EnglishBundle } from './grade-7/english-bundle';
import { Grade7MathBundle } from './grade-7/math-bundle';
import { SubjectBundle } from '@/types/bundles';

export const BUNDLE_REGISTRY: Record<string, SubjectBundle> = {
    'grade-7-english': Grade7EnglishBundle,
    'grade-7-math': Grade7MathBundle
};

export const getAllBundles = () => Object.values(BUNDLE_REGISTRY);

export const getBundleById = (id: string) => BUNDLE_REGISTRY[id] || null;
