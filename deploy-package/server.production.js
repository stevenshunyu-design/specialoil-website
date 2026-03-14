var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/email.ts
var email_exports = {};
__export(email_exports, {
  resend: () => resend,
  sendAdminApplicationNotification: () => sendAdminApplicationNotification,
  sendApplicationConfirmation: () => sendApplicationConfirmation,
  sendApprovalEmail: () => sendApprovalEmail,
  sendArticleApprovalEmail: () => sendArticleApprovalEmail,
  sendArticleRejectionEmail: () => sendArticleRejectionEmail,
  sendNewsletter: () => sendNewsletter,
  sendNewsletterToSubscribers: () => sendNewsletterToSubscribers,
  sendRejectionEmail: () => sendRejectionEmail,
  sendSubscriptionConfirmation: () => sendSubscriptionConfirmation,
  sendUnsubscribeConfirmation: () => sendUnsubscribeConfirmation,
  sendVerificationCode: () => sendVerificationCode
});
import { Resend } from "resend";
async function sendSubscriptionConfirmation(email) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to ${SITE_NAME} Newsletter! \u{1F4E7}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Your Trusted China Special Oil Partner</p>
          </div>
          <div class="content">
            <h2>Welcome to Our Newsletter!</h2>
            <p>Thank you for subscribing to the <strong>${SITE_NAME}</strong> newsletter.</p>
            <p>You'll now receive:</p>
            <ul>
              <li>\u{1F4CA} Latest China special oil industry news</li>
              <li>\u{1F527} Technical insights and product updates</li>
              <li>\u{1F4C8} Market analysis and price trends</li>
              <li>\u{1F381} Exclusive offers and promotions</li>
            </ul>
            <p style="margin-top: 30px;">Stay tuned for our next update!</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to our newsletter.</p>
            <p>
              <a href="${unsubscribeUrl}">Unsubscribe</a> | 
              <a href="${SITE_URL}">Visit Website</a>
            </p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send subscription email:", error);
      return false;
    }
    console.log("Subscription email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending subscription email:", error);
    return false;
  }
}
async function sendUnsubscribeConfirmation(email) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  const resubscribeUrl = `${SITE_URL}/blog`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You've been unsubscribed from ${SITE_NAME} Newsletter`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
          </div>
          <div class="content">
            <h2>Unsubscribe Confirmation</h2>
            <p>You have been successfully unsubscribed from our newsletter.</p>
            <p>We're sorry to see you go! If you change your mind, you can always resubscribe:</p>
            <a href="${resubscribeUrl}" class="button">Resubscribe</a>
            <p>Thank you for being part of our community.</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send unsubscribe email:", error);
      return false;
    }
    console.log("Unsubscribe email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending unsubscribe email:", error);
    return false;
  }
}
async function sendNewsletter(subject, articles, previewText) {
  if (!resend) {
    return { success: false, sentCount: 0, error: "Resend not configured" };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: "delivered@resend.dev",
      // 批量发送时使用这个
      subject,
      html: generateNewsletterHTML(subject, articles, previewText)
    });
    if (error) {
      return { success: false, sentCount: 0, error: error.message };
    }
    return { success: true, sentCount: 1 };
  } catch (error) {
    return {
      success: false,
      sentCount: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
async function sendNewsletterToSubscribers(subscribers, subject, articles, previewText) {
  if (!resend) {
    return { success: false, sentCount: 0, errors: ["Resend not configured"] };
  }
  const errors = [];
  let sentCount = 0;
  for (const email of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject,
        html: generateNewsletterHTML(subject, articles, previewText, unsubscribeUrl)
      });
      if (error) {
        errors.push(`${email}: ${error.message}`);
      } else {
        sentCount++;
      }
      if (sentCount % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    } catch (err) {
      errors.push(`${email}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }
  return { success: sentCount > 0, sentCount, errors };
}
function generateNewsletterHTML(subject, articles, previewText, unsubscribeUrl) {
  const defaultUnsubscribeUrl = `${SITE_URL}/unsubscribe`;
  const articlesHTML = articles.map((article) => `
    <div class="article">
      <h3><a href="${article.url}">${article.title}</a></h3>
      <p>${article.summary}</p>
      <a href="${article.url}" style="color: #D4AF37; text-decoration: none;">Read more \u2192</a>
    </div>
  `).join("");
  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${emailStyles}
    </head>
    <body>
      <div class="header">
        <h1>\u{1F3ED} ${SITE_NAME}</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Newsletter</p>
      </div>
      <div class="content">
        <h2>${subject}</h2>
        ${previewText ? `<p style="color: #666; font-style: italic;">${previewText}</p>` : ""}
        ${articlesHTML}
        <p style="margin-top: 30px;">Stay connected with us!</p>
        <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
      </div>
      <div class="footer">
        <p>You're receiving this email because you subscribed to our newsletter.</p>
        <p>
          <a href="${unsubscribeUrl || defaultUnsubscribeUrl}">Unsubscribe</a> | 
          <a href="${SITE_URL}">Visit Website</a>
        </p>
      </div>
    </body>
    </html>
  `;
}
async function sendVerificationCode(email, code, type = "register") {
  if (!resend) {
    console.log("========================================");
    console.log("\u{1F4E7} EMAIL VERIFICATION CODE");
    console.log("========================================");
    console.log(`To: ${email}`);
    console.log(`Type: ${type}`);
    console.log(`Code: ${code}`);
    console.log(`Expires: 10 minutes`);
    console.log("========================================");
    return true;
  }
  const typeText = type === "register" ? "Email Verification" : type === "bind_email" ? "Bind New Email" : type === "admin_login" ? "Admin Login Verification" : "Password Reset";
  const purposeText = type === "register" ? "Please use the following code to verify your email address for author registration." : type === "bind_email" ? "Please use the following code to verify your new email address for account binding." : type === "admin_login" ? "Please use the following code to verify your identity for admin panel login." : "Please use the following code to reset your password.";
  try {
    console.log(`\u{1F4E7} Sending ${type} verification code to ${email}...`);
    console.log(`\u{1F4E7} From: ${FROM_EMAIL}`);
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${SITE_NAME} - ${typeText} Code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>${typeText}</h2>
            <p>${purposeText}</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #003366;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            <p style="margin-top: 30px;">Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("\u274C Failed to send verification code:");
      console.error("  Error name:", error.name);
      console.error("  Error message:", error.message);
      console.error("  Full error:", JSON.stringify(error, null, 2));
      return false;
    }
    console.log("\u2705 Verification code sent successfully!");
    console.log("  Email ID:", data?.id);
    return true;
  } catch (error) {
    console.error("\u274C Exception sending verification code:");
    console.error("  Message:", error?.message);
    console.error("  Stack:", error?.stack);
    return false;
  }
}
async function sendApplicationConfirmation(email, name) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${SITE_NAME} - Author Application Submitted`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>Application Received!</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for applying to become an author on <strong>${SITE_NAME}</strong>.</p>
            <p>Your application has been submitted successfully and is now <strong>pending review</strong> by our team.</p>
            <div style="background: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>\u23F3 What's Next?</strong></p>
              <ul style="margin: 10px 0 0; padding-left: 20px; color: #856404;">
                <li>Our team will review your application within 1-3 business days</li>
                <li>You will receive an email notification once approved</li>
                <li>To expedite the review process, you may contact our administrator</li>
              </ul>
            </div>
            <p style="margin-top: 30px;">Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a> | <a href="mailto:kdwelly@163.com">Contact Administrator</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send application confirmation:", error);
      return false;
    }
    console.log("Application confirmation sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending application confirmation:", error);
    return false;
  }
}
async function sendAdminApplicationNotification(applicantName, applicantEmail, company, expertiseAreas, bio) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  const adminEmail = process.env.ADMIN_EMAIL || "kdwelly@163.com";
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `\u{1F514} New Author Application - ${applicantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">New Author Application</p>
          </div>
          <div class="content">
            <h2>New Author Application Received</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Applicant Information</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Name:</strong></td>
                  <td style="padding: 8px 0;">${applicantName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 8px 0;"><a href="mailto:${applicantEmail}">${applicantEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Company:</strong></td>
                  <td style="padding: 8px 0;">${company || "Not provided"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Expertise:</strong></td>
                  <td style="padding: 8px 0;">${expertiseAreas.join(", ") || "Not specified"}</td>
                </tr>
              </table>
              ${bio ? `
                <h4 style="margin-top: 15px;">About the Applicant</h4>
                <p style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd;">${bio}</p>
              ` : ""}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${SITE_URL}/admin?tab=applications" class="button">Review Application</a>
            </div>
            <p style="margin-top: 30px;">Best regards,<br><strong>${SITE_NAME} System</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated notification from ${SITE_NAME}</p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send admin notification:", error);
      return false;
    }
    console.log("Admin notification sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return false;
  }
}
async function sendApprovalEmail(email, name, username, tempPassword) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  const loginUrl = `${SITE_URL}/author/login`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `\u{1F389} ${SITE_NAME} - Your Author Account is Approved!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>\u{1F389} Congratulations, ${name}!</h2>
            <p>Your author application has been <strong style="color: #28a745;">approved</strong>! Welcome to the <strong>${SITE_NAME}</strong> author community.</p>
            
            <div style="background: #e8f5e9; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #28a745;">Your Account Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Username:</strong></td>
                  <td style="padding: 8px 0; font-family: monospace; background: white; padding: 5px 10px; border-radius: 4px;">${username}</td>
                </tr>
                ${tempPassword ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Temp Password:</strong></td>
                  <td style="padding: 8px 0; font-family: monospace; background: white; padding: 5px 10px; border-radius: 4px;">${tempPassword}</td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Login URL:</strong></td>
                  <td style="padding: 8px 0;"><a href="${loginUrl}">${loginUrl}</a></td>
                </tr>
              </table>
            </div>
            
            <p><strong>\u26A0\uFE0F Important:</strong> Please change your password after your first login.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">Login Now</a>
            </div>
            
            <h4>What you can do now:</h4>
            <ul>
              <li>\u{1F4DD} Write and publish articles about special oil industry</li>
              <li>\u{1F4CA} Track your article views and engagement</li>
              <li>\u{1F468}\u200D\u{1F4BC} Manage your author profile</li>
            </ul>
            
            <p style="margin-top: 30px;">We look forward to seeing your contributions!</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a> | <a href="mailto:kdwelly@163.com">Contact Administrator</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send approval email:", error);
      return false;
    }
    console.log("Approval email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending approval email:", error);
    return false;
  }
}
async function sendRejectionEmail(email, name, reason) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${SITE_NAME} - Application Status Update`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>Application Status Update</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for your interest in becoming an author on <strong>${SITE_NAME}</strong>.</p>
            <p>After careful review, we regret to inform you that your application was not approved at this time.</p>
            
            ${reason ? `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>Reason:</strong></p>
              <p style="margin: 10px 0 0; color: #856404;">${reason}</p>
            </div>
            ` : ""}
            
            <p>You're welcome to reapply in the future with updated information.</p>
            <p>If you have any questions, please don't hesitate to contact our administrator.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a> | <a href="mailto:kdwelly@163.com">Contact Administrator</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send rejection email:", error);
      return false;
    }
    console.log("Rejection email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending rejection email:", error);
    return false;
  }
}
async function sendArticleApprovalEmail(email, authorName, articleTitle, articleId) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  const articleUrl = `${SITE_URL}/blog/${articleId}`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `\u{1F389} ${SITE_NAME} - Your Article Has Been Published!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>\u{1F389} Congratulations, ${authorName}!</h2>
            <p>Your article has been <strong style="color: #28a745;">approved and published</strong>!</p>
            
            <div style="background: #e8f5e9; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #28a745;">Article Details</h3>
              <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${articleTitle}</p>
              <a href="${articleUrl}" class="button" style="display: inline-block; background: #D4AF37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Article</a>
            </div>
            
            <p>Your article is now live and visible to all visitors. Share it with your network!</p>
            
            <h4>What happens next:</h4>
            <ul>
              <li>\u{1F4C8} Track your article's views and engagement</li>
              <li>\u{1F4AC} Respond to reader comments</li>
              <li>\u270D\uFE0F Continue writing more great content</li>
            </ul>
            
            <p style="margin-top: 30px;">Thank you for contributing to ${SITE_NAME}!</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}/author/dashboard">Author Dashboard</a> | <a href="${SITE_URL}">Visit Website</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send article approval email:", error);
      return false;
    }
    console.log("Article approval email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending article approval email:", error);
    return false;
  }
}
async function sendArticleRejectionEmail(email, authorName, articleTitle, reason) {
  if (!resend) {
    console.log("Resend not configured, skipping email");
    return false;
  }
  const dashboardUrl = `${SITE_URL}/author/dashboard`;
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${SITE_NAME} - Article Review Update`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>\u{1F3ED} ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>Article Review Update</h2>
            <p>Dear <strong>${authorName}</strong>,</p>
            <p>Thank you for submitting your article to <strong>${SITE_NAME}</strong>.</p>
            <p>After review, your article "<strong>${articleTitle}</strong>" requires some revisions before it can be published.</p>
            
            ${reason ? `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>Reviewer Feedback:</strong></p>
              <p style="margin: 10px 0 0; color: #856404;">${reason}</p>
            </div>
            ` : ""}
            
            <p>Please review the feedback above and make the necessary changes. You can edit and resubmit your article from your dashboard.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
            </div>
            
            <p style="margin-top: 30px;">We look forward to seeing your revised article!</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a> | <a href="mailto:kdwelly@163.com">Contact Administrator</a></p>
          </div>
        </body>
        </html>
      `
    });
    if (error) {
      console.error("Failed to send article rejection email:", error);
      return false;
    }
    console.log("Article rejection email sent:", data?.id);
    return true;
  } catch (error) {
    console.error("Error sending article rejection email:", error);
    return false;
  }
}
var resend, FROM_EMAIL, SITE_NAME, SITE_URL, emailStyles;
var init_email = __esm({
  "src/lib/email.ts"() {
    "use strict";
    console.log("\u{1F4E7} Email Service Config:");
    console.log("  RESEND_API_KEY:", process.env.RESEND_API_KEY ? "SET" : "NOT SET");
    console.log("  FROM_EMAIL:", process.env.FROM_EMAIL || "default: steven.shunyu@gmail.com");
    resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    FROM_EMAIL = process.env.FROM_EMAIL || "steven.shunyu@gmail.com";
    SITE_NAME = "SpecialOil";
    SITE_URL = process.env.SITE_URL || "https://specialoil.com";
    emailStyles = `
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #003366 0%, #004488 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #D4AF37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #c9a02e; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .footer a { color: #003366; }
    .article { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #D4AF37; }
    .article h3 { margin: 0 0 10px; color: #003366; }
    .article a { color: #D4AF37; text-decoration: none; }
  </style>
`;
  }
});

// server.ts
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

// src/storage/database/supabase-client.ts
import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
var envLoaded = false;
function loadEnv() {
  const hasUrl = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL;
  const hasKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (envLoaded || hasUrl && hasKey) {
    return;
  }
  try {
    try {
      __require("dotenv").config();
      const hasUrlNow = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL;
      const hasKeyNow = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
      if (hasUrlNow && hasKeyNow) {
        envLoaded = true;
        return;
      }
    } catch {
    }
    const pythonCode = `
import os
import sys
try:
    from coze_workload_identity import Client
    client = Client()
    env_vars = client.get_project_env_vars()
    client.close()
    for env_var in env_vars:
        print(f"{env_var.key}={env_var.value}")
except Exception as e:
    print(f"# Error: {e}", file=sys.stderr)
`;
    const output = execSync(`python3 -c '${pythonCode.replace(/'/g, `'"'"'`)}'`, {
      encoding: "utf-8",
      timeout: 1e4,
      stdio: ["pipe", "pipe", "pipe"]
    });
    const lines = output.trim().split("\n");
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const eqIndex = line.indexOf("=");
      if (eqIndex > 0) {
        const key = line.substring(0, eqIndex);
        let value = line.substring(eqIndex + 1);
        if (value.startsWith("'") && value.endsWith("'") || value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
    envLoaded = true;
  } catch {
  }
}
function getSupabaseCredentials() {
  loadEnv();
  const url = process.env.COZE_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.COZE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url) {
    throw new Error("SUPABASE_URL is not set");
  }
  if (!anonKey) {
    throw new Error("SUPABASE_ANON_KEY is not set");
  }
  return { url, anonKey };
}
function getSupabaseClient(token) {
  const { url, anonKey } = getSupabaseCredentials();
  if (token) {
    return createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` }
      },
      db: {
        timeout: 6e4
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return createClient(url, anonKey, {
    db: {
      timeout: 6e4
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// server.ts
init_email();
import { S3Storage } from "coze-coding-dev-sdk";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import crypto from "crypto";
console.log("\u{1F680} CODE VERSION: TEXT-MESSAGE-FORMAT-v1 (commit f5c0639)");
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var distPath = process.env.NODE_ENV === "production" ? path.join(__dirname, "dist") : path.join(process.cwd(), "dist");
console.log("========================================");
console.log("Starting server with security features...");
console.log("PORT:", process.env.PORT || 3001);
console.log("NODE_ENV:", process.env.NODE_ENV || "development");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL ? "SET" : "NOT SET");
console.log("Static files path:", distPath);
console.log("dist directory exists:", fs.existsSync(distPath));
console.log("========================================");
var app = express();
var httpServer = createServer(app);
var PORT = process.env.PORT || 3001;
var io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://localhost:3000", process.env.SITE_URL].filter(Boolean),
    methods: ["GET", "POST"],
    credentials: true
  },
  path: "/socket.io/"
});
app.use(cors());
app.use(express.json());
app.use(express.static(distPath, {
  index: false,
  // 禁止自动返回 index.html，让 SPA 路由处理
  maxAge: "1d"
  // 静态资源缓存
}));
var FEISHU_CHAT_WEBHOOK = process.env.FEISHU_CHAT_WEBHOOK;
var FEISHU_INQUIRY_WEBHOOK = process.env.FEISHU_INQUIRY_WEBHOOK;
var FEISHU_WEBHOOK_URL = FEISHU_CHAT_WEBHOOK || process.env.FEISHU_WEBHOOK_URL;
var FEISHU_APP_ID = process.env.FEISHU_APP_ID || process.env.FEISHU_CHAT_APP_ID;
var FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || process.env.FEISHU_CHAT_APP_SECRET;
var FEISHU_CHAT_ID = process.env.FEISHU_CHAT_ID;
var OPENAI_API_KEY = process.env.OPENAI_API_KEY;
var OPENAI_API_HOST = process.env.OPENAI_API_HOST || "api.openai.com";
console.log("========================================");
console.log("Server Configuration:");
console.log("FEISHU_APP_ID:", FEISHU_APP_ID || "NOT SET");
console.log("FEISHU_APP_SECRET:", FEISHU_APP_SECRET ? "SET" : "NOT SET");
console.log("FEISHU_CHAT_ID:", FEISHU_CHAT_ID || "NOT SET");
console.log("FEISHU_CHAT_WEBHOOK (\u5BA2\u670D\u901A\u77E5):", FEISHU_CHAT_WEBHOOK ? `SET` : "NOT SET");
console.log("FEISHU_INQUIRY_WEBHOOK (\u8BE2\u76D8\u901A\u77E5):", FEISHU_INQUIRY_WEBHOOK ? `SET` : "NOT SET");
console.log("OPENAI_API_KEY:", OPENAI_API_KEY ? "SET" : "NOT SET");
console.log("========================================");
var feishuAccessToken = null;
var tokenExpireTime = 0;
async function getFeishuAccessToken() {
  if (feishuAccessToken && Date.now() < tokenExpireTime) {
    return feishuAccessToken;
  }
  if (!FEISHU_APP_ID || !FEISHU_APP_SECRET) {
    return null;
  }
  try {
    const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET
      })
    });
    const data = await response.json();
    if (data.code === 0) {
      feishuAccessToken = data.tenant_access_token;
      tokenExpireTime = Date.now() + (data.expire - 300) * 1e3;
      console.log("\u2705 Feishu access token obtained");
      return feishuAccessToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting Feishu token:", error);
    return null;
  }
}
async function sendFeishuMessage(openId, message) {
  const token = await getFeishuAccessToken();
  if (!token) return false;
  try {
    const response = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        receive_id: openId,
        msg_type: "text",
        content: JSON.stringify({ text: message })
      })
    });
    const data = await response.json();
    return data.code === 0;
  } catch (error) {
    console.error("Error sending Feishu message:", error);
    return false;
  }
}
async function sendFeishuGroupMessage(sessionId, visitorName, visitorEmail, message) {
  if (!FEISHU_WEBHOOK_URL) {
    console.log("Feishu webhook not configured");
    return false;
  }
  const shortId = sessionId.substring(0, 8);
  try {
    const response = await fetch(FEISHU_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        msg_type: "interactive",
        card: {
          header: {
            title: { tag: "plain_text", content: `\u{1F4AC} \u6765\u81EA\u8BBF\u5BA2: ${visitorName || "\u533F\u540D"}` },
            template: "blue"
          },
          elements: [
            {
              tag: "div",
              fields: [
                { is_short: true, text: { tag: "lark_md", content: `**\u4F1A\u8BDDID:**
${shortId}` } },
                { is_short: true, text: { tag: "lark_md", content: `**\u90AE\u7BB1:**
${visitorEmail || "\u672A\u63D0\u4F9B"}` } }
              ]
            },
            {
              tag: "div",
              text: { tag: "lark_md", content: `**\u6D88\u606F\u5185\u5BB9:**
${message}` }
            },
            {
              tag: "note",
              elements: [
                { tag: "plain_text", content: `\u56DE\u590D\u683C\u5F0F: /reply ${shortId} \u60A8\u7684\u56DE\u590D\u5185\u5BB9` }
              ]
            }
          ]
        }
      })
    });
    return response.ok;
  } catch (error) {
    console.error("Error sending Feishu group message:", error);
    return false;
  }
}
async function sendFeishuChatMessage(sessionId, customerNo, customerName, customerEmail, customerPhone, message, rootMessageId) {
  const token = await getFeishuAccessToken();
  if (!token || !FEISHU_CHAT_ID) {
    console.log("Feishu API not configured, falling back to webhook");
    const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
    return { success: webhookSuccess };
  }
  const shortId = sessionId.substring(0, 8);
  const timestamp = (/* @__PURE__ */ new Date()).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  const card = {
    config: { wide_screen_mode: true },
    header: {
      title: { tag: "plain_text", content: rootMessageId ? `\u{1F4AC} ${customerNo}` : `\u{1F514} \u65B0\u5BA2\u6237\u54A8\u8BE2 ${customerNo}` },
      template: "blue"
    },
    elements: [
      {
        tag: "div",
        fields: [
          { is_short: true, text: { tag: "lark_md", content: `**\u5BA2\u6237\u59D3\u540D**
${customerName}` } },
          { is_short: true, text: { tag: "lark_md", content: `**\u65F6\u95F4**
${timestamp}` } },
          { is_short: true, text: { tag: "lark_md", content: `**\u90AE\u7BB1**
${customerEmail || "\u672A\u63D0\u4F9B"}` } },
          { is_short: true, text: { tag: "lark_md", content: `**\u7535\u8BDD**
${customerPhone || "\u672A\u63D0\u4F9B"}` } }
        ]
      },
      { tag: "hr" },
      { tag: "div", text: { tag: "lark_md", content: `**\u6D88\u606F\u5185\u5BB9**
${message}` } },
      { tag: "hr" },
      { tag: "note", text: { tag: "lark_md", content: rootMessageId ? `\u{1F4AC} \u76F4\u63A5\u5728\u8BDD\u9898\u4E0B\u56DE\u590D\u5BA2\u6237` : `\u{1F4AC} \u76F4\u63A5\u5728\u8BDD\u9898\u4E0B\u56DE\u590D\u5BA2\u6237` } }
    ]
  };
  try {
    const requestBody = {
      receive_id: FEISHU_CHAT_ID,
      msg_type: "interactive",
      content: JSON.stringify(card)
    };
    if (rootMessageId) {
      requestBody.root_id = rootMessageId;
    }
    const response = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    if (data.code === 0 && data.data?.message_id) {
      console.log(`\u2705 Feishu message sent: ${data.data.message_id}`);
      return { success: true, messageId: data.data.message_id };
    } else {
      console.error("Feishu API error:", data);
      const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
      return { success: webhookSuccess };
    }
  } catch (error) {
    console.error("Error sending Feishu API message:", error);
    const webhookSuccess = await sendFeishuGroupMessage(sessionId, customerName, customerEmail, message);
    return { success: webhookSuccess };
  }
}
var connectedVisitors = /* @__PURE__ */ new Map();
var sessionSocketMap = /* @__PURE__ */ new Map();
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("visitor:join", async (data) => {
    const { visitorId, name, email } = data;
    const client = getSupabaseClient();
    let session = null;
    const { data: existingSession } = await client.from("chat_sessions").select("*").eq("visitor_id", visitorId).in("status", ["waiting", "active"]).order("created_at", { ascending: false }).limit(1).single();
    if (existingSession) {
      session = existingSession;
    } else {
      const { data: newSession, error } = await client.from("chat_sessions").insert({
        visitor_id: visitorId,
        visitor_name: name || null,
        visitor_email: email || null,
        status: "waiting"
        // 新会话设为等待状态
      }).select().single();
      if (!error && newSession) {
        session = newSession;
      }
    }
    if (session) {
      socket.join(`session:${session.id}`);
      connectedVisitors.set(visitorId, socket.id);
      sessionSocketMap.set(session.id, socket.id);
      socket.data.visitorId = visitorId;
      socket.data.sessionId = session.id;
      socket.emit("session:created", session);
      const { data: messages } = await client.from("chat_messages").select("*").eq("session_id", session.id).order("created_at", { ascending: true });
      socket.emit("messages:history", messages || []);
      socket.emit("session:active", { message: "Connected to support" });
    }
  });
  socket.on("visitor:message", async (data) => {
    const { sessionId, message } = data;
    const client = getSupabaseClient();
    const { data: savedMessage, error } = await client.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "visitor",
      sender_name: "Visitor",
      message
    }).select().single();
    if (!error && savedMessage) {
      socket.emit("message:received", savedMessage);
      const { data: session } = await client.from("chat_sessions").select("*").eq("id", sessionId).single();
      if (session) {
        const visitorName = session.visitor_name || "Visitor";
        const visitorEmail = session.visitor_email || "Not provided";
        const visitorPhone = session.visitor_phone || "Not provided";
        const customerNo = session.customer_no || `#${sessionId.substring(0, 8)}`;
        const rootMessageId = session.feishu_root_message_id;
        console.log(`Sending message to Feishu for session ${sessionId}`);
        const result = await sendFeishuChatMessage(
          sessionId,
          customerNo,
          visitorName,
          visitorEmail,
          visitorPhone,
          message,
          rootMessageId
          // 如果有 root_message_id，则作为话题回复
        );
        if (result.success && result.messageId && !rootMessageId) {
          await client.from("chat_sessions").update({ feishu_root_message_id: result.messageId }).eq("id", sessionId);
          console.log(`\u2705 Saved root message ID: ${result.messageId}`);
        }
      }
      await client.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    }
  });
  socket.on("session:close", async (sessionId) => {
    const client = getSupabaseClient();
    await client.from("chat_sessions").update({ status: "closed" }).eq("id", sessionId);
    socket.emit("session:closed");
    sessionSocketMap.delete(sessionId);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    if (socket.data.visitorId) connectedVisitors.delete(socket.data.visitorId);
    if (socket.data.sessionId) sessionSocketMap.delete(socket.data.sessionId);
  });
});
app.post("/feishu/webhook", async (req, res) => {
  console.log("=== Received Feishu webhook ===");
  console.log("Body:", JSON.stringify(req.body, null, 2));
  const { type, challenge, event } = req.body;
  if (type === "url_verification") {
    console.log("URL verification, challenge:", challenge);
    return res.status(200).json({ challenge });
  }
  if (event?.message) {
    const message = event.message;
    const senderId = event.sender?.sender_id?.open_id;
    const rootId = message.root_id;
    const parentId = message.parent_id;
    let messageText = "";
    try {
      const content = JSON.parse(message.content || "{}");
      messageText = content.text || "";
    } catch {
      messageText = message.content || "";
    }
    console.log(`Feishu message from ${senderId}: ${messageText}, root_id: ${rootId}, parent_id: ${parentId}`);
    const client = getSupabaseClient();
    if (rootId) {
      console.log(`Looking for session with feishu_root_message_id: ${rootId}`);
      const { data: sessionByRootId } = await client.from("chat_sessions").select("*").eq("feishu_root_message_id", rootId).eq("status", "active").single();
      if (sessionByRootId) {
        console.log(`Found session ${sessionByRootId.id} by root_id`);
        await client.from("chat_messages").insert({
          session_id: sessionByRootId.id,
          sender_type: "admin",
          sender_name: "Support",
          message: messageText
        });
        io.to(`session:${sessionByRootId.id}`).emit("message:new", {
          id: Date.now().toString(),
          session_id: sessionByRootId.id,
          sender_type: "admin",
          sender_name: "Support",
          message: messageText,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log(`\u2705 Topic reply sent to visitor: ${messageText}`);
        return res.status(200).json({ code: 0, msg: "success" });
      }
    }
    const replyMatch = messageText.match(/^\/reply\s+(\w+)\s+(.+)/is);
    if (replyMatch) {
      const sessionShortId = replyMatch[1];
      const replyMessage = replyMatch[2];
      const { data: sessions } = await client.from("chat_sessions").select("*").eq("status", "active");
      const targetSession = sessions?.find(
        (s) => s.id.startsWith(sessionShortId)
      );
      if (targetSession) {
        console.log(`Found session ${targetSession.id} for reply`);
        await client.from("chat_messages").insert({
          session_id: targetSession.id,
          sender_type: "admin",
          sender_name: "Support",
          message: replyMessage
        });
        io.to(`session:${targetSession.id}`).emit("message:new", {
          id: Date.now().toString(),
          session_id: targetSession.id,
          sender_type: "admin",
          sender_name: "Support",
          message: replyMessage,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        console.log(`\u2705 Reply sent to visitor: ${replyMessage}`);
        if (senderId) {
          await sendFeishuMessage(senderId, `\u2705 \u6D88\u606F\u5DF2\u53D1\u9001\u7ED9\u8BBF\u5BA2`);
        }
      } else {
        console.log(`Session not found: ${sessionShortId}`);
        if (senderId) {
          await sendFeishuMessage(senderId, `\u274C \u672A\u627E\u5230\u4F1A\u8BDD: ${sessionShortId}`);
        }
      }
    }
  }
  res.status(200).json({ code: 0, msg: "success" });
});
app.get("/feishu/webhook", (req, res) => {
  res.status(200).json({ status: "ok", message: "Feishu webhook endpoint is working" });
});
var WEBSITE_KNOWLEDGE = `
You are an AI assistant for CN-SpecLube Chain (Chinese Special Oil Supply Platform).

**IMPORTANT: You MUST respond in English only. Never respond in Chinese or any other language.**

About the Company:
- Leading Chinese supplier of specialty lubricants and oils
- Products: Transformer Oil, Rubber Process Oil, White Oil, Finished Lubricants
- Services: Quality assurance, global logistics, custom solutions

Contact Information:
- Email: steven.shunyu@gmail.com
- Phone: +8613793280176
- Website: https://cnspecialtyoils.com

**IMPORTANT Website Promotion Rules:**
- When providing product information, ALWAYS include the website: https://cnspecialtyoils.com
- When users ask about products, services, or company info, mention they can visit https://cnspecialtyoils.com for more details
- At the end of helpful responses, naturally suggest visiting https://cnspecialtyoils.com
- For product inquiries, direct them to specific pages like:
  * Transformer Oil: https://cnspecialtyoils.com/products/transformer-oil
  * Rubber Process Oil: https://cnspecialtyoils.com/products/rubber-process-oil
  * Finished Lubricants: https://cnspecialtyoils.com/products/finished-lubricants
  * All Products: https://cnspecialtyoils.com/products
  * Quality Assurance: https://cnspecialtyoils.com/quality
  * Logistics: https://cnspecialtyoils.com/logistics
  * Contact: https://cnspecialtyoils.com/contact
- Make the website mention feel natural and helpful, not forced

When to Transfer to Human Agent:
If user asks about: pricing, quotes, custom orders, complaints, partnership, bulk orders, or requests human help - respond: "I'll connect you with a human agent. Please wait..."
`;
function needsHumanAgent(message) {
  const keywords = [
    "price",
    "pricing",
    "quote",
    "quotation",
    "cost",
    "discount",
    "negotiate",
    "complaint",
    "complain",
    "human",
    "agent",
    "person",
    "speak to",
    "talk to",
    "manager",
    "supervisor",
    "urgent",
    "emergency",
    "custom order",
    "special order",
    "partnership",
    "bulk order",
    "wholesale",
    "distributor",
    "human support",
    "customer service",
    "live chat"
  ];
  return keywords.some((k) => message.toLowerCase().includes(k));
}
app.get("/api/chat/messages", async (req, res) => {
  try {
    const { sessionId, after } = req.query;
    console.log(`\u{1F4E8} Polling messages for session: ${sessionId}`);
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      console.log("\u26A0\uFE0F Database not configured");
      return res.json({ messages: [] });
    }
    let targetSession = null;
    const { data: exactSession } = await client.from("chat_sessions").select("id, status").eq("id", sessionId).single();
    if (exactSession) {
      targetSession = exactSession;
      console.log(`\u2705 Found exact session: ${targetSession.id}`);
    } else {
      const { data: sessions } = await client.from("chat_sessions").select("id, status").eq("status", "active");
      targetSession = sessions?.find((s) => s.id.startsWith(sessionId));
      if (targetSession) {
        console.log(`\u2705 Found session by prefix match: ${targetSession.id}`);
      } else {
        console.log(`\u26A0\uFE0F Session not found: ${sessionId}`);
        return res.json({ messages: [] });
      }
    }
    let query = client.from("chat_messages").select("*").eq("session_id", targetSession.id).order("created_at", { ascending: true });
    if (after) {
      const { data: afterMessage } = await client.from("chat_messages").select("created_at").eq("id", after).single();
      if (afterMessage) {
        query = query.gt("created_at", afterMessage.created_at);
      }
    }
    const { data: messages, error } = await query;
    if (error) {
      console.error("Error fetching messages:", error);
      return res.json({ messages: [] });
    }
    console.log(`\u{1F4EC} Returning ${messages?.length || 0} messages`);
    res.json({ messages: messages || [] });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});
app.get("/api/chat/sessions", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    const { data: sessions, error } = await client.from("chat_sessions").select("*").order("updated_at", { ascending: false });
    if (error) {
      console.error("Error fetching sessions:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: sessions || [] });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Failed to get sessions" });
  }
});
app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    const { data: messages, error } = await client.from("chat_messages").select("*").eq("session_id", sessionId).order("created_at", { ascending: true });
    if (error) {
      console.error("Error fetching messages:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: messages || [] });
  } catch (error) {
    console.error("Get session messages error:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
});
app.get("/api/chat/sessions/:sessionId/status", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: false, error: "Database not configured" });
    }
    const { data: session, error } = await client.from("chat_sessions").select("status").eq("id", sessionId).single();
    if (error || !session) {
      return res.json({ success: false, error: "Session not found" });
    }
    res.json({ success: true, status: session.status });
  } catch (error) {
    console.error("Get session status error:", error);
    res.status(500).json({ error: "Failed to get session status" });
  }
});
app.post("/api/chat/admin/message", async (req, res) => {
  try {
    const { sessionId, message, adminName } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "Session ID and message are required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { error: insertError } = await client.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "admin",
      sender_name: adminName || "Support",
      message
    });
    if (insertError) {
      console.error("Error saving admin message:", insertError);
      return res.status(500).json({ error: "Failed to save message" });
    }
    await client.from("chat_sessions").update({
      status: "active",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", sessionId).eq("status", "waiting");
    await client.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    res.json({ success: true, message: "Message sent" });
  } catch (error) {
    console.error("Admin message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
app.post("/api/chat/sessions/:sessionId/close", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { error } = await client.from("chat_sessions").update({ status: "closed", updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    if (error) {
      console.error("Error closing session:", error);
      return res.status(500).json({ error: "Failed to close session" });
    }
    res.json({ success: true, message: "Session closed" });
  } catch (error) {
    console.error("Close session error:", error);
    res.status(500).json({ error: "Failed to close session" });
  }
});
app.delete("/api/chat/sessions/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { error: messagesError } = await client.from("chat_messages").delete().eq("session_id", sessionId);
    if (messagesError) {
      console.error("Error deleting session messages:", messagesError);
      return res.status(500).json({ error: "Failed to delete session messages" });
    }
    const { error: sessionError } = await client.from("chat_sessions").delete().eq("id", sessionId);
    if (sessionError) {
      console.error("Error deleting session:", sessionError);
      return res.status(500).json({ error: "Failed to delete session" });
    }
    console.log(`\u2705 Session ${sessionId} deleted successfully`);
    res.json({ success: true, message: "Session deleted" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Failed to delete session" });
  }
});
app.post("/api/chat/human", async (req, res) => {
  try {
    const { message, sessionId, customerInfo } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { data: existingSession } = await client.from("chat_sessions").select("*").eq("id", sessionId).single();
    if (!existingSession) {
      return res.status(404).json({ error: "Session not found" });
    }
    await client.from("chat_messages").insert({
      session_id: sessionId,
      sender_type: "visitor",
      sender_name: existingSession.visitor_name || "Visitor",
      message
    });
    await client.from("chat_sessions").update({ updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", sessionId);
    if (FEISHU_WEBHOOK_URL) {
      const customerNo = existingSession.customer_no || `#${sessionId.substring(0, 8)}`;
      const visitorName = existingSession.visitor_name || "Visitor";
      const notification = {
        msg_type: "text",
        content: {
          text: `\u{1F4AC} \u65B0\u6D88\u606F ${customerNo}

${visitorName}: ${message.substring(0, 200)}${message.length > 200 ? "..." : ""}

\u8BF7\u524D\u5F80\u540E\u53F0\u56DE\u590D: ${process.env.SITE_URL || "https://cnspecialtyoils.com"}/admin/chat`
        }
      };
      try {
        console.log(`\u{1F4E4} Sending Feishu notification for new message from ${customerNo}`);
        const feishuResponse = await fetch(FEISHU_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification)
        });
        const feishuResult = await feishuResponse.text();
        console.log(`\u{1F4E5} Feishu response status: ${feishuResponse.status}`);
        console.log(`\u{1F4E5} Feishu response: ${feishuResult}`);
        if (feishuResponse.ok) {
          console.log(`\u2705 Feishu notification sent successfully for ${customerNo}`);
        } else {
          console.error(`\u274C Feishu notification failed: ${feishuResult}`);
        }
      } catch (feishuError) {
        console.error("\u274C Failed to send Feishu notification:", feishuError);
      }
    } else {
      console.log("\u26A0\uFE0F FEISHU_WEBHOOK_URL not configured, skipping notification");
    }
    res.json({
      success: true,
      message: "Message sent",
      session: existingSession
    });
  } catch (error) {
    console.error("Human chat error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});
app.post("/api/chat", async (req, res) => {
  console.log(`\u{1F4E9} POST /api/chat received`);
  console.log(`   Body:`, JSON.stringify(req.body).substring(0, 200));
  try {
    const { message, customerInfo } = req.body;
    if (!message) {
      console.log(`\u26A0\uFE0F No message in request body`);
      return res.status(400).json({ error: "Message required" });
    }
    console.log(`\u{1F4DD} Processing message: "${message.substring(0, 50)}..."`);
    console.log(`\u{1F50D} needsHumanAgent check: ${needsHumanAgent(message)}`);
    if (needsHumanAgent(message)) {
      console.log(`\u{1F514} needsHumanAgent triggered for message: "${message.substring(0, 50)}..."`);
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const shortId = sessionId.substring(0, 8);
      const customerNo = customerInfo?.customerNo || `#${shortId}`;
      const customerName = customerInfo?.name || "Unknown";
      const customerEmail = customerInfo?.email || "Not provided";
      const customerPhone = customerInfo?.phone || "Not provided";
      console.log(`\u{1F4CB} Creating chat session: ${customerNo}, Name: ${customerName}, Email: ${customerEmail}`);
      const client = getSupabaseClient();
      if (client) {
        await client.from("chat_sessions").insert({
          id: sessionId,
          visitor_id: sessionId,
          visitor_name: customerName,
          visitor_email: customerEmail,
          visitor_phone: customerPhone,
          customer_no: customerNo,
          status: "waiting"
          // 新会话设为等待状态，管理员回复后变为 active
        });
        await client.from("chat_messages").insert({
          session_id: sessionId,
          sender_type: "visitor",
          sender_name: customerName,
          message
        });
        console.log(`\u2705 Session saved: ${customerNo}`);
      }
      console.log(`\u{1F50D} Checking FEISHU_WEBHOOK_URL: ${FEISHU_WEBHOOK_URL ? "SET" : "NOT SET"}`);
      if (FEISHU_WEBHOOK_URL) {
        console.log(`\u{1F4E4} Preparing to send Feishu notification for human support request...`);
        console.log(`   Webhook URL: ${FEISHU_WEBHOOK_URL}`);
        const notification = {
          msg_type: "text",
          content: {
            text: `\u{1F514} \u65B0\u5BA2\u6237\u54A8\u8BE2 ${customerNo}

\u5BA2\u6237\u4FE1\u606F:
\u{1F464} \u59D3\u540D: ${customerName}
\u{1F4E7} \u90AE\u7BB1: ${customerEmail}
\u{1F4F1} \u7535\u8BDD: ${customerPhone}
\u{1F4AC} \u6D88\u606F: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}

\u8BF7\u524D\u5F80\u540E\u53F0\u56DE\u590D: ${process.env.SITE_URL || "https://cnspecialtyoils.com"}/admin/chat`
          }
        };
        console.log(`\u{1F4E4} NOTIFICATION CONTENT: ${JSON.stringify(notification)}`);
        try {
          console.log(`\u{1F4E4} Sending Feishu notification for new customer: ${customerNo}`);
          console.log(`   Webhook URL: ${FEISHU_WEBHOOK_URL?.substring(0, 50)}...`);
          const feishuResponse = await fetch(FEISHU_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notification)
          });
          const feishuResult = await feishuResponse.text();
          console.log(`\u{1F4E5} Feishu response status: ${feishuResponse.status}`);
          console.log(`\u{1F4E5} Feishu response body: ${feishuResult}`);
          if (feishuResponse.ok) {
            console.log(`\u2705 Feishu notification sent successfully: ${customerNo}`);
          } else {
            console.error(`\u274C Feishu notification failed with status ${feishuResponse.status}: ${feishuResult}`);
          }
        } catch (error) {
          console.error("\u274C Feishu notification error:", error);
        }
      } else {
        console.log("\u26A0\uFE0F FEISHU_WEBHOOK_URL not configured, skipping Feishu notification for human support");
      }
      return res.json({
        response: "I'll connect you with a human agent. Please wait...",
        needsHuman: true,
        sessionId
      });
    }
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "AI not configured" });
    }
    const response = await fetch(`https://${OPENAI_API_HOST}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: WEBSITE_KNOWLEDGE },
          { role: "user", content: message }
        ],
        max_tokens: 500
      })
    });
    const data = await response.json();
    res.json({ response: data.choices?.[0]?.message?.content || "Sorry, error occurred." });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/inquiries", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ data: [] });
    }
    const { data, error } = await client.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching inquiries:", error);
      return res.json({ data: [] });
    }
    res.json({ data: data || [] });
  } catch (error) {
    console.error("Get inquiries error:", error);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});
app.post("/api/inquiries", async (req, res) => {
  try {
    const { name, company, email, productCategory, portOfDestination, estimatedQuantity, message, captchaToken } = req.body;
    if (!name || !company || !email || !portOfDestination) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (captchaToken) {
      const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;
      if (HCAPTCHA_SECRET) {
        const captchaResponse = await fetch("https://api.hcaptcha.com/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${HCAPTCHA_SECRET}&response=${captchaToken}`
        });
        const captchaResult = await captchaResponse.json();
        if (!captchaResult.success) {
          return res.status(400).json({ error: "Captcha verification failed" });
        }
      }
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { data, error } = await client.from("inquiries").insert({
      name,
      company,
      email,
      product_category: productCategory || null,
      port_of_destination: portOfDestination,
      estimated_quantity: estimatedQuantity || null,
      message: message || null,
      status: "new"
    }).select().single();
    if (error) {
      console.error("Error creating inquiry:", error);
      return res.status(500).json({ error: "Failed to save inquiry" });
    }
    console.log(`\u2705 New inquiry created: ${name} from ${company}`);
    const inquiryWebhook = FEISHU_INQUIRY_WEBHOOK || FEISHU_WEBHOOK_URL;
    if (inquiryWebhook) {
      try {
        console.log(`\u{1F4E4} Sending inquiry notification to Feishu...`);
        const notification = {
          msg_type: "text",
          content: {
            text: `\u{1F4E7} \u65B0\u5BA2\u6237\u8BE2\u4EF7

\u5BA2\u6237\u4FE1\u606F:
\u{1F464} \u59D3\u540D: ${name}
\u{1F3E2} \u516C\u53F8: ${company}
\u{1F4E7} \u90AE\u7BB1: ${email}
\u{1F4E6} \u4EA7\u54C1: ${productCategory || "\u672A\u6307\u5B9A"}
\u{1F6A2} \u76EE\u7684\u6E2F: ${portOfDestination}
\u{1F4CA} \u6570\u91CF: ${estimatedQuantity || "\u672A\u6307\u5B9A"}

\u{1F4AC} \u6D88\u606F: ${message || "\u65E0"}`
          }
        };
        const response = await fetch(inquiryWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification)
        });
        const result = await response.text();
        console.log(`\u{1F4E5} Feishu inquiry notification response: ${response.status} - ${result}`);
      } catch (feishuError) {
        console.error("\u274C Failed to send Feishu inquiry notification:", feishuError);
      }
    } else {
      console.log("\u26A0\uFE0F No inquiry webhook configured");
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});
app.patch("/api/inquiries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const updateData = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (status) updateData.status = status;
    if (notes !== void 0) updateData.notes = notes;
    const { error } = await client.from("inquiries").update(updateData).eq("id", id);
    if (error) {
      console.error("Error updating inquiry:", error);
      return res.status(500).json({ error: "Failed to update inquiry" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Update inquiry error:", error);
    res.status(500).json({ error: "Failed to update inquiry" });
  }
});
var imageStorage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing"
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  // 限制10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("\u53EA\u5141\u8BB8\u4E0A\u4F20\u56FE\u7247\u6587\u4EF6"));
    }
  }
});
app.post("/api/images/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "\u6CA1\u6709\u4E0A\u4F20\u6587\u4EF6" });
    }
    console.log(`\u{1F4E4} Uploading image: ${req.file.originalname}, size: ${req.file.size}`);
    const timestamp = Date.now();
    const ext = req.file.originalname.split(".").pop() || "jpg";
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `blog-images/${timestamp}_${safeName}`;
    const fileKey = await imageStorage.uploadFile({
      fileContent: req.file.buffer,
      fileName,
      contentType: req.file.mimetype
    });
    console.log(`\u2705 Image uploaded: ${fileKey}`);
    const imageUrl = await imageStorage.generatePresignedUrl({
      key: fileKey,
      expireTime: 31536e3
      // 1年有效期
    });
    res.json({
      success: true,
      key: fileKey,
      url: imageUrl,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "\u4E0A\u4F20\u5931\u8D25" });
  }
});
app.get("/api/images", async (req, res) => {
  try {
    const { prefix = "blog-images/", maxKeys = 100 } = req.query;
    console.log(`\u{1F4CB} Listing images with prefix: ${prefix}`);
    const result = await imageStorage.listFiles({
      prefix,
      maxKeys: Number(maxKeys)
    });
    const images = await Promise.all(
      (result.keys || []).map(async (key) => {
        const url = await imageStorage.generatePresignedUrl({
          key,
          expireTime: 3600
          // 1小时有效期
        });
        return {
          key,
          url,
          name: key.split("/").pop() || key
        };
      })
    );
    res.json({
      success: true,
      images,
      isTruncated: result.isTruncated,
      nextToken: result.nextContinuationToken
    });
  } catch (error) {
    console.error("List images error:", error);
    res.status(500).json({ error: "\u83B7\u53D6\u56FE\u7247\u5217\u8868\u5931\u8D25" });
  }
});
app.delete("/api/images/:key", async (req, res) => {
  try {
    const { key } = req.params;
    if (!key) {
      return res.status(400).json({ error: "\u7F3A\u5C11\u56FE\u7247key" });
    }
    console.log(`\u{1F5D1}\uFE0F Deleting image: ${key}`);
    const success = await imageStorage.deleteFile({ fileKey: key });
    if (success) {
      res.json({ success: true, message: "\u5220\u9664\u6210\u529F" });
    } else {
      res.status(404).json({ error: "\u56FE\u7247\u4E0D\u5B58\u5728" });
    }
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ error: "\u5220\u9664\u5931\u8D25" });
  }
});
var geoCache = /* @__PURE__ */ new Map();
async function getGeoLocation(ip) {
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
    return {
      country: "Local",
      country_code: "LO",
      region: "Local",
      city: "Local",
      latitude: 0,
      longitude: 0,
      timezone: "UTC"
    };
  }
  if (geoCache.has(ip)) {
    return geoCache.get(ip);
  }
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,city,lat,lon,timezone`);
    const data = await response.json();
    if (data.status === "success") {
      const result = {
        country: data.country || "Unknown",
        country_code: data.countryCode || "XX",
        region: data.region || "Unknown",
        city: data.city || "Unknown",
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        timezone: data.timezone || "UTC"
      };
      geoCache.set(ip, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error("Geo location error:", error);
    return null;
  }
}
function parseUserAgent(userAgent) {
  const result = {
    browser: "Unknown",
    browserVersion: "",
    os: "Unknown",
    osVersion: "",
    deviceType: "desktop"
  };
  if (!userAgent) return result;
  if (userAgent.includes("Windows NT 10")) {
    result.os = "Windows";
    result.osVersion = "10/11";
  } else if (userAgent.includes("Windows NT 6.3")) {
    result.os = "Windows";
    result.osVersion = "8.1";
  } else if (userAgent.includes("Windows NT 6.1")) {
    result.os = "Windows";
    result.osVersion = "7";
  } else if (userAgent.includes("Mac OS X")) {
    result.os = "macOS";
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) result.osVersion = match[1].replace("_", ".");
  } else if (userAgent.includes("Android")) {
    result.os = "Android";
    const match = userAgent.match(/Android (\d+\.?\d*)/);
    if (match) result.osVersion = match[1];
    result.deviceType = "mobile";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    result.os = "iOS";
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    if (match) result.osVersion = match[1].replace("_", ".");
    result.deviceType = userAgent.includes("iPad") ? "tablet" : "mobile";
  } else if (userAgent.includes("Linux")) {
    result.os = "Linux";
  }
  if (userAgent.includes("Edg/")) {
    result.browser = "Edge";
    const match = userAgent.match(/Edg\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  } else if (userAgent.includes("Chrome/")) {
    result.browser = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  } else if (userAgent.includes("Firefox/")) {
    result.browser = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  } else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) {
    result.browser = "Safari";
    const match = userAgent.match(/Version\/(\d+\.?\d*)/);
    if (match) result.browserVersion = match[1];
  }
  if (userAgent.includes("Tablet") || userAgent.includes("iPad")) {
    result.deviceType = "tablet";
  }
  return result;
}
function parseTrafficSource(referrer, utmSource, utmMedium) {
  if (utmSource) return utmMedium || "campaign";
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    const domain = url.hostname.toLowerCase();
    const searchEngines = ["google", "bing", "yahoo", "baidu", "duckduckgo", "yandex", "sogou", "360", "shenma"];
    if (searchEngines.some((se) => domain.includes(se))) return "organic";
    const socialMedia = ["facebook", "twitter", "linkedin", "instagram", "youtube", "weibo", "weixin", "wechat", "tiktok", "douyin", "xiaohongshu", "pinterest", "reddit"];
    if (socialMedia.some((sm) => domain.includes(sm))) return "social";
    if (domain.includes("mail") || utmMedium === "email") return "email";
    return "referral";
  } catch {
    return "direct";
  }
}
app.post("/api/analytics/track", async (req, res) => {
  try {
    const { visitorId, sessionId, pageUrl, pagePath, pageTitle, referrer, screenResolution, language, utmSource, utmMedium, utmCampaign } = req.body;
    if (!visitorId || !pageUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const geo = await getGeoLocation(ip);
    const userAgent = req.headers["user-agent"] || "";
    const uaInfo = parseUserAgent(userAgent);
    const trafficSource = parseTrafficSource(referrer, utmSource, utmMedium);
    let referrerDomain = null;
    if (referrer) {
      try {
        referrerDomain = new URL(referrer).hostname;
      } catch {
      }
    }
    const { data: existingVisitor } = await client.from("visitors").select("*").eq("visitor_id", visitorId).single();
    if (existingVisitor) {
      await client.from("visitors").update({
        last_visit_at: (/* @__PURE__ */ new Date()).toISOString(),
        visit_count: (existingVisitor.visit_count || 0) + 1,
        ip_address: ip,
        country: geo?.country || existingVisitor.country,
        city: geo?.city || existingVisitor.city,
        browser: uaInfo.browser,
        os: uaInfo.os,
        device_type: uaInfo.deviceType,
        screen_resolution: screenResolution || existingVisitor.screen_resolution
      }).eq("visitor_id", visitorId);
    } else {
      await client.from("visitors").insert({
        visitor_id: visitorId,
        ip_address: ip,
        country: geo?.country || "Unknown",
        country_code: geo?.country_code || "XX",
        region: geo?.region || "Unknown",
        city: geo?.city || "Unknown",
        latitude: geo?.latitude || 0,
        longitude: geo?.longitude || 0,
        timezone: geo?.timezone || "UTC",
        browser: uaInfo.browser,
        browser_version: uaInfo.browserVersion,
        os: uaInfo.os,
        os_version: uaInfo.osVersion,
        device_type: uaInfo.deviceType,
        screen_resolution: screenResolution,
        language
      });
    }
    await client.from("page_views").insert({
      visitor_id: visitorId,
      session_id: sessionId,
      page_url: pageUrl,
      page_path: pagePath || new URL(pageUrl).pathname,
      page_title: pageTitle,
      referrer,
      referrer_domain: referrerDomain,
      traffic_source: trafficSource,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign
    });
    if (sessionId) {
      const { data: existingSession } = await client.from("active_sessions").select("*").eq("session_id", sessionId).single();
      if (existingSession) {
        await client.from("active_sessions").update({
          last_activity_at: (/* @__PURE__ */ new Date()).toISOString(),
          page_url: pageUrl,
          page_title: pageTitle,
          page_views: (existingSession.page_views || 0) + 1
        }).eq("session_id", sessionId);
      } else {
        await client.from("active_sessions").insert({
          visitor_id: visitorId,
          session_id: sessionId,
          ip_address: ip,
          country: geo?.country || "Unknown",
          city: geo?.city || "Unknown",
          page_url: pageUrl,
          page_title: pageTitle,
          browser: uaInfo.browser,
          os: uaInfo.os,
          device_type: uaInfo.deviceType
        });
      }
    }
    res.json({ success: true, isNewVisitor: !existingVisitor });
  } catch (error) {
    console.error("Track visitor error:", error);
    res.status(500).json({ error: "Failed to track visitor" });
  }
});
app.post("/api/analytics/leave", async (req, res) => {
  try {
    const { sessionId, pageUrl, durationSeconds, scrollDepth } = req.body;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    const { data: pageView } = await client.from("page_views").select("id").eq("session_id", sessionId).eq("page_url", pageUrl).is("exit_time", null).order("entry_time", { ascending: false }).limit(1).single();
    if (pageView) {
      await client.from("page_views").update({
        exit_time: (/* @__PURE__ */ new Date()).toISOString(),
        duration_seconds: durationSeconds,
        scroll_depth: scrollDepth,
        is_bounce: durationSeconds < 10
      }).eq("id", pageView.id);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Leave page error:", error);
    res.status(500).json({ error: "Failed to record leave" });
  }
});
app.post("/api/analytics/end-session", async (req, res) => {
  try {
    const { sessionId } = req.body;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ error: "Database not configured" });
    }
    await client.from("active_sessions").delete().eq("session_id", sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error("End session error:", error);
    res.status(500).json({ error: "Failed to end session" });
  }
});
app.get("/api/analytics/online", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1e3).toISOString();
    const { data, error } = await client.from("active_sessions").select("*").gte("last_activity_at", fiveMinutesAgo).order("last_activity_at", { ascending: false });
    if (error) {
      console.error("Get online visitors error:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Get online visitors error:", error);
    res.status(500).json({ error: "Failed to get online visitors" });
  }
});
app.get("/api/analytics/stats", async (req, res) => {
  try {
    const { period = "7d" } = req.query;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: getEmptyStats() });
    }
    const now = /* @__PURE__ */ new Date();
    let startDate;
    switch (period) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1e3);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1e3);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
    }
    const startDateStr = startDate.toISOString();
    const [totalVisitors, newVisitors, totalPageViews, topPages, topCountries, trafficSources, dailyStats, avgDuration] = await Promise.all([
      // 总访客数
      client.from("page_views").select("visitor_id", { count: "exact", head: true }).gte("entry_time", startDateStr),
      // 新访客数
      client.from("visitors").select("id", { count: "exact", head: true }).gte("first_visit_at", startDateStr),
      // 总页面浏览量
      client.from("page_views").select("id", { count: "exact", head: true }).gte("entry_time", startDateStr),
      // 热门页面
      client.from("page_views").select("page_path, page_title").gte("entry_time", startDateStr).limit(100),
      // 国家分布
      client.from("page_views").select("visitor_id").gte("entry_time", startDateStr).limit(500),
      // 流量来源
      client.from("page_views").select("traffic_source").gte("entry_time", startDateStr).limit(500),
      // 每日统计
      client.from("page_views").select("entry_time").gte("entry_time", startDateStr).limit(1e3),
      // 平均停留时长
      client.from("page_views").select("duration_seconds").gte("entry_time", startDateStr).not("duration_seconds", "is", null).limit(500)
    ]);
    const pageCounts = {};
    (topPages.data || []).forEach((pv) => {
      const path2 = pv.page_path || "/";
      if (!pageCounts[path2]) {
        pageCounts[path2] = { count: 0, title: pv.page_title || path2 };
      }
      pageCounts[path2].count++;
    });
    const topPagesList = Object.entries(pageCounts).map(([path2, data]) => ({ path: path2, title: data.title, views: data.count })).sort((a, b) => b.views - a.views).slice(0, 10);
    const visitorIds = [...new Set((topCountries.data || []).map((pv) => pv.visitor_id))];
    const { data: visitorsData } = await client.from("visitors").select("country, country_code").in("visitor_id", visitorIds.slice(0, 100));
    const countryCounts = {};
    (visitorsData || []).forEach((v) => {
      const country = v.country || "Unknown";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    const topCountriesList = Object.entries(countryCounts).map(([country, count]) => ({ country, count })).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const sourceCounts = {};
    (trafficSources.data || []).forEach((pv) => {
      const source = pv.traffic_source || "direct";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    const dailyData = {};
    (dailyStats.data || []).forEach((pv) => {
      const date = new Date(pv.entry_time).toISOString().split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = { visitors: /* @__PURE__ */ new Set(), pageViews: 0 };
      }
      dailyData[date].visitors.add(pv.visitor_id);
      dailyData[date].pageViews++;
    });
    const dailyStatsList = Object.entries(dailyData).map(([date, data]) => ({ date, visitors: data.visitors.size, pageViews: data.pageViews })).sort((a, b) => a.date.localeCompare(b.date));
    const durations = (avgDuration.data || []).map((pv) => pv.duration_seconds).filter((d) => d > 0);
    const avgDurationValue = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const bounceCount = (trafficSources.data || []).filter((pv) => pv.traffic_source === "direct").length;
    const bounceRate = totalPageViews.count && totalPageViews.count > 0 ? Math.round(bounceCount / totalPageViews.count * 100) : 0;
    res.json({
      success: true,
      data: {
        overview: {
          totalVisitors: totalVisitors.count || 0,
          newVisitors: newVisitors.count || 0,
          returningVisitors: (totalVisitors.count || 0) - (newVisitors.count || 0),
          totalPageViews: totalPageViews.count || 0,
          avgDuration: avgDurationValue,
          bounceRate
        },
        topPages: topPagesList,
        topCountries: topCountriesList,
        trafficSources: Object.entries(sourceCounts).map(([source, count]) => ({ source, count })),
        dailyStats: dailyStatsList
      }
    });
  } catch (error) {
    console.error("Get analytics stats error:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});
function getEmptyStats() {
  return {
    overview: {
      totalVisitors: 0,
      newVisitors: 0,
      returningVisitors: 0,
      totalPageViews: 0,
      avgDuration: 0,
      bounceRate: 0
    },
    topPages: [],
    topCountries: [],
    trafficSources: [],
    dailyStats: []
  };
}
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    feishu: FEISHU_APP_ID ? "configured" : "not configured",
    appId: FEISHU_APP_ID
  });
});
function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "specialoil_salt").digest("hex");
}
function generateRandomPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
}
function generateUsername(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const random = Math.floor(Math.random() * 1e4);
  return `${base}${random}`;
}
function generateVerificationCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
app.post("/api/auth/send-code", async (req, res) => {
  try {
    const { email, type = "register" } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    if (type === "register") {
      const { data: existingApp } = await client.from("author_applications").select("id, status").eq("email", email).single();
      if (existingApp) {
        if (existingApp.status === "pending") {
          return res.status(400).json({
            success: false,
            error: "You already have a pending application. Please wait for review."
          });
        }
        if (existingApp.status === "approved") {
          return res.status(400).json({
            success: false,
            error: "This email is already registered. Please login instead."
          });
        }
      }
    }
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    await client.from("email_verification_codes").update({ is_used: true }).eq("email", email).eq("type", type).eq("is_used", false);
    const { error: insertError } = await client.from("email_verification_codes").insert({
      email,
      code,
      type,
      expires_at: expiresAt.toISOString()
    });
    if (insertError) {
      console.error("Failed to save verification code:", insertError);
      return res.status(500).json({ success: false, error: "Failed to generate code" });
    }
    const sent = await sendVerificationCode(email, code, type);
    if (!sent) {
      return res.status(500).json({
        success: false,
        error: "Failed to send verification email. Please try again later."
      });
    }
    res.json({
      success: true,
      message: "Verification code sent to your email",
      expiresIn: 600
      // 10分钟
    });
  } catch (error) {
    console.error("Send verification code error:", error);
    res.status(500).json({ success: false, error: "Failed to send verification code" });
  }
});
app.post("/api/auth/verify-code", async (req, res) => {
  try {
    const { email, code, type = "register" } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and code are required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: codes, error } = await client.from("email_verification_codes").select("*").eq("email", email).eq("code", code).eq("type", type).eq("is_used", false).gte("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: false }).limit(1);
    if (error || !codes || codes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification code"
      });
    }
    await client.from("email_verification_codes").update({ is_used: true }).eq("id", codes[0].id);
    res.json({
      success: true,
      message: "Email verified successfully",
      verifiedEmail: email
    });
  } catch (error) {
    console.error("Verify code error:", error);
    res.status(500).json({ success: false, error: "Failed to verify code" });
  }
});
app.post("/api/author/apply", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      expertiseAreas,
      bio,
      verificationCode
    } = req.body;
    if (!name || !email || !verificationCode) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and verification code are required"
      });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: codes } = await client.from("email_verification_codes").select("*").eq("email", email).eq("code", verificationCode).eq("type", "register").eq("is_used", true).gte("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: false }).limit(1);
    if (!codes || codes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please verify your email first"
      });
    }
    const { data: existingApp } = await client.from("author_applications").select("id, status").eq("email", email).single();
    if (existingApp) {
      if (existingApp.status === "pending") {
        return res.status(400).json({
          success: false,
          error: "You already have a pending application"
        });
      }
      if (existingApp.status === "approved") {
        return res.status(400).json({
          success: false,
          error: "This email is already registered"
        });
      }
    }
    const { error: insertError } = await client.from("author_applications").insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      expertise_areas: expertiseAreas || [],
      bio: bio || null,
      status: "pending"
    });
    if (insertError) {
      console.error("Failed to create application:", insertError);
      return res.status(500).json({ success: false, error: "Failed to submit application" });
    }
    await sendApplicationConfirmation(email, name);
    await sendAdminApplicationNotification(
      name,
      email,
      company || "",
      expertiseAreas || [],
      bio || ""
    );
    res.json({
      success: true,
      message: "Application submitted successfully! Please wait for review."
    });
  } catch (error) {
    console.error("Author application error:", error);
    res.status(500).json({ success: false, error: "Failed to submit application" });
  }
});
var ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kdwelly@163.com";
app.post("/api/admin/send-login-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    if (email !== ADMIN_EMAIL) {
      return res.json({ success: true, message: "If this email is registered as admin, a verification code has been sent." });
    }
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { error: insertError } = await client.from("email_verification_codes").insert({
      email,
      code,
      type: "admin_login",
      expires_at: new Date(Date.now() + 10 * 60 * 1e3).toISOString()
      // 10分钟有效
    });
    if (insertError) {
      console.error("Failed to save admin login code:", insertError);
      return res.status(500).json({ success: false, error: "Failed to generate verification code" });
    }
    const { sendVerificationCode: sendVerificationCode2 } = await Promise.resolve().then(() => (init_email(), email_exports));
    const emailSent = await sendVerificationCode2(email, code, "admin_login");
    if (!emailSent) {
      console.log(`Admin login code (dev): ${code}`);
    }
    res.json({ success: true, message: "Verification code sent to your email" });
  } catch (error) {
    console.error("Send admin login code error:", error);
    res.status(500).json({ success: false, error: "Failed to send verification code" });
  }
});
app.post("/api/admin/verify-login", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Email and code are required" });
    }
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: codes, error: queryError } = await client.from("email_verification_codes").select("*").eq("email", email).eq("code", code).eq("type", "admin_login").eq("is_used", false).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: false }).limit(1);
    if (queryError || !codes || codes.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid or expired verification code" });
    }
    await client.from("email_verification_codes").update({ is_used: true }).eq("id", codes[0].id);
    res.json({
      success: true,
      message: "Login successful",
      admin: {
        email: ADMIN_EMAIL,
        username: "admin",
        role: "admin"
      }
    });
  } catch (error) {
    console.error("Verify admin login error:", error);
    res.status(500).json({ success: false, error: "Failed to verify login" });
  }
});
app.post("/api/admin/set-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ success: false, error: "Email, code, and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: "Password must be at least 6 characters" });
    }
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: codes, error: queryError } = await client.from("email_verification_codes").select("*").eq("email", email).eq("code", code).eq("type", "admin_login").eq("is_used", false).gt("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: false }).limit(1);
    if (queryError || !codes || codes.length === 0) {
      return res.status(401).json({ success: false, error: "Invalid or expired verification code" });
    }
    await client.from("email_verification_codes").update({ is_used: true }).eq("id", codes[0].id);
    res.json({ success: true, message: "Password set successfully" });
  } catch (error) {
    console.error("Set admin password error:", error);
    res.status(500).json({ success: false, error: "Failed to set password" });
  }
});
app.get("/api/admin/dashboard", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: false, error: "Database not configured" });
    }
    const [
      articlesResult,
      authorsResult,
      subscribersResult,
      visitorsResult,
      pendingArticlesResult,
      pendingApplicationsResult
    ] = await Promise.all([
      // 文章统计
      client.from("blog_posts").select("id, view_count, like_count, review_status", { count: "exact" }),
      // 作者统计
      client.from("authors").select("id, status", { count: "exact" }),
      // 订阅用户统计
      client.from("newsletter_subscribers").select("id", { count: "exact" }),
      // 访客统计
      client.from("visitor_tracking").select("id, visit_count", { count: "exact" }),
      // 待审核文章
      client.from("blog_posts").select("id", { count: "exact" }).eq("review_status", "pending"),
      // 待审核作者申请
      client.from("author_applications").select("id", { count: "exact" }).eq("status", "pending")
    ]);
    const totalViews = articlesResult.data?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;
    const totalLikes = articlesResult.data?.reduce((sum, article) => sum + (article.like_count || 0), 0) || 0;
    const totalVisits = visitorsResult.data?.reduce((sum, visitor) => sum + (visitor.visit_count || 1), 0) || 0;
    const publishedCount = articlesResult.data?.filter((a) => a.review_status === "approved").length || 0;
    const pendingCount = articlesResult.data?.filter((a) => a.review_status === "pending").length || 0;
    const draftCount = articlesResult.data?.filter((a) => a.review_status === "draft").length || 0;
    const dashboardData = {
      articles: {
        total: articlesResult.count || 0,
        published: publishedCount,
        pending: pendingCount,
        draft: draftCount,
        totalViews,
        totalLikes
      },
      authors: {
        total: authorsResult.count || 0,
        active: authorsResult.data?.filter((a) => a.status === "active").length || 0
      },
      subscribers: {
        total: subscribersResult.count || 0
      },
      visitors: {
        total: visitorsResult.count || 0,
        totalVisits
      },
      pendingItems: {
        articles: pendingArticlesResult.count || 0,
        applications: pendingApplicationsResult.count || 0
      }
    };
    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch dashboard stats" });
  }
});
app.get("/api/admin/articles", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [], total: 0 });
    }
    let query = client.from("blog_posts").select("*, authors!author_id(name, display_name)", { count: "exact" }).order("created_at", { ascending: false });
    if (status && status !== "all") {
      query = query.eq("review_status", status);
    }
    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);
    const { data, error, count } = await query;
    if (error) {
      console.error("Failed to fetch articles:", error);
      return res.json({ success: true, data: [], total: 0 });
    }
    res.json({ success: true, data: data || [], total: count || 0 });
  } catch (error) {
    console.error("Get admin articles error:", error);
    res.status(500).json({ success: false, error: "Failed to get articles" });
  }
});
app.post("/api/admin/articles/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason, adminEmail } = req.body;
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: article, error: fetchError } = await client.from("blog_posts").select("*, authors!author_id(email, display_name, name)").eq("id", id).single();
    if (fetchError || !article) {
      return res.status(404).json({ success: false, error: "Article not found" });
    }
    if (article.review_status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "This article has already been reviewed"
      });
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newStatus = action === "approve" ? "approved" : "rejected";
    const { error: updateError } = await client.from("blog_posts").update({
      review_status: newStatus,
      reviewed_at: now,
      reviewed_by: adminEmail || "admin",
      rejection_reason: action === "reject" ? rejectionReason : null,
      publishedAt: action === "approve" ? now : article.publishedAt
    }).eq("id", id);
    if (updateError) {
      console.error("Failed to update article:", updateError);
      return res.status(500).json({ success: false, error: "Failed to review article" });
    }
    if (action === "approve" && article.author_id) {
      await client.rpc("increment_author_articles_count", { author_id: article.author_id });
    }
    const author = article.authors;
    if (author?.email) {
      if (action === "approve") {
        await sendArticleApprovalEmail(
          author.email,
          author.display_name || author.name || "Author",
          article.title,
          article.id
        );
      } else {
        await sendArticleRejectionEmail(
          author.email,
          author.display_name || author.name || "Author",
          article.title,
          rejectionReason
        );
      }
    }
    res.json({
      success: true,
      message: action === "approve" ? "Article approved!" : "Article rejected",
      status: newStatus
    });
  } catch (error) {
    console.error("Review article error:", error);
    res.status(500).json({ success: false, error: "Failed to review article" });
  }
});
app.get("/api/admin/subscribers", async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [], total: 0 });
    }
    let query = client.from("newsletter_subscribers").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (search) {
      query = query.ilike("email", `%${search}%`);
    }
    const offset = (Number(page) - 1) * Number(limit);
    query = query.range(offset, offset + Number(limit) - 1);
    const { data, error, count } = await query;
    if (error) {
      console.error("Failed to fetch subscribers:", error);
      return res.json({ success: true, data: [], total: 0 });
    }
    res.json({ success: true, data: data || [], total: count || 0 });
  } catch (error) {
    console.error("Get subscribers error:", error);
    res.status(500).json({ success: false, error: "Failed to get subscribers" });
  }
});
app.post("/api/subscribers", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: existing } = await client.from("newsletter_subscribers").select("id").eq("email", email).single();
    if (existing) {
      return res.json({ success: true, message: "Already subscribed" });
    }
    const { error: insertError } = await client.from("newsletter_subscribers").insert({
      email,
      status: "active",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (insertError) {
      console.error("Failed to add subscriber:", insertError);
      return res.status(500).json({ success: false, error: "Failed to subscribe" });
    }
    await sendSubscriptionConfirmation(email);
    res.json({ success: true, message: "Subscribed successfully!" });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ success: false, error: "Failed to subscribe" });
  }
});
app.delete("/api/admin/subscribers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { error } = await client.from("newsletter_subscribers").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete subscriber:", error);
      return res.status(500).json({ success: false, error: "Failed to delete subscriber" });
    }
    res.json({ success: true, message: "Subscriber removed" });
  } catch (error) {
    console.error("Delete subscriber error:", error);
    res.status(500).json({ success: false, error: "Failed to delete subscriber" });
  }
});
app.get("/api/admin/applications", async (req, res) => {
  try {
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    const { status } = req.query;
    let query = client.from("author_applications").select("*").order("created_at", { ascending: false });
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch applications:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Failed to get applications" });
  }
});
app.post("/api/admin/applications/:id/review", async (req, res) => {
  try {
    const { id } = req.params;
    const { action, rejectionReason, adminEmail } = req.body;
    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({ success: false, error: "Invalid action" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: application, error: fetchError } = await client.from("author_applications").select("*").eq("id", id).single();
    if (fetchError || !application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }
    if (application.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "This application has already been processed"
      });
    }
    if (action === "approve") {
      const username = generateUsername(application.name);
      const tempPassword = generateRandomPassword();
      const passwordHash = hashPassword(tempPassword);
      const { error: updateError } = await client.from("author_applications").update({
        status: "approved",
        username,
        password_hash: passwordHash,
        reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
        reviewed_by: adminEmail || "admin"
      }).eq("id", id);
      if (updateError) {
        console.error("Failed to update application:", updateError);
        return res.status(500).json({ success: false, error: "Failed to approve application" });
      }
      const { error: authorError } = await client.from("authors").insert({
        application_id: id,
        name: application.name,
        email: application.email,
        phone: application.phone,
        company: application.company,
        username,
        password_hash: passwordHash,
        expertise_areas: application.expertise_areas,
        bio: application.bio
      });
      if (authorError) {
        console.error("Failed to create author:", authorError);
        await client.from("author_applications").update({ status: "pending", username: null, password_hash: null }).eq("id", id);
        return res.status(500).json({ success: false, error: "Failed to create author account" });
      }
      await sendApprovalEmail(application.email, application.name, username, tempPassword);
      res.json({
        success: true,
        message: "Application approved! Account created and email sent.",
        username
      });
    } else {
      const { error: updateError } = await client.from("author_applications").update({
        status: "rejected",
        rejection_reason: rejectionReason || null,
        reviewed_at: (/* @__PURE__ */ new Date()).toISOString(),
        reviewed_by: adminEmail || "admin"
      }).eq("id", id);
      if (updateError) {
        console.error("Failed to reject application:", updateError);
        return res.status(500).json({ success: false, error: "Failed to reject application" });
      }
      await sendRejectionEmail(application.email, application.name, rejectionReason || "");
      res.json({ success: true, message: "Application rejected and email sent." });
    }
  } catch (error) {
    console.error("Review application error:", error);
    res.status(500).json({ success: false, error: "Failed to process application" });
  }
});
app.post("/api/author/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required"
      });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const passwordHash = hashPassword(password);
    const { data: author, error } = await client.from("authors").select("*").eq("username", username).eq("password_hash", passwordHash).eq("status", "active").single();
    if (error || !author) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password"
      });
    }
    await client.from("authors").update({ last_login_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", author.id);
    const { password_hash, ...authorData } = author;
    res.json({
      success: true,
      author: authorData,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Author login error:", error);
    res.status(500).json({ success: false, error: "Failed to login" });
  }
});
app.get("/api/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: author, error } = await client.from("authors").select("id, name, email, phone, company, username, expertise_areas, bio, avatar_url, articles_count, total_views, total_likes, created_at").eq("id", id).single();
    if (error || !author) {
      return res.status(404).json({ success: false, error: "Author not found" });
    }
    res.json({ success: true, author });
  } catch (error) {
    console.error("Get author error:", error);
    res.status(500).json({ success: false, error: "Failed to get author" });
  }
});
app.get("/api/author/:id/articles", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const client = getSupabaseClient();
    if (!client) {
      return res.json({ success: true, data: [] });
    }
    let query = client.from("blog_posts").select("*").eq("author_id", id).order("publishedAt", { ascending: false });
    if (status && status !== "all") {
      query = query.eq("review_status", status);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch author articles:", error);
      return res.json({ success: true, data: [] });
    }
    res.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Get author articles error:", error);
    res.status(500).json({ error: "Failed to get articles" });
  }
});
app.post("/api/author/:id/change-password", async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current and new password are required"
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters"
      });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const currentHash = hashPassword(currentPassword);
    const { data: author, error: fetchError } = await client.from("authors").select("id").eq("id", id).eq("password_hash", currentHash).single();
    if (fetchError || !author) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect"
      });
    }
    const newHash = hashPassword(newPassword);
    const { error: updateError } = await client.from("authors").update({ password_hash: newHash, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
    if (updateError) {
      return res.status(500).json({
        success: false,
        error: "Failed to update password"
      });
    }
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, error: "Failed to change password" });
  }
});
app.put("/api/author/:id/profile", async (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, username, bio, company, expertise_areas } = req.body;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    if (username) {
      const { data: existingUser } = await client.from("authors").select("id").eq("username", username).neq("id", id).single();
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Username already taken"
        });
      }
    }
    const updates = {
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (display_name) updates.display_name = display_name;
    if (username) updates.username = username;
    if (bio !== void 0) updates.bio = bio;
    if (company !== void 0) updates.company = company;
    if (expertise_areas) updates.expertise_areas = expertise_areas;
    const { data, error: updateError } = await client.from("authors").update(updates).eq("id", id).select().single();
    if (updateError) {
      console.error("Update profile error:", updateError);
      return res.status(500).json({
        success: false,
        error: "Failed to update profile"
      });
    }
    res.json({
      success: true,
      message: "Profile updated successfully",
      author: {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        username: data.username,
        email: data.email,
        company: data.company,
        bio: data.bio,
        expertise_areas: data.expertise_areas,
        avatar_url: data.avatar_url,
        articles_count: data.articles_count,
        total_views: data.total_views,
        total_likes: data.total_likes,
        created_at: data.created_at
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
});
app.post("/api/author/:id/avatar", async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url } = req.body;
    if (!avatar_url) {
      return res.status(400).json({
        success: false,
        error: "Avatar URL is required"
      });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data, error: updateError } = await client.from("authors").update({
      avatar_url,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select("avatar_url").single();
    if (updateError) {
      console.error("Update avatar error:", updateError);
      return res.status(500).json({
        success: false,
        error: "Failed to update avatar"
      });
    }
    res.json({
      success: true,
      message: "Avatar updated successfully",
      avatar_url: data.avatar_url
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    res.status(500).json({ success: false, error: "Failed to update avatar" });
  }
});
app.post("/api/author/:id/send-bind-email-code", async (req, res) => {
  try {
    const { id } = req.params;
    const { new_email } = req.body;
    if (!new_email) {
      return res.status(400).json({ success: false, error: "New email is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(new_email)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: existingUser } = await client.from("authors").select("id").eq("email", new_email).neq("id", id).single();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "This email is already in use by another account"
      });
    }
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
    await client.from("email_verification_codes").update({ is_used: true }).eq("email", new_email).eq("type", "bind_email").eq("is_used", false);
    const { error: insertError } = await client.from("email_verification_codes").insert({
      email: new_email,
      code,
      type: "bind_email",
      expires_at: expiresAt.toISOString()
    });
    if (insertError) {
      console.error("Failed to save verification code:", insertError);
      return res.status(500).json({ success: false, error: "Failed to generate code" });
    }
    const sent = await sendVerificationCode(new_email, code, "bind_email");
    if (!sent) {
      return res.status(500).json({
        success: false,
        error: "Failed to send verification email. Please try again later."
      });
    }
    res.json({
      success: true,
      message: "Verification code sent to your new email address",
      // 开发环境返回验证码方便测试
      ...process.env.NODE_ENV === "development" && { devCode: code }
    });
  } catch (error) {
    console.error("Send bind email code error:", error);
    res.status(500).json({ success: false, error: "Failed to send verification code" });
  }
});
app.post("/api/author/:id/bind-email", async (req, res) => {
  try {
    const { id } = req.params;
    const { new_email, code } = req.body;
    if (!new_email || !code) {
      return res.status(400).json({ success: false, error: "Email and verification code are required" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: codes, error } = await client.from("email_verification_codes").select("*").eq("email", new_email).eq("code", code).eq("type", "bind_email").eq("is_used", false).gte("expires_at", (/* @__PURE__ */ new Date()).toISOString()).order("created_at", { ascending: false }).limit(1);
    if (error || !codes || codes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired verification code"
      });
    }
    await client.from("email_verification_codes").update({ is_used: true }).eq("id", codes[0].id);
    const { data: existingUser } = await client.from("authors").select("id").eq("email", new_email).neq("id", id).single();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "This email is already in use by another account"
      });
    }
    const { data, error: updateError } = await client.from("authors").update({
      email: new_email,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select().single();
    if (updateError) {
      console.error("Update email error:", updateError);
      return res.status(500).json({
        success: false,
        error: "Failed to update email"
      });
    }
    res.json({
      success: true,
      message: "Email updated successfully",
      author: {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        username: data.username,
        email: data.email,
        company: data.company,
        bio: data.bio,
        expertise_areas: data.expertise_areas,
        avatar_url: data.avatar_url,
        articles_count: data.articles_count,
        total_views: data.total_views,
        total_likes: data.total_likes,
        created_at: data.created_at
      }
    });
  } catch (error) {
    console.error("Bind email error:", error);
    res.status(500).json({ success: false, error: "Failed to bind email" });
  }
});
app.post("/api/author/:id/bind-phone", async (req, res) => {
  try {
    const { id } = req.params;
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: "Phone number is required" });
    }
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return res.status(400).json({ success: false, error: "Invalid phone number format" });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data, error: updateError } = await client.from("authors").update({
      phone,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id).select("id, phone").single();
    if (updateError) {
      console.error("Update phone error:", updateError);
      return res.status(500).json({
        success: false,
        error: "Failed to update phone number"
      });
    }
    res.json({
      success: true,
      message: "Phone number updated successfully",
      phone: data.phone
    });
  } catch (error) {
    console.error("Bind phone error:", error);
    res.status(500).json({ success: false, error: "Failed to bind phone" });
  }
});
app.delete("/api/author/:id/phone", async (req, res) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { error: updateError } = await client.from("authors").update({
      phone: null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    if (updateError) {
      console.error("Unbind phone error:", updateError);
      return res.status(500).json({
        success: false,
        error: "Failed to unbind phone"
      });
    }
    res.json({
      success: true,
      message: "Phone number unbound successfully"
    });
  } catch (error) {
    console.error("Unbind phone error:", error);
    res.status(500).json({ success: false, error: "Failed to unbind phone" });
  }
});
app.post("/api/author/articles", async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featuredImage, author_id, review_status } = req.body;
    if (!title || !content || !author_id) {
      return res.status(400).json({
        success: false,
        error: "Title, content, and author are required"
      });
    }
    const client = getSupabaseClient();
    if (!client) {
      return res.status(500).json({ success: false, error: "Database not configured" });
    }
    const { data: author, error: authorError } = await client.from("authors").select("id, display_name").eq("id", author_id).single();
    if (authorError || !author) {
      return res.status(401).json({
        success: false,
        error: "Author not found"
      });
    }
    const postId = generateId();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const { error: insertError } = await client.from("blog_posts").insert({
      id: postId,
      title,
      excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
      content,
      category: category || "Industry News",
      tags: tags || [],
      featured_image: featuredImage,
      author_id,
      author: author.display_name,
      review_status: review_status || "pending",
      publishedAt: now,
      created_at: now,
      updated_at: now,
      view_count: 0,
      like_count: 0
    });
    if (insertError) {
      console.error("Insert article error:", insertError);
      return res.status(500).json({
        success: false,
        error: "Failed to create article"
      });
    }
    res.json({
      success: true,
      message: review_status === "draft" ? "Draft saved" : "Article submitted for review",
      articleId: postId
    });
  } catch (error) {
    console.error("Create article error:", error);
    res.status(500).json({ success: false, error: "Failed to create article" });
  }
});
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/feishu/")) {
    return res.status(404).json({ error: "Not found" });
  }
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Application not built. Please run build first.");
  }
});
httpServer.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`WebSocket: /socket.io/`);
  console.log(`Feishu webhook: POST /feishu/webhook`);
  console.log(`========================================`);
  console.log(`\u2705 Server ready to accept connections`);
  if (FEISHU_APP_ID && FEISHU_APP_SECRET) {
    getFeishuAccessToken().then((token) => {
      if (token) {
        console.log("\u2705 Feishu bot connected successfully");
      }
    });
  }
});
