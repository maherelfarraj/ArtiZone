import { Navigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
export default function ArServicesPage() {
  return (<><Helmet><meta name="robots" content="noindex, nofollow" /><link rel="canonical" href="https://artizonespa.com/services" /></Helmet><Navigate to="/services" replace /></>);
}
