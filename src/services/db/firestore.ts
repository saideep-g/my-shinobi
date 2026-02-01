import {
    collection,
    doc,
    CollectionReference,
    DocumentReference
} from 'firebase/firestore';
import { db } from '@core/database/firebase';
// Note: We use the @ alias which points to src/


/**
 * FIRESTORE SERVICE HELPERS
 * Provides standardized references to collections and documents.
 * * By wrapping these in functions, we ensure that the application 
 * always uses the correct paths for data retrieval and updates.
 */

// --- USER & PROFILE PATHS ---
/** Returns a reference to a specific student's profile document */
export const getStudentDoc = (uid: string): DocumentReference =>
    doc(db, 'students', uid);

/** Returns the global collection of students */
export const getStudentsCol = (): CollectionReference =>
    collection(db, 'students');

// --- CURRICULUM PATHS ---
/** Returns the global collection of subjects */
export const getSubjectsCol = (): CollectionReference =>
    collection(db, 'subjects');

/** Returns a reference to a specific subject document */
export const getSubjectDoc = (subjectId: string): DocumentReference =>
    doc(db, 'subjects', subjectId);

// --- BUNDLE MASTER PATHS ---
/** Returns a reference to the version control document for a specific bundle */
export const getBundleMasterDoc = (bundleId: string): DocumentReference =>
    doc(db, 'bundle_master', bundleId);

/** Returns a reference to the heavy content bundle document */
export const getBundleDoc = (bundleId: string): DocumentReference =>
    doc(db, 'bundles', bundleId);

// --- QUESTION PATHS ---
/** Returns the global question library collection */
export const getQuestionsCol = (): CollectionReference =>
    collection(db, 'questions');

// --- SESSION LOGGING PATHS ---
/** * Returns a reference to a student's monthly session logs bucket.
 * monthlyId format: YYYY-MM (e.g., '2026-01')
 */
export const getSessionBucketDoc = (uid: string, monthlyId: string): DocumentReference =>
    doc(db, 'students', uid, 'sessions', monthlyId);

/** Returns a collection reference for all sessions of a student */
export const getSessionsCol = (uid: string): CollectionReference =>
    collection(db, 'students', uid, 'sessions');
