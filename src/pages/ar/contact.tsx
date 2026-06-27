import { Navigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
export default function ArContactPage() {
  return (<><Helmet><meta name="robots" content="noindex, nofollow" /><link rel="canonical" href="https://artizonespa.com/contact" /></Helmet><Navigate to="/contact" replace /></>);
}
