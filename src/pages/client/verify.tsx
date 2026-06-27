/**
 * /client/verify — OTP step removed; redirect to signup.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';

export default function ClientVerify() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/client/signup', { replace: true }); }, [navigate]);
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
