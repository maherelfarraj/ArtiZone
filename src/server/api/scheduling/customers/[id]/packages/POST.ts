/**
 * POST /api/scheduling/customers/:id/packages
 * Sells a package bundle to a customer.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../../db/client.js';
import { customerPackages, packages } from '../../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const customerId = Number(req.params.id);
    if (!customerId) return res.status(400).json({ error: 'Invalid customer id' });

    const { packageId, pricePaidJod, soldBy, notes } = req.body as {
      packageId: number;
      pricePaidJod?: number;
      soldBy?: string;
      notes?: string;
    };

    if (!packageId) return res.status(400).json({ error: 'packageId is required' });

    // Fetch package details
    const [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, Number(packageId)))
      .limit(1);

    if (!pkg) return res.status(404).json({ error: 'Package not found' });
    if (!pkg.active) return res.status(400).json({ error: 'Package is no longer active' });

    // Compute expiry
    let expiresAt: Date | null = null;
    if (pkg.validityDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + pkg.validityDays);
    }

    const result = await db.insert(customerPackages).values({
      customerId,
      packageId: pkg.id,
      packageName: pkg.name,
      totalSessions: pkg.totalSessions,
      sessionsRemaining: pkg.totalSessions,
      pricePaidJod: pricePaidJod !== undefined ? Number(pricePaidJod) : pkg.priceJod,
      expiresAt,
      status: 'active',
      soldBy: soldBy ?? null,
      notes: notes ?? null,
    });

    const id = (result[0] as unknown as { insertId: number }).insertId;
    res.status(201).json({ ok: true, id, sessionsRemaining: pkg.totalSessions });
  } catch (err) {
    console.error('scheduling.customers.packages.post.error', err);
    res.status(500).json({ error: 'Failed to sell package' });
  }
}
