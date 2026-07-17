import { api } from "@/infrastructure/api/client";
import { Category, CreateCategoryRequest } from "../type";
import { ApiSuccessResponse } from "@/infrastructure/api/types";

export async function createCategory(data: CreateCategoryRequest): Promise<ApiSuccessResponse<Category>> {
    const response = await api.post<ApiSuccessResponse<Category>>('/categories/', data);
    return response.data;
}
