import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDoc, setDoc } from 'firebase/firestore';
import { auth } from '@core/database/firebase';
import { getStudentDoc } from '@services/db/firestore';
import { UserProfile } from '@/types/auth';

/**
 * IDENTITY SERVICE (AuthContext)
 * Manages the global authentication state and user profile retrieval.
 * * It synchronizes Firebase Auth (Identity) with Firestore (Profile Data).
 */

interface AuthContextType {
    // The raw Firebase user object
    user: FirebaseUser | null;
    // The custom My-Shinobi profile (role, grade, etc.)
    profile: UserProfile | null;
    // Loading state to prevent premature rendering of protected routes
    isInitializing: boolean;
    // Utility function to log out
    logout: () => Promise<void>;
    // Utility function to sign in with Google
    signInWithGoogle: () => Promise<void>;
    // Boolean helper to check for admin privileges
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        /**
         * Subscribe to Firebase Auth state changes.
         * This listener triggers whenever a user logs in, logs out, or 
         * when the app initializes with a persisted session.
         */
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setIsInitializing(true);

            if (firebaseUser) {
                // User is logged in, now fetch their custom profile data from Firestore
                try {
                    const profileDoc = await getDoc(getStudentDoc(firebaseUser.uid));

                    if (profileDoc.exists()) {
                        setProfile(profileDoc.data() as UserProfile);
                    } else {
                        // NEW: Auto-initialize profile for first-time users
                        const newProfile: UserProfile = {
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || '',
                            displayName: firebaseUser.displayName || 'New Shinobi',
                            role: 'STUDENT',
                            grade: 7,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            preferredLayout: 'mobile-quest',
                            connections: []
                        };
                        await setDoc(getStudentDoc(firebaseUser.uid), newProfile);
                        setProfile(newProfile);
                        console.log(`[AuthService] New profile initialized for: ${firebaseUser.uid}`);
                    }
                } catch (error) {
                    console.error("[AuthService] Failed to fetch user profile:", error);
                }
                setUser(firebaseUser);
            } else {
                // User is logged out, clear all state
                setUser(null);
                setProfile(null);
            }

            setIsInitializing(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("[AuthService] Logout failed:", error);
        }
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("[AuthService] Google Sign-In failed:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            isInitializing,
            logout,
            signInWithGoogle,
            isAdmin: profile?.role === 'ADMIN'
        }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * CLEAN AUTH HOOK
 * Provides a simple, type-safe way to access auth data in any component.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
