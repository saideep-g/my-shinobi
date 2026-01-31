import React, { createContext, useContext, useState, useEffect } from 'react';
import { updateMastery } from './bayesian';
import { dbAdapter } from '@core/database/adapter';
import { useAuth } from '@core/auth/AuthContext';
import { MasteryMap } from '@/types/progression';

/**
 * INTELLIGENCE CONTEXT
 * The "Memory" of the student's mastery across all subjects.
 */

interface IntelligenceContextType {
    mastery: MasteryMap;
    recordAttempt: (atomId: string, isCorrect: boolean, contentHash?: string) => Promise<void>;
    getAtomMastery: (atomId: string) => number;
}

const IntelligenceContext = createContext<IntelligenceContextType | undefined>(undefined);

export const IntelligenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [mastery, setMastery] = useState<MasteryMap>({});

    // 1. Load mastery from IndexedDB on startup
    useEffect(() => {
        const loadMastery = async () => {
            if (!user) return;
            const data = await dbAdapter.get<any>('mastery', user.uid);
            if (data) setMastery(data.map);
        };
        loadMastery();
    }, [user]);

    const recordAttempt = async (atomId: string, isCorrect: boolean, contentHash?: string) => {
        if (!user) return;

        const updatedMap = { ...mastery };

        // 1. Update Atom-Level Mastery (General concept)
        const currentAtomProb = updatedMap[atomId] || 0.25;
        updatedMap[atomId] = updateMastery(currentAtomProb, isCorrect);

        // 2. Update Fact-Level Mastery (Specific fluency)
        if (contentHash) {
            const currentFactProb = updatedMap[contentHash] || 0.25;
            updatedMap[contentHash] = updateMastery(currentFactProb, isCorrect);
        }

        setMastery(updatedMap);

        // Persist to local storage (IndexedDB) immediately
        await dbAdapter.put('mastery', { id: user.uid, map: updatedMap });
    };

    const getAtomMastery = (atomId: string) => mastery[atomId] || 0.0;

    return (
        <IntelligenceContext.Provider value={{ mastery, recordAttempt, getAtomMastery }}>
            {children}
        </IntelligenceContext.Provider>
    );
};

export const useIntelligence = () => {
    const context = useContext(IntelligenceContext);
    if (!context) throw new Error('useIntelligence must be used within IntelligenceProvider');
    return context;
};
