"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dataset_1 = __importDefault(require("./routes/dataset"));
const hospitals_1 = __importDefault(require("./routes/hospitals"));
const risk_analysis_1 = __importDefault(require("./routes/risk-analysis"));
const sos_1 = __importDefault(require("./routes/sos"));
const sos_2 = require("./db/sos");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.BACKEND_PORT) || 5000;
// Initialize Database
(0, sos_2.initDB)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.use('/api/dataset', dataset_1.default);
app.use('/api/hospitals', hospitals_1.default);
app.use('/api/risk', risk_analysis_1.default);
app.use('/api/sos', sos_1.default);
// Database Connection (Removed as per user request - using local CSV intelligence)
// mongoose.connect(MONGODB_URI)...
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on http://127.0.0.1:${PORT}`);
});
