import { Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import { ProtectedRoute } from "@/components/layout/protected-route";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { bootstrapSession } from "@/lib/auth";
import HomePage from "@/pages/home-page";
import NotFoundPage from "@/pages/not-found-page";

// Routes are loaded when they are first visited. The home page and the
// 404 are imported eagerly above: one is where most visits start, and the
// other has to be able to render when a chunk fails to load.
const OverviewPage = lazy(() => import("@/pages/workspace/overview-page"));
const ThreatIntelligencePage = lazy(
  () => import("@/pages/workspace/threat-intelligence-page"),
);
const DigitalRiskPage = lazy(
  () => import("@/pages/workspace/digital-risk-page"),
);
const FraudPage = lazy(() => import("@/pages/workspace/fraud-page"));
const ManagedXdrPage = lazy(() => import("@/pages/workspace/managed-xdr-page"));
const AttackSurfacePage = lazy(
  () => import("@/pages/workspace/attack-surface-page"),
);
const EmailProtectionPage = lazy(
  () => import("@/pages/workspace/email-protection-page"),
);
const IncidentsPage = lazy(() => import("@/pages/workspace/incidents-page"));
const SettingsPage = lazy(() => import("@/pages/workspace/settings-page"));
const DemoRequestsPage = lazy(
  () => import("@/pages/workspace/demo-requests-page"),
);
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password-page"));
const ResetPasswordPage = lazy(() => import("@/pages/reset-password-page"));
const ProductsPage = lazy(() => import("@/pages/products-page"));
const ProductPage = lazy(() => import("@/pages/product-page"));
const IndustriesPage = lazy(() => import("@/pages/industries-page"));
const IndustryDetailPage = lazy(() => import("@/pages/industry-detail-page"));
const SolutionsPage = lazy(() => import("@/pages/solutions-page"));
const SolutionDetailPage = lazy(() => import("@/pages/solution-detail-page"));
const ServicesPage = lazy(() => import("@/pages/services-page"));
const ServicePage = lazy(() => import("@/pages/service-page"));
const CompanyPage = lazy(() => import("@/pages/company-page"));
const ResourcesPage = lazy(() => import("@/pages/resources-page"));
const ContactPage = lazy(() => import("@/pages/contact-page"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const CareersPage = lazy(() => import("@/pages/careers-page"));
const PartnersPage = lazy(() => import("@/pages/partners-page"));
const TeamPage = lazy(() => import("@/pages/team-page"));
const SubscriptionsPage = lazy(() => import("@/pages/subscriptions-page"));
const LegalPage = lazy(() => import("@/pages/legal-page"));

/** Holds the layout's height while a route's chunk arrives, so the header
 * and footer do not jump. Deliberately blank — a spinner that appears for
 * 80ms on a local network is more distracting than nothing at all. */
function RouteFallback() {
  return <div className="min-h-[60vh]" aria-busy="true" />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  // The SOC workspace is the product, not a page about the product, so it
  // gets its own chrome (`WorkspaceShell`) instead of the marketing
  // header/footer that wraps every other route.
  const isWorkspace = pathname.startsWith("/workspace");

  useEffect(() => {
    // Exchanges the HttpOnly refresh cookie (if any) for an access token, so
    // a signed-in analyst reloading the page stays signed in. Safe to call
    // when signed out — see `@/lib/auth`.
    bootstrapSession();
  }, []);

  if (isWorkspace) {
    return (
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
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
              <Route
                path="threat-intelligence"
                element={<ThreatIntelligencePage />}
              />
              <Route path="digital-risk" element={<DigitalRiskPage />} />
              <Route path="fraud" element={<FraudPage />} />
              <Route path="managed-xdr" element={<ManagedXdrPage />} />
              <Route path="attack-surface" element={<AttackSurfacePage />} />
              <Route
                path="email-protection"
                element={<EmailProtectionPage />}
              />
              <Route path="incidents" element={<IncidentsPage />} />
              <Route path="demo-requests" element={<DemoRequestsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <SiteHeader />
      <main className="min-h-screen">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route
              path="/subscriptions/:slug"
              element={<SubscriptionsPage />}
            />
            <Route path="/pricing" element={<SubscriptionsPage />} />

            <Route path="/industries" element={<IndustriesPage />} />
            <Route path="/industries/:slug" element={<IndustryDetailPage />} />

            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/solutions/:slug" element={<SolutionDetailPage />} />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServicePage />} />

            <Route path="/company" element={<CompanyPage />} />
            <Route path="/company/team" element={<TeamPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/company/careers" element={<CareersPage />} />
            <Route path="/company/partners" element={<PartnersPage />} />
            <Route path="/company/contact" element={<ContactPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/talk-to-sales"
              element={<ContactPage isSales={true} />}
            />
            <Route path="/sign-in" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:slug" element={<ResourcesPage />} />
            <Route path="/blog" element={<ResourcesPage />} />
            <Route path="/blog/:slug" element={<ResourcesPage />} />

            <Route path="/privacy" element={<LegalPage type="privacy" />} />
            <Route path="/terms" element={<LegalPage type="terms" />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </ErrorBoundary>
  );
}
