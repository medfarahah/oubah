
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get orders
router.get('/', async (req, res) => {
    try {
        const { email, userId } = req.query;
        let where: any = {};

        if (email && userId) {
            where = {
                OR: [
                    { email: email as string },
                    { userId: userId as string }
                ]
            };
        } else if (email) {
            where.email = email as string;
        } else if (userId) {
            where.userId = userId as string;
        }

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: true }
                },
                customer: true,
                user: true
            }
        });
        res.json({ success: true, data: orders, count: orders.length });
    } catch (error) {
        console.error('Fetch orders error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch orders' });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                items: {
                    include: { product: true }
                },
                customer: true,
                user: true
            }
        });

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        console.error('Fetch order error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch order' });
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
            whatsapp, quartier, placeToReceive,
            userId // Optional linked user
        } = req.body;

        // 1. Create or Find Customer
        let customerId = null;
        let finalUserId = userId;

        if (email) {
            // Find or create customer (for Admin CRM)
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

            // Auto-link to registered user if userId not provided
            if (!finalUserId) {
                const registeredUser = await prisma.user.findUnique({ where: { email } });
                if (registeredUser) {
                    finalUserId = registeredUser.id;
                }
            }
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
                whatsapp,
                quartier,
                placeToReceive,
                userId: finalUserId,
                customerId,
                items: {
                    create: items?.map((item: any) => ({
                        productId: item.productId || item.id, // Handle both formats if possible
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size
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

// Update order
router.put('/:id', async (req, res) => {
    try {
        const { status, paymentMethod, deliveryNotes } = req.body;
        const order = await prisma.order.update({
            where: { id: req.params.id },
            data: {
                status,
                paymentMethod,
                deliveryNotes
            }
        });
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update order' });
    }
});

export default router;
