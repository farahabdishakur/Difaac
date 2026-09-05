import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ErrorBoundary } from '@/components/layout/error-boundary'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import { bootstrapSession } from '@/lib/auth'
import OverviewPage from '@/pages/workspace/overview-page'
import ThreatIntelligencePage from '@/pages/workspace/threat-intelligence-page'
import DigitalRiskPage from '@/pages/workspace/digital-risk-page'
import FraudPage from '@/pages/workspace/fraud-page'
import ManagedXdrPage from '@/pages/workspace/managed-xdr-page'
import AttackSurfacePage from '@/pages/workspace/attack-surface-page'
import EmailProtectionPage from '@/pages/workspace/email-protection-page'
import IncidentsPage from '@/pages/workspace/incidents-page'
import SettingsPage from '@/pages/workspace/settings-page'
import DemoRequestsPage from '@/pages/workspace/demo-requests-page'
import ForgotPasswordPage from '@/pages/forgot-password-page'
import ResetPasswordPage from '@/pages/reset-password-page'
import HomePage from '@/pages/home-page'
import ProductsPage from '@/pages/products-page'
import ProductPage from '@/pages/product-page'
import IndustriesPage from '@/pages/industries-page'
import IndustryDetailPage from '@/pages/industry-detail-page'
import SolutionsPage from '@/pages/solutions-page'
import SolutionDetailPage from '@/pages/solution-detail-page'
import ServicesPage from '@/pages/services-page'
import ServicePage from '@/pages/service-page'
import CompanyPage from '@/pages/company-page'
import ResourcesPage from '@/pages/resources-page'
import ContactPage from '@/pages/contact-page'
import AuthPage from '@/pages/auth-page'
import CareersPage from '@/pages/careers-page'
import PartnersPage from '@/pages/partners-page'
import TeamPage from '@/pages/team-page'
import SubscriptionsPage from '@/pages/subscriptions-page'
import LegalPage from '@/pages/legal-page'
import NotFoundPage from '@/pages/not-found-page'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  // The SOC workspace is the product, not a page about the product, so it
  // gets its own chrome (`WorkspaceShell`) instead of the marketing
  // header/footer that wraps every other route.
  const isWorkspace = pathname.startsWith('/workspace')

  useEffect(() => {
    // Exchanges the HttpOnly refresh cookie (if any) for an access token, so
    // a signed-in analyst reloading the page stays signed in. Safe to call
    // when signed out — see `@/lib/auth`.
    bootstrapSession()
  }, [])

  if (isWorkspace) {
    return (
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <WorkspaceShell />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="threat-intelligence" element={<ThreatIntelligencePage />} />
            <Route path="digital-risk" element={<DigitalRiskPage />} />
            <Route path="fraud" element={<FraudPage />} />
            <Route path="managed-xdr" element={<ManagedXdrPage />} />
            <Route path="attack-surface" element={<AttackSurfacePage />} />
            <Route path="email-protection" element={<EmailProtectionPage />} />
            <Route path="incidents" element={<IncidentsPage />} />
            <Route path="demo-requests" element={<DemoRequestsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <SiteHeader />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Products & Subscriptions */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/subscriptions/:slug" element={<SubscriptionsPage />} />
          <Route path="/pricing" element={<SubscriptionsPage />} />
          
          {/* Industries */}
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:slug" element={<IndustryDetailPage />} />
          
          {/* Solutions */}
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/solutions/:slug" element={<SolutionDetailPage />} />

          {/* Services */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServicePage />} />

          {/* Company */}
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/company/team" element={<TeamPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/company/careers" element={<CareersPage />} />
          <Route path="/company/partners" element={<PartnersPage />} />
          <Route path="/company/contact" element={<ContactPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Sales & Auth */}
          <Route path="/talk-to-sales" element={<ContactPage isSales={true} />} />
          <Route path="/sign-in" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Resources & Blog */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:slug" element={<ResourcesPage />} />
          <Route path="/blog" element={<ResourcesPage />} />
          <Route path="/blog/:slug" element={<ResourcesPage />} />

          {/* Legal Pages */}
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </ErrorBoundary>
  )
}

