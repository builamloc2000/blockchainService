// services/blockchain.service.ts
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner } from '@taquito/signer';
import { config } from '../config';
import { logger } from '../utils/logger';
import { TransferParams, TransferResult } from '../types/blockchain.types';

export class BlockchainService {
    private tezos: TezosToolkit;
    private withdrawWallet: TezosToolkit;
    private withdrawUSDTWallet: TezosToolkit;

    constructor() {
        this.tezos = new TezosToolkit(config.tezos.rpcUrl);
        this.withdrawWallet = new TezosToolkit(config.tezos.rpcUrl);
        this.withdrawUSDTWallet = new TezosToolkit(config.tezos.rpcUrl);
        this.initWithdrawWallets();
    }

    private async initWithdrawWallets() {
        try {
            // Initialize TEZ withdraw wallet
            this.withdrawWallet = new TezosToolkit(config.tezos.rpcUrl);
            const tezSigner = await InMemorySigner.fromSecretKey(config.tezos.withdrawPrivateKey);
            this.withdrawWallet.setProvider({ signer: tezSigner });

            // Initialize USDT withdraw wallet
            this.withdrawUSDTWallet = new TezosToolkit(config.tezos.rpcUrl);
            const usdtSigner = await InMemorySigner.fromSecretKey(config.tezos.withdrawUSDTPrivateKey);
            this.withdrawUSDTWallet.setProvider({ signer: usdtSigner });
        } catch (error) {
            logger.error('Failed to initialize withdraw wallets:', error);
            throw error;
        }
    }

    async getBalance(address: string): Promise<string> {
        try {
            const balance = await this.tezos.tz.getBalance(address);
            return (balance.toNumber() / 1000000).toString();
        } catch (error) {
            logger.error('Failed to get balance:', error);
            throw error;
        }
    }

    async depositTez(params: TransferParams): Promise<TransferResult> {
        try {
            // Just validate the deposit address matches config
            if (params.toAddress !== config.tezos.depositWallet) {
                throw new Error('Invalid deposit address');
            }

            // Return success as deposit is handled by user's wallet
            return { success: true };
        } catch (error: unknown) {
            logger.error('TEZ deposit error:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async withdrawTez(params: TransferParams): Promise<TransferResult> {
        try {
            const op = await this.withdrawWallet.contract.transfer({
                to: params.toAddress,
                amount: params.amount / 1000000,
            });

            await op.confirmation();
            logger.info(`TEZ withdrawal successful: ${op.hash}`);
            
            return {
                success: true,
                opHash: op.hash
            };
        } catch (error: unknown) {
            logger.error('TEZ withdraw error:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async withdrawUSDT(params: TransferParams): Promise<TransferResult> {
        try {
            const contract = await this.withdrawUSDTWallet.contract.at(config.tezos.usdtContract);
            
            const transferParams = [{
                from_: config.tezos.withdrawUSDTWallet,
                txs: [{
                    to_: params.toAddress,
                    token_id: 0,
                    amount: params.amount
                }]
            }];

            const op = await contract.methods.transfer(transferParams).send();
            await op.confirmation();

            logger.info(`USDT withdrawal successful: ${op.hash}`);
            return {
                success: true,
                opHash: op.hash
            };
        } catch (error: unknown) {
            logger.error('USDT withdraw error:', error);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getUSDTBalance(address: string): Promise<string> {
        try {
            const contract = await this.tezos.contract.at(config.tezos.usdtContract);
            const storage: any = await contract.storage();
            const balance = await storage.ledger.get({
                0: address,
                1: "0"
            });
            return (balance ? balance.toNumber() / 1000000 : 0).toString();
        } catch (error) {
            logger.error('Failed to get USDT balance:', error);
            throw error;
        }
    }
}