import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dropyourstories_secret_jwt_key_2026';

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username: username.trim().toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        bio: admin.bio,
        avatarUrl: admin.avatarUrl
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to process login request' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    return res.json({ admin });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching profile' });
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    const { name, bio, avatarUrl, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    if (name !== undefined) admin.name = name;
    if (bio !== undefined) admin.bio = bio;
    if (avatarUrl !== undefined) admin.avatarUrl = avatarUrl;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();
    return res.json({
      message: 'Settings updated successfully',
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        bio: admin.bio,
        avatarUrl: admin.avatarUrl
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating settings' });
  }
};
