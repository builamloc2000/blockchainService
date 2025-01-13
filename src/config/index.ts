import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  tezos: {
    rpcUrl: process.env.TEZOS_RPC_URL,
    network: process.env.TEZOS_NETWORK,
    withdrawWallet: process.env.WITHDRAW_WALLET,
    withdrawPrivateKey: process.env.WITHDRAW_WALLET_PRIVATE_KEY,
    usdtContract: process.env.USDT_CONTRACT
  }
};