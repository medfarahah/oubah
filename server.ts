
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// API Handlers
import registerHandler from './api/auth/register';
import loginHandler from './api/auth/login';
import productsHandler from './api/products';
import productHandler from './api/products/[id]';
import ordersHandler from './api/orders';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper to adapt Vercel handlers to Express
const adapt = (handler: any) => async (req: express.Request, res: express.Response) => {
    // augment req/res if necessary to match VercelRequest/VercelResponse
    // VercelRequest is just IncomingMessage + body/query/cookies
    // Express Request has these.

    // VercelResponse has status(), send(), json(), etc.
    // Express Response has these.

    try {
        await handler(req, res);
    } catch (err) {
        console.error('API Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Local API server running' });
});

// Auth
app.all('/api/auth/register', adapt(registerHandler));
app.all('/api/auth/login', adapt(loginHandler));

// Products
app.all('/api/products', adapt(productsHandler));
app.all('/api/products/:id', adapt(productHandler));

// Orders
app.all('/api/orders', adapt(ordersHandler));

app.listen(PORT, () => {
    console.log(`
  🚀 Local Backend Server running at http://localhost:${PORT}
  API endpoint: http://localhost:${PORT}/api
  `);
});
