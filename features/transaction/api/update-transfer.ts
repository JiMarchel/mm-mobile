import { api } from "@/infrastructure/api/client";
import { UpdateTransferPayload, GetTransactionResponse } from "../type";

export async function updateTransfer(id: string, data: UpdateTransferPayload): Promise<GetTransactionResponse> {
    const response = await api.put<GetTransactionResponse>(`/transactions/transfer/${id}`, data);
    return response.data;
}
