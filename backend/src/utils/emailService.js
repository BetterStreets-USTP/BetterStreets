const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your.email@gmail.com
    pass: process.env.EMAIL_APP_PASSWORD // App Password from Google
  }
});

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} name - User's name
 * @returns {Promise} Email sending promise
 */
const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `BetterStreets <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'BetterStreets - Email Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #10b981; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏘️ BetterStreets</h1>
            <p>Barangay Camaman-an Community Reporting</p>
          </div>
          <div class="content">
            <h2>Hello ${name || 'Resident'}!</h2>
            <p>Thank you for registering with BetterStreets. Please verify your email address to activate your account.</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #6b7280;">Your verification code is:</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">This code expires in 10 minutes</p>
            </div>
            
            <p><strong>Why verify?</strong></p>
            <ul>
              <li>Secure your account</li>
              <li>Receive report status updates</li>
              <li>Get community announcements</li>
            </ul>
            
            <p style="color: #ef4444; font-size: 14px;">⚠️ If you didn't create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 BetterStreets - Barangay Camaman-an, Cagayan de Oro City</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} email - Recipient email address
 * @param {string} name - User's name
 * @returns {Promise} Email sending promise
 */
const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `BetterStreets <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to BetterStreets! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .feature-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to BetterStreets!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}!</h2>
            <p>Your account has been successfully verified. You're now part of the BetterStreets community!</p>
            
            <h3>What you can do:</h3>
            <div class="feature-box">
              <strong>📸 Submit Reports</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Report community issues with photos and GPS location</p>
            </div>
            <div class="feature-box">
              <strong>📍 Track Status</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Monitor progress of your submitted reports in real-time</p>
            </div>
            <div class="feature-box">
              <strong>🔔 Get Notified</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">Receive updates when your reports are resolved</p>
            </div>
            <div class="feature-box">
              <strong>📢 Stay Informed</strong>
              <p style="margin: 5px 0 0 0; font-size: 14px;">View official barangay announcements and updates</p>
            </div>
            
            <p style="margin-top: 20px;">Together, we can make Barangay Camaman-an a better place!</p>
          </div>
          <div class="footer">
            <p>© 2025 BetterStreets - Barangay Camaman-an, Cagayan de Oro City</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset OTP email
 * @param {string} email - Recipient email address
 * @param {string} otp - Password reset OTP code
 * @param {string} name - User's name
 * @returns {Promise} Email sending promise
 */
const sendPasswordResetOTP = async (email, otp, name) => {
  const mailOptions = {
    from: `BetterStreets <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Code - BetterStreets',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; border: 2px dashed #10b981; }
          .otp-code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px; font-family: 'Courier New', monospace; }
          .warning { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We received a request to reset your password for your BetterStreets account.</p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Your Password Reset Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">Valid for 10 minutes</p>
            </div>

            <p>Enter this code in the app to reset your password.</p>

            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              For security reasons, this code will expire in <strong>10 minutes</strong>.
            </p>
          </div>
          <div class="footer">
            <p>BetterStreets - Barangay Camaman-an, Cagayan de Oro City</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error);
    throw new Error('Failed to send password reset email. Please try again.');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetOTP
};
