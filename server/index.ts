
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import settingRoutes from './routes/settings';
import addressRoutes from './routes/addresses';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Handle OPTIONS requests for all routes (handled by cors middleware)
// app.options('(.*)', (req, res) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.sendStatus(200);
// });

// Health check route (must be before other routes to avoid conflicts)
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'ok', message: 'Backend is running', timestamp: new Date().toISOString() });
});

// Explicitly handle /api/health/* to prevent routing issues
app.all(/\/api\/health\/.*/, (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route not found: ${req.method} ${req.path}. Did you mean /api/health?`
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/addresses', addressRoutes);

app.get('/', (req, res) => {
    res.send('Nuri Backend Server is running. API is available at /api');
});

// Catch-all for undefined /api routes (must be before general catch-all)
app.all(/\/api\/.*/, (req, res, next) => {
    // Skip if it's a valid route (already handled above)
    // This will catch any /api/* routes that don't match
    if (req.path.startsWith('/api/health/') && req.path !== '/api/health') {
        return res.status(404).json({
            success: false,
            error: `Route not found: ${req.method} ${req.path}. Did you mean /api/health?`
        });
    }
    next();
});

// Catch-all for undefined routes
app.use((req, res) => {
    console.error(`Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${req.path}`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
