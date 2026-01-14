
import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
            },
            include: { addresses: true }
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({ success: true, data: userWithoutPassword });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
            include: { addresses: true }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({ success: true, data: userWithoutPassword });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Me (Simple implementation via email look up for now, usually done via token)
// For this simple app, we might rely on client storing user info, but let's provide a refresh endpoint if needed.
// Actually proper Auth usually returns a token. 
// The existing frontend was just storing the user object in localStorage. 
// We'll stick to that simple flow for now as requested.

export default router;
