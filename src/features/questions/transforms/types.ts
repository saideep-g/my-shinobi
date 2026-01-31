/**
 * QUESTION TRANSFORMER TYPES
 * Defines the contract for "Lens" functions that migrate data on-the-fly.
 */

export interface TransformationContext {
    questionId: string;
    atomId: string;
}

export type TransformFn = (data: any, context: TransformationContext) => any;

export interface QuestionTransformer {
    templateId: string;
    fromVersion: number;
    toVersion: number;
    transform: TransformFn;
}
