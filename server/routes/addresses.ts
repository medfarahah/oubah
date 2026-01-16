import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get all addresses for a user
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }

        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
        });

        res.json({ success: true, data: addresses, count: addresses.length });
    } catch (error) {
        console.error('Get addresses error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch addresses' });
    }
});

// Create address
router.post('/', async (req, res) => {
    try {
        const { userId, type, firstName, lastName, address, apartment, city, state, zipCode, country, phone, isDefault } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: 'User ID is required' });
        }
        if (!address || !city || !country) {
            return res.status(400).json({ success: false, error: 'Address, city, and country are required' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId,
                type: type || 'shipping',
                firstName,
                lastName,
                address,
                apartment,
                city,
                state,
                zipCode,
                country,
                phone,
                isDefault: isDefault || false,
            },
        });

        res.status(201).json({ success: true, data: newAddress });
    } catch (error) {
        console.error('Create address error:', error);
        res.status(500).json({ success: false, error: 'Failed to create address' });
    }
});

// Update address
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, firstName, lastName, address, apartment, city, state, zipCode, country, phone, isDefault } = req.body;

        const existingAddress = await prisma.address.findUnique({
            where: { id },
        });

        if (!existingAddress) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        // If setting as default, unset other defaults for the same user
        if (isDefault && existingAddress.userId) {
            await prisma.address.updateMany({
                where: { userId: existingAddress.userId, id: { not: id } },
                data: { isDefault: false },
            });
        }

        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                type,
                firstName,
                lastName,
                address,
                apartment,
                city,
                state,
                zipCode,
                country,
                phone,
                isDefault,
            },
        });

        res.json({ success: true, data: updatedAddress });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ success: false, error: 'Failed to update address' });
    }
});

// Delete address
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.address.delete({
            where: { id },
        });

        res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete address' });
    }
});

// Set default address
router.put('/:id/default', async (req, res) => {
    try {
        const { id } = req.params;

        const address = await prisma.address.findUnique({
            where: { id },
        });

        if (!address || !address.userId) {
            return res.status(404).json({ success: false, error: 'Address not found' });
        }

        // Unset all other defaults for this user
        await prisma.address.updateMany({
            where: { userId: address.userId, id: { not: id } },
            data: { isDefault: false },
        });

        // Set this address as default
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: { isDefault: true },
        });

        res.json({ success: true, data: updatedAddress });
    } catch (error) {
        console.error('Set default address error:', error);
        res.status(500).json({ success: false, error: 'Failed to set default address' });
    }
});

export default router;
