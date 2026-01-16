import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || 
      process.env.EMAIL_USER === 'dev@nexora.com' || 
      process.env.EMAIL_PASS === 'dev_password') {
    console.warn('⚠️  Email not configured. Using console logging for development.');
    return null;
  }

  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Welcome to NEXORA - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to NEXORA</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${data.name}!</h2>
          <p>Thank you for joining NEXORA, the advanced e-commerce platform. To complete your registration, please verify your email address.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">If you didn't create an account with NEXORA, please ignore this email.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'NEXORA - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${data.name}!</h2>
          <p>We received a request to reset your password for your NEXORA account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
          <p>This link will expire in 10 minutes for security reasons.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
      </div>
    `
  }),

  orderConfirmation: (data) => ({
    subject: `Order Confirmation - ${data.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Thank you for your order, ${data.customerName}!</h2>
          <p>Your order <strong>${data.orderNumber}</strong> has been confirmed and is being processed.</p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Details:</h3>
            ${data.items.map(item => `
              <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                <strong>${item.name}</strong><br>
                Quantity: ${item.quantity} × $${item.price} = $${item.quantity * item.price}
              </div>
            `).join('')}
            <div style="text-align: right; margin-top: 15px; font-size: 18px;">
              <strong>Total: $${data.total}</strong>
            </div>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.orderUrl}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Order</a>
          </div>
          
          <p>We'll send you another email when your order ships.</p>
        </div>
      </div>
    `
  }),

  sellerApproval: (data) => ({
    subject: 'NEXORA - Seller Account Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Congratulations!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello ${data.name}!</h2>
          <p>Great news! Your seller account has been approved and you can now start selling on NEXORA.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardUrl}" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Seller Dashboard</a>
          </div>
          
          <p>You can now:</p>
          <ul>
            <li>Add and manage your products</li>
            <li>Track your sales and earnings</li>
            <li>Manage orders and inventory</li>
            <li>Access seller analytics</li>
          </ul>
          
          <p>Welcome to the NEXORA seller community!</p>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();

    // If no transporter (email not configured), log to console in development
    if (!transporter) {
      console.log('\n📧 EMAIL (Development Mode - Not Sent):');
      console.log('To:', to);
      console.log('Subject:', subject || template);
      if (template && emailTemplates[template]) {
        const emailContent = emailTemplates[template](data);
        console.log('Template:', template);
        console.log('Data:', JSON.stringify(data, null, 2));
      }
      console.log('---\n');
      return { messageId: 'dev-mode-' + Date.now() };
    }

    let emailContent = {};

    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: `"NEXORA" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    // Don't throw error in development - just log it
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Email failed but continuing in development mode');
      return { messageId: 'dev-error-' + Date.now() };
    }
    throw error;
  }
};

// Send bulk emails
export const sendBulkEmail = async (emails) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const email of emails) {
      try {
        const info = await transporter.sendMail({
          from: `"NEXORA" <${process.env.EMAIL_USER}>`,
          ...email
        });
        results.push({ success: true, messageId: info.messageId, to: email.to });
      } catch (error) {
        results.push({ success: false, error: error.message, to: email.to });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email sending error:', error);
    throw error;
  }
};