import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCategoryRequest, Category } from '../type';
import { createCategory } from '../api/create-category';
import { ApiSuccessResponse } from '@/infrastructure/api/types';

export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation<ApiSuccessResponse<Category>, Error, CreateCategoryRequest>({
        mutationFn: createCategory,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
}
