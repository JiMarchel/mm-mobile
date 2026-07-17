import { api } from "@/infrastructure/api/client";
import { AllCategoriesResponse } from "../type";

export async function getCategories(): Promise<AllCategoriesResponse> {
    const response = await api.get<AllCategoriesResponse>('/categories/');
    return response.data;
}
