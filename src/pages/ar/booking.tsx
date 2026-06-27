import { Navigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
export default function ArBookingPage() {
  return (<><Helmet><meta name="robots" content="noindex, nofollow" /><link rel="canonical" href="https://artizonespa.com/booking" /></Helmet><Navigate to="/booking" replace /></>);
}
