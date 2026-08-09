#!/usr/bin/env node

/**
 * ARTIZONE draft catalogue importer
 *
 * Safe defaults:
 * - DRY RUN unless --apply is supplied
 * - never updates an existing service/package
 * - all newly inserted rows are inactive / non-bookable / non-featured where supported
 * - unknown price and duration use 0 only when the DB schema requires a non-null integer sentinel
 * - no staff assignments are created
 * - no public activation is performed
 *
 * Environment:
 *   DATABASE_URL=mysql://user:pass@host:3306/database
 * or
 *   MYSQL_URL=mysql://user:pass@host:3306/database
 * or
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *
 * Usage:
 *   npm run catalog:dry-run
 *   npm run catalog:apply
 *   node scripts/import-artizone-catalog.mjs --apply --services-only
 *   node scripts/import-artizone-catalog.mjs --apply --packages-only
 */

import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const SERVICES_ONLY = args.has('--services-only');
const PACKAGES_ONLY = args.has('--packages-only');

if (SERVICES_ONLY && PACKAGES_ONLY) {
  throw new Error('Choose only one of --services-only or --packages-only.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const catalogPath = path.resolve(__dirname, '../data/artizone-catalog.json');
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'));

function connectionConfig() {
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL;
  if (url) return url;

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;
  if (!host || !user || !database) {
    throw new Error(
      'Database connection missing. Set DATABASE_URL/MYSQL_URL or DB_HOST + DB_USER + DB_NAME (+ DB_PASSWORD/DB_PORT).',
    );
  }

  return {
    host,
    port: Number(process.env.DB_PORT || 3306),
    user,
    password: process.env.DB_PASSWORD || '',
    database,
    charset: 'utf8mb4',
  };
}

const qid = (name) => `\`${String(name).replaceAll('`', '``')}\``;
const normalizeName = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
const sumSessions = (items = []) => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

async function getCurrentDatabase(conn) {
  const [rows] = await conn.query('SELECT DATABASE() AS db');
  const db = rows?.[0]?.db;
  if (!db) throw new Error('No MySQL database is selected.');
  return db;
}

async function getTableColumns(conn, database, table) {
  const [rows] = await conn.execute(
    `SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, DATA_TYPE
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION`,
    [database, table],
  );

  return new Map(
    rows.map((row) => [
      row.COLUMN_NAME,
      {
        name: row.COLUMN_NAME,
        nullable: row.IS_NULLABLE === 'YES',
        defaultValue: row.COLUMN_DEFAULT,
        dataType: row.DATA_TYPE,
      },
    ]),
  );
}

async function tableExists(conn, database, table) {
  const [rows] = await conn.execute(
    `SELECT 1
       FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      LIMIT 1`,
    [database, table],
  );
  return rows.length > 0;
}

function putIfColumn(values, columns, column, value) {
  if (columns.has(column)) values[column] = value;
}

function requiredNumericSentinel(columns, column, preferred = 0) {
  const info = columns.get(column);
  if (!info) return undefined;
  if (info.nullable) return null;
  if (info.defaultValue !== null && info.defaultValue !== undefined) return undefined;
  return preferred;
}

async function findExistingByNameOrSlug(conn, table, columns, name, slug) {
  const predicates = ['LOWER(TRIM(name)) = ?'];
  const params = [normalizeName(name)];

  if (columns.has('slug') && slug) {
    predicates.push('slug = ?');
    params.push(slug);
  }

  const [rows] = await conn.execute(
    `SELECT * FROM ${qid(table)} WHERE ${predicates.join(' OR ')} LIMIT 1`,
    params,
  );
  return rows[0] || null;
}

function buildServiceInsert(service, columns) {
  const values = {};

  putIfColumn(values, columns, 'name', service.name);
  putIfColumn(values, columns, 'slug', service.slug);
  putIfColumn(values, columns, 'category', service.category);
  putIfColumn(values, columns, 'description', service.description || null);
  putIfColumn(values, columns, 'active', false);
  putIfColumn(values, columns, 'bookable_online', false);
  putIfColumn(values, columns, 'featured', false);
  putIfColumn(values, columns, 'loyalty_points', null);
  putIfColumn(values, columns, 'default_staff_id', null);
  putIfColumn(values, columns, 'required_capability', null);
  putIfColumn(values, columns, 'buffer_min', 0);

  for (const durationColumn of ['duration_min', 'duration_minutes', 'duration']) {
    if (columns.has(durationColumn)) {
      const sentinel = requiredNumericSentinel(columns, durationColumn, 0);
      if (sentinel !== undefined) values[durationColumn] = sentinel;
      break;
    }
  }

  for (const priceColumn of ['price_fils', 'price', 'price_jod']) {
    if (columns.has(priceColumn)) {
      const sentinel = requiredNumericSentinel(columns, priceColumn, 0);
      if (sentinel !== undefined) values[priceColumn] = sentinel;
      break;
    }
  }

  return values;
}

function buildPackageInsert(pkg, columns) {
  const values = {};
  const totalSessions = sumSessions(pkg.items);

  putIfColumn(values, columns, 'name', pkg.name);
  putIfColumn(values, columns, 'slug', pkg.slug);
  putIfColumn(values, columns, 'description', pkg.description || null);
  putIfColumn(values, columns, 'category', pkg.category || 'other');
  putIfColumn(values, columns, 'total_sessions', totalSessions);
  putIfColumn(values, columns, 'validity_days', 0);
  putIfColumn(values, columns, 'active', false);
  putIfColumn(values, columns, 'bookable_online', false);
  putIfColumn(values, columns, 'featured', false);
  putIfColumn(values, columns, 'service_id', null);
  putIfColumn(values, columns, 'regular_value_fils', null);
  putIfColumn(values, columns, 'loyalty_eligible', false);
  putIfColumn(values, columns, 'campaign_eligible', false);

  for (const priceColumn of ['price_fils', 'price_jod', 'price']) {
    if (columns.has(priceColumn)) {
      const sentinel = requiredNumericSentinel(columns, priceColumn, 0);
      if (sentinel !== undefined) values[priceColumn] = sentinel;
      break;
    }
  }

  return values;
}

async function insertObject(conn, table, values) {
  const entries = Object.entries(values);
  if (!entries.length) throw new Error(`No compatible columns found for ${table}.`);

  const sql = `INSERT INTO ${qid(table)} (${entries.map(([key]) => qid(key)).join(', ')}) VALUES (${entries.map(() => '?').join(', ')})`;
  const [result] = await conn.execute(sql, entries.map(([, value]) => value));
  return Number(result.insertId || 0);
}

async function loadServiceIdMap(conn, serviceColumns) {
  const fields = ['id', 'name'];
  if (serviceColumns.has('slug')) fields.push('slug');
  const [rows] = await conn.query(`SELECT ${fields.map(qid).join(', ')} FROM services`);

  const bySlug = new Map();
  const byName = new Map();
  for (const row of rows) {
    if (row.slug) bySlug.set(String(row.slug), Number(row.id));
    byName.set(normalizeName(row.name), Number(row.id));
  }
  return { bySlug, byName };
}

async function detectPackageItemsTable(conn, database) {
  const candidates = ['package_services', 'package_items', 'package_service_items'];
  for (const table of candidates) {
    if (!(await tableExists(conn, database, table))) continue;
    const columns = await getTableColumns(conn, database, table);
    const hasPackage = columns.has('package_id') || columns.has('packageId');
    const hasService = columns.has('service_id') || columns.has('serviceId');
    const hasQuantity = columns.has('quantity') || columns.has('sessions') || columns.has('session_count');
    if (hasPackage && hasService && hasQuantity) return { table, columns };
  }
  return null;
}

function relationColumns(columns) {
  const pick = (choices) => choices.find((name) => columns.has(name));
  return {
    packageId: pick(['package_id', 'packageId']),
    serviceId: pick(['service_id', 'serviceId']),
    quantity: pick(['quantity', 'sessions', 'session_count']),
  };
}

async function relationExists(conn, table, cols, packageId, serviceId) {
  const [rows] = await conn.execute(
    `SELECT 1 FROM ${qid(table)} WHERE ${qid(cols.packageId)} = ? AND ${qid(cols.serviceId)} = ? LIMIT 1`,
    [packageId, serviceId],
  );
  return rows.length > 0;
}

async function main() {
  console.log(`ARTIZONE catalogue importer — ${APPLY ? 'APPLY MODE' : 'DRY RUN'}`);
  if (!APPLY) console.log('No database rows will be changed. Add --apply to commit inserts.');

  const conn = await mysql.createConnection(connectionConfig());
  const report = {
    existingServices: 0,
    newDraftServices: 0,
    duplicateServicesSkipped: 0,
    existingPackages: 0,
    newDraftPackages: 0,
    duplicatePackagesSkipped: 0,
    packageItemsPlanned: 0,
    packageItemsInserted: 0,
    packageItemsSkipped: 0,
    servicesRequiringPrice: [],
    servicesRequiringDuration: [],
    servicesRequiringStaff: [],
    packagesRequiringPrice: [],
    warnings: [],
  };

  try {
    const database = await getCurrentDatabase(conn);
    console.log(`Database: ${database}`);

    if (!(await tableExists(conn, database, 'services'))) {
      throw new Error('Required table `services` was not found.');
    }

    const serviceColumns = await getTableColumns(conn, database, 'services');
    const hasPackages = await tableExists(conn, database, 'packages');
    const packageColumns = hasPackages ? await getTableColumns(conn, database, 'packages') : new Map();

    const [[serviceCount]] = await conn.query('SELECT COUNT(*) AS count FROM services');
    report.existingServices = Number(serviceCount.count || 0);
    if (hasPackages) {
      const [[packageCount]] = await conn.query('SELECT COUNT(*) AS count FROM packages');
      report.existingPackages = Number(packageCount.count || 0);
    }

    if (APPLY) await conn.beginTransaction();

    if (!PACKAGES_ONLY) {
      for (const service of catalog.services) {
        const existing = await findExistingByNameOrSlug(conn, 'services', serviceColumns, service.name, service.slug);
        if (existing) {
          report.duplicateServicesSkipped += 1;
          console.log(`SKIP service: ${service.name}`);
          continue;
        }

        report.servicesRequiringPrice.push(service.name);
        report.servicesRequiringDuration.push(service.name);
        report.servicesRequiringStaff.push(service.name);

        const values = buildServiceInsert(service, serviceColumns);
        if (APPLY) {
          await insertObject(conn, 'services', values);
          console.log(`INSERT service draft: ${service.name}`);
        } else {
          console.log(`WOULD INSERT service draft: ${service.name}`);
        }
        report.newDraftServices += 1;
      }
    }

    if (!SERVICES_ONLY) {
      if (!hasPackages) {
        report.warnings.push('Table `packages` does not exist; package import was skipped.');
      } else {
        const serviceIds = await loadServiceIdMap(conn, serviceColumns);
        const relation = await detectPackageItemsTable(conn, database);
        const relationCols = relation ? relationColumns(relation.columns) : null;

        if (!relation) {
          report.warnings.push(
            'No supported package-item relation table found. Package catalogue rows can still be inserted, but included-service quantities will remain in data/artizone-catalog.json until the app schema supports them.',
          );
        }

        for (const pkg of catalog.packages) {
          const existing = await findExistingByNameOrSlug(conn, 'packages', packageColumns, pkg.name, pkg.slug);
          if (existing) {
            report.duplicatePackagesSkipped += 1;
            console.log(`SKIP package: ${pkg.name}`);
            continue;
          }

          report.packagesRequiringPrice.push(pkg.name);
          const values = buildPackageInsert(pkg, packageColumns);
          let packageId = 0;
          if (APPLY) {
            packageId = await insertObject(conn, 'packages', values);
            console.log(`INSERT package draft: ${pkg.name}`);
          } else {
            console.log(`WOULD INSERT package draft: ${pkg.name}`);
          }
          report.newDraftPackages += 1;

          for (const item of pkg.items || []) {
            report.packageItemsPlanned += 1;
            const serviceId = serviceIds.bySlug.get(item.serviceSlug);
            if (!serviceId) {
              report.packageItemsSkipped += 1;
              report.warnings.push(`Package ${pkg.name}: service slug ${item.serviceSlug} was not found in the current DB.`);
              continue;
            }

            if (!relation || !relationCols?.packageId || !relationCols?.serviceId || !relationCols?.quantity) {
              report.packageItemsSkipped += 1;
              continue;
            }

            if (APPLY) {
              if (await relationExists(conn, relation.table, relationCols, packageId, serviceId)) {
                report.packageItemsSkipped += 1;
                continue;
              }
              await insertObject(conn, relation.table, {
                [relationCols.packageId]: packageId,
                [relationCols.serviceId]: serviceId,
                [relationCols.quantity]: Number(item.quantity),
              });
              report.packageItemsInserted += 1;
            }
          }
        }
      }
    }

    if (APPLY) await conn.commit();

    console.log('\n=== ARTIZONE IMPORT REPORT ===');
    console.log(`TOTAL EXISTING SERVICES: ${report.existingServices}`);
    console.log(`NEW DRAFT SERVICES: ${report.newDraftServices}`);
    console.log(`DUPLICATE SERVICES SKIPPED: ${report.duplicateServicesSkipped}`);
    console.log(`TOTAL EXISTING PACKAGES: ${report.existingPackages}`);
    console.log(`NEW DRAFT PACKAGES: ${report.newDraftPackages}`);
    console.log(`DUPLICATE PACKAGES SKIPPED: ${report.duplicatePackagesSkipped}`);
    console.log(`PACKAGE ITEMS PLANNED: ${report.packageItemsPlanned}`);
    console.log(`PACKAGE ITEMS INSERTED: ${report.packageItemsInserted}`);
    console.log(`PACKAGE ITEMS SKIPPED: ${report.packageItemsSkipped}`);
    console.log(`SERVICES REQUIRING PRICE: ${report.servicesRequiringPrice.length}`);
    console.log(`SERVICES REQUIRING DURATION: ${report.servicesRequiringDuration.length}`);
    console.log(`SERVICES REQUIRING STAFF: ${report.servicesRequiringStaff.length}`);
    console.log(`PACKAGES REQUIRING PRICE: ${report.packagesRequiringPrice.length}`);

    if (report.warnings.length) {
      console.log('\nWARNINGS:');
      for (const warning of [...new Set(report.warnings)]) console.log(`- ${warning}`);
    }

    if (!APPLY) {
      console.log('\nDRY RUN COMPLETE — no rows changed.');
      console.log('Review the report, then run with --apply only when the target database is confirmed.');
    } else {
      console.log('\nAPPLY COMPLETE — new records were inserted as drafts only.');
    }
  } catch (error) {
    if (APPLY) {
      try { await conn.rollback(); } catch {}
    }
    console.error('\nIMPORT FAILED:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

await main();
