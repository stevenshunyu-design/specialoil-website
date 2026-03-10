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

export { resend };
