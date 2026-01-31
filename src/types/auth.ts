/**
 * AUTH & PROFILE SCHEMAS
 * Manages identity, roles, and administrative access.
 */

export type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    grade: number;
    createdAt: number;
    updatedAt: number;
    /** User-selected UI layout ('mobile-quest' | 'study-era') */
    preferredLayout?: 'mobile-quest' | 'study-era';
    /** Links to related profiles (e.g., Parent linking to Student) */
    connections: {
        targetUid: string;
        relationship: string;
    }[];
}
