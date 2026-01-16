
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { orders: true }
                },
                orders: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { createdAt: true }
                }
            }
        });

        // Format for frontend
        const formattedCustomers = customers.map(c => ({
            id: c.id,
            email: c.email,
            firstName: c.firstName,
            lastName: c.lastName,
            phone: c.phone,
            totalOrders: c._count.orders,
            lastOrderDate: c.orders[0]?.createdAt || null,
            createdAt: c.createdAt
        }));

        res.json({ success: true, data: formattedCustomers, count: formattedCustomers.length });
    } catch (error) {
        console.error('Fetch customers error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch customers' });
    }
});

// Get customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: { id: req.params.id },
            include: {
                orders: {
                    orderBy: { createdAt: 'desc' },
                    include: { items: { include: { product: true } } }
                },
                addresses: true
            }
        });

        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }

        res.json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch customer details' });
    }
});

export default router;
