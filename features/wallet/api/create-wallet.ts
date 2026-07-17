import { api } from '@/infrastructure/api/client';
import { CreateWalletRequest, Wallet } from '../type';
import { ApiSuccessResponse } from '@/infrastructure/api/types';

export async function createWallet(data: CreateWalletRequest): Promise<ApiSuccessResponse<Wallet>> {
    const response = await api.post<ApiSuccessResponse<Wallet>>('/wallets/', data);
    return response.data;
}
