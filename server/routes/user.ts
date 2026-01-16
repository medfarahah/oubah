
import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Update Profile
router.put('/profile', async (req, res) => {
    try {
        const { id, name, email, phone } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                phone,
            },
            include: { addresses: true }
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json({ success: true, data: userWithoutPassword });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
});

// Change Password
router.put('/password', async (req, res) => {
    try {
        const { id, currentPassword, newPassword } = req.body;

        if (!id || !currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const user = await prisma.user.findUnique({ where: { id } });
        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id },
            data: { password: hashedPassword }
        });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, error: 'Failed to change password' });
    }
});

export default router;
