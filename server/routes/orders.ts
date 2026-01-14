
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get orders
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: true }
                },
                customer: true
            }
        });
        res.json({ success: true, data: orders, count: orders.length });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

// Create order
router.post('/', async (req, res) => {
    try {
        const {
            customer, phone, email,
            items, // Array of { productId, quantity, price }
            total, subtotal, shipping,
            address, apartment, city, state, zipCode, country,
            userId // Optional linked user
        } = req.body;

        // 1. Create or Find Customer
        // If email is provided, try to find existing customer
        let customerId = null;
        if (email) {
            let existingCust = await prisma.customer.findUnique({ where: { email } });
            if (!existingCust) {
                existingCust = await prisma.customer.create({
                    data: {
                        email,
                        firstName: customer.split(' ')[0],
                        lastName: customer.split(' ').slice(1).join(' '),
                        phone
                    }
                });
            }
            customerId = existingCust.id;
        }

        // 2. Create Order
        const order = await prisma.order.create({
            data: {
                customerName: customer,
                phone,
                email,
                total,
                subtotal: subtotal || total,
                shipping: shipping || 0,
                address,
                apartment,
                city,
                state,
                zipCode,
                country,
                userId,
                customerId,
                items: {
                    create: items?.map((item: any) => ({
                        productId: item.productId || item.id, // Handle both formats if possible
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { items: true }
        });

        // 3. Update Inventory
        if (items && Array.isArray(items)) {
            for (const item of items) {
                const pid = item.productId || item.id;
                if (pid) {
                    // Decrement inventory
                    try {
                        await prisma.inventory.update({
                            where: { productId: pid },
                            data: { quantity: { decrement: item.quantity } }
                        });
                    } catch (e) {
                        console.log(`Failed to update inventory for product ${pid}`);
                    }
                }
            }
        }

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, error: 'Failed to create order' });
    }
});

export default router;
