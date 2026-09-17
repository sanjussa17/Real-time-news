import nodemailer from 'nodemailer';

let transporter = null;
let testAccount = null;

export const initEmailTransporter = async () => {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log('[EmailService] Using configured SMTP server.');
    } else {
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
            console.log(`[EmailService] Created Ethereal Test Account: ${testAccount.user}`);
        } catch (err) {
            console.error(`[EmailService] Failed to create Ethereal test account: ${err.message}`);
        }
    }
};

export const sendNewsAlertEmail = async ({ toEmail, userTitle, article }) => {
    if (!transporter) {
        await initEmailTransporter();
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 24px; border: 1px solid #334155; }
          .header { font-size: 22px; font-weight: bold; color: #f43f5e; margin-bottom: 8px; display: flex; align-items: center; }
          .category { background-color: #e11d48; color: #ffffff; font-size: 11px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
          .title { font-size: 20px; font-weight: 700; color: #ffffff; margin: 16px 0 8px 0; text-decoration: none; display: block; }
          .meta { font-size: 12px; color: #94a3b8; margin-bottom: 16px; }
          .desc { font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px; }
          .button { display: inline-block; background-color: #f43f5e; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; }
          .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 30px; border-top: 1px solid #334155; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            🔴 PulseNews Breaking Alert
          </div>
          <div>
            <span class="category">${article.category}</span>
          </div>
          <a href="${article.url}" target="_blank" class="title">${article.title}</a>
          <div class="meta">Source: ${article.source} | ${new Date(article.publishedAt || Date.now()).toLocaleTimeString()}</div>
          <div class="desc">${article.description}</div>
          <a href="${article.url}" target="_blank" class="button">Read Full Article →</a>
          <div class="footer">
            You received this real-time alert based on your PulseNews preferences.<br/>
            Frequency: ${article.frequency || 'Immediate'} | Preferences: Email Alert
          </div>
        </div>
      </body>
    </html>
  `;

    try {
        const info = await transporter.sendMail({
            from: '"PulseNews Breaking Alerts" <alerts@pulsenews.live>',
            to: toEmail,
            subject: `🚨 Breaking [${article.category}]: ${article.title}`,
            html: htmlContent,
        });

        const previewUrl = nodemailer.getTestMessageUrl(info) || null;
        if (previewUrl) {
            console.log(`[EmailService] Email sent! Live preview URL: ${previewUrl}`);
        }

        return {
            success: true,
            messageId: info.messageId,
            previewUrl,
        };
    } catch (error) {
        console.error(`[EmailService] Error sending email: ${error.message}`);
        return {
            success: false,
            error: error.message,
        };
    }
};
