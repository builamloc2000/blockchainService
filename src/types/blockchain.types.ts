export interface TransferParams {
    toAddress: string;
    amount: number;
}

export interface TransferResult {
    success: boolean;
    opHash?: string;
    error?: string;
}

export interface BalanceResult {
    success: boolean;
    balance?: number;
    error?: string;
}