import { api } from '@/infrastructure/api/client';
import { RegisterRequest, RegisterResponse } from '../type';

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>('/auth/register', data);
  return response.data;
}
