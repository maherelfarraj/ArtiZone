/**
 * GET /api/scheduling/packages
 * Returns all packages (active only by default; ?all=1 returns inactive too).
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { packages, services } from '../../../db/schema.js';
import { eq, asc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const showAll = req.query.all === '1';
    const rows = await db
      .select({
        id:            packages.id,
        name:          packages.name,
        description:   packages.description,
        category:      packages.category,
        totalSessions: packages.totalSessions,
        priceJod:      packages.priceJod,
        serviceId:     packages.serviceId,
        serviceName:   services.name,
        validityDays:  packages.validityDays,
        active:        packages.active,
        createdAt:     packages.createdAt,
      })
      .from(packages)
      .leftJoin(services, eq(packages.serviceId, services.id))
      .where(showAll ? undefined : eq(packages.active, true))
      .orderBy(asc(packages.category), asc(packages.name));

    res.json({ packages: rows });
  } catch (err) {
    console.error('scheduling.packages.get.error', err);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
}
