import { initDB, ShinobiDB } from './idb';
import { StoreNames } from 'idb';

/**
 * DATABASE ADAPTER
 * Standardized CRUD operations for My-Shinobi.
 * Ensures all components use a consistent interface to access local data.
 */

type DBStoreNames = StoreNames<ShinobiDB>;

export const dbAdapter = {
    // --- Generic Operations ---
    async get<T>(storeName: DBStoreNames, id: string): Promise<T | undefined> {
        const db = await initDB();
        return db.get(storeName, id);
    },

    async getAll<T>(storeName: DBStoreNames): Promise<T[]> {
        const db = await initDB();
        return db.getAll(storeName);
    },

    async put<T>(storeName: DBStoreNames, data: T): Promise<void> {
        const db = await initDB();
        await db.put(storeName, data);
    },

    async delete(storeName: DBStoreNames, id: string): Promise<void> {
        const db = await initDB();
        await db.delete(storeName, id);
    },

    // --- Specialized Question Queries ---
    async getQuestionByHash(hash: string) {
        const db = await initDB();
        return db.getFromIndex('questions', 'by-hash', hash);
    },

    async getQuestionsByAtom(atomId: string) {
        const db = await initDB();
        return db.getAllFromIndex('questions', 'by-atom', atomId);
    },

    // --- Session Management ---
    async getUnsyncedSessions() {
        const db = await initDB();
        const all = await db.getAll('sessions');
        // We only want sessions that are COMPLETED but not yet SYNCED to Firestore
        return all.filter(s => s.status === 'COMPLETED');
    }
};
