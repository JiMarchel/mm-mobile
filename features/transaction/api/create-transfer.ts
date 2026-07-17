import { api } from "@/infrastructure/api/client";
import { CreateTransferPayload, CreateTransactionResponse } from "../type";

export async function createTransfer(data: CreateTransferPayload): Promise<CreateTransactionResponse> {
    const response = await api.post<CreateTransactionResponse>('/transactions/transfer', data);
    return response.data;
}
