/**
 * BAYESIAN KNOWLEDGE TRACING (BKT) ENGINE
 * Calculates the updated probability of mastery after a student interaction.
 * * Formulas used:
 * 1. Probability student knows it, given they got it RIGHT:
 * P(L|Correct) = [P(L) * (1 - P(S))] / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]
 * * 2. Probability student knows it, given they got it WRONG:
 * P(L|Wrong) = [P(L) * P(S)] / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]
 */

interface BKTParameters {
    pG: number; // Guess
    pS: number; // Slip
    pT: number; // Transit (Learning rate)
}

const DEFAULT_PARAMS: BKTParameters = {
    pG: 0.20,
    pS: 0.10,
    pT: 0.15,
};

export const updateMastery = (
    currentProb: number,
    isCorrect: boolean,
    params = DEFAULT_PARAMS
): number => {
    let pL_given_action: number;

    if (isCorrect) {
        pL_given_action = (currentProb * (1 - params.pS)) /
            ((currentProb * (1 - params.pS)) + ((1 - currentProb) * params.pG));
    } else {
        pL_given_action = (currentProb * params.pS) /
            ((currentProb * params.pS) + ((1 - currentProb) * (1 - params.pG)));
    }

    // Calculate new mastery including the probability of learning (Transit)
    const newMastery = pL_given_action + (1 - pL_given_action) * params.pT;

    // Clamp the value between 0 and 0.99 (we never assume 100% certainty)
    return Math.min(Math.max(newMastery, 0.01), 0.99);
};
