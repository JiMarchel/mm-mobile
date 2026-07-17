import { z } from 'zod';

export const createTransactionSchema = z.object({
  accountId: z.string().uuid('Invalid account selected'),
  categoryId: z.string().uuid('Invalid category selected'),
  amount: z.coerce.number().positive('Amount must be positive'),
  direction: z.enum(['IN', 'OUT']),
  description: z.string().min(1, 'Description is required'),
  date: z.string().datetime(),
});

export const createTransferSchema = z.object({
  sourceAccountId: z.string().uuid('Invalid source account'),
  destinationAccountId: z.string().uuid('Invalid destination account'),
  amount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().datetime(),
}).refine(data => data.sourceAccountId !== data.destinationAccountId, {
  message: 'Source and destination accounts must be different',
  path: ['destinationAccountId'],
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type CreateTransferInput = z.infer<typeof createTransferSchema>;
