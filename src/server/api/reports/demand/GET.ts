/**
 * GET /api/reports/demand
 * Returns booking demand grouped by day_hour or service.
 *
 * Query params:
 *   from        ISO date (YYYY-MM-DD)
 *   to          ISO date (YYYY-MM-DD)
 *   group_by    'day_hour' | 'service' | 'channel'   (default: day_hour)
 *   status      'all' | 'pending' | 'confirmed' | 'declined' | 'no_show' | 'cancelled'  (default: all)
 *   channel     filter by source channel (optional)
 *
 * Response:
 *   { group_by, status, from, to, buckets: [{ bucket_key, requests }] }
 *   For day_hour: bucket_key = [dow, hour]  (dow: 0=Sun..6=Sat, Postgres convention)
 *   For service/channel: bucket_key = string label
 */
import type { Request, Response } from 'express';
import { db } from '../../../db/client.js';
import { sql } from 'drizzle-orm';

const VALID_GROUPINGS = ['day_hour', 'service', 'channel'] as const;
type Grouping = typeof VALID_GROUPINGS[number];

export default async function handler(req: Request, res: Response) {
  try {
    const from  = (req.query.from  as string) || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
    const to    = (req.query.to    as string) || new Date().toISOString().slice(0, 10);
    const rawGroup = req.query.group_by as string;
    const groupBy: Grouping = VALID_GROUPINGS.includes(rawGroup as Grouping) ? rawGroup as Grouping : 'day_hour';
    const statusFilter = req.query.status as string || 'all';
    const channelFilter = req.query.channel as string || '';

    // Build WHERE clauses
    const conditions: string[] = [
      `created_at >= '${from} 00:00:00'`,
      `created_at <  '${to} 23:59:59'`,
    ];
    if (statusFilter !== 'all') {
      const safe = statusFilter.replace(/[^a-z_]/g, '');
      conditions.push(`status = '${safe}'`);
    }
    if (channelFilter && channelFilter !== 'all') {
      const safe = channelFilter.replace(/[^a-z_]/g, '');
      conditions.push(`source = '${safe}'`);
    }
    const where = conditions.join(' AND ');

    let rows: { bucket_key: unknown; requests: number }[] = [];

    if (groupBy === 'day_hour') {
      // MySQL: DAYOFWEEK returns 1=Sun..7=Sat; convert to Postgres DOW (0=Sun..6=Sat) for front-end compat
      const result = await db.execute(sql.raw(`
        SELECT
          JSON_ARRAY(DAYOFWEEK(created_at) - 1, HOUR(created_at)) AS bucket_key,
          COUNT(*) AS requests
        FROM booking_requests
        WHERE ${where}
        GROUP BY DAYOFWEEK(created_at), HOUR(created_at)
        ORDER BY DAYOFWEEK(created_at), HOUR(created_at)
      `));
      const rawRows = result[0] as unknown as { bucket_key: string; requests: number | string }[];
      rows = rawRows.map(r => ({
        bucket_key: JSON.parse(r.bucket_key as string),
        requests: Number(r.requests),
      }));
    } else if (groupBy === 'service') {
      const result = await db.execute(sql.raw(`
        SELECT service AS bucket_key, COUNT(*) AS requests
        FROM booking_requests
        WHERE ${where}
        GROUP BY service
        ORDER BY requests DESC
      `));
      rows = (result[0] as unknown as { bucket_key: string; requests: number | string }[]).map(r => ({
        bucket_key: r.bucket_key,
        requests: Number(r.requests),
      }));
    } else {
      // channel
      const result = await db.execute(sql.raw(`
        SELECT source AS bucket_key, COUNT(*) AS requests
        FROM booking_requests
        WHERE ${where}
        GROUP BY source
        ORDER BY requests DESC
      `));
      rows = (result[0] as unknown as { bucket_key: string; requests: number | string }[]).map(r => ({
        bucket_key: r.bucket_key,
        requests: Number(r.requests),
      }));
    }

    return res.json({ group_by: groupBy, status: statusFilter, from, to, buckets: rows });
  } catch (err) {
    console.error('reports.demand.error', err);
    return res.status(500).json({ error: 'Failed to load demand report.' });
  }
}
