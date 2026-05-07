import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import datasetRoutes from './routes/dataset';
import hospitalRoutes from './routes/hospitals';
import riskRoutes from './routes/risk-analysis';
import sosRoutes from './routes/sos';
import { initDB } from './db/sos';

dotenv.config();

const app = express();
const PORT = Number(process.env.BACKEND_PORT) || 5000;

// Initialize Database
initDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Healthcare Backend API is running',
        endpoints: {
            upload: '/api/dataset/upload',
            summary: '/api/dataset/summary',
            sos: '/api/sos/send'
        }
    });
});

app.use('/api/dataset', datasetRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/sos', sosRoutes);

// Database Connection (Removed as per user request - using local CSV intelligence)
// mongoose.connect(MONGODB_URI)...

app.listen(PORT, '0.0.0.0' as any, () => {
    console.log(`🚀 Backend server running on http://127.0.0.1:${PORT}`);
});
