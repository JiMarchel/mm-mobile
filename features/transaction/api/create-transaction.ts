import { api } from "@/infrastructure/api/client";
import { CreateTransactionPayload, CreateTransactionResponse } from "../type";

export async function createTransaction(data: CreateTransactionPayload): Promise<CreateTransactionResponse> {
    const response = await api.post<CreateTransactionResponse>('/transactions/', data);
    return response.data;
}
