import { z } from 'zod';
import { ACCOUNT_TYPES } from '../type';

export const createWalletSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  accountType: z.enum(ACCOUNT_TYPES, {
    message: 'Invalid account type'
  }),
  currency: z.string().min(3, 'Currency must be 3 characters').max(3, 'Currency must be 3 characters')
});

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
