/**
 * useAdminAuth — fetches the current admin session once and caches it.
 * Returns { user, loading } where user is null until resolved.
 */
import { useState, useEffect } from 'react';
import type { AdminRole } from '@/lib/adminPermissions';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
}

interface State {
  user: AdminUser | null;
  loading: boolean;
  error: string | null;
}

export function useAdminAuth(): State {
  const [state, setState] = useState<State>({ user: null, loading: true, error: null });

  useEffect(() => {
    fetch('/api/admin/auth/me', { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json().catch(() => ({}));
          setState({ user: null, loading: false, error: d.error ?? 'unauthenticated' });
          return;
        }
        const d = await r.json();
        setState({ user: d.user as AdminUser, loading: false, error: null });
      })
      .catch(() => setState({ user: null, loading: false, error: 'network_error' }));
  }, []);

  return state;
}
