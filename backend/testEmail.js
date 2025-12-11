// Test script to send OTP to an existing user
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const { generateOTP, sendOTPEmail } = require('./src/utils/emailService');

const testEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Get the email from command line argument or use default
    const emailToTest = process.argv[2] || 'test@example.com';
    
    console.log(`\n🔍 Looking for user with email: ${emailToTest}`);

    // Find the user
    const user = await User.findOne({ email: emailToTest });
    
    if (!user) {
      console.log('❌ User not found in database');
      process.exit(1);
    }

    console.log(`✅ User found: ${user.name}`);
    console.log(`   isVerified: ${user.isVerified}`);

    // Generate OTP
    const otp = generateOTP();
    console.log(`\n🔢 Generated OTP: ${otp}`);

    // Save OTP to database
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    console.log('✅ OTP saved to database');

    // Send email
    console.log(`\n📧 Sending OTP email to: ${emailToTest}`);
    console.log(`   Using SMTP: ${process.env.EMAIL_USER}`);
    
    const result = await sendOTPEmail(emailToTest, otp, user.name);
    
    console.log('\n✅ SUCCESS! Email sent successfully!');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`\n📬 Check your inbox at: ${emailToTest}`);
    console.log(`   OTP Code: ${otp}`);

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

testEmail();
