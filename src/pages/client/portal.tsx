/**
 * /client/portal — Shell that renders ClientPortalLayout with Outlet
 * All /client/portal/* sub-routes render inside this layout.
 */
import { Navigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import ClientPortalLayout from '@/layouts/ClientPortalLayout';
import { DEMO_CUSTOMER } from '@/lib/client-portal-data';

export default function ClientPortalShell() {
  // TODO: Replace with real auth check when backend is connected
  const isLoggedIn = true;
  if (!isLoggedIn) return <Navigate to="/client/login" replace />;

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ClientPortalLayout customerName={DEMO_CUSTOMER.firstName} />
    </>
  );
}
