import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

export const EMAIL_HOST = process.env.EMAIL_HOST || 'your-email@gmail.com';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your-app-password';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const SYSTEM_NAME = process.env.APP_NAME || 'Event Planner';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_HOST,
    pass: EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true
});

export const sendWelcomeEmail = async (user, verificationToken) => {
  const verificationLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
  const mailOptions = {
    from: `"${SYSTEM_NAME}" <${EMAIL_HOST}>`,
    to: user.email,
    subject: `Welcome to ${SYSTEM_NAME}, ${user.firstName} ${user.lastName}!`,
    html: `
      <h1>Welcome, ${user.firstName} ${user.lastName}!</h1>
       <p>Thank you for joining ${SYSTEM_NAME}, the platform for planning your events!</p>
       <p>Please verify your email address to activate your account:</p>
      <a href="${verificationLink}" style="background-color: #1976D2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      <p>If the button above doesn't work, copy and paste this link into your browser:</p> 
      <p>${verificationLink}</p>
      <p style="color: #1976D2;">Happy planning!</p>
      
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${user.email}:`, error);
    throw new Error("Failed to send welcome email");
  }
};

export const sendVerificationEmail = async (user, verificationToken) => {
  const verificationLink = `${CLIENT_URL}/verify-email/${verificationToken}`;
  const mailOptions = {
    from: `"${SYSTEM_NAME}" <${EMAIL_HOST}>`,
    to: user.email,
    subject: `Verify Your ${SYSTEM_NAME} Account`,
    html: `
      <h1>Verify Your Email</h1>
      <p>Hi ${user.firstName} ${user.lastName},</p>
      <p>Thank you for registering with ${SYSTEM_NAME}!</p>
      <p style="color: #1976D2;">Happy planning!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send verification email to ${user.email}:`, error);
    throw new Error("Failed to send verification email");
  }
};

export const sendResetPasswordEmail = async (user, resetCode) => {
  const mailOptions = {
    from: `"${SYSTEM_NAME}" <${EMAIL_HOST}>`,
    to: user.email,
    subject: `Reset Your ${SYSTEM_NAME} Password`,
    html: `
      <h1>Reset Your Password</h1>
      <p>Hi ${user.firstName} ${user.lastName},</p>
      <p>You requested to reset your password with ${SYSTEM_NAME}!</p>
      <p>Your reset code is: ${resetCode}</p>
      <p style="color: #1976D2;">Happy planning!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send reset password email to ${user.email}:`, error);
    throw new Error("Failed to send reset password email");
  }
}