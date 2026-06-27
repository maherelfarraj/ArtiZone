/**
 * /client/set-password — No longer needed; redirect to login.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';

export default function ClientSetPassword() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/client/login', { replace: true }); }, [navigate]);
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
