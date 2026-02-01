import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoadingGuard } from '@core/auth/LoadingGuard';
import { ProtectedRoute } from '@core/auth/ProtectedRoute';
import { RoleGuard } from '@core/auth/RoleGuard';
import { UniversalNav } from '@shared/layouts/UniversalNav';
import { useProgression } from '@core/engine/ProgressionContext';
import { HeroProfile } from '@features/progression/components/HeroProfile';
import { HistoryVault } from '@features/assessment/components/HistoryVault';
import { CurriculumManagement } from '@features/admin/components/CurriculumManagement';
import { UserManagement } from '@features/admin/components/UserManagement';
import { SubjectMap } from '@features/progression/components/SubjectMap';
import { LibraryDashboard } from '@features/progression/components/LibraryDashboard';
import { StudyEraSubjectView } from '@features/progression/components/StudyEraSubjectView';
import { QuestDashboard } from '@features/assessment/components/QuestDashboard';
import { QuestSessionUI } from '@features/assessment/components/QuestSessionUI';
import { LoginPage } from '@features/auth/components/LoginPage';
import { useParams } from 'react-router-dom';
import { TablesMasteryDashboard } from '@features/progression/components/TablesMasteryDashboard';
import { ParentAnalyticsDashboard } from '@features/progression/components/ParentAnalyticsDashboard';
import { EraLayout } from './layouts/EraLayout';
import { Outlet } from 'react-router-dom';

/**
 * SUBJECT ROUTE SWITCH
 * Decides whether to show a specialized dashboard (like Multiplication)
 * or the standard study path map.
 */
import { TableDashboard } from '@features/progression/components/TableDashboard';

/**
 * SPECIALIZED SUBJECT WITCH
 * Ensures that subjects like Multiplication Tables get their high-performance
 * dashboards regardless of whether the user is in 'Quest' or 'Library' mode.
 */
const SpecializedSubjectView = ({ defaultView }: { defaultView: React.ReactNode }) => {
    const { subjectId } = useParams<{ subjectId: string }>();
    if (subjectId === 'multiplication-tables') return <TableDashboard />;
    return <>{defaultView}</>;
};

/**
 * APP ROUTER
 * The heart of My-Shinobi's navigation. 
 * Separates domains (Student, Admin) and handles deep-linking.
 */

/**
 * ROOT REDIRECT
 * Sends the student to their assigned starting layout.
 */
const RootRedirect = () => {
    const { isLoaded } = useProgression();

    if (!isLoaded) return null;

    return <Navigate to="/quest" replace />;
};

/**
 * STUDENT LAYOUT SWITCHER
 * Dynamic shell selection based on student preference.
 */
const StudentLayoutSwitcher = () => {
    const { stats } = useProgression();
    if (stats.preferredLayout === 'era') {
        return <EraLayout><Outlet /></EraLayout>;
    }
    return <UniversalNav />;
};

import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from '@features/admin/components/AdminDashboard';
import { ReviewQueue } from '@features/admin/components/ReviewQueue';
import { LogsExplorer } from '@features/admin/components/LogsExplorer';

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <LoadingGuard>
                <Routes>
                    {/* 0. PUBLIC ACCESS */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* 1. STUDENT DOMAIN (Wrapped in Dynamic Layout Switcher) */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <RoleGuard allowedRoles={['STUDENT', 'ADMIN']}>
                                    <StudentLayoutSwitcher />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    >
                        {/* Landing Redirect */}
                        <Route path="/" element={<RootRedirect />} />
                        <Route path="/dashboard" element={<RootRedirect />} />

                        {/* Quest Section */}
                        <Route path="/quest" element={<QuestDashboard />} />
                        <Route path="/quest/:subjectId" element={<SpecializedSubjectView defaultView={<SubjectMap />} />} />
                        <Route path="/quest/:subjectId/play" element={<QuestSessionUI />} />

                        {/* Syllabus Section */}
                        <Route path="/syllabus" element={<LibraryDashboard />} />
                        <Route path="/syllabus/:subjectId" element={<SpecializedSubjectView defaultView={<StudyEraSubjectView />} />} />
                        <Route path="/era" element={<Navigate to="/syllabus" replace />} />
                        <Route path="/library" element={<Navigate to="/syllabus" replace />} />

                        {/* Profile & History */}
                        <Route path="/profile" element={<HeroProfile />} />
                        <Route path="/history" element={<HistoryVault />} />

                        {/* Tables Mastery Feature Hub (Blue-Ninja Parity) */}
                        <Route path="/tables" element={<TablesMasteryDashboard />} />
                        <Route path="/tables/practice" element={<Navigate to="/quest/multiplication-tables/play" replace />} />
                        <Route path="/tables/parent" element={<ParentAnalyticsDashboard />} />
                    </Route>

                    {/* 2. ADMIN DOMAIN (Consolidated Desktop Layout) */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <RoleGuard allowedRoles={['ADMIN']} redirectTo="/dashboard">
                                    <AdminLayout />
                                </RoleGuard>
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="curriculum" element={<CurriculumManagement />} />
                        <Route path="curriculum/:bundleId" element={<CurriculumManagement />} />
                        <Route path="questions" element={<CurriculumManagement />} />
                        <Route path="questions/:bundleId" element={<CurriculumManagement />} />
                        <Route path="students" element={<UserManagement />} />
                        <Route path="review" element={<ReviewQueue />} />
                        <Route path="logs" element={<LogsExplorer />} />
                        <Route path="health" element={<Navigate to="/admin/curriculum/english-grade-7" replace />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </LoadingGuard>
        </Router>
    );
};
