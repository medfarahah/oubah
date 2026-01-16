
import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: { inventory: true }
        });
        res.json({ success: true, data: products, count: products.length });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { inventory: true }
        });
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
});

// Create product
router.post('/', async (req, res) => {
    try {
        const { name, price, imageUrl, categories, description, stock } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                price,
                imageUrl,
                categories: categories || [],
                description,
                inventory: {
                    create: {
                        quantity: stock || 0
                    }
                }
            },
            include: { inventory: true }
        });

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to create product' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { stock, ...data } = req.body;

        // Update product fields
        const product = await prisma.product.update({
            where: { id: req.params.id },
            data: data,
        });

        // Update inventory if stock provided
        if (stock !== undefined) {
            await prisma.inventory.upsert({
                where: { productId: product.id },
                create: { productId: product.id, quantity: stock },
                update: { quantity: stock }
            });
        }

        const updatedProduct = await prisma.product.findUnique({
            where: { id: req.params.id },
            include: { inventory: true }
        });

        res.json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to update product' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
});

export default router;
