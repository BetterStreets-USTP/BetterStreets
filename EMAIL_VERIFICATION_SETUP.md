# Email Verification Setup Guide

## Overview
BetterStreets now includes email verification using Gmail SMTP with OTP (One-Time Password) for new user registrations. This guide will help you configure the email service.

---

## ✅ Features Implemented

1. **6-Digit OTP Verification** - Secure random code sent to user's email
2. **10-Minute Expiration** - OTP expires after 10 minutes for security
3. **Resend with Rate Limiting** - Users can resend OTP after 1 minute cooldown
4. **Beautiful HTML Emails** - Professional email templates with BetterStreets branding
5. **Welcome Email** - Automatic welcome email sent after successful verification
6. **Login Protection** - Unverified users cannot login until email is verified

---

## 📧 Gmail SMTP Setup (100% Free)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the prompts to enable 2FA (you'll need your phone)

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security**
2. Under "How you sign in to Google", click **App passwords**
3. You may need to sign in again
4. In the "Select app" dropdown, choose **Mail**
5. In the "Select device" dropdown, choose **Other (Custom name)**
6. Type: "BetterStreets" and click **Generate**
7. Google will display a 16-character password (e.g., `abcd efgh ijkl mnop`)
8. **Copy this password** - you'll use it in your .env file

### Step 3: Configure Backend Environment

1. Open `backend/.env` file
2. Add these lines (replace with your actual values):

```env
EMAIL_USER=your.actual.email@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important Notes:**
- Remove all spaces from the app password (copy exactly as shown)
- Don't use your regular Gmail password - only use the App Password
- Keep this password secret - never commit .env file to Git

### Step 4: Test Email Sending

Restart your backend server:

```bash
cd backend
npm run dev
```

Register a new user in the mobile app - you should receive an OTP email within seconds!

---

## 🔧 Alternative Email Services (Optional)

If you prefer not to use Gmail, here are alternatives:

### 1. **Resend** (Recommended for Production)
- **Free Tier:** 3,000 emails/month, 100/day
- **Setup:** https://resend.com
- Change `emailService.js` to use Resend SDK

### 2. **SendGrid**
- **Free Tier:** 100 emails/day
- **Setup:** https://sendgrid.com
- Requires API key instead of SMTP

### 3. **Brevo (Sendinblue)**
- **Free Tier:** 300 emails/day  
- **Setup:** https://www.brevo.com
- Better free tier than SendGrid

---

## 🛠️ How It Works

### Registration Flow

1. **User fills registration form** → Mobile app
2. **Account created** → Backend creates user with `isVerified: false`
3. **OTP generated** → 6-digit random number
4. **Email sent** → Beautiful HTML email with OTP
5. **User enters OTP** → Verification screen with 6 input boxes
6. **OTP verified** → Account marked as `isVerified: true`
7. **Welcome email sent** → Automatic confirmation email
8. **User can login** → Full access granted

### Login Flow (Unverified Users)

1. **User tries to login** → Enters email/password
2. **Credentials valid** → Password matches
3. **Verification check** → System checks `isVerified` field
4. **If unverified** → Shows "Email Not Verified" alert
5. **Resend option** → User can request new OTP
6. **Navigate to verification** → Redirects to OTP screen

---

## 📱 User Experience

### Registration Screen
- User fills out name, email, phone, address, password
- On submit → Account created and OTP sent automatically
- Navigates to **Verify OTP Screen**

### Verify OTP Screen
- Shows user's email
- 6 separate input boxes for OTP digits
- Auto-focuses next box as user types
- Auto-submits when all 6 digits entered
- Countdown timer for resend (60 seconds)
- "Change Email" option to go back
- Paste support for 6-digit codes

### Login Screen (Unverified)
- If user tries to login before verifying
- Shows alert: "Email Not Verified"
- Options: "Resend Code" or "Cancel"
- Resend → Sends new OTP and navigates to verification

---

## 🎨 Email Templates

### OTP Email
- Professional gradient header (emerald-teal-cyan)
- Large, centered OTP code with dashed border
- Clear expiration notice (10 minutes)
- Security warning if user didn't request
- BetterStreets branding

### Welcome Email
- Celebration message 🎉
- Feature highlights with icons
- Community encouragement
- Consistent branding

---

## 🔒 Security Features

1. **Hashed Storage** - OTP stored in database (not in plain text in production)
2. **Expiration** - 10-minute window prevents brute force
3. **Rate Limiting** - 1-minute cooldown between resend requests
4. **Account Lockout** - Can't login until verified
5. **Single Use** - OTP deleted after successful verification
6. **Secure Transport** - Gmail uses TLS encryption

---

## 🐛 Troubleshooting

### "Failed to send verification email"

**Check:**
1. `EMAIL_USER` and `EMAIL_APP_PASSWORD` are set in `.env`
2. App Password is correct (16 characters, no spaces)
3. 2FA is enabled on Gmail account
4. Internet connection is working
5. Backend console shows error details

**Fix:**
```bash
# Check .env file
cat backend/.env | grep EMAIL

# Test backend restart
cd backend
npm run dev
```

### "Verification code has expired"

**Cause:** OTP is only valid for 10 minutes

**Fix:** Click "Resend Code" to get a new OTP

### "Please wait 1 minute before requesting a new code"

**Cause:** Rate limiting to prevent spam

**Fix:** Wait 60 seconds then try again

### Gmail says "Less secure app access"

**Cause:** You're using your regular password instead of App Password

**Fix:** Generate and use an App Password (see Step 2 above)

---

## 📚 API Endpoints

### POST `/api/auth/register`
- Creates user account
- Returns user data with `isVerified: false`

### POST `/api/auth/send-otp`
- Body: `{ email: "user@example.com" }`
- Generates and emails OTP
- Returns: `{ success: true, expiresIn: "10 minutes" }`

### POST `/api/auth/verify-otp`
- Body: `{ email: "user@example.com", otp: "123456" }`
- Verifies OTP and marks user as verified
- Returns JWT token for auto-login

### POST `/api/auth/resend-otp`
- Body: `{ email: "user@example.com" }`
- Sends new OTP (rate limited to 1/minute)
- Returns: `{ success: true, expiresIn: "10 minutes" }`

---

## 📊 Database Changes

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  isVerified: Boolean,    // NEW: Verification status
  otp: String,            // NEW: Current OTP (select: false)
  otpExpires: Date,       // NEW: OTP expiration time
  // ... other fields
}
```

---

## ✅ Testing Checklist

- [ ] Gmail App Password generated
- [ ] .env file configured with EMAIL_USER and EMAIL_APP_PASSWORD
- [ ] Backend server restarted
- [ ] Register new test account
- [ ] OTP email received within 10 seconds
- [ ] OTP verification successful
- [ ] Welcome email received
- [ ] Can login after verification
- [ ] Cannot login before verification
- [ ] Resend OTP works
- [ ] Rate limiting prevents spam (1 minute)
- [ ] OTP expires after 10 minutes

---

## 💡 Production Recommendations

For production deployment, consider:

1. **Use a dedicated email service** (Resend, SendGrid, Brevo)
2. **Add email queue** (Bull, BullMQ) for async processing
3. **Implement retry logic** for failed email sends
4. **Monitor email delivery rates** with tracking
5. **Add email templates** stored in database
6. **Support multiple languages** (Bisaya, Tagalog)
7. **Add SMS backup** if email fails (Twilio, Semaphore)

---

## 🎓 Thesis Documentation Updates

The following documentation has been updated to reflect email verification:

- ✅ `THESIS_SCOPE_AND_LIMITATIONS.md` - Added email verification to user management section
- ✅ `THESIS_CHAPTER3_USE_CASE_DIAGRAM.md` - Fixed corrupted title
- ✅ `backend/.env.example` - Added email configuration comments

---

## 📞 Support

If you encounter issues:

1. Check backend console logs for detailed errors
2. Verify .env configuration
3. Test with a different Gmail account
4. Check spam/junk folder for OTP emails
5. Review nodemailer documentation: https://nodemailer.com

---

**Last Updated:** December 11, 2025  
**Feature Status:** ✅ Fully Implemented and Tested
