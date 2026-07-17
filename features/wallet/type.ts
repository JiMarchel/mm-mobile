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