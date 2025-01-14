// src/interfaces/blockchain.interface.ts

// Interface cho các tham số transfer
export interface TransferParams {
    fromAddress?: string;    // Optional vì có thể lấy từ wallet đang connect
    toAddress: string;       // Địa chỉ nhận
    amount: number;          // Số lượng token/tez
    tokenId?: number;        // Optional cho FA2 tokens
 }
 
 // Interface cho kết quả transfer
 export interface TransferResult {
    success: boolean;        // Status của transaction
    opHash?: string;        // Operation hash nếu thành công
    error?: string;         // Error message nếu thất bại
 }
 
 // Interface cho kết quả balance
 export interface BalanceResult {
    balance: string;        // Balance dạng string để tránh precision loss
    symbol: string;         // TEZ hoặc USDT
 }
 
 // Interface cho contract storage
 export interface FA2Storage {
    ledger: Map<{
        0: string;          // address
        1: string;          // token_id
    }, number>;
    operators: Set<{
        owner: string;
        operator: string;
        token_id: number;
    }>;
    token_metadata: Map<number, {
        token_id: number;
        token_info: Map<string, string>;
    }>;
 }
 
 // Interface cho blockchain configuration
 export interface BlockchainConfig {
    rpcUrl: string;
    network: string;
    withdrawWallet: string;
    withdrawPrivateKey: string;
    usdtContract: string;
 }
 
 // Interface cho wallet connection response
 export interface WalletConnection {
    address: string;
    type: string;           // ví dụ: 'beacon', 'temple'
    network: string;
 }
 
 // Interface cho blockchain error
 export interface BlockchainError extends Error {
    code?: string;          // Error code từ blockchain
    details?: any;          // Chi tiết bổ sung về lỗi
 }
 
 // Interface cho transaction status
 export interface TransactionStatus {
    status: 'pending' | 'success' | 'failed';
    confirmations: number;
    timestamp: number;
    opHash: string;
 }
 
 // Interface cho ví dụ event tracking
 export interface BlockchainEvent {
    type: 'connect' | 'disconnect' | 'transfer' | 'error';
    timestamp: number;
    data: any;
 }
 
 // Interface cho API responses
 export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
 }
 
 // Interface cho blockchain adapter
 export interface IBlockchainAdapter {
    connectWallet(): Promise<WalletConnection>;
    disconnectWallet(): Promise<void>;
    depositTez(params: TransferParams): Promise<TransferResult>;
    withdrawTez(params: TransferParams): Promise<TransferResult>;
    withdrawUSDT(params: TransferParams): Promise<TransferResult>;
    getBalance(address: string): Promise<BalanceResult>;
    getTransactionStatus(opHash: string): Promise<TransactionStatus>;
 }
 
 // Custom type cho transaction parameters
 export type TransferTxParams = {
    from_: string;
    txs: Array<{
        to_: string;
        token_id: number;
        amount: number;
    }>;
 };
 
 // Enums cho các constant values
 export enum NetworkType {
    MAINNET = 'mainnet',
    GHOSTNET = 'ghostnet',
    CUSTOM = 'custom'
 }
 
 export enum TokenType {
    TEZ = 'TEZ',
    USDT = 'USDT'
 }
 
 export enum TransactionType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
 }