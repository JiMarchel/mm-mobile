import { api } from "@/infrastructure/api/client";
import { GetTransactionResponse } from "../type";

export async function getTransaction(id: string): Promise<GetTransactionResponse> {
    const response = await api.get<GetTransactionResponse>(`/transactions/${id}`);
    return response.data;
}
