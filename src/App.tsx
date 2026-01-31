import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@core/theme/ThemeContext';
import { AuthProvider, useAuth } from '@core/auth/AuthContext';
import { ProtectedRoute } from '@core/auth/ProtectedRoute';
import { RoleGuard } from '@core/auth/RoleGuard';
import { StudentShellSelector } from '@layouts/StudentShellSelector';
import { useTheme } from '@core/theme/ThemeContext';

// Placeholder components for the new structure
const AdminDashboard = () => (
    <div className="p-12 text-center">
        <div className="text-xl font-black uppercase text-rose-500 tracking-widest bg-rose-500/10 py-2 px-6 rounded-full inline-block mb-4">
            Admin Workbench (Secret)
        </div>
        <p className="text-text-muted">Master ninja command center.</p>
    </div>
);

const StudentDashboard = () => (
    <div className="space-y-6">
        <div className="bg-app-surface p-8 rounded-3xl border border-app-border shadow-xl">
            <h2 className="text-2xl font-bold mb-2">Welcome, Shinobi</h2>
            <p className="text-text-muted">Your learning journey continues here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-app-primary/10 p-6 rounded-2xl border border-app-primary/20">
                <h3 className="font-bold text-app-primary mb-2">Daily Quest</h3>
                <p className="text-sm text-text-main">Master 5 Present Simple atoms today.</p>
            </div>
            <div className="bg-app-secondary/10 p-6 rounded-2xl border border-app-secondary/20">
                <h3 className="font-bold text-app-secondary mb-2">Skill Progress</h3>
                <p className="text-sm text-text-main">English Grade 7: 45% Completed</p>
            </div>
        </div>
    </div>
);

const LoginPage = () => {
    const { theme, toggleTheme } = useTheme();
    const { signInWithGoogle } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Login failed:", error);
            alert("Firebase Sign-in failed. Please check your .env configuration.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="p-12 bg-app-bg min-h-screen flex flex-col items-center justify-center transition-colors duration-300">
            <div className="absolute top-8 right-8">
                <button
                    onClick={toggleTheme}
                    className="p-3 bg-app-surface border border-app-border rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>
            <div className="bg-app-surface p-12 rounded-3xl border border-app-border shadow-2xl text-center max-w-sm w-full">
                <div className="text-5xl mb-8 text-app-primary font-black tracking-tighter italic">MY-SHINOBI</div>
                <div className="aspect-square bg-app-bg flex items-center justify-center rounded-3xl mb-8 text-7xl">
                    🥷
                </div>
                <h2 className="text-2xl font-bold mb-2">Gate of Entry</h2>
                <p className="text-text-muted mb-8 text-sm">Please sign in to continue.</p>
                <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className={`w-full py-4 bg-app-primary text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 ${isLoggingIn ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-app-primary/20 hover:-translate-y-0.5'}`}
                >
                    {isLoggingIn ? 'Connecting...' : 'Unlock with Firebase'}
                </button>
            </div>
        </div>
    );
};

import { IntelligenceProvider } from '@core/engine/IntelligenceContext';
import { SessionProvider } from '@core/engine/SessionContext';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <IntelligenceProvider>
                    <SessionProvider>
                        <Router>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/login" element={<LoginPage />} />

                                {/* Student Protected Routes (Wrapped in Shell Selector) */}
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <RoleGuard allowedRoles={['STUDENT', 'ADMIN']}>
                                                <StudentShellSelector>
                                                    <StudentDashboard />
                                                </StudentShellSelector>
                                            </RoleGuard>
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Other student routes will go here as well, also wrapped in StudentShellSelector */}

                                {/* Admin Only Routes */}
                                <Route
                                    path="/admin/*"
                                    element={
                                        <ProtectedRoute>
                                            <RoleGuard allowedRoles={['ADMIN']} redirectTo="/dashboard">
                                                <AdminDashboard />
                                            </RoleGuard>
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Default Redirect */}
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </Router>
                    </SessionProvider>
                </IntelligenceProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
