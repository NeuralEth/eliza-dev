import { elizaLogger } from "@elizaos/core";
import {
    ApiResponse,
    SolanaBalanceResponse,
    SolanaSwapRequest,
    SolanaSwapResponse,
    SolanaTransferRequest,
    SolanaTransferResponse,
    VaultInfo,
} from "../types";

export interface ApiClient {
    getVaultInfo(): Promise<ApiResponse<VaultInfo>>;
    solanaTransfer(
        request: SolanaTransferRequest
    ): Promise<ApiResponse<SolanaTransferResponse>>;
    solanaBalance(address: string): Promise<ApiResponse<SolanaBalanceResponse>>;
    solanaSwap(
        request: SolanaSwapRequest
    ): Promise<ApiResponse<SolanaSwapResponse>>;
}

const BASE_URL = "https://api.emblemvault.ai";
const API_KEY_HEADER = "x-api-key";

export class EmblemVaultApiClient implements ApiClient {
    private readonly apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    private async request<T>(
        endpoint: string,
        options?: RequestInit
    ): Promise<ApiResponse<T>> {
        try {
            const headers = {
                [API_KEY_HEADER]: this.apiKey,
                ...(options?.headers || {}),
            };
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();
            if (!response.ok) {
                return {
                    data: null as unknown as T,
                    error: data?.error || "Error",
                };
            }

            return { data };
        } catch (error) {
            elizaLogger.error("Request error:", error);
            return {
                data: null as unknown as T,
                error: (error as Error).message,
            };
        }
    }

    async getVaultInfo(): Promise<ApiResponse<VaultInfo>> {
        // TODO: mock response
        return {
            data: {
                vaultId: "3516801222",
                solanaAddress: "AJan2t85RGsDLeYcC9nQCk86qJsRzzAHo91KR4mNJpwq",
            },
        };
        // return await this.request("/oauth/userinfo");
    }

    async solanaBalance(
        address: string
    ): Promise<ApiResponse<SolanaBalanceResponse>> {
        return await this.request(`/solana2/balance/${address}`);
    }

    async solanaTransfer(
        request: SolanaTransferRequest
    ): Promise<ApiResponse<SolanaTransferResponse>> {
        return await this.request(`/solana2/transfer`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    async solanaSwap(
        request: SolanaSwapRequest
    ): Promise<ApiResponse<SolanaSwapResponse>> {
        return await this.request(`/solana2/swap`, {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
