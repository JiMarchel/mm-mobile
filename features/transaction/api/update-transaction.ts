import { api } from "@/infrastructure/api/client";
import { UpdateTransactionPayload, GetTransactionResponse } from "../type";

export async function updateTransaction(id: string, data: UpdateTransactionPayload): Promise<GetTransactionResponse> {
    const response = await api.put<GetTransactionResponse>(`/transactions/${id}`, data);
    return response.data;
}
