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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
// services/blockchain.service.ts
const taquito_1 = require("@taquito/taquito");
const signer_1 = require("@taquito/signer");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class BlockchainService {
    constructor() {
        this.tezos = new taquito_1.TezosToolkit(config_1.config.tezos.rpcUrl);
        this.withdrawWallet = new taquito_1.TezosToolkit(config_1.config.tezos.rpcUrl);
        this.withdrawUSDTWallet = new taquito_1.TezosToolkit(config_1.config.tezos.rpcUrl);
        this.initWithdrawWallets();
    }
    initWithdrawWallets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Initialize TEZ withdraw wallet
                this.withdrawWallet = new taquito_1.TezosToolkit(config_1.config.tezos.rpcUrl);
                const tezSigner = yield signer_1.InMemorySigner.fromSecretKey(config_1.config.tezos.withdrawPrivateKey);
                this.withdrawWallet.setProvider({ signer: tezSigner });
                // Initialize USDT withdraw wallet
                this.withdrawUSDTWallet = new taquito_1.TezosToolkit(config_1.config.tezos.rpcUrl);
                const usdtSigner = yield signer_1.InMemorySigner.fromSecretKey(config_1.config.tezos.withdrawUSDTPrivateKey);
                this.withdrawUSDTWallet.setProvider({ signer: usdtSigner });
            }
            catch (error) {
                logger_1.logger.error('Failed to initialize withdraw wallets:', error);
                throw error;
            }
        });
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.tezos.tz.getBalance(address);
                return (balance.toNumber() / 1000000).toString();
            }
            catch (error) {
                logger_1.logger.error('Failed to get balance:', error);
                throw error;
            }
        });
    }
    depositTez(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Just validate the deposit address matches config
                if (params.toAddress !== config_1.config.tezos.depositWallet) {
                    throw new Error('Invalid deposit address');
                }
                // Return success as deposit is handled by user's wallet
                return { success: true };
            }
            catch (error) {
                logger_1.logger.error('TEZ deposit error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    withdrawTez(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const op = yield this.withdrawWallet.contract.transfer({
                    to: params.toAddress,
                    amount: params.amount / 1000000,
                });
                yield op.confirmation();
                logger_1.logger.info(`TEZ withdrawal successful: ${op.hash}`);
                return {
                    success: true,
                    opHash: op.hash
                };
            }
            catch (error) {
                logger_1.logger.error('TEZ withdraw error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    withdrawUSDT(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contract = yield this.withdrawUSDTWallet.contract.at(config_1.config.tezos.usdtContract);
                const transferParams = [{
                        from_: config_1.config.tezos.withdrawUSDTWallet,
                        txs: [{
                                to_: params.toAddress,
                                token_id: 0,
                                amount: params.amount
                            }]
                    }];
                const op = yield contract.methods.transfer(transferParams).send();
                yield op.confirmation();
                logger_1.logger.info(`USDT withdrawal successful: ${op.hash}`);
                return {
                    success: true,
                    opHash: op.hash
                };
            }
            catch (error) {
                logger_1.logger.error('USDT withdraw error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                };
            }
        });
    }
    getUSDTBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contract = yield this.tezos.contract.at(config_1.config.tezos.usdtContract);
                const storage = yield contract.storage();
                const balance = yield storage.ledger.get({
                    0: address,
                    1: "0"
                });
                return (balance ? balance.toNumber() / 1000000 : 0).toString();
            }
            catch (error) {
                logger_1.logger.error('Failed to get USDT balance:', error);
                throw error;
            }
        });
    }
}
exports.BlockchainService = BlockchainService;
