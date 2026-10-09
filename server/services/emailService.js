import { Resend } from 'resend';
import nodemailer from 'nodemailer';

let resendClient = null;
let transporter = null;
let testAccount = null;

export const initEmailTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const isGmail = process.env.SMTP_HOST.includes('gmail');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: isGmail || process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log(`[EmailService] Configured Live SMTP Transporter via ${process.env.SMTP_HOST}`);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey && !apiKey.includes('sample_resend_key')) {
    try {
      resendClient = new Resend(apiKey);
      console.log('[EmailService] Resend API Client also active.');
    } catch (err) {
      console.warn('[EmailService] Resend SDK init error:', err.message);
    }
  }

  if (!transporter) {
    try {
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[EmailService] Ethereal Fallback Transporter: ${testAccount.user}`);
    } catch (err) {
      console.warn(`[EmailService] Ethereal test account notice: ${err.message}`);
    }
  }
};

export const sendNewsAlertEmail = async ({ toEmail, userTitle, article, unsubscribeToken }) => {
  if (!transporter) {
    await initEmailTransporter();
  }

  const host = process.env.API_URL || 'http://localhost:5000';
  const unsubscribeUrl = `${host}/api/notifications/unsubscribe?email=${encodeURIComponent(toEmail)}${unsubscribeToken ? `&token=${unsubscribeToken}` : ''}`;
  const fromEmail = process.env.FROM_EMAIL || 'sanju.ssa17@gmail.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; }
          .badge { background-color: #f43f5e; color: #ffffff; font-size: 11px; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; font-weight: 700; letter-spacing: 0.05em; display: inline-block; }
          .category { background-color: #3b82f6; color: #ffffff; font-size: 11px; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; font-weight: 700; display: inline-block; margin-left: 6px; }
          .title { font-size: 20px; font-weight: 700; color: #ffffff; margin: 16px 0 8px 0; text-decoration: none; display: block; line-height: 1.4; }
          .meta { font-size: 12px; color: #94a3b8; margin-bottom: 16px; }
          .desc { font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
          .button { display: inline-block; background-color: #e11d48; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; }
          .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #334155; padding-top: 16px; line-height: 1.5; }
          .unsub-link { color: #f43f5e; text-decoration: underline; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div>
            <span class="badge">🔴 BREAKING ALERT</span>
            <span class="category">${article.category || 'General'}</span>
          </div>
          <a href="${article.url || 'https://pulsenews.live'}" target="_blank" class="title">${article.title}</a>
          <div class="meta">Source: ${article.source || 'PulseNews Wire'} | Published: ${new Date(article.publishedAt || Date.now()).toLocaleString()}</div>
          <div class="desc">${article.description || ''}</div>
          <a href="${article.url || 'https://pulsenews.live'}" target="_blank" class="button">Read Full Article →</a>
          <div class="footer">
            You received this real-time breaking alert based on your <strong>PulseNews</strong> alert preferences.<br/>
            Frequency: Immediate | Channel: Email Alert<br/><br/>
            Want to change notification settings or opt out? <a href="${unsubscribeUrl}" target="_blank" class="unsub-link">Click here to Unsubscribe</a>
          </div>
        </div>
      </body>
    </html>
  `;

  const subject = `🚨 Breaking [${article.category || 'News'}]: ${article.title}`;

  // Try SMTP Transporter (Gmail) first for unrestricted delivery to any email address
  if (transporter) {
    try {
      console.log(`[EmailService] Dispatching alert email to ${toEmail} via SMTP (${process.env.SMTP_HOST || 'Gmail'})...`);
      const info = await transporter.sendMail({
        from: `"PulseNews Alerts" <${fromEmail}>`,
        to: toEmail,
        subject,
        html: htmlContent,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || null;
      console.log(`[EmailService] Email successfully delivered to ${toEmail}! MessageId: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        previewUrl,
        message: `Delivered to ${toEmail} via Gmail SMTP`,
      };
    } catch (err) {
      console.warn('[EmailService] SMTP send error, attempting Resend fallback:', err.message);
    }
  }

  // Resend API Fallback
  if (resendClient) {
    try {
      const resendRes = await resendClient.emails.send({
        from: 'onboarding@resend.dev',
        to: toEmail,
        subject,
        html: htmlContent,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
      });

      if (!resendRes.error) {
        return {
          success: true,
          resendId: resendRes.data?.id,
          message: `Delivered to ${toEmail} via Resend API`,
        };
      }
    } catch (err) {
      console.warn('[EmailService] Resend API error:', err.message);
    }
  }

  return { success: false, error: 'Failed to send email via SMTP or Resend API' };
};

export const sendDigestEmail = async ({ toEmail, userTitle, articles, digestType = 'Hourly', unsubscribeToken }) => {
  if (!transporter) {
    await initEmailTransporter();
  }

  if (!articles || articles.length === 0) return { success: false, reason: 'No articles for digest' };

  const host = process.env.API_URL || 'http://localhost:5000';
  const unsubscribeUrl = `${host}/api/notifications/unsubscribe?email=${encodeURIComponent(toEmail)}${unsubscribeToken ? `&token=${unsubscribeToken}` : ''}`;
  const fromEmail = process.env.FROM_EMAIL || 'sanju.ssa17@gmail.com';

  const articlesListHtml = articles.map(art => `
        <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px dashed #334155;">
            <span style="background-color: #3b82f6; color: #fff; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${art.category}</span>
            <span style="color: #94a3b8; font-size: 11px; margin-left: 8px;">${art.source}</span>
            <a href="${art.url}" target="_blank" style="display: block; font-size: 16px; font-weight: 700; color: #60a5fa; margin: 6px 0; text-decoration: none;">${art.title}</a>
            <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">${art.description}</p>
        </div>
    `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; }
          .header { font-size: 20px; font-weight: bold; color: #38bdf8; margin-bottom: 16px; }
          .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #334155; padding-top: 16px; line-height: 1.5; }
          .unsub-link { color: #f43f5e; text-decoration: underline; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">📰 Your ${digestType} PulseNews Digest</div>
          <p style="font-size: 14px; color: #94a3b8;">Here are your top ${articles.length} personalized news updates matching your preferences:</p>
          ${articlesListHtml}
          <div class="footer">
            Frequency: ${digestType} Digest | Channel: Email<br/>
            <a href="${unsubscribeUrl}" target="_blank" class="unsub-link">Click here to Unsubscribe from ${digestType} Digest</a>
          </div>
        </div>
      </body>
    </html>
    `;

  const subject = `📰 PulseNews ${digestType} Digest (${articles.length} Updates)`;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"PulseNews Digest" <${fromEmail}>`,
        to: toEmail,
        subject,
        html: htmlContent,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
      });

      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.warn('[EmailService] SMTP digest error, fallback:', err.message);
    }
  }

  if (resendClient) {
    try {
      const resendRes = await resendClient.emails.send({
        from: 'onboarding@resend.dev',
        to: toEmail,
        subject,
        html: htmlContent,
      });

      if (!resendRes.error) {
        return { success: true, resendId: resendRes.data?.id };
      }
    } catch (err) {
      console.warn('[EmailService] Resend API digest error:', err.message);
    }
  }

  return { success: false, error: 'Failed to send digest email' };
};
