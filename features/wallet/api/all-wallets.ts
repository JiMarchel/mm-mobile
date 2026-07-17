import { api } from "@/infrastructure/api/client";
import { AllWalletResponse } from "../type";

export async function allWallets(): Promise<AllWalletResponse> {
    const response = await api.get<AllWalletResponse>('/wallets');
    return response.data;
}