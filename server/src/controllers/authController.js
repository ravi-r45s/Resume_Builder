import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';

function checkValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg;
    const err = new Error(message);
    err.status = 400;
    throw err;
  }
}

export const register = asyncHandler(async (req, res) => {
  checkValidation(req);
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  // New accounts are intentionally locked until an admin grants builder access.
  const user = await User.create({ name, email, passwordHash, role: 'user', accessGranted: false });

  res.status(201).json({
    token: generateToken(user),
    user: user.toPublicJSON(),
  });
});

export const login = asyncHandler(async (req, res) => {
  checkValidation(req);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  // -----
  console.log('LOGIN DEBUG:', {
  email: email.toLowerCase(),
  userFound: !!user,
  role: user?.role,
});
  // -----
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  // -----
  console.log('PASSWORD DEBUG:', { match });
  // ------
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    token: generateToken(user),
    user: user.toPublicJSON(),
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: user.toPublicJSON() });
});
