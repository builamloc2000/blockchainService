import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './utils/logger';
import blockchainRoutes from './controllers/blockchain.controller';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/blockchain', blockchainRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

app.listen(config.port, () => {
    logger.info(`Blockchain service running on port ${config.port}`);
});