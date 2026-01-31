import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingGuard } from '@core/auth/LoadingGuard';
import { ProtectedRoute } from '@core/auth/ProtectedRoute';
import { RoleGuard } from '@core/auth/RoleGuard';
import { UniversalNav } from '@shared/layouts/UniversalNav';
import { HeroProfile } from '@features/progression/components/HeroProfile';
import { HistoryVault } from '@features/assessment/components/HistoryVault';
import { ContentWorkbench } from '@features/admin/components/ContentWorkbench';
import { SubjectMap } from '@features/progression/components/SubjectMap';
import { LibraryDashboard } from '@features/progression/components/LibraryDashboard';
import { StudyEraSubjectView } from '@features/progression/components/StudyEraSubjectView';
import { QuestDashboard } from '@features/assessment/components/QuestDashboard';
import { QuestSessionUI } from '@features/assessment/components/QuestSessionUI';
import { LoginPage } from '@features/auth/components/LoginPage';
import { TableDashboard } from '@features/progression/components/TableDashboard';
import { useParams } from 'react-router-dom';

/**
 * SUBJECT ROUTE SWITCH
 * Decides whether to show a specialized dashboard (like Multiplication)
 * or the standard study path map.
 */
const SubjectRouteSwitch = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    if (subjectId === 'multiplication-tables') return <TableDashboard />;
    return <SubjectMap />;
};

/**
 * APP ROUTER
 * The heart of My-Shinobi's navigation. 
 * Separates domains (Student, Admin) and handles deep-linking.
 */

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <LoadingGuard>
                <Routes>
                    {/* 0. PUBLIC ACCESS */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* 1. STUDENT DOMAIN (Wrapped in UniversalNav Layout) */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <RoleGuard allowedRoles={['STUDENT', 'ADMIN']}>
                                    <UniversalNav />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    >
                        {/* Landing Redirect */}
                        <Route path="/" element={<Navigate to="/quest" replace />} />
                        <Route path="/dashboard" element={<Navigate to="/quest" replace />} />

                        {/* Quest Section */}
                        <Route path="/quest" element={<QuestDashboard />} />
                        <Route path="/quest/:subjectId" element={<SubjectRouteSwitch />} />
                        <Route path="/quest/:subjectId/play" element={<QuestSessionUI />} />

                        {/* Library Section */}
                        <Route path="/library" element={<LibraryDashboard />} />
                        <Route path="/library/:subjectId" element={<StudyEraSubjectView />} />

                        {/* Profile & History */}
                        <Route path="/profile" element={<HeroProfile />} />
                        <Route path="/history" element={<HistoryVault />} />
                    </Route>

                    {/* 2. ADMIN DOMAIN */}
                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute>
                                <RoleGuard allowedRoles={['ADMIN']} redirectTo="/dashboard">
                                    <ContentWorkbench />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </LoadingGuard>
        </Router>
    );
};
