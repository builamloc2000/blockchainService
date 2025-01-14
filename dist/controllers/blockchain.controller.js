"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blockchain_service_1 = require("../services/blockchain.service");
const logger_1 = require("../utils/logger");
const router = express_1.default.Router(); // Thay đổi từ blockchainController thành router
const blockchainService = new blockchain_service_1.BlockchainService();
// Get balance USDT
router.get('/balanceUSDT/:address', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blockchainService.getUSDTBalance(req.params.address);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Balance endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})));
// Get balance
router.get('/balance/:address', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield blockchainService.getBalance(req.params.address);
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Balance endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})));
// Deposit TEZ
router.post('/deposit-tez', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toAddress, amount } = req.body;
        if (!toAddress || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }
        const result = yield blockchainService.depositTez({
            toAddress,
            amount: Number(amount)
        });
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Deposit TEZ endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})));
// Withdraw TEZ
router.post('/withdraw-tez', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toAddress, amount } = req.body;
        if (!toAddress || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }
        const result = yield blockchainService.withdrawTez({
            toAddress,
            amount: Number(amount)
        });
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Withdraw TEZ endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})));
// Withdraw USDT
router.post('/withdraw-usdt', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { toAddress, amount } = req.body;
        if (!toAddress || !amount) {
            return res.status(400).json({
                success: false,
                error: 'Missing required parameters'
            });
        }
        const result = yield blockchainService.withdrawUSDT({
            toAddress,
            amount: Number(amount)
        });
        res.json(result);
    }
    catch (error) {
        logger_1.logger.error('Withdraw USDT endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
})));
// Health check endpoint
router.get('/health', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
})));
exports.default = router; // Export router thay vì blockchainController
