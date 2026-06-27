/**
 * SSR Route Tree — eager imports only.
 *
 * renderToString() cannot resolve React.lazy() — lazy components always
 * suspend during SSR and fall back to the Suspense spinner, producing an
 * empty shell with the wrong title/meta for crawlers.
 *
 * This file mirrors routes.tsx but uses static (eager) imports for every
 * public page so renderToString gets the real component tree.
 *
 * The client bundle (App.tsx / routes.tsx) keeps lazy() for code-splitting.
 * Admin, client-portal, PWA, and other non-indexed pages stay lazy here
 * because crawlers don't need them and they add bundle weight to the SSR path.
 */

import { RouteObject } from 'react-router-dom';

// ── Public / SEO pages — eager ────────────────────────────────────────────
import HomePage            from './pages/index';
import ProdNotFoundPage    from './pages/_404';
import ServicesPage        from './pages/services';
import MensServicesPage    from './pages/mens-services';
import PackagesPage        from './pages/packages';
import BeforeAfterPage     from './pages/before-after';
import AboutPage           from './pages/about';
import BookingPage         from './pages/booking';
import ContactPage         from './pages/contact';
import SpecialOffersPage   from './pages/special-offers';
import BlogPage            from './pages/Blog';
import BlogPostPage        from './pages/BlogPostPage';
import LoyaltyPage         from './pages/loyalty';
import EmbedBookingPage    from './pages/embed/booking';

// Service sub-pages
import FaceSkinCarePage       from './pages/services/face-skin-care';
import LaserHairRemovalPage   from './pages/services/laser-hair-removal';
import HairRemovalPage        from './pages/services/hair-removal';
import NailsFootCarePage      from './pages/services/nails-foot-care';
import BodySlimmingPage       from './pages/services/body-slimming';
import MensGroomingPage       from './pages/services/mens-grooming';

// Landing pages (highest SEO value — must render on server)
import LaserHairRemovalAmmanPage  from './pages/landing/laser-hair-removal-amman';
import LaserHairRemovalAmmanBPage from './pages/landing/laser-hair-removal-amman-b';
import BestFacialAmmanPage        from './pages/landing/best-facial-amman';
import BestFacialAmmanBPage       from './pages/landing/best-facial-amman-b';
import BodySlimmingAmmanPage      from './pages/landing/body-slimming-amman';
import BodySlimmingAmmanBPage     from './pages/landing/body-slimming-amman-b';
import NailSalonAmmanPage         from './pages/landing/nail-salon-amman';
import MensGroomingAmmanPage      from './pages/landing/mens-grooming-amman';
import SummerSkincareAmmanPage    from './pages/landing/summer-skincare-amman';
import WinterTreatmentsAmmanPage  from './pages/landing/winter-treatments-amman';
import HydraFacialAmmanPage       from './pages/landing/hydrafacial-amman';
import BridalPackageAmmanPage     from './pages/landing/bridal-package-amman';
import SkinTighteningAmmanPage    from './pages/landing/skin-tightening-amman';
import AcneScarRemovalAmmanPage   from './pages/landing/acne-scar-removal-amman';
import PopularPackagesPage        from './pages/landing/popular-packages';
import OffersDealsPage            from './pages/landing/offers-deals';
import PackagesAmmanPage          from './pages/landing/packages-amman';

// ── Non-indexed pages — lazy is fine for SSR (crawlers don't need them) ───
// Admin, client portal, PWA screens, brochure, install page are intentionally
// excluded from SSR rendering. They carry noindex and don't need server HTML.

export const ssrRoutes: RouteObject[] = [
  { path: '/',                        element: <HomePage /> },
  { path: '/services',                element: <ServicesPage /> },
  { path: '/mens-services',           element: <MensServicesPage /> },
  { path: '/packages',                element: <PackagesPage /> },
  { path: '/before-after',            element: <BeforeAfterPage /> },
  { path: '/about',                   element: <AboutPage /> },
  { path: '/booking',                 element: <BookingPage /> },
  { path: '/contact',                 element: <ContactPage /> },
  { path: '/special-offers',          element: <SpecialOffersPage /> },
  { path: '/blog',                    element: <BlogPage /> },
  { path: '/blog/:slug',              element: <BlogPostPage /> },
  { path: '/loyalty',                 element: <LoyaltyPage /> },

  // Service sub-pages
  { path: '/services/face-skin-care',       element: <FaceSkinCarePage /> },
  { path: '/services/laser-hair-removal',   element: <LaserHairRemovalPage /> },
  { path: '/services/hair-removal',         element: <HairRemovalPage /> },
  { path: '/services/nails-foot-care',      element: <NailsFootCarePage /> },
  { path: '/services/body-slimming',        element: <BodySlimmingPage /> },
  { path: '/services/mens-grooming',        element: <MensGroomingPage /> },

  // Landing pages
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
  { path: '/packages-amman',                element: <PackagesAmmanPage /> },
  { path: '/embed/booking',                 element: <EmbedBookingPage /> },

  // Catch-all
  { path: '*', element: <ProdNotFoundPage /> },
];
