import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@core/theme/ThemeContext';
import { AuthProvider } from '@core/auth/AuthContext';
import { ProtectedRoute } from '@core/auth/ProtectedRoute';
import { RoleGuard } from '@core/auth/RoleGuard';

// Placeholder components for the new structure
const AdminDashboard = () => (
    <div className="p-12 bg-app-bg min-h-screen text-text-main flex flex-col items-center justify-center">
        <div className="bg-app-surface p-8 rounded-3xl border border-app-border shadow-2xl text-center">
            <div className="text-6xl mb-4 text-app-primary font-black tracking-tighter italic">MY-SHINOBI</div>
            <div className="text-xl font-black uppercase text-rose-500 tracking-widest bg-rose-500/10 py-2 px-6 rounded-full inline-block mb-4">
                Admin Workbench (Secret)
            </div>
            <p className="text-text-muted max-w-sm">
                Welcome to the restricted command center. Only master ninjas with administrative clearance can view this scroll.
            </p>
        </div>
    </div>
);

const StudentDashboard = () => (
    <div className="p-12 bg-app-bg min-h-screen text-text-main flex flex-col items-center justify-center">
        <div className="bg-app-surface p-8 rounded-3xl border border-app-border shadow-2xl text-center">
            <div className="text-6xl mb-4 text-app-primary font-black tracking-tighter italic">MY-SHINOBI</div>
            <div className="text-xl font-black uppercase text-app-accent tracking-widest bg-app-accent/10 py-2 px-6 rounded-full inline-block mb-4">
                Student Quest Hub
            </div>
            <p className="text-text-muted max-w-sm">
                Your journey begins here. Master your tenses, earn power points, and rise through the ranks.
            </p>
        </div>
    </div>
);

const LoginPage = () => (
    <div className="p-12 bg-app-bg min-h-screen text-text-main flex flex-col items-center justify-center">
        <div className="bg-app-surface p-12 rounded-3xl border border-app-border shadow-2xl text-center max-w-sm w-full">
            <div className="text-5xl mb-8 text-app-primary font-black tracking-tighter italic">MY-SHINOBI</div>
            <div className="aspect-square bg-app-bg flex items-center justify-center rounded-3xl mb-8 text-7xl">
                🥷
            </div>
            <h2 className="text-2xl font-bold mb-2">Gate of Entry</h2>
            <p className="text-text-muted mb-8 text-sm">Please sign in to continue your path of knowledge.</p>
            <button className="w-full py-4 bg-app-primary text-white rounded-xl font-bold shadow-lg hover:shadow-app-primary/20 hover:-translate-y-0.5 transition-all active:scale-95">
                Unlock with Firebase
            </button>
        </div>
    </div>
);

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* Student Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <RoleGuard allowedRoles={['STUDENT', 'ADMIN']}>
                                        <StudentDashboard />
                                    </RoleGuard>
                                </ProtectedRoute>
                            }
                        />

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
            </AuthProvider>
        </ThemeProvider>
    );
}
