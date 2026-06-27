/**
 * DELETE /api/scheduling/packages/:id
 * Soft-deletes (deactivates) a package. Hard delete only if no customer_packages exist.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import { packages, customerPackages } from '../../../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    // Check if any customer has purchased this package
    const sold = await db
      .select({ id: customerPackages.id })
      .from(customerPackages)
      .where(eq(customerPackages.packageId, id))
      .limit(1);

    if (sold.length > 0) {
      // Soft-delete: just deactivate
      await db.update(packages).set({ active: false }).where(eq(packages.id, id));
      return res.json({ ok: true, action: 'deactivated' });
    }

    await db.delete(packages).where(eq(packages.id, id));
    res.json({ ok: true, action: 'deleted' });
  } catch (err) {
    console.error('scheduling.packages.delete.error', err);
    res.status(500).json({ error: 'Failed to delete package' });
  }
}
