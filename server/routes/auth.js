import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../models/User.js';
import { sendResetPasswordEmail, sendWelcomeEmail } from '../config/email.js';

const authRoutes = express.Router();
// Mock users data
let users = [
  {
    id: '1',
    email: 'john@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567'
  }
];

// Register user
authRoutes.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = uuidv4();

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      verificationToken,
      verificationTokenExpire: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      isVerified: false
    };

    // users.push(newUser);

    const user = await UserModel.create(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    await user.save();

    await sendWelcomeEmail(newUser, verificationToken);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user:{
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    res.status(500).json(
      {
        success: false,
        message: error.message
      }
    );
  }
});

// Sign in user
authRoutes.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user profile
authRoutes.get('/profile', async (req, res) => {
  // In a real app, you'd verify the JWT token here
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// Update user profile
authRoutes.patch('/me', async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

  try {
    const { email, firstName, lastName, phone } = req.body;
    const user = await UserModel.findByIdAndUpdate(decoded.userId, { email, firstName, lastName, phone }, { new: true });
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

authRoutes.post('/forgot-password', async (req, res) => {
  const {email} = req.body;

  if(!email){
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await UserModel.findOne({ email });
    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    user.resetCode = resetCode;
    await user.save();

    await sendResetPasswordEmail(user, resetCode);

    res.json({ success: true, message: 'Reset code sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

authRoutes.post('/reset-password', async (req, res) => {
  const {email, resetCode, password} = req.body;

  if(!email || !resetCode || !password){
    return res.status(400).json({ success: false, message: 'Email, reset code and new password are required' });
  }

  try {
    const user = await UserModel.findOne({ email });
    if(!user){
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Convert both to string for comparison to handle number/string mismatches
    if(String(user.resetCode) !== String(resetCode)){
      return res.status(400).json({ success: false, message: 'Invalid reset code' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    user.resetCode = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default authRoutes;