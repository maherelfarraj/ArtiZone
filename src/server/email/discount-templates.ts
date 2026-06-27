import type { DiscountSignup } from '../api/discount-signup/POST.js';

const FOREST = '#0E2A3A';
const MINT   = '#C4A882';
const GREEN  = '#ADAF10';

export function discountClientEmail(name: string, code: string): { subject: string; html: string; text: string } {
  const subject = `Your 10% Discount Code — ArtiZone Beauty Clinic`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:2px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:${FOREST};padding:36px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${MINT};font-weight:600;">ArtiZone Beauty & Aesthetic Clinic</p>
            <h1 style="margin:0;font-size:28px;font-weight:400;color:#ffffff;font-family:Georgia,serif;line-height:1.2;">
              Your Exclusive<br><em style="color:${MINT};">10% Discount</em>
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 16px;font-size:15px;color:#333;line-height:1.6;">
              Dear <strong>${name}</strong>,
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#555;line-height:1.7;">
              Welcome to ArtiZone! We're thrilled to have you. As a thank-you for signing up, here is your personal <strong>10% discount code</strong> — valid on all our services.
            </p>

            <!-- Code box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td align="center" style="background:${FOREST};padding:24px;border-radius:2px;">
                  <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.20em;text-transform:uppercase;color:${MINT};font-weight:600;">Your Discount Code</p>
                  <p style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.12em;font-family:'Courier New',monospace;">${code}</p>
                  <p style="margin:8px 0 0;font-size:11px;color:rgba(255,255,255,0.50);">10% off all services</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 12px;font-size:14px;color:#555;line-height:1.7;">
              <strong>How to use it:</strong>
            </p>
            <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#555;line-height:1.8;">
              <li>Mention your code when booking via phone or in person</li>
              <li>Valid on all face, skin, laser, nails, body & men's services</li>
              <li>One use per client</li>
            </ul>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
              <tr>
                <td align="center">
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
              <tr>
                <td align="center">
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
              Questions? Call us at <a href="tel:+962790412758" style="color:${GREEN};">+962 79 041 2758</a> or <a href="tel:+962792828024" style="color:${GREEN};">+962 79 282 8024</a> · Arjan St., 2nd Floor, Amman.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0ebe4;padding:20px 40px;text-align:center;border-top:1px solid #e5ddd5;">
            <p style="margin:0;font-size:11px;color:#999;line-height:1.6;">
              ArtiZone Beauty & Aesthetic Clinic · Arjan St., Amman, Jordan<br>
              <a href="https://artizonespa.com" style="color:${GREEN};text-decoration:none;">artizonespa.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
Dear ${name},

Welcome to ArtiZone! Your exclusive 10% discount code is:

  ${code}

Valid on all services. Mention this code when booking.

Book via phone: +962 79 041 2758 / +962 79 282 8024
Visit: artizonespa.com

artizonespa.com
`;

  return { subject, html, text };
}

export function discountAdminEmail(signup: DiscountSignup): { subject: string; html: string; text: string } {
  const subject = `New 10% Discount Sign-Up — ${signup.name}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:2px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background:${FOREST};padding:28px 40px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.20em;text-transform:uppercase;color:${MINT};font-weight:600;">ArtiZone Admin</p>
            <h1 style="margin:0;font-size:22px;font-weight:400;color:#ffffff;font-family:Georgia,serif;">New Discount Sign-Up</h1>
          </td>
        </tr>

        <!-- Client info -->
        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 20px;font-size:14px;color:#555;">A new client has signed up for the 10% discount offer:</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5ddd5;border-radius:2px;overflow:hidden;margin-bottom:24px;">
              ${[
                ['Full Name',      signup.name],
                ['Email',          signup.email],
                ['Phone',          signup.phone],
                ['Discount Code',  signup.code],
                ['Signed Up At',   new Date(signup.signedUpAt).toLocaleString('en-GB', { timeZone: 'Asia/Amman' })],
                ['Record ID',      signup.id],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#faf6f0' : '#ffffff'};">
                <td style="padding:10px 16px;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.10em;width:140px;border-right:1px solid #e5ddd5;">${label}</td>
                <td style="padding:10px 16px;font-size:14px;color:#333;font-weight:${label === 'Discount Code' ? '700' : '400'};">${value}</td>
              </tr>`).join('')}
            </table>

            <p style="margin:0;font-size:13px;color:#888;">
              The discount code has been automatically sent to the client's email address.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0ebe4;padding:16px 40px;text-align:center;border-top:1px solid #e5ddd5;">
            <p style="margin:0;font-size:11px;color:#999;">ArtiZone Admin Notification · artizonespa.com</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `
New Discount Sign-Up — ArtiZone

Name:    ${signup.name}
Email:   ${signup.email}
Phone:   ${signup.phone}
Code:    ${signup.code}
Date:    ${new Date(signup.signedUpAt).toLocaleString('en-GB', { timeZone: 'Asia/Amman' })}
ID:      ${signup.id}

The discount code has been sent to the client automatically.
`;

  return { subject, html, text };
}
