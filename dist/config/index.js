"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3001,
    tezos: {
        rpcUrl: process.env.TEZOS_RPC_URL || 'https://ghostnet.ecadinfra.com',
        network: process.env.TEZOS_NETWORK || 'ghostnet',
        depositWallet: process.env.DEPOSIT_WALLET || '',
        withdrawWallet: process.env.WITHDRAW_WALLET || '',
        withdrawUSDTWallet: process.env.WITHDRAW_USDT_WALLET || '',
        withdrawPrivateKey: process.env.WITHDRAW_WALLET_PRIVATE_KEY || '',
        withdrawUSDTPrivateKey: process.env.WITHDRAW_USDT_WALLET_PRIVATE_KEY || '',
        usdtContract: process.env.USDT_CONTRACT || ''
    }
};
