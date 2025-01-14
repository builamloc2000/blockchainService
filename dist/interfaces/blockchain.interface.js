"use strict";
// src/interfaces/blockchain.interface.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.TokenType = exports.NetworkType = void 0;
// Enums cho các constant values
var NetworkType;
(function (NetworkType) {
    NetworkType["MAINNET"] = "mainnet";
    NetworkType["GHOSTNET"] = "ghostnet";
    NetworkType["CUSTOM"] = "custom";
})(NetworkType || (exports.NetworkType = NetworkType = {}));
var TokenType;
(function (TokenType) {
    TokenType["TEZ"] = "TEZ";
    TokenType["USDT"] = "USDT";
})(TokenType || (exports.TokenType = TokenType = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["DEPOSIT"] = "deposit";
    TransactionType["WITHDRAW"] = "withdraw";
    TransactionType["TRANSFER"] = "transfer";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
