import { api } from "@/infrastructure/api/client";
import { AllTransactionsResponse } from "../type";

export async function getTransactions(startDate?: string, endDate?: string): Promise<AllTransactionsResponse> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/transactions/?${queryString}` : '/transactions/';
    
    const response = await api.get<AllTransactionsResponse>(endpoint);
    return response.data;
}
