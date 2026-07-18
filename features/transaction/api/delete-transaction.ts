import { api } from "@/infrastructure/api/client";

export async function deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`);
}
