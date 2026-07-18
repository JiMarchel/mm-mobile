import { ApiSuccessResponse } from "@/infrastructure/api/types";

export type TransactionDirection = 'IN' | 'OUT';

export type CreateTransactionPayload = {
    accountId: string;
    categoryId: string;
    amount: number;
    direction: TransactionDirection;
    description: string;
    date: string;
}

export type CreateTransferPayload = {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    description: string;
    date: string;
}

export type TransactionEntry = {
    id: string;
    accountId: string;
    categoryId?: string;
    amount: number;
    direction: TransactionDirection;
};

export type Transaction = {
    id: string;
    description: string;
    date: string;
    entries: TransactionEntry[];
    createdAt?: string;
    updatedAt?: string;
}

export type FlatTransaction = {
    id: string;
    transactionId: string;
    description: string;
    date: string;
    accountId: string;
    destinationAccountId?: string;
    categoryId?: string;
    amount: number;
    direction: TransactionDirection | 'TRANSFER';
}

export type CreateTransactionResponse = ApiSuccessResponse<Transaction>;

export type AllTransactionsResponse = ApiSuccessResponse<Transaction[]>;
