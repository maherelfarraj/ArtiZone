import express, { type NextFunction, type Request, type Response } from "express";
import { fileURLToPath } from "node:url";
import { dirname, extname, join } from "node:path";
import { readFileSync } from "node:fs";

// <api-imports>
import ab_events_get_0 from "./api/ab-events/GET";
import ab_events_post_1 from "./api/ab-events/POST";
import admin_auth_change_password_post_2 from "./api/admin/auth/change-password/POST";
import admin_auth_forgot_password_post_3 from "./api/admin/auth/forgot-password/POST";
import admin_auth_login_post_4 from "./api/admin/auth/login/POST";
import admin_auth_logout_post_5 from "./api/admin/auth/logout/POST";
import admin_auth_me_get_6 from "./api/admin/auth/me/GET";
import admin_auth_reset_password_post_7 from "./api/admin/auth/reset-password/POST";
import admin_discount_codes_get_8 from "./api/admin/discount-codes/GET";
import admin_loyalty_clients_get_9 from "./api/admin/loyalty/clients/GET";
import admin_loyalty_clients_post_10 from "./api/admin/loyalty/clients/POST";
import admin_loyalty_clients_id_get_11 from "./api/admin/loyalty/clients/[id]/GET";
import admin_loyalty_clients_id_patch_12 from "./api/admin/loyalty/clients/[id]/PATCH";
import admin_loyalty_clients_id_points_post_13 from "./api/admin/loyalty/clients/[id]/points/POST";
import admin_loyalty_clients_id_sessions_get_14 from "./api/admin/loyalty/clients/[id]/sessions/GET";
import admin_loyalty_clients_id_sessions_post_15 from "./api/admin/loyalty/clients/[id]/sessions/POST";
import admin_migrate_post_16 from "./api/admin/migrate/POST";
import admin_reveal_secret_get_17 from "./api/admin/reveal-secret/GET";
import admin_test_email_post_18 from "./api/admin/test-email/POST";
import admin_token_get_19 from "./api/admin/token/GET";
import admin_users_get_20 from "./api/admin/users/GET";
import admin_users_post_21 from "./api/admin/users/POST";
import admin_users_id_delete_22 from "./api/admin/users/[id]/DELETE";
import admin_users_id_patch_23 from "./api/admin/users/[id]/PATCH";
import admin_users_id_reset_password_post_24 from "./api/admin/users/[id]/reset-password/POST";
import booking_delete_25 from "./api/booking/DELETE";
import booking_get_26 from "./api/booking/GET";
import booking_patch_27 from "./api/booking/PATCH";
import booking_post_28 from "./api/booking/POST";
import booking_count_get_29 from "./api/booking/count/GET";
import client_appointments_id_cancel_post_30 from "./api/client/appointments/[id]/cancel/POST";
import client_bookings_get_31 from "./api/client/bookings/GET";
import client_login_post_32 from "./api/client/login/POST";
import client_logout_post_33 from "./api/client/logout/POST";
import client_loyalty_get_34 from "./api/client/loyalty/GET";
import client_loyalty_redeem_post_35 from "./api/client/loyalty/redeem/POST";
import client_me_get_36 from "./api/client/me/GET";
import client_profile_patch_37 from "./api/client/profile/PATCH";
import client_register_post_38 from "./api/client/register/POST";
import client_resend_otp_post_39 from "./api/client/resend-otp/POST";
import client_seed_demo_post_40 from "./api/client/seed-demo/POST";
import client_set_password_post_41 from "./api/client/set-password/POST";
import client_verify_otp_post_42 from "./api/client/verify-otp/POST";
import discount_signup_post_43 from "./api/discount-signup/POST";
import export_booking_code_pdf_get_44 from "./api/export/booking-code-pdf/GET";
import health_get_45 from "./api/health/GET";
import newsletter_post_46 from "./api/newsletter/POST";
import newsletter_analytics_get_47 from "./api/newsletter/analytics/GET";
import newsletter_run_sequence_post_48 from "./api/newsletter/run-sequence/POST";
import reports_demand_get_49 from "./api/reports/demand/GET";
import review_requests_post_50 from "./api/review-requests/POST";
import review_requests_admin_get_51 from "./api/review-requests/admin/GET";
import review_requests_run_followups_post_52 from "./api/review-requests/run-followups/POST";
import review_requests_id_patch_53 from "./api/review-requests/[id]/PATCH";
import reviews_get_54 from "./api/reviews/GET";
import reviews_post_55 from "./api/reviews/POST";
import reviews_admin_get_56 from "./api/reviews/admin/GET";
import reviews_id_patch_57 from "./api/reviews/[id]/PATCH";
import scheduling_appointments_get_58 from "./api/scheduling/appointments/GET";
import scheduling_appointments_post_59 from "./api/scheduling/appointments/POST";
import scheduling_appointments_id_get_60 from "./api/scheduling/appointments/[id]/GET";
import scheduling_appointments_id_patch_61 from "./api/scheduling/appointments/[id]/PATCH";
import scheduling_availability_get_62 from "./api/scheduling/availability/GET";
import scheduling_customers_get_63 from "./api/scheduling/customers/GET";
import scheduling_customers_post_64 from "./api/scheduling/customers/POST";
import scheduling_customers_id_get_65 from "./api/scheduling/customers/[id]/GET";
import scheduling_customers_id_patch_66 from "./api/scheduling/customers/[id]/PATCH";
import scheduling_customers_id_packages_post_67 from "./api/scheduling/customers/[id]/packages/POST";
import scheduling_customers_id_packages_pkgId_redeem_post_68 from "./api/scheduling/customers/[id]/packages/[pkgId]/redeem/POST";
import scheduling_packages_get_69 from "./api/scheduling/packages/GET";
import scheduling_packages_post_70 from "./api/scheduling/packages/POST";
import scheduling_packages_id_delete_71 from "./api/scheduling/packages/[id]/DELETE";
import scheduling_packages_id_patch_72 from "./api/scheduling/packages/[id]/PATCH";
import scheduling_reminders_run_post_73 from "./api/scheduling/reminders/run/POST";
import scheduling_rooms_get_74 from "./api/scheduling/rooms/GET";
import scheduling_rooms_post_75 from "./api/scheduling/rooms/POST";
import scheduling_rooms_id_delete_76 from "./api/scheduling/rooms/[id]/DELETE";
import scheduling_services_delete_77 from "./api/scheduling/services/DELETE";
import scheduling_services_get_78 from "./api/scheduling/services/GET";
import scheduling_services_patch_79 from "./api/scheduling/services/PATCH";
import scheduling_services_post_80 from "./api/scheduling/services/POST";
import scheduling_slots_get_81 from "./api/scheduling/slots/GET";
import scheduling_staff_get_82 from "./api/scheduling/staff/GET";
import scheduling_staff_post_83 from "./api/scheduling/staff/POST";
import scheduling_staff_id_delete_84 from "./api/scheduling/staff/[id]/DELETE";
import scheduling_staff_id_put_85 from "./api/scheduling/staff/[id]/PUT";
import scheduling_waitlist_get_86 from "./api/scheduling/waitlist/GET";
import scheduling_waitlist_post_87 from "./api/scheduling/waitlist/POST";
import scheduling_waitlist_id_patch_88 from "./api/scheduling/waitlist/[id]/PATCH";
import support_tickets_get_89 from "./api/support/tickets/GET";
import support_tickets_post_90 from "./api/support/tickets/POST";
import support_tickets_id_get_91 from "./api/support/tickets/[id]/GET";
import support_tickets_id_patch_92 from "./api/support/tickets/[id]/PATCH";
import support_tickets_id_messages_post_93 from "./api/support/tickets/[id]/messages/POST";
import track_click_get_94 from "./api/track/click/GET";
import track_event_post_95 from "./api/track/event/POST";
import v1_availability_get_96 from "./api/v1/availability/GET";
import v1_booking_post_97 from "./api/v1/booking/POST";
import v1_services_get_98 from "./api/v1/services/GET";
// </api-imports>
import { seoRoutes } from "../lib/seo-routes";

function normalizeCommerceApiBaseUrlEnv() {
	if (process.env.GODADDY_API_BASE_URL) return;
	const hostOnly = process.env.VITE_GODADDY_API_HOST;
	if (!hostOnly) return;
	const normalizedHost = hostOnly.replace(/^https?:\/\//, "").trim();
	if (!normalizedHost) return;
	process.env.GODADDY_API_BASE_URL = `https://${normalizedHost}`;
}

normalizeCommerceApiBaseUrlEnv();

const app = express();

// Honour x-forwarded-* from the load balancer so req.protocol/req.hostname
// reflect the public-facing values. Express-maintained parsing respects the
// existing trust-proxy config; direct header reads would let a client spoof
// the sitemap origin in robots.txt.
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── www → non-www canonical redirect (301 permanent) ────────────────────────
// Canonical host is https://artizonespa.com (non-www).
// Any www request is permanently redirected to non-www so Google consolidates
// all signals on one host and never sees duplicate content.
app.use((req: Request, res: Response, next: NextFunction) => {
  const host = req.headers['x-forwarded-host'] as string || req.hostname;
  if (host && host === 'www.artizonespa.com') {
    return res.redirect(301, `https://artizonespa.com${req.originalUrl}`);
  }
  next();
});
// Parse cookies manually (avoids CJS cookie-parser incompatibility)
app.use((req: Request, _res: Response, next: NextFunction) => {
  const raw = req.headers.cookie ?? '';
  req.cookies = Object.fromEntries(
    raw.split(';').map(s => s.trim()).filter(Boolean).map(s => {
      const idx = s.indexOf('=');
      return idx < 0 ? [s, ''] : [s.slice(0, idx).trim(), decodeURIComponent(s.slice(idx + 1).trim())];
    })
  );
  next();
});

// ── Security headers ────────────────────────────────────────────────────────
// Applied to every response. Tightens the attack surface without breaking
// the SPA or media assets.
app.use((_req: Request, res: Response, next: NextFunction) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Stop MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Force HTTPS for 1 year (only meaningful in production behind TLS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Limit referrer leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Restrict powerful browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Basic XSS protection for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Content Security Policy — allows the SPA, Google Fonts, Google Maps embed,
  // WhatsApp/social links, and the Airo asset CDN while blocking unknown origins.
  res.setHeader('Content-Security-Policy', [
    "default-src 'self'",
    // Scripts: self + inline (Vite HMR / React hydration) + Google Tag Manager
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    // Styles: self + inline (Tailwind/shadcn) + Google Fonts
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Fonts: self + Google Fonts CDN
    "font-src 'self' https://fonts.gstatic.com",
    // Images: self + data URIs + Airo asset CDN + Google Maps static
    "img-src 'self' data: blob: https://airo-assets.godaddy.com https://maps.googleapis.com https://maps.gstatic.com https://*.airoapp.ai",
    // Media: self + Airo asset CDN
    "media-src 'self' https://airo-assets.godaddy.com https://*.airoapp.ai",
    // Frames: Google Maps embed only
    "frame-src https://www.google.com",
    // Connections: self + analytics + Airo APIs
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.airoapp.ai",
    // Prevent framing by other origins (belt-and-suspenders with X-Frame-Options)
    "frame-ancestors 'self'",
    // Block mixed content
    "upgrade-insecure-requests",
  ].join('; '));
  next();
});

// <api-registrations>
app.get("/api/ab-events", ab_events_get_0);
app.post("/api/ab-events", ab_events_post_1);
app.post("/api/admin/auth/change-password", admin_auth_change_password_post_2);
app.post("/api/admin/auth/forgot-password", admin_auth_forgot_password_post_3);
app.post("/api/admin/auth/login", admin_auth_login_post_4);
app.post("/api/admin/auth/logout", admin_auth_logout_post_5);
app.get("/api/admin/auth/me", admin_auth_me_get_6);
app.post("/api/admin/auth/reset-password", admin_auth_reset_password_post_7);
app.get("/api/admin/discount-codes", admin_discount_codes_get_8);
app.get("/api/admin/loyalty/clients", admin_loyalty_clients_get_9);
app.post("/api/admin/loyalty/clients", admin_loyalty_clients_post_10);
app.get("/api/admin/loyalty/clients/:id", admin_loyalty_clients_id_get_11);
app.patch("/api/admin/loyalty/clients/:id", admin_loyalty_clients_id_patch_12);
app.post("/api/admin/loyalty/clients/:id/points", admin_loyalty_clients_id_points_post_13);
app.get("/api/admin/loyalty/clients/:id/sessions", admin_loyalty_clients_id_sessions_get_14);
app.post("/api/admin/loyalty/clients/:id/sessions", admin_loyalty_clients_id_sessions_post_15);
app.post("/api/admin/migrate", admin_migrate_post_16);
app.get("/api/admin/reveal-secret", admin_reveal_secret_get_17);
app.post("/api/admin/test-email", admin_test_email_post_18);
app.get("/api/admin/token", admin_token_get_19);
app.get("/api/admin/users", admin_users_get_20);
app.post("/api/admin/users", admin_users_post_21);
app.delete("/api/admin/users/:id", admin_users_id_delete_22);
app.patch("/api/admin/users/:id", admin_users_id_patch_23);
app.post("/api/admin/users/:id/reset-password", admin_users_id_reset_password_post_24);
app.delete("/api/booking", booking_delete_25);
app.get("/api/booking", booking_get_26);
app.patch("/api/booking", booking_patch_27);
app.post("/api/booking", booking_post_28);
app.get("/api/booking/count", booking_count_get_29);
app.post("/api/client/appointments/:id/cancel", client_appointments_id_cancel_post_30);
app.get("/api/client/bookings", client_bookings_get_31);
app.post("/api/client/login", client_login_post_32);
app.post("/api/client/logout", client_logout_post_33);
app.get("/api/client/loyalty", client_loyalty_get_34);
app.post("/api/client/loyalty/redeem", client_loyalty_redeem_post_35);
app.get("/api/client/me", client_me_get_36);
app.patch("/api/client/profile", client_profile_patch_37);
app.post("/api/client/register", client_register_post_38);
app.post("/api/client/resend-otp", client_resend_otp_post_39);
app.post("/api/client/seed-demo", client_seed_demo_post_40);
app.post("/api/client/set-password", client_set_password_post_41);
app.post("/api/client/verify-otp", client_verify_otp_post_42);
app.post("/api/discount-signup", discount_signup_post_43);
app.get("/api/export/booking-code-pdf", export_booking_code_pdf_get_44);
app.get("/api/health", health_get_45);
app.post("/api/newsletter", newsletter_post_46);
app.get("/api/newsletter/analytics", newsletter_analytics_get_47);
app.post("/api/newsletter/run-sequence", newsletter_run_sequence_post_48);
app.get("/api/reports/demand", reports_demand_get_49);
app.post("/api/review-requests", review_requests_post_50);
app.get("/api/review-requests/admin", review_requests_admin_get_51);
app.post("/api/review-requests/run-followups", review_requests_run_followups_post_52);
app.patch("/api/review-requests/:id", review_requests_id_patch_53);
app.get("/api/reviews", reviews_get_54);
app.post("/api/reviews", reviews_post_55);
app.get("/api/reviews/admin", reviews_admin_get_56);
app.patch("/api/reviews/:id", reviews_id_patch_57);
app.get("/api/scheduling/appointments", scheduling_appointments_get_58);
app.post("/api/scheduling/appointments", scheduling_appointments_post_59);
app.get("/api/scheduling/appointments/:id", scheduling_appointments_id_get_60);
app.patch("/api/scheduling/appointments/:id", scheduling_appointments_id_patch_61);
app.get("/api/scheduling/availability", scheduling_availability_get_62);
app.get("/api/scheduling/customers", scheduling_customers_get_63);
app.post("/api/scheduling/customers", scheduling_customers_post_64);
app.get("/api/scheduling/customers/:id", scheduling_customers_id_get_65);
app.patch("/api/scheduling/customers/:id", scheduling_customers_id_patch_66);
app.post("/api/scheduling/customers/:id/packages", scheduling_customers_id_packages_post_67);
app.post("/api/scheduling/customers/:id/packages/:pkgId/redeem", scheduling_customers_id_packages_pkgId_redeem_post_68);
app.get("/api/scheduling/packages", scheduling_packages_get_69);
app.post("/api/scheduling/packages", scheduling_packages_post_70);
app.delete("/api/scheduling/packages/:id", scheduling_packages_id_delete_71);
app.patch("/api/scheduling/packages/:id", scheduling_packages_id_patch_72);
app.post("/api/scheduling/reminders/run", scheduling_reminders_run_post_73);
app.get("/api/scheduling/rooms", scheduling_rooms_get_74);
app.post("/api/scheduling/rooms", scheduling_rooms_post_75);
app.delete("/api/scheduling/rooms/:id", scheduling_rooms_id_delete_76);
app.delete("/api/scheduling/services", scheduling_services_delete_77);
app.get("/api/scheduling/services", scheduling_services_get_78);
app.patch("/api/scheduling/services", scheduling_services_patch_79);
app.post("/api/scheduling/services", scheduling_services_post_80);
app.get("/api/scheduling/slots", scheduling_slots_get_81);
app.get("/api/scheduling/staff", scheduling_staff_get_82);
app.post("/api/scheduling/staff", scheduling_staff_post_83);
app.delete("/api/scheduling/staff/:id", scheduling_staff_id_delete_84);
app.put("/api/scheduling/staff/:id", scheduling_staff_id_put_85);
app.get("/api/scheduling/waitlist", scheduling_waitlist_get_86);
app.post("/api/scheduling/waitlist", scheduling_waitlist_post_87);
app.patch("/api/scheduling/waitlist/:id", scheduling_waitlist_id_patch_88);
app.get("/api/support/tickets", support_tickets_get_89);
app.post("/api/support/tickets", support_tickets_post_90);
app.get("/api/support/tickets/:id", support_tickets_id_get_91);
app.patch("/api/support/tickets/:id", support_tickets_id_patch_92);
app.post("/api/support/tickets/:id/messages", support_tickets_id_messages_post_93);
app.get("/api/track/click", track_click_get_94);
app.post("/api/track/event", track_event_post_95);
app.get("/api/v1/availability", v1_availability_get_96);
app.post("/api/v1/booking", v1_booking_post_97);
app.get("/api/v1/services", v1_services_get_98);
// </api-registrations>

// Error middleware must be registered AFTER the routes it protects; Express
// only passes errors to middleware defined later in the stack.
app.use("/api", (err: unknown, req: Request, res: Response, _next: NextFunction) => {
	// Always respond JSON on /api so clients parsing response.json() don't
	// receive Express's default HTML error page for non-Error throws.
	console.error("ssr.api.error", {
		url: req.url,
		error: err instanceof Error ? err.stack : String(err),
	});
	res.status(500).json({ error: "Internal server error" });
});

function baseUrl(_req: Request): string {
	// Always return the canonical non-www host so sitemap.xml and robots.txt
	// never emit www URLs regardless of which host the request arrived on.
	return 'https://artizonespa.com';
}

function escapeXml(s: string): string {
	return s.replace(/[&<>"']/g, (c) =>
		({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
	);
}

app.get("/robots.txt", (req, res) => {
	const base = baseUrl(req);
	const body = [
		"User-agent: *",
		"Allow: /",
		"Disallow: /admin",
		"Disallow: /admin/",
		"Disallow: /api/",
		"Disallow: /client/dashboard",
		"Disallow: /client/signup",
		"Disallow: /client/login",
		"Disallow: /newsletter-analytics",
		"Disallow: /reviews-admin",
		"Disallow: /mobile-landing",
		"",
		`Sitemap: ${base}/sitemap.xml`,
		"",
	].join("\n");
	res.type("text/plain").set("Cache-Control", "public, max-age=3600").send(body);
});

app.get("/sitemap.xml", (req, res) => {
	const base = baseUrl(req);
	const urls = seoRoutes
		.filter((r) => typeof r.path === "string" && r.path.startsWith("/"))
		.map((r) => {
			const loc = `${base}${r.path}`;
			const parts = [`    <loc>${escapeXml(loc)}</loc>`];
			if (r.lastmod) parts.push(`    <lastmod>${escapeXml(r.lastmod)}</lastmod>`);
			if (r.changefreq) parts.push(`    <changefreq>${r.changefreq}</changefreq>`);
			if (r.priority !== undefined)
				parts.push(`    <priority>${r.priority.toFixed(1)}</priority>`);
			return `  <url>\n${parts.join("\n")}\n  </url>`;
		})
		.join("\n");
	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
	res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(body);
});

if (import.meta.env.PROD) {
  // ── Newsletter sequence scheduler ──────────────────────────────────────────
  // Runs every 6 hours to send Day-3 and Day-7 emails to eligible subscribers.
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  const runSequence = async () => {
    try {
      const res = await fetch(`http://localhost:${process.env.PORT || 3000}/api/newsletter/run-sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sequence-secret': process.env.SEQUENCE_SECRET || '',
        },
      });
      const data = await res.json() as Record<string, unknown>;
      console.log('newsletter.scheduler.ran', data);
    } catch (err) {
      console.error('newsletter.scheduler.error', err);
    }
  };
  // Delay first run by 30s to let the server fully start
  setTimeout(() => {
    void runSequence();
    setInterval(() => { void runSequence(); }, SIX_HOURS);
  }, 30_000);

  // ── Review request follow-up scheduler ─────────────────────────────────────
  // Runs every 12 hours to send follow-up emails to clients who haven't reviewed yet.
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  const runFollowUps = async () => {
    try {
      const res = await fetch(`http://localhost:${process.env.PORT || 3000}/api/review-requests/run-followups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sequence-secret': process.env.SEQUENCE_SECRET || '',
        },
      });
      const data = await res.json() as Record<string, unknown>;
      console.log('review-request.followup.scheduler.ran', data);
    } catch (err) {
      console.error('review-request.followup.scheduler.error', err);
    }
  };
  setTimeout(() => {
    void runFollowUps();
    setInterval(() => { void runFollowUps(); }, TWELVE_HOURS);
  }, 60_000);

  // ── 24h appointment reminder scheduler ──────────────────────────────────────
  // Runs every hour. Finds confirmed appointments scheduled for tomorrow and
  // sends a WhatsApp-style reminder email to the clinic so staff can reach out.
  const ONE_HOUR = 60 * 60 * 1000;
  const runReminders = async () => {
    try {
      const res = await fetch(`http://localhost:${process.env.PORT || 3000}/api/scheduling/reminders/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sequence-secret': process.env.SEQUENCE_SECRET || '',
        },
      });
      const data = await res.json() as Record<string, unknown>;
      if ((data.sent as number) > 0) {
        console.log('appointment.reminders.ran', data);
      }
    } catch (err) {
      console.error('appointment.reminders.error', err);
    }
  };
  setTimeout(() => {
    void runReminders();
    setInterval(() => { void runReminders(); }, ONE_HOUR);
  }, 90_000);
	const __dirname = dirname(fileURLToPath(import.meta.url));
	const clientDir = join(__dirname, "client");

	app.use(
		express.static(clientDir, {
			index: false,
			setHeaders(res, filePath) {
				res.set(
					"Cache-Control",
					filePath.includes("/assets/")
						? "public, max-age=31536000, immutable"
						: "no-cache",
				);
			},
		}),
	);

	app.use((_req, res, next) => {
		res.set("Cache-Control", "no-cache");
		next();
	});

	let template: string;
	try {
		template = readFileSync(join(clientDir, "index.html"), "utf-8");
	} catch (err) {
		console.error("ssr.template.load-failed", {
			path: join(clientDir, "index.html"),
			error: err instanceof Error ? err.message : String(err),
		});
		process.exit(1);
	}
	if (!template.includes("<!--app-head-->") || !template.includes("<!--app-html-->")) {
		// Fail fast at boot, same as a template load failure above: without
		// markers, every .replace() call on the render path is a no-op and we
		// would serve a shell with no <head> content and no rendered body on
		// every request. Preferring process.exit over a degraded mode ensures
		// an operator notices and fixes the build rather than serving broken
		// SEO-invisible pages indefinitely.
		console.error("ssr.template.markers-missing", {
			hasHead: template.includes("<!--app-head-->"),
			hasHtml: template.includes("<!--app-html-->"),
		});
		process.exit(1);
	}
	const fallbackShell = template
		.replace("<!--app-head-->", "")
		.replace("<!--app-html-->", "");

	// Resolve the SSR module once into a stable render function. A failed
	// load is unrecoverable at runtime - exiting lets the container
	// scheduler restart with a clean slate rather than leaving the server
	// to serve silent 503s indefinitely against a single startup log.
	type RenderResult = {
		html: string;
		head: string;
		status: number;
		redirect?: string;
	};
	let renderFn: ((url: string) => Promise<RenderResult>) | null = null;
	const SSR_MODULE_LOAD_TIMEOUT_MS = 30_000;
	const loadTimeout = setTimeout(() => {
		if (renderFn !== null) return;
		console.error("ssr.module.load-timeout", {
			timeoutMs: SSR_MODULE_LOAD_TIMEOUT_MS,
		});
		process.exit(1);
	}, SSR_MODULE_LOAD_TIMEOUT_MS);
	loadTimeout.unref();
	import("../entry-server").then(
		(mod) => {
			clearTimeout(loadTimeout);
			renderFn = mod.render;
		},
		(err) => {
			clearTimeout(loadTimeout);
			console.error("ssr.module.load-failed", {
				error: err instanceof Error ? err.stack : String(err),
			});
			process.exit(1);
		},
	);

	app.get(/.*/, async (req, res, next) => {
		if (req.method !== "GET") return next();
		if (req.path.startsWith("/api")) return next();
		if (extname(req.path)) return next();
		const sendFallback = () =>
			res
				.status(503)
				.set("Content-Type", "text/html; charset=utf-8")
				.set("Cache-Control", "no-store")
				.send(fallbackShell);
		if (renderFn === null) {
			// Module not yet resolved; fall back without logging to avoid startup
			// noise before the first render is even possible. A terminal load
			// failure (import reject or 30s timeout) process.exit(1)s from the
			// loader above, so this branch is only the brief warmup window.
			return sendFallback();
		}
		try {
			const result = await renderFn(req.url);
			if (result.redirect) {
				// Redirect thrown from a loader/action surfaces as a Response.
				// Forward it so the browser actually navigates to the new URL
				// instead of seeing an empty shell with a stale status.
				res.redirect(result.status, result.redirect);
				return;
			}
			if (!result.html) {
				// A non-redirect Response was thrown from a loader (e.g.
				// `throw new Response(null, { status: 404 })`). renderToString
				// produced no markup, so we have a real status but no body.
				// Log so the case is observable in ops dashboards, and mark
				// no-store so CDNs don't cache an empty page as a valid hit.
				// User-visible 404 / error pages should come from a route
				// errorElement, not from this fallback path.
				console.error("ssr.render.error-response", {
					url: req.url,
					status: result.status,
				});
				res
					.status(result.status)
					.set("Content-Type", "text/html; charset=utf-8")
					.set("Cache-Control", "no-store")
					.send(fallbackShell);
				return;
			}
			// Function replacements disable String.replace's $-special sequences
			// ($&, $', $`, $$) so user-authored titles / JSON-LD like
			// "Save $& today" insert literally instead of being interpolated.
			const out = template
				.replace("<!--app-head-->", () => result.head)
				.replace("<!--app-html-->", () => result.html);
			res
				.status(result.status)
				.set("Content-Type", "text/html; charset=utf-8")
				.set("Cache-Control", "no-cache")
				.send(out);
		} catch (err) {
			// 503 surfaces the failure in CDN/monitoring without caching a broken
			// page as success. console.error (not warn) puts it at the right log
			// level for the observability pipeline to alert on.
			console.error("ssr.render.failed", {
				url: req.url,
				// Log the full stack — React's renderToString annotates it with
				// the failing component's call tree, which the message alone
				// discards.
				error: err instanceof Error ? err.stack : String(err),
			});
			sendFallback();
		}
	});

	const shutdown = async (signal: string) => {
		console.log(`Got ${signal}, shutting down gracefully...`);
		// Scope the ERR_MODULE_NOT_FOUND suppression to the import() only.
		// A closeConnection() failure that happens to carry the same code
		// (unlikely but possible for wrapped errors) must not be silently
		// swallowed - it indicates a real db-close failure worth logging.
		let mod: { closeConnection?: () => Promise<void> | void } | null = null;
		try {
			const dbClient = "./db/client" + ".js";
			mod = await import(/* @vite-ignore */ dbClient);
		} catch (error: unknown) {
			const code = (error as { code?: string } | null)?.code;
			if (code !== "ERR_MODULE_NOT_FOUND") {
				console.error("ssr.shutdown.db-import-failed", {
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}
		if (mod && typeof mod.closeConnection === "function") {
			try {
				await mod.closeConnection();
				console.log("Database connections closed");
			} catch (error: unknown) {
				console.error("ssr.shutdown.db-close-failed", {
					error: error instanceof Error ? error.message : String(error),
				});
			}
		}
		process.exit(0);
	};

	(["SIGTERM", "SIGINT"] as const).forEach((signal) => {
		process.once(signal, () => {
			void shutdown(signal);
		});
	});

	const rawPort = process.env.PORT || "3000";
	const port = parseInt(rawPort, 10);
	if (!Number.isInteger(port) || port <= 0 || port > 65535) {
		// parseInt("abc") returns NaN; passing that to app.listen throws
		// synchronously before the server.on("error") handler below can catch
		// it. Fail fast with an actionable log rather than a cryptic crash.
		console.error("ssr.server.invalid-port", { rawPort });
		process.exit(1);
	}
	const host = process.env.HOST || "0.0.0.0";
	const server = app.listen(port, host, () => {
		console.log(`Server listening on http://${host}:${port}`);
	});
	server.on("error", (err: Error & { code?: string }) => {
		console.error("ssr.server.listen-failed", {
			port,
			host,
			code: err.code,
			error: err.message,
		});
		process.exit(1);
	});
}

export default app;
