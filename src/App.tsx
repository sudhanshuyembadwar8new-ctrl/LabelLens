import React from 'react';
import { InspectionProvider, useInspection } from './context/InspectionContext';
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { InspectorLoginPage } from './pages/InspectorLoginPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InspectionHistoryPage } from './pages/InspectionHistoryPage';
import { NewInspectionDetailsPage } from './pages/NewInspectionDetailsPage';
import { ProductImageUploadPage } from './pages/ProductImageUploadPage';
import { MockAnalysisPage } from './pages/MockAnalysisPage';
import { MockResultPage } from './pages/MockResultPage';
import { EvidenceReviewPage } from './pages/EvidenceReviewPage';
import { ReportPreviewPage } from './pages/ReportPreviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LegalMetrologyPage } from './pages/LegalMetrologyPage';
import { AdminInspectorDetailPage } from './pages/AdminInspectorDetailPage';

const AppRouter: React.FC = () => {
  const { activeRoute, routeParams, currentRole, isAuthenticated } = useInspection();

  // Root landing & Official Homepage
  if (activeRoute === '/' || activeRoute === '/home' || !activeRoute) {
    return <LandingPage />;
  }

  // Dedicated Legal Metrology Knowledge Base
  if (activeRoute === '/legal-metrology') {
    return <LegalMetrologyPage />;
  }

  // Authentication - Role Selection
  if (activeRoute === '/login') {
    return <RoleSelectionPage />;
  }

  // Authentication - Inspector Login
  if (activeRoute === '/login/inspector') {
    return <InspectorLoginPage />;
  }

  // Authentication - Admin Login
  if (activeRoute === '/login/admin') {
    return <AdminLoginPage />;
  }

  // Guard: Protect all internal routes from unauthenticated access
  if (!isAuthenticated) {
    return <RoleSelectionPage />;
  }

  // Guard: Restrict admin routes to ADMIN role only
  if (activeRoute.startsWith('/admin') && currentRole !== 'ADMIN') {
    return <DashboardPage />;
  }

  // Admin Supervisory Inspector Detail: /admin/inspectors/:id
  if (routeParams.inspectorId || activeRoute.startsWith('/admin/inspectors/')) {
    return <AdminInspectorDetailPage />;
  }

  // Admin Supervisory Dashboard & Ledger
  if (
    activeRoute === '/admin' ||
    activeRoute === '/admin/dashboard' ||
    activeRoute === '/admin/inspectors' ||
    activeRoute === '/admin/inspections' ||
    activeRoute === '/admin/activity' ||
    activeRoute === '/admin/reports'
  ) {
    return <AdminDashboardPage />;
  }

  // Settings (Inspector or Admin)
  if (activeRoute === '/settings' || activeRoute === '/admin/settings') {
    return <SettingsPage />;
  }

  // New Inspection - Details
  if (activeRoute === '/inspections/new') {
    return <NewInspectionDetailsPage />;
  }

  // Inspections History list
  if (activeRoute === '/inspections') {
    return <InspectionHistoryPage />;
  }

  // Parametric inspection routes:
  // e.g. /inspections/:id/upload
  if (routeParams.sub === 'upload') {
    return <ProductImageUploadPage />;
  }

  // e.g. /inspections/:id/analyzing
  if (routeParams.sub === 'analyzing') {
    return <MockAnalysisPage />;
  }

  // e.g. /inspections/:id/result
  if (routeParams.sub === 'result') {
    return <MockResultPage />;
  }

  // e.g. /inspections/:id/evidence
  if (routeParams.sub === 'evidence') {
    return <EvidenceReviewPage />;
  }

  // e.g. /inspections/:id/report
  if (routeParams.sub === 'report') {
    return <ReportPreviewPage />;
  }

  // Role-based fallback
  if (currentRole === 'ADMIN') {
    return <AdminDashboardPage />;
  }

  return <DashboardPage />;
};

export default function App() {
  return (
    <InspectionProvider>
      <AppRouter />
    </InspectionProvider>
  );
}
