import { lazy } from 'react';
import HomePage from './pages/index';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';



const NotFoundPage = ProdNotFoundPage;

const ServicesPage = lazy(() => import('./pages/services'));
const MensServicesPage = lazy(() => import('./pages/mens-services'));
const PackagesPage = lazy(() => import('./pages/packages'));
const BeforeAfterPage = lazy(() => import('./pages/before-after'));
const AboutPage = lazy(() => import('./pages/about'));
const BookingPage = lazy(() => import('./pages/booking'));
const ContactPage = lazy(() => import('./pages/contact'));
const FaceSkinCarePage = lazy(() => import('./pages/services/face-skin-care'));
const LaserHairRemovalPage = lazy(() => import('./pages/services/laser-hair-removal'));
const HairRemovalPage = lazy(() => import('./pages/services/hair-removal'));
const NailsFootCarePage = lazy(() => import('./pages/services/nails-foot-care'));
const BodySlimmingPage = lazy(() => import('./pages/services/body-slimming'));
const MensGroomingPage = lazy(() => import('./pages/services/mens-grooming'));
const SpecialOffersPage = lazy(() => import('./pages/special-offers'));
const NewsletterAnalyticsPage = lazy(() => import('./pages/newsletter-analytics'));
const ReviewsAdminPage = lazy(() => import('./pages/reviews-admin'));
const AdminOverviewPage = lazy(() => import('./pages/admin/index'));
const AdminNewsletterPage = lazy(() => import('./pages/admin/newsletter'));
const AdminReviewsPage = lazy(() => import('./pages/admin/reviews'));
const AdminReviewRequestsPage = lazy(() => import('./pages/admin/review-requests'));
const AdminSupportPage = lazy(() => import('./pages/admin/support'));
const LaserHairRemovalAmmanPage = lazy(() => import('./pages/landing/laser-hair-removal-amman'));
const LaserHairRemovalAmmanBPage = lazy(() => import('./pages/landing/laser-hair-removal-amman-b'));
const BestFacialAmmanPage        = lazy(() => import('./pages/landing/best-facial-amman'));
const BestFacialAmmanBPage       = lazy(() => import('./pages/landing/best-facial-amman-b'));
const BodySlimmingAmmanPage      = lazy(() => import('./pages/landing/body-slimming-amman'));
const BodySlimmingAmmanBPage     = lazy(() => import('./pages/landing/body-slimming-amman-b'));
const NailSalonAmmanPage         = lazy(() => import('./pages/landing/nail-salon-amman'));
const MensGroomingAmmanPage      = lazy(() => import('./pages/landing/mens-grooming-amman'));
const SummerSkincareAmmanPage    = lazy(() => import('./pages/landing/summer-skincare-amman'));
const WinterTreatmentsAmmanPage  = lazy(() => import('./pages/landing/winter-treatments-amman'));
const HydraFacialAmmanPage       = lazy(() => import('./pages/landing/hydrafacial-amman'));
const BridalPackageAmmanPage     = lazy(() => import('./pages/landing/bridal-package-amman'));
const SkinTighteningAmmanPage    = lazy(() => import('./pages/landing/skin-tightening-amman'));
const AcneScarRemovalAmmanPage   = lazy(() => import('./pages/landing/acne-scar-removal-amman'));
const PopularPackagesPage        = lazy(() => import('./pages/landing/popular-packages'));
const OffersDealsPage            = lazy(() => import('./pages/landing/offers-deals'));
const PackagesAmmanPage          = lazy(() => import('./pages/landing/packages-amman'));
const ClientSignupPage           = lazy(() => import('./pages/client/signup'));
const ClientLoginPage            = lazy(() => import('./pages/client/login'));
const ClientDashboardPage        = lazy(() => import('./pages/client/dashboard'));
const ClientPortalShell          = lazy(() => import('./pages/client/portal'));
const ClientPortalDashboard      = lazy(() => import('./pages/client/portal/index'));
const ClientPortalBookings       = lazy(() => import('./pages/client/portal/bookings'));
const ClientPortalRewards        = lazy(() => import('./pages/client/portal/rewards'));
const ClientPortalPackages       = lazy(() => import('./pages/client/portal/packages'));
const ClientPortalRefer          = lazy(() => import('./pages/client/portal/refer'));
const ClientPortalProfile        = lazy(() => import('./pages/client/portal/profile'));
const AbResultsPage              = lazy(() => import('./pages/admin/ab-results'));
const AdminBookingsPage          = lazy(() => import('./pages/admin/bookings'));
const AdminSchedulingPage        = lazy(() => import('./pages/admin/scheduling'));
const AdminUsersPage             = lazy(() => import('./pages/admin/users'));
const AdminSetupPage             = lazy(() => import('./pages/admin/setup'));
const AdminLoginPage             = lazy(() => import('./pages/admin/login'));
const AdminLoyaltyPage           = lazy(() => import('./pages/admin/loyalty'));
const AdminLoyaltyClientPage     = lazy(() => import('./pages/admin/loyalty-client'));
const LoyaltyPage                = lazy(() => import('./pages/loyalty'));
const MobileLandingPage          = lazy(() => import('./pages/mobile-landing'));
const BlogPage = lazy(() => import('./pages/Blog'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const BrochurePage = lazy(() => import('./pages/Brochure'));
const EmbedBookingPage = lazy(() => import('./pages/embed/booking'));
const ReviewsPage = lazy(() => import('./pages/reviews'));
const LeaveAReviewPage = lazy(() => import('./pages/leave-a-review'));

export const routes: RouteObject[] = [
  { path: '/',                        element: <HomePage /> },
  { path: '/services',                element: <ServicesPage /> },
  { path: '/mens-services',           element: <MensServicesPage /> },
  { path: '/packages',                element: <PackagesPage /> },
  { path: '/before-after',            element: <BeforeAfterPage /> },
  { path: '/about',                   element: <AboutPage /> },
  { path: '/booking',                 element: <BookingPage /> },
  { path: '/contact',                 element: <ContactPage /> },
  { path: '/special-offers',          element: <SpecialOffersPage /> },
  { path: '/newsletter-analytics',    element: <NewsletterAnalyticsPage /> },
  { path: '/reviews-admin',           element: <ReviewsAdminPage /> },
  { path: '/admin',                   element: <AdminOverviewPage /> },
  { path: '/admin/newsletter',        element: <AdminNewsletterPage /> },
  { path: '/admin/reviews',           element: <AdminReviewsPage /> },
  { path: '/admin/review-requests',   element: <AdminReviewRequestsPage /> },
  { path: '/admin/support',           element: <AdminSupportPage /> },
  { path: '/blog',                    element: <BlogPage /> },
  { path: '/blog/:slug',              element: <BlogPostPage /> },
  { path: '/services/face-skin-care',       element: <FaceSkinCarePage /> },
  { path: '/services/laser-hair-removal',   element: <LaserHairRemovalPage /> },
  { path: '/services/hair-removal',         element: <HairRemovalPage /> },
  { path: '/services/nails-foot-care',      element: <NailsFootCarePage /> },
  { path: '/services/body-slimming',        element: <BodySlimmingPage /> },
  { path: '/services/mens-grooming',        element: <MensGroomingPage /> },
  { path: '/laser-hair-removal-amman',      element: <LaserHairRemovalAmmanPage /> },
  { path: '/laser-hair-removal-amman-b',    element: <LaserHairRemovalAmmanBPage /> },
  { path: '/best-facial-amman',             element: <BestFacialAmmanPage /> },
  { path: '/best-facial-amman-b',           element: <BestFacialAmmanBPage /> },
  { path: '/body-slimming-amman',           element: <BodySlimmingAmmanPage /> },
  { path: '/body-slimming-amman-b',         element: <BodySlimmingAmmanBPage /> },
  { path: '/nail-salon-amman',              element: <NailSalonAmmanPage /> },
  { path: '/mens-grooming-amman',           element: <MensGroomingAmmanPage /> },
  { path: '/summer-skincare-amman',         element: <SummerSkincareAmmanPage /> },
  { path: '/winter-treatments-amman',       element: <WinterTreatmentsAmmanPage /> },
  { path: '/hydrafacial-amman',             element: <HydraFacialAmmanPage /> },
  { path: '/bridal-package-amman',          element: <BridalPackageAmmanPage /> },
  { path: '/skin-tightening-amman',         element: <SkinTighteningAmmanPage /> },
  { path: '/acne-scar-removal-amman',       element: <AcneScarRemovalAmmanPage /> },
  { path: '/popular-packages',              element: <PopularPackagesPage /> },
  { path: '/offers-deals',                  element: <OffersDealsPage /> },
  /* ── Client portal (legacy) ─────────────────────────────────────── */
  { path: '/client/signup',                 element: <ClientSignupPage /> },
  { path: '/client/login',                  element: <ClientLoginPage /> },
  { path: '/client/dashboard',              element: <ClientDashboardPage /> },
  /* ── Client portal v2 (multi-page) ──────────────────────────────── */
  {
    path: '/client/portal',
    element: <ClientPortalShell />,
    children: [
      { index: true,           element: <ClientPortalDashboard /> },
      { path: 'bookings',      element: <ClientPortalBookings /> },
      { path: 'rewards',       element: <ClientPortalRewards /> },
      { path: 'packages',      element: <ClientPortalPackages /> },
      { path: 'refer',         element: <ClientPortalRefer /> },
      { path: 'profile',       element: <ClientPortalProfile /> },
    ],
  },
  { path: '/packages-amman',                element: <PackagesAmmanPage /> },
  { path: '/admin/ab-results',              element: <AbResultsPage /> },
  { path: '/admin/bookings',               element: <AdminBookingsPage /> },
  { path: '/admin/scheduling',             element: <AdminSchedulingPage /> },
  { path: '/admin/users',                  element: <AdminUsersPage /> },
  { path: '/admin/setup',                  element: <AdminSetupPage /> },
  { path: '/admin/login',                  element: <AdminLoginPage /> },
  { path: '/admin/loyalty',               element: <AdminLoyaltyPage /> },
  { path: '/admin/loyalty/:id',           element: <AdminLoyaltyClientPage /> },
  { path: '/loyalty',                     element: <LoyaltyPage /> },
  { path: '/mobile-landing',               element: <MobileLandingPage /> },
  { path: '/brochure',                      element: <BrochurePage /> },
  { path: '/embed/booking',                 element: <EmbedBookingPage /> },
  { path: '/reviews',                       element: <ReviewsPage /> },
  { path: '/leave-a-review',               element: <LeaveAReviewPage /> },
  { path: '*',         element: <NotFoundPage /> },
];

// Types for type-safe navigation
export type Path = '/' | '/services' | '/mens-services' | '/packages' | '/before-after' | '/about' | '/booking' | '/contact';

export type Params = Record<string, string | undefined>;
