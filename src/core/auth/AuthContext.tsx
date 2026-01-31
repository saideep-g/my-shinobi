import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
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
    loading: boolean;
    // Utility function to log out
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        /**
         * Subscribe to Firebase Auth state changes.
         * This listener triggers whenever a user logs in, logs out, or 
         * when the app initializes with a persisted session.
         */
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);

            if (firebaseUser) {
                // User is logged in, now fetch their custom profile data from Firestore
                try {
                    const profileDoc = await getDoc(getStudentDoc(firebaseUser.uid));

                    if (profileDoc.exists()) {
                        setProfile(profileDoc.data() as UserProfile);
                    } else {
                        console.warn(`[AuthService] No Firestore profile found for UID: ${firebaseUser.uid}`);
                        setProfile(null);
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

            setLoading(false);
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

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout }}>
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
