/**
 * POST /api/scheduling/customers/:id/packages/:pkgId/redeem
 * Redeems one session from a customer's package.
 * Optionally links to an appointment via body.appointmentId.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../../../db/client.js';
import { customerPackages, packageRedemptions } from '../../../../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const customerId = Number(req.params.id);
    const pkgId = Number(req.params.pkgId);
    if (!customerId || !pkgId) return res.status(400).json({ error: 'Invalid ids' });

    const { appointmentId, redeemedBy, notes } = req.body as {
      appointmentId?: number;
      redeemedBy?: string;
      notes?: string;
    };

    // Fetch the customer package
    const [cp] = await db
      .select()
      .from(customerPackages)
      .where(eq(customerPackages.id, pkgId))
      .limit(1);

    if (!cp) return res.status(404).json({ error: 'Customer package not found' });
    if (cp.customerId !== customerId) return res.status(403).json({ error: 'Package does not belong to this customer' });
    if (cp.status !== 'active') return res.status(400).json({ error: `Package is ${cp.status}` });
    if (cp.sessionsRemaining <= 0) return res.status(400).json({ error: 'No sessions remaining' });

    // Check expiry
    if (cp.expiresAt && new Date() > new Date(cp.expiresAt)) {
      await db.update(customerPackages).set({ status: 'expired' }).where(eq(customerPackages.id, pkgId));
      return res.status(400).json({ error: 'Package has expired' });
    }

    const newRemaining = cp.sessionsRemaining - 1;
    const newStatus = newRemaining === 0 ? 'completed' : 'active';

    // Decrement sessions
    await db.update(customerPackages).set({
      sessionsRemaining: newRemaining,
      status: newStatus,
    }).where(eq(customerPackages.id, pkgId));

    // Write redemption record
    await db.insert(packageRedemptions).values({
      customerPackageId: pkgId,
      appointmentId: appointmentId ? Number(appointmentId) : null,
      redeemedBy: redeemedBy ?? null,
      notes: notes ?? null,
    });

    res.json({ ok: true, sessionsRemaining: newRemaining, packageStatus: newStatus });
  } catch (err) {
    console.error('scheduling.packages.redeem.error', err);
    res.status(500).json({ error: 'Failed to redeem session' });
  }
}
