
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const defaultSettings = {
    storeName: 'NŪRA Collection (Verified)',
    storeEmail: 'info@nura.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Fashion Street, New York, NY 10001',
    currency: 'USD',
    taxRate: 8.5,
    freeShippingThreshold: 150,
    shippingCost: 15,
    enableNotifications: true,
    enableEmailNotifications: true,
};

async function seedSettings() {
    try {
        console.log('🌱 Seeding settings...');

        for (const [key, value] of Object.entries(defaultSettings)) {
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
            const type = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string';

            await prisma.setting.upsert({
                where: { key },
                update: { value: stringValue, type },
                create: { key, value: stringValue, type, description: `Default setting for ${key}` },
            });
            console.log(`  ✓ Set ${key}`);
        }

        console.log('✅ Settings seeded successfully');
    } catch (error) {
        console.error('Error seeding settings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedSettings();
