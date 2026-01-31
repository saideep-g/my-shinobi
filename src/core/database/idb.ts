import { openDB, IDBPDatabase } from 'idb';
import { Subject } from '@/types/curriculum';
import { QuestionBase } from '@/types/questions';
import { AssessmentSession } from '@/types/assessment';
import { StudentStats, MasteryMap } from '@/types/progression';

/**
 * INDEXEDDB CONFIGURATION
 * Defines the stores and indexes for My-Shinobi's offline-first foundation.
 */

const DB_NAME = 'my_shinobi_db';
const DB_VERSION = 1;

export interface ShinobiDB {
    subjects: Subject;
    questions: QuestionBase;
    sessions: AssessmentSession;
    stats: StudentStats & { id: string }; // Local stats per user
    mastery: { id: string; map: MasteryMap }; // Bayesian mastery per user
}

export const initDB = async (): Promise<IDBPDatabase<ShinobiDB>> => {
    return openDB<ShinobiDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // 1. Curriculum Store
            if (!db.objectStoreNames.contains('subjects')) {
                db.createObjectStore('subjects', { keyPath: 'id' });
            }

            // 2. Question Library Store
            if (!db.objectStoreNames.contains('questions')) {
                const qStore = db.createObjectStore('questions', { keyPath: 'id' });
                // Index by contentHash for duplicate checking
                qStore.createIndex('by-hash', 'contentHash', { unique: true });
                // Index by atom for quick quiz generation
                qStore.createIndex('by-atom', 'atomId');
            }

            // 3. Assessment Sessions (The Write-Through Buffer)
            if (!db.objectStoreNames.contains('sessions')) {
                const sStore = db.createObjectStore('sessions', { keyPath: 'id' });
                sStore.createIndex('by-status', 'status');
                sStore.createIndex('by-user', 'userId');
            }

            // 4. Student Stats & Progression
            if (!db.objectStoreNames.contains('stats')) {
                db.createObjectStore('stats', { keyPath: 'id' });
            }

            // 5. Bayesian Mastery Map
            if (!db.objectStoreNames.contains('mastery')) {
                db.createObjectStore('mastery', { keyPath: 'id' });
            }
        },
    });
};
