import { z } from 'zod';
import { CATEGORY_TYPES } from '../type';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(CATEGORY_TYPES, {
    message: 'Invalid category type'
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
