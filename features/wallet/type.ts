import { ApiSuccessResponse } from "@/infrastructure/api/types";

export type Wallet = {
    id: string,
    name: string,
    accountType: string,
    currency: string,
    balance: string,
    createdAt: string,
    updatedAt: string
}

export type AllWalletResponse = ApiSuccessResponse<Wallet[]>

export const ACCOUNT_TYPES = [
    'Cash', 'Bank', 'Credit Card', 'Savings', 'Investment', 'E-Wallet', 'Crypto', 'Loan'
] as const;

export type AccountType = typeof ACCOUNT_TYPES[number];

export type CreateWalletRequest = {
    name: string;
    accountType: AccountType;
    currency: string;
};