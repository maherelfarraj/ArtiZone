/**
 * Role-based access control for the admin panel.
 *
 * Roles:
 *   superadmin — full access to everything
 *   staff      — limited to day-to-day operational pages
 *
 * To restrict a new route, add it to SUPERADMIN_ONLY_ROUTES.
 */

export type AdminRole = 'superadmin' | 'staff';

/** Routes that ONLY superadmins may visit. Staff are redirected to /admin. */
export const SUPERADMIN_ONLY_ROUTES: string[] = [
  '/admin/users',
  '/admin/newsletter',
  '/admin/reviews',
  '/admin/ab-results',
  '/admin/loyalty',
];

/** Returns true if the given role is allowed to visit the given pathname. */
export function canAccess(role: AdminRole, pathname: string): boolean {
  if (role === 'superadmin') return true;
  return !SUPERADMIN_ONLY_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
}

/** Nav items visible to each role */
export const ROLE_NAV_LABELS: Record<AdminRole, string[]> = {
  superadmin: [
    'Overview', 'Bookings', 'Scheduling', 'Newsletter', 'Reviews',
    'Review Requests', 'Support', 'A/B Tests', 'Loyalty', 'Users',
  ],
  staff: [
    'Overview', 'Bookings', 'Scheduling', 'Review Requests', 'Support',
  ],
};
