// ─── ArtiZone Email Templates ─────────────────────────────────────────────────

const GOLD = '#C4A882';
const TAUPE = '#0E2A3A';
const CREAM = '#FDFAF6';
const SITE_URL = 'https://artizonespa.com';

/** Wrap a URL with the click-tracking redirect proxy */
function tracked(url: string, seq: 'welcome' | 'day3' | 'day7' | 'day14blog', label: string): string {
  return `${SITE_URL}/api/track/click?seq=${seq}&label=${encodeURIComponent(label)}&url=${encodeURIComponent(url)}`;
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ArtiZone</title>
</head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:580px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(61,46,38,0.10);">

          <!-- Header -->
          <tr>
            <td style="background:${TAUPE};padding:28px 36px;text-align:center;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <span style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:${GOLD};letter-spacing:0.06em;">ArtiZone</span>
                <span style="display:block;font-size:11px;color:rgba(249,245,240,0.55);letter-spacing:0.18em;text-transform:uppercase;margin-top:3px;">Beauty &amp; Aesthetic Clinic</span>
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${TAUPE};padding:22px 36px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:rgba(249,245,240,0.55);">
                Arjan St., 2nd Floor, Mazen Al-Kurdi St., Amman, Jordan
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:rgba(249,245,240,0.55);">
                <a href="tel:+962790412758" style="color:${GOLD};text-decoration:none;">+962 79 041 2758</a>
                &nbsp;·&nbsp;
                <a href="tel:+962792828024" style="color:${GOLD};text-decoration:none;">+962 79 282 8024</a>
                &nbsp;·&nbsp;
                <a href="mailto:info@artizonespa.com" style="color:${GOLD};text-decoration:none;">info@artizonespa.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(249,245,240,0.35);">
                © 2026 ArtiZone. You're receiving this because you subscribed at artizonespa.com.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function goldButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:${GOLD};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;letter-spacing:0.03em;margin-top:8px;">${label}</a>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid rgba(61,46,38,0.08);margin:24px 0;" />`;
}

/** Wrap a URL with the review-request click-tracking redirect proxy */
function trackedReview(url: string, requestId: string, label: string): string {
  return `${SITE_URL}/api/track/click?seq=review-request&reqId=${encodeURIComponent(requestId)}&label=${encodeURIComponent(label)}&url=${encodeURIComponent(url)}`;
}

// ─── Email 4: Review Request (sent after service completion) ──────────────────
export function reviewRequestEmail(opts: {
  name: string;
  service: string;
  requestId: string;
  staffName?: string;
}): { subject: string; html: string; text: string } {
  const { name, service, requestId, staffName } = opts;
  const reviewUrl = `${SITE_URL}/?review=1`;

  const html = baseLayout(`
    <!-- Star graphic -->
    <div style="text-align:center;margin-bottom:20px;">
      <span style="font-size:32px;letter-spacing:4px;">★★★★★</span>
    </div>

    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;color:${TAUPE};font-weight:700;text-align:center;">
      How was your experience?
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;text-align:center;">
      Hi ${name},<br/>
      Thank you for visiting ArtiZone for your <strong>${service}</strong> treatment.
      ${staffName ? `We hope <strong>${staffName}</strong> took great care of you.` : 'We hope you had a wonderful experience.'}
    </p>

    <!-- CTA card -->
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background:${CREAM};border-radius:14px;padding:28px;text-align:center;border:1.5px solid rgba(184,150,90,0.2);">
          <p style="margin:0 0 8px;font-size:15px;color:#5a4a3a;line-height:1.7;">
            Your feedback helps other clients discover ArtiZone — and helps us keep raising the bar.
          </p>
          <p style="margin:0 0 20px;font-size:13px;color:#9a8a7a;">It only takes 60 seconds.</p>
          <a href="${trackedReview(reviewUrl, requestId, 'Leave a Review')}"
             style="display:inline-block;background:${GOLD};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.03em;">
            ★ &nbsp;Leave a Review
          </a>
        </td>
      </tr>
    </table>

    ${divider()}

    <!-- What to mention -->
    <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:${TAUPE};">Not sure what to write?</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr><td style="padding:5px 0;font-size:13px;color:#6a5a4a;">✦ &nbsp;How did the treatment make you feel?</td></tr>
      <tr><td style="padding:5px 0;font-size:13px;color:#6a5a4a;">✦ &nbsp;Were the results what you expected?</td></tr>
      <tr><td style="padding:5px 0;font-size:13px;color:#6a5a4a;">✦ &nbsp;Would you recommend us to a friend?</td></tr>
    </table>

    ${divider()}

    <!-- Re-book nudge -->
    <p style="margin:0 0 16px;font-size:14px;color:#5a4a3a;line-height:1.7;">
      Ready for your next visit? Book your next appointment and keep the glow going.
    </p>
    <div style="text-align:center;margin:8px 0 24px;">
      <a href="${trackedReview(`${SITE_URL}/booking`, requestId, 'Book Next Appointment')}"
         style="display:inline-block;background:${TAUPE};color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:0.03em;">
        Book Next Appointment
      </a>
    </div>

    ${divider()}
    <p style="margin:0;font-size:13px;color:#9a8a7a;line-height:1.6;">
      Had an issue? We'd love to make it right. Call us at
      <a href="tel:+962790412758" style="color:${GOLD};">+962 79 041 2758</a> or reply to this email and we'll get back to you right away.
    </p>
  `);

  const text = `Hi ${name},

Thank you for visiting ArtiZone for your ${service} treatment!

We'd love to hear about your experience. Your review helps other clients and helps us keep improving.

Leave a review (takes 60 seconds): ${reviewUrl}

Book your next appointment: ${SITE_URL}/booking

Had an issue? Call us: +962 79 041 2758

© 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan.`;

  return {
    subject: `How was your ${service} at ArtiZone? ⭐ Leave a quick review`,
    html,
    text,
  };
}

// ─── Email 5: Review Request Follow-up (sent 3 days later if no review) ───────
export function reviewFollowUpEmail(opts: {
  name: string;
  service: string;
  requestId: string;
}): { subject: string; html: string; text: string } {
  const { name, service, requestId } = opts;
  const reviewUrl = `${SITE_URL}/?review=1`;

  const html = baseLayout(`
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:24px;color:${TAUPE};font-weight:700;">
      Just a gentle reminder 🌸
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      Hi ${name},<br/>
      We noticed you haven't had a chance to share your thoughts on your recent <strong>${service}</strong> at ArtiZone. No pressure — but if you have 60 seconds, we'd truly appreciate it.
    </p>

    <div style="text-align:center;margin:0 0 28px;">
      <a href="${trackedReview(reviewUrl, requestId, 'Leave a Review Follow-up')}"
         style="display:inline-block;background:${GOLD};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.03em;">
        ★ &nbsp;Share Your Experience
      </a>
    </div>

    ${divider()}
    <p style="margin:0;font-size:13px;color:#9a8a7a;line-height:1.6;">
      This is the last reminder we'll send. Thank you for being an ArtiZone client —
      we look forward to seeing you again soon.
      <a href="${trackedReview(`${SITE_URL}/booking`, requestId, 'Book Again Follow-up')}" style="color:${GOLD};">Book your next visit →</a>
    </p>
  `);

  const text = `Hi ${name},

Just a gentle reminder — we'd love to hear about your ${service} experience at ArtiZone.

Leave a review: ${reviewUrl}

This is the last reminder we'll send. Thank you for being an ArtiZone client!

Book your next visit: ${SITE_URL}/booking

© 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan.`;

  return {
    subject: `Still thinking about your ${service}? Share your review 🌸`,
    html,
    text,
  };
}

// ─── Email 1: Welcome (sent immediately on subscribe) ─────────────────────────
export function welcomeEmail(name?: string): { subject: string; html: string; text: string } {
  const greeting = name ? `Hi ${name},` : 'Welcome to ArtiZone,';

  const html = baseLayout(`
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;color:${TAUPE};font-weight:700;">
      You're in! ✨
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      ${greeting}<br/>
      Thank you for joining the ArtiZone family. We're thrilled to have you with us.
    </p>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      As a subscriber, you'll be the <strong>first to know</strong> about:
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr><td style="padding:6px 0;font-size:14px;color:#5a4a3a;">✦ &nbsp;Exclusive subscriber-only discounts</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#5a4a3a;">✦ &nbsp;New treatments &amp; seasonal packages</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#5a4a3a;">✦ &nbsp;Expert skincare &amp; beauty tips</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#5a4a3a;">✦ &nbsp;Flash sales &amp; limited-time offers</td></tr>
    </table>
    ${divider()}
    <p style="margin:0 0 16px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      Ready to treat yourself? Browse our current special offers or book your first appointment today.
    </p>
    <div style="text-align:center;margin:8px 0 24px;">
      ${goldButton(tracked(`${SITE_URL}/special-offers`, 'welcome', 'View Special Offers'), 'View Special Offers')}
      &nbsp;&nbsp;
      ${goldButton(tracked(`${SITE_URL}/booking`, 'welcome', 'Book Appointment'), 'Book Appointment')}
    </div>
    ${divider()}
    <p style="margin:0;font-size:13px;color:#9a8a7a;line-height:1.6;">
      Have a question? Call us at <a href="tel:+962790412758" style="color:${GOLD};">+962 79 041 2758</a> or reply to this email — we'd love to hear from you.
    </p>
  `);

  const text = `${greeting}

Thank you for subscribing to ArtiZone! You'll be the first to know about exclusive deals, new treatments, and beauty tips.

View our special offers: ${SITE_URL}/special-offers
Book an appointment: ${SITE_URL}/booking

Questions? Call us: +962 79 041 2758

© 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan.`;

  return { subject: 'Welcome to ArtiZone — You\'re in! ✨', html, text };
}

// ─── Email 2: Day 3 — Beauty Tips ─────────────────────────────────────────────
export function beautyTipsEmail(name?: string): { subject: string; html: string; text: string } {
  const greeting = name ? `Hi ${name},` : 'Hi there,';

  const html = baseLayout(`
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;color:${TAUPE};font-weight:700;">
      5 Skincare Tips from Our Experts
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      ${greeting}<br/>
      Our specialists have put together their top 5 tips for glowing, healthy skin — all year round.
    </p>

    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background:${CREAM};border-radius:10px;padding:16px 20px;margin-bottom:12px;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${TAUPE};">1. Double Cleanse Every Evening</p>
          <p style="margin:0;font-size:13px;color:#6a5a4a;line-height:1.6;">Remove makeup with an oil cleanser first, then follow with a gentle foam cleanser to clear pores without stripping moisture.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="background:${CREAM};border-radius:10px;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${TAUPE};">2. SPF Every Single Day</p>
          <p style="margin:0;font-size:13px;color:#6a5a4a;line-height:1.6;">UV damage is the #1 cause of premature aging. Apply SPF 30+ every morning — even on cloudy days or indoors near windows.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="background:${CREAM};border-radius:10px;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${TAUPE};">3. Hydrate from the Inside Out</p>
          <p style="margin:0;font-size:13px;color:#6a5a4a;line-height:1.6;">Drink at least 8 glasses of water daily. Pair with a hyaluronic acid serum to lock moisture into the skin barrier.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="background:${CREAM};border-radius:10px;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${TAUPE};">4. Don't Skip Your Neck &amp; Décolletage</p>
          <p style="margin:0;font-size:13px;color:#6a5a4a;line-height:1.6;">These areas age faster than your face. Extend your moisturiser and SPF downward every morning and evening.</p>
        </td>
      </tr>
      <tr><td style="height:10px;"></td></tr>
      <tr>
        <td style="background:${CREAM};border-radius:10px;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:${TAUPE};">5. Book a Professional Facial Monthly</p>
          <p style="margin:0;font-size:13px;color:#6a5a4a;line-height:1.6;">Home routines maintain — professional treatments transform. A monthly facial deep-cleanses, resurfaces, and resets your skin.</p>
        </td>
      </tr>
    </table>

    ${divider()}
    <p style="margin:0 0 16px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      Ready to experience a professional facial? Our <strong>Face &amp; Skin Care</strong> treatments are tailored to your skin type.
    </p>
    <div style="text-align:center;margin:8px 0 24px;">
      ${goldButton(tracked(`${SITE_URL}/services/face-skin-care`, 'day3', 'Explore Skin Treatments'), 'Explore Skin Treatments')}
    </div>
    ${divider()}
    <p style="margin:0;font-size:13px;color:#9a8a7a;line-height:1.6;">
      Questions about your skin? Call our team at <a href="tel:+962790412758" style="color:${GOLD};">+962 79 041 2758</a> — we're happy to help.
    </p>
  `);

  const text = `${greeting}

5 Expert Skincare Tips from ArtiZone:

1. Double Cleanse Every Evening — oil cleanser first, then foam.
2. SPF Every Single Day — UV damage is the #1 cause of premature aging.
3. Hydrate from the Inside Out — 8 glasses of water + hyaluronic acid serum.
4. Don't Skip Your Neck & Décolletage — extend your routine downward.
5. Book a Professional Facial Monthly — professional treatments transform.

Explore our skin treatments: ${SITE_URL}/services/face-skin-care

Book now: ${SITE_URL}/booking

© 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan.`;

  return { subject: '5 Expert Skincare Tips — Just for You 💆‍♀️', html, text };
}

// ─── Email 6: Day 14 — Blog Reader Nurture (blog-source subscribers only) ─────
/**
 * Sent 14 days after subscription to readers who signed up via a blog post.
 * Deepens the relationship with curated content links + a soft booking nudge.
 */
export function blogReaderNurtureEmail(name?: string): { subject: string; html: string; text: string } {
  const greeting = name ? `Hi ${name},` : 'Hi there,';

  const html = baseLayout(`
    <!-- Icon -->
    <div style="text-align:center;margin-bottom:20px;">
      <span style="display:inline-block;background:rgba(201,169,110,0.12);border-radius:50%;width:52px;height:52px;line-height:52px;font-size:22px;">📖</span>
    </div>

    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;color:${TAUPE};font-weight:700;text-align:center;">
      More Reading for You
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;text-align:center;">
      ${greeting}<br/>
      You've been with us for two weeks — and we wanted to share some of our most-read guides, hand-picked for you.
    </p>

    ${divider()}

    <!-- Article links -->
    <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:${TAUPE};letter-spacing:0.04em;">
      ✦ &nbsp;Recommended Reading
    </p>

    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px;">
      <tr>
        <td style="padding:12px 16px;background:${CREAM};border-radius:10px;margin-bottom:8px;">
          <a href="${tracked(`${SITE_URL}/blog/best-acne-scar-treatment-amman`, 'day14blog', 'Acne Scar Guide')}"
             style="font-size:14px;font-weight:700;color:${TAUPE};text-decoration:none;">
            The Best Acne Scar Treatments in Amman →
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#7a6a5a;line-height:1.5;">
            A complete guide to scar types, treatment options, and what to expect — session by session.
          </p>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px;">
      <tr>
        <td style="padding:12px 16px;background:${CREAM};border-radius:10px;">
          <a href="${tracked(`${SITE_URL}/blog/non-invasive-skin-tightening-amman`, 'day14blog', 'Skin Tightening Guide')}"
             style="font-size:14px;font-weight:700;color:${TAUPE};text-decoration:none;">
            RF vs HIFU: Which Skin Tightening is Right for You? →
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#7a6a5a;line-height:1.5;">
            A head-to-head comparison of the two most popular non-invasive tightening technologies.
          </p>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:8px;">
      <tr>
        <td style="padding:12px 16px;background:${CREAM};border-radius:10px;">
          <a href="${tracked(`${SITE_URL}/blog/laser-hair-removal-dark-skin-amman`, 'day14blog', 'Laser Dark Skin Guide')}"
             style="font-size:14px;font-weight:700;color:${TAUPE};text-decoration:none;">
            Laser Hair Removal for Dark & Olive Skin in Amman →
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#7a6a5a;line-height:1.5;">
            Everything you need to know about Nd:YAG laser and the Fitzpatrick scale — safe for all skin tones.
          </p>
        </td>
      </tr>
    </table>
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="padding:12px 16px;background:${CREAM};border-radius:10px;">
          <a href="${tracked(`${SITE_URL}/blog/hydrafacial-vs-chemical-peel-amman`, 'day14blog', 'HydraFacial vs Peel')}"
             style="font-size:14px;font-weight:700;color:${TAUPE};text-decoration:none;">
            HydraFacial vs Chemical Peel — Which Should You Choose? →
          </a>
          <p style="margin:4px 0 0;font-size:12px;color:#7a6a5a;line-height:1.5;">
            A practical comparison with guidance for sensitive and darker skin tones.
          </p>
        </td>
      </tr>
    </table>

    ${divider()}

    <!-- Soft booking nudge -->
    <p style="margin:0 0 6px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      Ready to put the reading into practice?
    </p>
    <p style="margin:0 0 20px;font-size:14px;color:#7a6a5a;line-height:1.7;">
      Book a free consultation at ArtiZone — our specialists will assess your skin and recommend the right treatment for your goals.
    </p>
    <div style="text-align:center;margin:8px 0 24px;">
      ${goldButton(tracked(`${SITE_URL}/booking`, 'day14blog', 'Book Free Consultation'), 'Book a Free Consultation')}
    </div>

    ${divider()}
    <p style="margin:0;font-size:13px;color:#9a8a7a;line-height:1.6;">
      Questions? Call us at <a href="tel:+962790412758" style="color:${GOLD};">+962 79 041 2758</a> — we're happy to help you choose the right treatment.
    </p>
  `);

  const text = `${greeting}

You've been with us for two weeks — here are some of our most-read guides, hand-picked for you:

1. The Best Acne Scar Treatments in Amman
   ${SITE_URL}/blog/best-acne-scar-treatment-amman

2. RF vs HIFU: Which Skin Tightening is Right for You?
   ${SITE_URL}/blog/non-invasive-skin-tightening-amman

3. Laser Hair Removal for Dark & Olive Skin in Amman
   ${SITE_URL}/blog/laser-hair-removal-dark-skin-amman

4. HydraFacial vs Chemical Peel — Which Should You Choose?
   ${SITE_URL}/blog/hydrafacial-vs-chemical-peel-amman

Ready to book? Get a free consultation: ${SITE_URL}/booking

Call us: +962 79 041 2758

© 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan.`;

  return {
    subject: `${name ? `${name}, we` : 'We'} picked these guides just for you 📖`,
    html,
    text,
  };
}

export function specialOfferEmail(name?: string): { subject: string; html: string; text: string } {
  const greeting = name ? `Hi ${name},` : 'Hi there,';

  const html = baseLayout(`
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:rgba(201,169,110,0.15);color:${GOLD};font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;padding:6px 18px;border-radius:50px;">Subscriber Exclusive</span>
    </div>
    <h1 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;color:${TAUPE};font-weight:700;text-align:center;">
      A Special Gift for You 🎁
    </h1>
    <p style="margin:0 0 20px;font-size:15px;color:#5a4a3a;line-height:1.7;text-align:center;">
      ${greeting}<br/>
      As a valued subscriber, we'd love to welcome you to the clinic with an exclusive offer — just for you.
    </p>

    <!-- Offer card -->
    <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
      <tr>
        <td style="background:${TAUPE};border-radius:14px;padding:28px 28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(249,245,240,0.55);">Limited Time Offer</p>
          <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:32px;font-weight:700;color:${GOLD};">20% OFF</p>
          <p style="margin:0 0 16px;font-size:16px;color:#FDFAF6;font-weight:600;">Your First Treatment</p>
          <p style="margin:0 0 20px;font-size:13px;color:rgba(249,245,240,0.65);line-height:1.6;">
            Valid on any single treatment — facials, laser, nails, body slimming, or men's grooming.<br/>
            <strong style="color:rgba(249,245,240,0.85);">Mention this email when booking.</strong>
          </p>
          <a href="${tracked(`${SITE_URL}/booking`, 'day7', 'Claim 20% Discount')}" style="display:inline-block;background:${GOLD};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:14px;font-weight:600;letter-spacing:0.03em;">
            Claim My 20% Discount
          </a>
          <p style="margin:16px 0 0;font-size:11px;color:rgba(249,245,240,0.35);">Valid for 30 days from receipt. One use per subscriber.</p>
        </td>
      </tr>
    </table>

    ${divider()}
    <p style="margin:0 0 16px;font-size:15px;color:#5a4a3a;line-height:1.7;">
      Not sure which treatment to choose? Browse our full menu or check out this month's special offers.
    </p>
    <div style="text-align:center;margin:8px 0 24px;">
      ${goldButton(tracked(`${SITE_URL}/services`, 'day7', 'Browse All Treatments'), 'Browse All Treatments')}
      &nbsp;&nbsp;
      ${goldButton(tracked(`${SITE_URL}/special-offers`, 'day7', 'See Current Offers'), 'See Current Offers')}
    </div>
    ${divider()}
    <p style="margin:0;font-size:13px;color:#9a8a7a;line-height:1.6;">
      To book, simply call <a href="${tracked('tel:+962790412758', 'day7', 'Phone Footer')}" style="color:${GOLD};">+962 79 041 2758</a> or <a href="${tracked('tel:+962792828024', 'day7', 'Phone2 Footer')}" style="color:${GOLD};">+962 79 282 8024</a>.
      We're open Sat–Thu 10AM–9PM, Fri 2PM–9PM.
    </p>
  `);

  const text = `${greeting}

As a valued ArtiZone subscriber, here's an exclusive offer just for you:

🎁 20% OFF Your First Treatment

Valid on any single treatment — facials, laser, nails, body slimming, or men's grooming.
Mention this email when booking. Valid for 30 days. One use per subscriber.

Book via phone: +962 79 041 2758

Browse all treatments: ${SITE_URL}/services

© 2026 ArtiZone Beauty & Aesthetic Clinic, Amman, Jordan.`;

  return { subject: 'Your Exclusive 20% Off — Subscriber Gift 🎁', html, text };
}
