import { Navigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
export default function ArBlogPage() {
  return (<><Helmet><meta name="robots" content="noindex, nofollow" /><link rel="canonical" href="https://artizonespa.com/blog" /></Helmet><Navigate to="/blog" replace /></>);
}
