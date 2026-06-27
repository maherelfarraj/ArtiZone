import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  mysqlEnum,
  boolean,
} from 'drizzle-orm/mysql-core';

// ─── Support Tickets ──────────────────────────────────────────────────────────
export const supportTickets = mysqlTable('support_tickets', {
  id:          int('id').primaryKey().autoincrement(),
  name:        varchar('name',  { length: 120 }).notNull(),
  email:       varchar('email', { length: 255 }).notNull(),
  phone:       varchar('phone', { length: 40 }),
  subject:     varchar('subject', { length: 255 }).notNull(),
  status:      mysqlEnum('status', ['open', 'in_progress', 'resolved', 'closed']).notNull().default('open'),
  priority:    mysqlEnum('priority', ['low', 'normal', 'high']).notNull().default('normal'),
  source:      mysqlEnum('source', ['chat_widget', 'contact_form', 'admin']).notNull().default('chat_widget'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  resolvedAt:  timestamp('resolved_at'),
  /** Session token stored in localStorage so the client can retrieve their own ticket */
  sessionToken: varchar('session_token', { length: 64 }).notNull(),
});

// ─── Loyalty Clients ──────────────────────────────────────────────────────────
/**
 * One row per client. Identified by phone (primary) or email.
 * Glow Points system: clients earn 1 pt per 1 JOD spent + bonus actions.
 * Legacy fields (visits, freeSessionsEarned, freeSessionsUsed) kept for
 * backward compatibility with existing admin panel code.
 */
export const loyaltyClients = mysqlTable('loyalty_clients', {
  id:                 int('id').primaryKey().autoincrement(),
  name:               varchar('name',  { length: 120 }).notNull(),
  phone:              varchar('phone', { length: 40 }).notNull(),
  email:              varchar('email', { length: 255 }),
  /** Total paid visits logged by admin (legacy) */
  visits:             int('visits').notNull().default(0),
  /** How many free sessions have been earned (legacy) */
  freeSessionsEarned: int('free_sessions_earned').notNull().default(0),
  /** How many free sessions have been redeemed (legacy) */
  freeSessionsUsed:   int('free_sessions_used').notNull().default(0),
  notes:              text('notes'),
  // ── Glow Points fields (additive migration) ──────────────────────────────
  /** Current redeemable points balance */
  pointsBalance:      int('points_balance').notNull().default(0),
  /** Tier: glow | silver | gold | platinum */
  tier:               varchar('tier', { length: 20 }).notNull().default('glow'),
  /** Lifetime points earned (used for tier qualification) */
  pointsEarnedTotal:  int('points_earned_total').notNull().default(0),
  /** Lifetime points redeemed */
  pointsRedeemedTotal: int('points_redeemed_total').notNull().default(0),
  /** Birthday for 3× birthday month bonus (YYYY-MM-DD) */
  birthday:           varchar('birthday', { length: 10 }),
  /** Date of birth (YYYY-MM-DD) */
  dateOfBirth:        varchar('date_of_birth', { length: 10 }),
  /** Full address */
  address:            varchar('address', { length: 255 }),
  /** Area / district */
  area:               varchar('area', { length: 120 }),
  /** Account status */
  status:             mysqlEnum('status', ['active', 'inactive']).notNull().default('active'),
  /** Skin type for personalisation */
  skinType:           varchar('skin_type', { length: 40 }),
  createdAt:          timestamp('created_at').defaultNow().notNull(),
  updatedAt:          timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Loyalty Visit Log ────────────────────────────────────────────────────────
/** Audit trail — one row per visit logged by admin */
export const loyaltyVisits = mysqlTable('loyalty_visits', {
  id:         int('id').primaryKey().autoincrement(),
  clientId:   int('client_id').notNull().references(() => loyaltyClients.id),
  service:    varchar('service', { length: 120 }),
  isFree:     boolean('is_free').notNull().default(false),
  adminNote:  varchar('admin_note', { length: 255 }),
  createdAt:  timestamp('created_at').defaultNow().notNull(),
});

// ─── Loyalty Transactions ─────────────────────────────────────────────────────
/** Points ledger — one row per earn/redeem/bonus/transfer event */
export const loyaltyTransactions = mysqlTable('loyalty_transactions', {
  id:          int('id').primaryKey().autoincrement(),
  clientId:    int('client_id').notNull().references(() => loyaltyClients.id),
  /** earn | redeem | bonus | transfer */
  type:        varchar('type', { length: 20 }).notNull(),
  /** Positive = earned, negative = redeemed/transferred */
  points:      int('points').notNull(),
  description: varchar('description', { length: 255 }),
  /** Admin name who made the change */
  adminBy:     varchar('admin_by', { length: 120 }),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ─── Booking Requests ─────────────────────────────────────────────────────────
/** One row per booking form submission from the website */
export const bookingRequests = mysqlTable('booking_requests', {
  id:          int('id').primaryKey().autoincrement(),
  name:        varchar('name',    { length: 120 }).notNull(),
  phone:       varchar('phone',   { length: 40 }).notNull(),
  service:     varchar('service', { length: 255 }).notNull(),
  date:        varchar('date',    { length: 20 }).notNull(),
  time:        varchar('time',    { length: 20 }).notNull(),
  notes:       text('notes'),
  adminNotes:  text('admin_notes'),
  /** Channel the booking came in through */
  source:      varchar('source', { length: 40 }).notNull().default('web_form'),
  status:      mysqlEnum('status', ['pending', 'confirmed', 'cancelled', 'no_show', 'declined']).notNull().default('pending'),
  confirmedAt: timestamp('confirmed_at'),
  noShowAt:    timestamp('no_show_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ─── Admin Users ──────────────────────────────────────────────────────────────
/** Staff accounts that can log into the admin panel */
export const adminUsers = mysqlTable('admin_users', {
  id:               int('id').primaryKey().autoincrement(),
  name:             varchar('name',  { length: 120 }).notNull(),
  email:            varchar('email', { length: 255 }).notNull(),
  passwordHash:     varchar('password_hash', { length: 255 }).notNull(),
  role:             mysqlEnum('role', ['superadmin', 'staff']).notNull().default('staff'),
  isActive:         boolean('is_active').notNull().default(true),
  resetToken:       varchar('reset_token', { length: 128 }),
  resetTokenExpiry: timestamp('reset_token_expiry'),
  lastLoginAt:      timestamp('last_login_at'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Admin Sessions ───────────────────────────────────────────────────────────
export const adminSessions = mysqlTable('admin_sessions', {
  id:        varchar('id', { length: 128 }).primaryKey(),
  userId:    int('user_id').notNull().references(() => adminUsers.id),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Loyalty Sessions ─────────────────────────────────────────────────────────
/** One row per completed/pending/cancelled session for a loyalty client */
export const loyaltySessions = mysqlTable('loyalty_sessions', {
  id:          int('id').primaryKey().autoincrement(),
  clientId:    int('client_id').notNull().references(() => loyaltyClients.id),
  sessionDate: varchar('session_date', { length: 20 }).notNull(),
  sessionType: varchar('session_type', { length: 120 }).notNull(),
  status:      mysqlEnum('status', ['completed', 'pending', 'cancelled']).notNull().default('pending'),
  staffName:   varchar('staff_name', { length: 120 }),
  notes:       text('notes'),
  amountPaid:  int('amount_paid').notNull().default(0), // in JOD
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Client Users (public-facing portal) ─────────────────────────────────────
/** Clients who self-register via the client portal */
export const clientUsers = mysqlTable('client_users', {
  id:           int('id').primaryKey().autoincrement(),
  fullName:     varchar('full_name',  { length: 120 }).notNull(),
  phone:        varchar('phone',      { length: 40 }).notNull(),
  email:        varchar('email',      { length: 255 }).notNull(),
  area:         varchar('area',       { length: 120 }).notNull(),
  address:      varchar('address',    { length: 500 }),
  dob:          varchar('dob',        { length: 20 }),   // ISO date string YYYY-MM-DD
  passwordHash: varchar('password_hash', { length: 255 }),
  /** null = not yet verified; set after OTP confirmed */
  verifiedAt:   timestamp('verified_at'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Client OTP ───────────────────────────────────────────────────────────────
/** One-time codes sent by email for first-time verification */
export const clientOtp = mysqlTable('client_otp', {
  id:        int('id').primaryKey().autoincrement(),
  email:     varchar('email', { length: 255 }).notNull(),
  code:      varchar('code',  { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt:    timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Client Sessions ──────────────────────────────────────────────────────────
export const clientSessions = mysqlTable('client_sessions', {
  id:        varchar('id', { length: 128 }).primaryKey(),
  userId:    int('user_id').notNull().references(() => clientUsers.id),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Scheduling: Staff ────────────────────────────────────────────────────────
export const staff = mysqlTable('staff', {
  id:        int('id').primaryKey().autoincrement(),
  name:      varchar('name', { length: 120 }).notNull(),
  role:      varchar('role', { length: 80 }),
  active:    boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ─── Scheduling: Staff Skills ─────────────────────────────────────────────────
export const staffSkills = mysqlTable('staff_skills', {
  id:      int('id').primaryKey().autoincrement(),
  staffId: int('staff_id').notNull().references(() => staff.id),
  skill:   varchar('skill', { length: 40 }).notNull(), // skin|body|laser|nails|other
});

// ─── Scheduling: Staff Availability ──────────────────────────────────────────
export const staffAvailability = mysqlTable('staff_availability', {
  id:        int('id').primaryKey().autoincrement(),
  staffId:   int('staff_id').notNull().references(() => staff.id),
  weekday:   int('weekday').notNull(), // 0=Sun..6=Sat
  startTime: varchar('start_time', { length: 8 }).notNull(), // HH:MM
  endTime:   varchar('end_time',   { length: 8 }).notNull(),
});

// ─── Scheduling: Staff Time Off ───────────────────────────────────────────────
export const staffTimeOff = mysqlTable('staff_time_off', {
  id:        int('id').primaryKey().autoincrement(),
  staffId:   int('staff_id').notNull().references(() => staff.id),
  startAt:   timestamp('start_at').notNull(),
  endAt:     timestamp('end_at').notNull(),
  reason:    varchar('reason', { length: 255 }),
});

// ─── Scheduling: Resources (rooms / machines) ─────────────────────────────────
export const resources = mysqlTable('resources', {
  id:     int('id').primaryKey().autoincrement(),
  name:   varchar('name', { length: 120 }).notNull(),
  type:   varchar('type', { length: 20 }).notNull().default('room'), // room|machine
  active: boolean('active').notNull().default(true),
});

// ─── Scheduling: Resource Capabilities ───────────────────────────────────────
export const resourceCapabilities = mysqlTable('resource_capabilities', {
  id:           int('id').primaryKey().autoincrement(),
  resourceId:   int('resource_id').notNull().references(() => resources.id),
  capability:   varchar('capability', { length: 40 }).notNull(), // e.g. 'laser'
});

// ─── Scheduling: Services Catalogue ──────────────────────────────────────────
export const services = mysqlTable('services', {
  id:                  int('id').primaryKey().autoincrement(),
  name:                varchar('name', { length: 255 }).notNull(),
  category:            varchar('category', { length: 40 }).notNull(), // skin|body|laser|nails|other
  requiredCapability:  varchar('required_capability', { length: 40 }), // null = any room
  durationMin:         int('duration_min').notNull(),
  bufferMin:           int('buffer_min').notNull().default(0),
  price:               int('price').notNull().default(0), // JOD × 100 (fils)
  active:              boolean('active').notNull().default(true),
  /** Default therapist auto-assigned when this service is booked */
  defaultStaffId:      int('default_staff_id').references(() => staff.id),
});

// ─── Scheduling: Appointments ─────────────────────────────────────────────────
export const appointments = mysqlTable('appointments', {
  id:          int('id').primaryKey().autoincrement(),
  /** Customer name (denormalised for speed; no separate customer table yet) */
  customerName: varchar('customer_name', { length: 120 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 40 }).notNull(),
  serviceId:   int('service_id').references(() => services.id),
  /** Free-text service name (used when serviceId is null / legacy) */
  serviceName: varchar('service_name', { length: 255 }),
  staffId:     int('staff_id').references(() => staff.id),
  resourceId:  int('resource_id').references(() => resources.id),
  /** ISO date string YYYY-MM-DD */
  date:        varchar('date', { length: 20 }).notNull(),
  /** HH:MM */
  startTime:   varchar('start_time', { length: 8 }).notNull(),
  /** HH:MM — computed: startTime + durationMin + bufferMin */
  endTime:     varchar('end_time', { length: 8 }),
  status:      mysqlEnum('status', ['requested', 'confirmed', 'completed', 'declined', 'no_show', 'cancelled']).notNull().default('requested'),
  source:      varchar('source', { length: 40 }).notNull().default('web_form'),
  /** FK back to booking_requests.id — set when the appointment was created from a web booking form */
  bookingRequestId: int('booking_request_id'),
  notes:       text('notes'),
  adminNotes:  text('admin_notes'),
  confirmedAt: timestamp('confirmed_at'),
  noShowAt:    timestamp('no_show_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Scheduling: Appointment Events (audit trail) ─────────────────────────────
export const appointmentEvents = mysqlTable('appointment_events', {
  id:            int('id').primaryKey().autoincrement(),
  appointmentId: int('appointment_id').notNull().references(() => appointments.id),
  fromStatus:    varchar('from_status', { length: 40 }),
  toStatus:      varchar('to_status',   { length: 40 }).notNull(),
  actor:         varchar('actor', { length: 120 }),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
});

// ─── Customers (normalised) ───────────────────────────────────────────────────
/**
 * One row per unique customer. Appointments reference this table via customerId.
 * Existing denormalised appointments (customerName/customerPhone) remain valid;
 * new appointments created through the admin panel should link a customer row.
 */
export const customers = mysqlTable('customers', {
  id:          int('id').primaryKey().autoincrement(),
  name:        varchar('name',  { length: 120 }).notNull(),
  phone:       varchar('phone', { length: 40 }).notNull(),
  email:       varchar('email', { length: 255 }),
  /** Area / district in Amman */
  area:        varchar('area',  { length: 120 }),
  /** Birthday YYYY-MM-DD for birthday bonuses */
  dob:         varchar('dob',   { length: 10 }),
  notes:       text('notes'),
  /** Link to loyalty programme if they enrolled */
  loyaltyClientId: int('loyalty_client_id'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Packages catalogue ───────────────────────────────────────────────────────
/**
 * Sellable session bundles, e.g. "Laser Hair Removal — 6 sessions".
 * priceJod is stored in fils (JOD × 100) for integer arithmetic.
 */
export const packages = mysqlTable('packages', {
  id:           int('id').primaryKey().autoincrement(),
  name:         varchar('name',        { length: 255 }).notNull(),
  description:  text('description'),
  /** Category matches services.category: skin|body|laser|nails|other */
  category:     varchar('category',    { length: 40 }).notNull().default('other'),
  /** Total sessions included in the bundle */
  totalSessions: int('total_sessions').notNull(),
  /** Price in fils (JOD × 100) */
  priceJod:     int('price_jod').notNull().default(0),
  /** Optional: restrict to a specific service */
  serviceId:    int('service_id').references(() => services.id),
  /** Validity in days from purchase date (0 = no expiry) */
  validityDays: int('validity_days').notNull().default(0),
  active:       boolean('active').notNull().default(true),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Customer packages (purchased bundles) ────────────────────────────────────
/**
 * One row per package sold to a customer.
 * sessionsRemaining decrements each time a session is redeemed.
 */
export const customerPackages = mysqlTable('customer_packages', {
  id:                  int('id').primaryKey().autoincrement(),
  customerId:          int('customer_id').notNull().references(() => customers.id),
  packageId:           int('package_id').notNull().references(() => packages.id),
  /** Snapshot of package name at time of purchase */
  packageName:         varchar('package_name', { length: 255 }).notNull(),
  totalSessions:       int('total_sessions').notNull(),
  sessionsRemaining:   int('sessions_remaining').notNull(),
  /** Price actually paid (may differ from catalogue if discounted) */
  pricePaidJod:        int('price_paid_jod').notNull().default(0),
  purchasedAt:         timestamp('purchased_at').defaultNow().notNull(),
  /** NULL = no expiry */
  expiresAt:           timestamp('expires_at'),
  status:              mysqlEnum('status', ['active', 'completed', 'expired', 'cancelled']).notNull().default('active'),
  /** Admin who sold the package */
  soldBy:              varchar('sold_by', { length: 120 }),
  notes:               text('notes'),
  createdAt:           timestamp('created_at').defaultNow().notNull(),
  updatedAt:           timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Customer package redemptions ─────────────────────────────────────────────
/** Audit trail — one row each time a session is redeemed against a package */
export const packageRedemptions = mysqlTable('package_redemptions', {
  id:               int('id').primaryKey().autoincrement(),
  customerPackageId: int('customer_package_id').notNull().references(() => customerPackages.id),
  /** Appointment that consumed this session (optional link) */
  appointmentId:    int('appointment_id').references(() => appointments.id),
  redeemedAt:       timestamp('redeemed_at').defaultNow().notNull(),
  /** Admin who recorded the redemption */
  redeemedBy:       varchar('redeemed_by', { length: 120 }),
  notes:            varchar('notes', { length: 255 }),
});

// ─── Waitlist ─────────────────────────────────────────────────────────────────
/**
 * Clients who want a slot that is currently full.
 * When a cancellation occurs, admin can send an offer to the next in queue.
 */
export const waitlist = mysqlTable('waitlist', {
  id:           int('id').primaryKey().autoincrement(),
  /** Customer name (denormalised for quick display) */
  customerName: varchar('customer_name', { length: 120 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 40 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  /** Service they want */
  serviceId:    int('service_id').references(() => services.id),
  serviceName:  varchar('service_name', { length: 255 }),
  /** Preferred date YYYY-MM-DD (optional) */
  preferredDate: varchar('preferred_date', { length: 20 }),
  /** Preferred time HH:MM (optional) */
  preferredTime: varchar('preferred_time', { length: 8 }),
  /** Preferred staff (optional) */
  staffId:      int('staff_id').references(() => staff.id),
  status:       mysqlEnum('status', ['waiting', 'offered', 'booked', 'expired', 'cancelled']).notNull().default('waiting'),
  /** When an offer was sent to this client */
  offeredAt:    timestamp('offered_at'),
  /** Admin notes */
  notes:        text('notes'),
  source:       varchar('source', { length: 40 }).notNull().default('web_form'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
  updatedAt:    timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// ─── Notifications (deduplication log) ───────────────────────────────────────
/**
 * Prevents duplicate reminder / offer emails from firing twice.
 * Before sending, check that no row exists with the same (type, referenceId).
 */
export const notifications = mysqlTable('notifications', {
  id:          int('id').primaryKey().autoincrement(),
  /** e.g. 'appointment_reminder_24h' | 'waitlist_offer' | 'package_expiry' */
  type:        varchar('type',         { length: 80 }).notNull(),
  /** ID of the related record (appointmentId, waitlistId, customerPackageId) */
  referenceId: int('reference_id').notNull(),
  /** Channel used: email | sms | whatsapp */
  channel:     varchar('channel',      { length: 20 }).notNull().default('email'),
  /** Recipient address / phone */
  recipient:   varchar('recipient',    { length: 255 }),
  sentAt:      timestamp('sent_at').defaultNow().notNull(),
  /** HTTP status or delivery code from the provider */
  statusCode:  int('status_code'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
});

// ─── Ticket Messages ──────────────────────────────────────────────────────────
export const ticketMessages = mysqlTable('ticket_messages', {
  id:        int('id').primaryKey().autoincrement(),
  ticketId:  int('ticket_id').notNull().references(() => supportTickets.id),
  sender:    mysqlEnum('sender', ['client', 'admin']).notNull(),
  body:      text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  /** Admin display name for staff replies */
  adminName: varchar('admin_name', { length: 80 }),
});
