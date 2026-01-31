import { describe, it, expect } from 'vitest';
import { updateMastery } from '../bayesian';

/**
 * BAYESIAN ENGINE UNIT TESTS
 * Verifies that the math correctly updates mastery probability.
 */

describe('Bayesian Knowledge Tracing Logic', () => {
    const INITIAL_PROB = 0.25;

    it('should increase mastery significantly after a correct answer', () => {
        const newProb = updateMastery(INITIAL_PROB, true);
        // With default P(G)=0.2 and P(S)=0.1, mastery should jump
        // Calculation: 
        // pL_given_action = (0.25 * 0.9) / (0.25 * 0.9 + 0.75 * 0.2) = 0.225 / (0.225 + 0.15) = 0.225 / 0.375 = 0.6
        // newMastery = 0.6 + (1 - 0.6) * 0.15 = 0.6 + 0.06 = 0.66
        expect(newProb).toBeGreaterThan(0.40);
        expect(newProb).toBeCloseTo(0.66, 2);
    });

    it('should decrease mastery after a wrong answer', () => {
        const newProb = updateMastery(INITIAL_PROB, false);
        // Calculation:
        // pL_given_action = (0.25 * 0.1) / (0.25 * 0.1 + 0.75 * 0.8) = 0.025 / (0.025 + 0.6) = 0.025 / 0.625 = 0.04
        // newMastery = 0.04 + (1 - 0.04) * 0.15 = 0.04 + 0.144 = 0.184
        expect(newProb).toBeLessThan(INITIAL_PROB);
        expect(newProb).toBeCloseTo(0.184, 3);
    });

    it('should treat a mistake at high mastery as a "Slip"', () => {
        const highMastery = 0.95;
        const newProb = updateMastery(highMastery, false);
        // Calculation:
        // pL_given_action = (0.95 * 0.1) / (0.95 * 0.1 + 0.05 * 0.8) = 0.095 / (0.095 + 0.04) = 0.095 / 0.135 = 0.7037
        // newMastery = 0.7037 + (1 - 0.7037) * 0.15 = 0.7037 + 0.0444 = 0.7481
        expect(newProb).toBeGreaterThan(0.50);
        expect(newProb).toBeCloseTo(0.748, 3);
    });

    it('should never exceed a probability of 0.99', () => {
        const nearPerfect = 0.98;
        const newProb = updateMastery(nearPerfect, true);
        expect(newProb).toBeLessThanOrEqual(0.99);
    });
});
