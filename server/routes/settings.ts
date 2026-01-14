
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
    try {
        const settings = await prisma.setting.findMany();
        // Convert to key-value object for easier frontend consumption
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.type === 'json' ? JSON.parse(curr.value) : curr.value;
            return acc;
        }, {} as Record<string, any>);

        res.json({ success: true, data: settingsMap });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
});

// Update setting
router.post('/', async (req, res) => {
    try {
        const { key, value, type, description } = req.body;

        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        const settingType = type || (typeof value === 'object' ? 'json' : typeof value);

        const setting = await prisma.setting.upsert({
            where: { key },
            update: { value: stringValue, type: settingType },
            create: { key, value: stringValue, type: settingType, description }
        });

        res.json({ success: true, data: setting });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to save setting' });
    }
});

export default router;
