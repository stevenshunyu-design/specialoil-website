import { Resend } from 'resend';

// 初始化 Resend 客户端
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// 发件人地址
const FROM_EMAIL = process.env.FROM_EMAIL || 'steven.shunyu@gmail.com';
const SITE_NAME = 'SpecialOil';
const SITE_URL = process.env.SITE_URL || 'https://specialoil.com';

// 邮件模板样式
const emailStyles = `
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

/**
 * 发送订阅确认邮件
 */
export async function sendSubscriptionConfirmation(email: string): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return false;
  }

  const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to ${SITE_NAME} Newsletter! 📧`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>🏭 ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Your Trusted China Special Oil Partner</p>
          </div>
          <div class="content">
            <h2>Welcome to Our Newsletter!</h2>
            <p>Thank you for subscribing to the <strong>${SITE_NAME}</strong> newsletter.</p>
            <p>You'll now receive:</p>
            <ul>
              <li>📊 Latest China special oil industry news</li>
              <li>🔧 Technical insights and product updates</li>
              <li>📈 Market analysis and price trends</li>
              <li>🎁 Exclusive offers and promotions</li>
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
      `,
    });

    if (error) {
      console.error('Failed to send subscription email:', error);
      return false;
    }

    console.log('Subscription email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending subscription email:', error);
    return false;
  }
}

/**
 * 发送取消订阅确认邮件
 */
export async function sendUnsubscribeConfirmation(email: string): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
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
            <h1>🏭 ${SITE_NAME}</h1>
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
      `,
    });

    if (error) {
      console.error('Failed to send unsubscribe email:', error);
      return false;
    }

    console.log('Unsubscribe email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending unsubscribe email:', error);
    return false;
  }
}

/**
 * 发送 Newsletter 邮件（给所有订阅者）
 */
interface NewsletterArticle {
  title: string;
  summary: string;
  url: string;
}

export async function sendNewsletter(
  subject: string, 
  articles: NewsletterArticle[],
  previewText?: string
): Promise<{ success: boolean; sentCount: number; error?: string }> {
  if (!resend) {
    return { success: false, sentCount: 0, error: 'Resend not configured' };
  }

  try {
    // 获取所有活跃订阅者（这里需要从数据库获取）
    // 这个函数会在 server 端调用，传入订阅者列表
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: 'delivered@resend.dev', // 批量发送时使用这个
      subject: subject,
      html: generateNewsletterHTML(subject, articles, previewText),
    });

    if (error) {
      return { success: false, sentCount: 0, error: error.message };
    }

    return { success: true, sentCount: 1 };
  } catch (error) {
    return { 
      success: false, 
      sentCount: 0, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * 批量发送 Newsletter 给订阅者
 */
export async function sendNewsletterToSubscribers(
  subscribers: string[],
  subject: string,
  articles: NewsletterArticle[],
  previewText?: string
): Promise<{ success: boolean; sentCount: number; errors: string[] }> {
  if (!resend) {
    return { success: false, sentCount: 0, errors: ['Resend not configured'] };
  }

  const errors: string[] = [];
  let sentCount = 0;

  // 批量发送（Resend 支持批量发送）
  // 注意：免费计划每秒最多10封邮件
  for (const email of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    
    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: subject,
        html: generateNewsletterHTML(subject, articles, previewText, unsubscribeUrl),
      });

      if (error) {
        errors.push(`${email}: ${error.message}`);
      } else {
        sentCount++;
      }

      // 每秒发送10封，添加延迟
      if (sentCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      errors.push(`${email}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  return { success: sentCount > 0, sentCount, errors };
}

/**
 * 生成 Newsletter HTML
 */
function generateNewsletterHTML(
  subject: string, 
  articles: NewsletterArticle[],
  previewText?: string,
  unsubscribeUrl?: string
): string {
  const defaultUnsubscribeUrl = `${SITE_URL}/unsubscribe`;
  
  const articlesHTML = articles.map(article => `
    <div class="article">
      <h3><a href="${article.url}">${article.title}</a></h3>
      <p>${article.summary}</p>
      <a href="${article.url}" style="color: #D4AF37; text-decoration: none;">Read more →</a>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${emailStyles}
    </head>
    <body>
      <div class="header">
        <h1>🏭 ${SITE_NAME}</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Newsletter</p>
      </div>
      <div class="content">
        <h2>${subject}</h2>
        ${previewText ? `<p style="color: #666; font-style: italic;">${previewText}</p>` : ''}
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

// ==================== 作者系统邮件模板 ====================

/**
 * 发送邮箱验证码
 */
export async function sendVerificationCode(
  email: string, 
  code: string, 
  type: 'register' | 'reset_password' | 'bind_email' | 'admin_login' = 'register'
): Promise<boolean> {
  if (!resend) {
    // 开发环境：打印验证码到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log('========================================');
      console.log('📧 DEVELOPMENT MODE - Email Verification');
      console.log('========================================');
      console.log(`To: ${email}`);
      console.log(`Type: ${type}`);
      console.log(`Code: ${code}`);
      console.log('========================================');
      return true; // 开发环境返回成功
    }
    console.log('Resend not configured, skipping email');
    return false;
  }

  const typeText = type === 'register' ? 'Email Verification' 
    : type === 'bind_email' ? 'Bind New Email' 
    : type === 'admin_login' ? 'Admin Login Verification'
    : 'Password Reset';
  const purposeText = type === 'register' 
    ? 'Please use the following code to verify your email address for author registration.'
    : type === 'bind_email'
    ? 'Please use the following code to verify your new email address for account binding.'
    : type === 'admin_login'
    ? 'Please use the following code to verify your identity for admin panel login.'
    : 'Please use the following code to reset your password.';

  try {
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
            <h1>🏭 ${SITE_NAME}</h1>
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
      `,
    });

    if (error) {
      console.error('Failed to send verification code:', error);
      return false;
    }

    console.log('Verification code sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending verification code:', error);
    return false;
  }
}

/**
 * 发送作者申请提交确认邮件（给用户）
 */
export async function sendApplicationConfirmation(
  email: string,
  name: string
): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
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
            <h1>🏭 ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>Application Received!</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for applying to become an author on <strong>${SITE_NAME}</strong>.</p>
            <p>Your application has been submitted successfully and is now <strong>pending review</strong> by our team.</p>
            <div style="background: #fff3cd; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>⏳ What's Next?</strong></p>
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
      `,
    });

    if (error) {
      console.error('Failed to send application confirmation:', error);
      return false;
    }

    console.log('Application confirmation sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending application confirmation:', error);
    return false;
  }
}

/**
 * 发送新申请通知邮件（给管理员）
 */
export async function sendAdminApplicationNotification(
  applicantName: string,
  applicantEmail: string,
  company: string,
  expertiseAreas: string[],
  bio: string
): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return false;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'kdwelly@163.com';

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `🔔 New Author Application - ${applicantName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>🏭 ${SITE_NAME}</h1>
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
                  <td style="padding: 8px 0;">${company || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Expertise:</strong></td>
                  <td style="padding: 8px 0;">${expertiseAreas.join(', ') || 'Not specified'}</td>
                </tr>
              </table>
              ${bio ? `
                <h4 style="margin-top: 15px;">About the Applicant</h4>
                <p style="background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd;">${bio}</p>
              ` : ''}
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
      `,
    });

    if (error) {
      console.error('Failed to send admin notification:', error);
      return false;
    }

    console.log('Admin notification sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return false;
  }
}

/**
 * 发送审核通过邮件（给用户）
 */
export async function sendApprovalEmail(
  email: string,
  name: string,
  username: string,
  tempPassword?: string
): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return false;
  }

  const loginUrl = `${SITE_URL}/author/login`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🎉 ${SITE_NAME} - Your Author Account is Approved!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>🏭 ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>🎉 Congratulations, ${name}!</h2>
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
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Login URL:</strong></td>
                  <td style="padding: 8px 0;"><a href="${loginUrl}">${loginUrl}</a></td>
                </tr>
              </table>
            </div>
            
            <p><strong>⚠️ Important:</strong> Please change your password after your first login.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">Login Now</a>
            </div>
            
            <h4>What you can do now:</h4>
            <ul>
              <li>📝 Write and publish articles about special oil industry</li>
              <li>📊 Track your article views and engagement</li>
              <li>👨‍💼 Manage your author profile</li>
            </ul>
            
            <p style="margin-top: 30px;">We look forward to seeing your contributions!</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a> | <a href="mailto:kdwelly@163.com">Contact Administrator</a></p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send approval email:', error);
      return false;
    }

    console.log('Approval email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
}

/**
 * 发送审核拒绝邮件（给用户）
 */
export async function sendRejectionEmail(
  email: string,
  name: string,
  reason: string
): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
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
            <h1>🏭 ${SITE_NAME}</h1>
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
            ` : ''}
            
            <p>You're welcome to reapply in the future with updated information.</p>
            <p>If you have any questions, please don't hesitate to contact our administrator.</p>
            
            <p style="margin-top: 30px;">Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}">Visit Website</a> | <a href="mailto:kdwelly@163.com">Contact Administrator</a></p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send rejection email:', error);
      return false;
    }

    console.log('Rejection email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return false;
  }
}

/**
 * 发送文章审核通过邮件（给作者）
 */
export async function sendArticleApprovalEmail(
  email: string,
  authorName: string,
  articleTitle: string,
  articleId: string
): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
    return false;
  }

  const articleUrl = `${SITE_URL}/blog/${articleId}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🎉 ${SITE_NAME} - Your Article Has Been Published!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          ${emailStyles}
        </head>
        <body>
          <div class="header">
            <h1>🏭 ${SITE_NAME}</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Author Platform</p>
          </div>
          <div class="content">
            <h2>🎉 Congratulations, ${authorName}!</h2>
            <p>Your article has been <strong style="color: #28a745;">approved and published</strong>!</p>
            
            <div style="background: #e8f5e9; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #28a745;">Article Details</h3>
              <p style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${articleTitle}</p>
              <a href="${articleUrl}" class="button" style="display: inline-block; background: #D4AF37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Article</a>
            </div>
            
            <p>Your article is now live and visible to all visitors. Share it with your network!</p>
            
            <h4>What happens next:</h4>
            <ul>
              <li>📈 Track your article's views and engagement</li>
              <li>💬 Respond to reader comments</li>
              <li>✍️ Continue writing more great content</li>
            </ul>
            
            <p style="margin-top: 30px;">Thank you for contributing to ${SITE_NAME}!</p>
            <p>Best regards,<br><strong>The ${SITE_NAME} Team</strong></p>
          </div>
          <div class="footer">
            <p><a href="${SITE_URL}/author/dashboard">Author Dashboard</a> | <a href="${SITE_URL}">Visit Website</a></p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Failed to send article approval email:', error);
      return false;
    }

    console.log('Article approval email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending article approval email:', error);
    return false;
  }
}

/**
 * 发送文章审核拒绝邮件（给作者）
 */
export async function sendArticleRejectionEmail(
  email: string,
  authorName: string,
  articleTitle: string,
  reason?: string
): Promise<boolean> {
  if (!resend) {
    console.log('Resend not configured, skipping email');
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
            <h1>🏭 ${SITE_NAME}</h1>
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
            ` : ''}
            
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
      `,
    });

    if (error) {
      console.error('Failed to send article rejection email:', error);
      return false;
    }

    console.log('Article rejection email sent:', data?.id);
    return true;
  } catch (error) {
    console.error('Error sending article rejection email:', error);
    return false;
  }
}

export { resend };
