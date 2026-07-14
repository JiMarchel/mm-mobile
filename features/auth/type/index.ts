import { ApiSuccessResponse } from '@/infrastructure/api/types';
import { RegisterInput } from '../validation/register';

export type RegisterRequest = Omit<RegisterInput, 'confirmPassword'>;

export type RegisterResponse = ApiSuccessResponse<void>;
