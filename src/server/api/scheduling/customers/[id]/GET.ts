/**
 * GET /api/scheduling/customers/:id
 * Returns a single customer with their appointment history and active packages.
 */
import type { Request, Response } from 'express';
import { db } from '../../../../db/client.js';
import {
  customers, appointments, customerPackages, packages,
} from '../../../../db/schema.js';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    // Appointment history — match by customerId OR by phone (legacy denormalised rows)
    const appts = await db
      .select({
        id:          appointments.id,
        date:        appointments.date,
        startTime:   appointments.startTime,
        serviceName: appointments.serviceName,
        status:      appointments.status,
        source:      appointments.source,
        createdAt:   appointments.createdAt,
      })
      .from(appointments)
      .where(eq(appointments.customerPhone, customer.phone))
      .orderBy(desc(appointments.date))
      .limit(50);

    // Active packages
    const pkgs = await db
      .select({
        id:                customerPackages.id,
        packageName:       customerPackages.packageName,
        totalSessions:     customerPackages.totalSessions,
        sessionsRemaining: customerPackages.sessionsRemaining,
        pricePaidJod:      customerPackages.pricePaidJod,
        purchasedAt:       customerPackages.purchasedAt,
        expiresAt:         customerPackages.expiresAt,
        status:            customerPackages.status,
        category:          packages.category,
      })
      .from(customerPackages)
      .leftJoin(packages, eq(customerPackages.packageId, packages.id))
      .where(eq(customerPackages.customerId, id))
      .orderBy(desc(customerPackages.purchasedAt));

    res.json({ customer, appointments: appts, packages: pkgs });
  } catch (err) {
    console.error('scheduling.customers.id.get.error', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}
