import express from 'express';
import { BlockchainService } from '../services/blockchain.service';
import { logger } from '../utils/logger';

const router = express.Router();// Thay đổi từ blockchainController thành router
const blockchainService = new BlockchainService();

// Get balance USDT
router.get('/balanceUSDT/:address',  (async (req, res) => {
    try {
        const result = await blockchainService.getUSDTBalance(req.params.address);
        res.json(result);
    } catch (error: unknown) {
        logger.error('Balance endpoint error:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}) as express.Handler);

// Get balance
router.get('/balance/:address',  (async (req, res) => {
    try {
        const result = await blockchainService.getBalance(req.params.address);
        res.json(result);
    } catch (error: unknown) {
        logger.error('Balance endpoint error:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}) as express.Handler);

// Deposit TEZ
// Deposit directly on frontend
router.post('/deposit-tez',  (async (req, res) => {
    try {
        const { toAddress, amount } = req.body;
        if (!toAddress || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        const result = await blockchainService.depositTez({
            toAddress,
            amount: Number(amount)
        });
        res.json(result);
    } catch (error: unknown) {
        logger.error('Deposit TEZ endpoint error:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}) as express.Handler);

// Withdraw TEZ
router.post('/withdraw-tez', (async (req, res) => {
    try {
        const { toAddress, amount } = req.body;
        if (!toAddress || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        const result = await blockchainService.withdrawTez({
            toAddress,
            amount: Number(amount)
        });
        res.json(result);
    } catch (error: unknown) {
        logger.error('Withdraw TEZ endpoint error:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}) as express.Handler);

// Withdraw USDT
router.post('/withdraw-usdt', (async (req, res) => {
    try {
        const { toAddress, amount } = req.body;
        if (!toAddress || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }

        const result = await blockchainService.withdrawUSDT({
            toAddress,
            amount: Number(amount)
        });
        res.json(result);
    } catch (error: unknown) {
        logger.error('Withdraw USDT endpoint error:', error);
        res.status(500).json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}) as express.Handler);

// Health check endpoint
router.get('/health', (async (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
}) as express.Handler);

export default router;  // Export router thay vì blockchainController