// Script to create an admin user
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@yourstore.com';
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const name = process.env.ADMIN_NAME || 'Admin User';

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Using defaults.');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists. Updating to admin...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'admin',
          name: name,
        },
      });
      console.log('Admin user updated successfully:', {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      });
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name,
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      name: adminUser.name,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
