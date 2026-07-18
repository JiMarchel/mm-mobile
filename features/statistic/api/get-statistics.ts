import { api } from "@/infrastructure/api/client";
import { StatisticsData } from "../type";
import { ApiSuccessResponse } from "@/infrastructure/api/types";

export async function getStatistics(startDate?: string, endDate?: string): Promise<ApiSuccessResponse<StatisticsData>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const url = `/statistics${queryString ? `?${queryString}` : ''}`;
    
    const res = await api.get<ApiSuccessResponse<StatisticsData>>(url);
    return res.data;
}
