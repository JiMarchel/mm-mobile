import { ApiSuccessResponse } from "@/infrastructure/api/types";

export const CATEGORY_TYPES = ['Income', 'Expense', 'Transfer'] as const;
export type CategoryType = typeof CATEGORY_TYPES[number];

export type Category = {
    id: string;
    name: string;
    type: CategoryType;
    createdAt: string;
    updatedAt: string;
}

export type AllCategoriesResponse = ApiSuccessResponse<Category[]>;

export type CreateCategoryRequest = {
    name: string;
    type: CategoryType;
};
