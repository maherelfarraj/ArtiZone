/**
 * useClientAuth — lightweight client portal auth state.
 * Fetches /api/client/me on mount; exposes user + helpers.
 */
import { useState, useEffect, useCallback } from 'react';

export interface ClientUser {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  area: string;
  address?: string;
  dob?: string;
}

interface AuthState {
  user: ClientUser | null;
  loading: boolean;
  refetch: () => void;
  logout: () => Promise<void>;
}

export function useClientAuth(): AuthState {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/client/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        // API returns { user: {...} }
        setUser(data.user ?? data);
      } else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const logout = useCallback(async () => {
    await fetch('/api/client/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  return { user, loading, refetch: fetchMe, logout };
}
