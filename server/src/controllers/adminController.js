import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ $or: [{ role: 'user' }, { role: { $exists: false } }] })
    .select('_id name email role accessGranted isPremium createdAt updatedAt')
    .sort({ createdAt: -1 });
  res.json(users);
});

export const setBuilderAccess = asyncHandler(async (req, res) => {
  const { accessGranted } = req.body;
  if (typeof accessGranted !== 'boolean') {
    return res.status(400).json({ message: 'accessGranted must be true or false' });
  }

  const user = await User.findOneAndUpdate(
    { _id: req.params.userId, $or: [{ role: 'user' }, { role: { $exists: false } }] },
    { $set: { accessGranted } },
    { new: true }
  ).select('_id name email role accessGranted isPremium createdAt updatedAt');

  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

export async function ensureAdminAccount() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'ResumeForge Admin';

  if (!email || !password) return null;

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await User.findOneAndUpdate(
    { email },
    { $set: { name, passwordHash, role: 'admin', accessGranted: true } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return admin;
}
