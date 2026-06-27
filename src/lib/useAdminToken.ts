/**
 * useAdminToken — fetches the admin secret from the backend once per session.
 * All admin pages use this to authenticate API calls.
 */
import { useState, useEffect } from 'react';

let cached: string | null = null;

export function useAdminToken() {
  const [token, setToken] = useState<string>(cached ?? '');
  const [ready, setReady] = useState<boolean>(cached !== null);

  useEffect(() => {
    if (cached !== null) { setToken(cached); setReady(true); return; }
    fetch('/api/admin/token')
      .then(r => r.json())
      .then(d => {
        cached = d.token ?? '';
        setToken(cached!);
        setReady(true);
      })
      .catch(() => { cached = ''; setReady(true); });
  }, []);

  return { token, ready };
}
