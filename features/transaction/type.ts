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

export type Transaction = {
    id: string;
    accountId: string;
    categoryId?: string;
    amount: string;
    direction: TransactionDirection;
    description: string;
    date: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateTransactionResponse = ApiSuccessResponse<Transaction>;
