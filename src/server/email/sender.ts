import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'localhost',
  port: 25,
  secure: false,
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  await transport.sendMail({
    from: 'ArtiZone Beauty Clinic <info@artizonespa.com>',
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
}
